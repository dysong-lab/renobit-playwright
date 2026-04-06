# RENOBIT Playwright 사용 정리

## 목적

이 문서는 현재 `dev/e2e` 기준으로 정리된 Playwright 사용 방법, RENOBIT 검증 테스트를 구성하는 방법, Confluence 문서와의 차이, 그리고 실제 자동화에 추가로 필요한 항목을 정리한 문서다.

기준 환경:

- E2E 프로젝트 위치: `/Users/dayoung/dev/e2e`
- 테스트 대상: `RENOBIT 3.5.0`
- 접속 주소: `http://127.0.0.1:6284`
- 로그인 계정: `admin / didi0205`
- 에디터 진입 경로: `/renobit/login.do`

---

## 1. Playwright 기본 사용법

### 1.1 설치 구조

현재 `dev/e2e`는 Playwright 전용 프로젝트로 분리되어 있다.

- `package.json`
- `playwright.config.js`
- `tests/*.spec.js`
- `tests/helpers/*.js`

이 구조는 앱 소스와 E2E 실행 환경을 분리하기 위한 것이다.

### 1.2 실행 명령

`/Users/dayoung/dev/e2e` 에서 실행한다.

```bash
npm test
```

- headless 실행
- 브라우저 창은 보이지 않음

```bash
npm run test:headed
```

- 실제 브라우저 창을 띄워서 실행
- 화면을 보면서 흐름을 확인할 때 사용

```bash
npm run test:ui
```

- Playwright UI 모드
- 특정 spec만 선택 실행하거나 실패 지점을 추적할 때 사용

```bash
npm run report
```

- HTML 리포트 열기

### 1.3 결과 확인 위치

- 콘솔 출력: pass/fail, 에러 메시지
- `test-results/`: 실패 스크린샷, 비디오, error context
- `playwright-report/`: HTML 리포트

---

## 2. RENOBIT에서 Playwright를 사용하는 방식

## 2.1 일반 웹앱과 다른 점

RENOBIT 에디터는 단순 DOM 클릭 자동화만으로 안정적으로 테스트하기 어렵다.

이유:

- 로그인 후 페이지가 항상 자동으로 열리지 않음
- 활성 페이지가 없는 상태가 존재함
- 2D/3D 레이어 전환이 앱 내부 command 기반으로 움직임
- 3D 선택과 transform은 `threeLayer`, `tempGroup`, facade command에 의존함
- 저장 상태 검증도 DOM이 아니라 runtime object를 읽어야 함

즉 RENOBIT 자동화는 다음 두 계층이 필요하다.

- UI 계층: 로그인, 버튼 노출 여부, 모드 전환 등
- Runtime helper 계층: facade command 호출, 현재 page/layer/component 상태 확인

## 2.2 현재 helper가 담당하는 역할

현재 `tests/helpers/renobit.js`는 다음 공통 조작을 맡도록 정리 중이다.

- `loginAsEditor(page)`
- `waitForEditorReady(page)`
- `ensureActivePage(page)`
- `switchToThreeLayer(page)`
- `addThreeBox(page, name, position)`
- `selectThreeComponents(page, names)`
- `setThreeTransformMode(page, mode)`
- `moveSelectedByKeyboard(page, sequence)`
- `applyTempGroupTransform(page, type, value)`
- `savePage(page)`
- `getComponentState(page, name)`
- `getThreeLayerState(page)`

핵심 원칙:

- `helper`: 앱을 조작하는 방법
- `spec`: 기대 결과와 검증 조건

## 2.3 현재 테스트 흐름

현재 TC-1369용 spec은 아래 순서를 따르도록 작성 중이다.

1. 로그인
2. 에디터 준비 완료 대기
3. 활성 페이지 보장
4. 3D 레이어 전환
5. 3D Box 두 개 생성
6. 다중 선택
7. T/R/S 모드 전환
8. 이동/회전/스케일 검증
9. 저장
10. 새로고침 후 값 유지 여부 검증

현재 파일:

- `/Users/dayoung/dev/e2e/tests/tc-1369-editor-3d-multiselect.spec.js`

---

## 3. 현재 확인된 동작과 막히는 지점

## 3.1 확인된 것

- Playwright 자체 실행은 정상
- RENOBIT 로그인은 정상
- 로그인 후 에디터 진입은 정상
- 활성 페이지가 없을 수 있다는 점을 확인
- 기존 페이지를 열거나 초기 페이지를 생성하는 helper가 필요하다는 점을 확인
- 3D 레이어 전환과 Box 생성은 가능
- 다중 선택과 T/R/S 버튼 노출도 접근 가능

## 3.2 현재 남은 문제

핵심 문제는 `3D 다중 선택 후 상태 읽기 안정화`다.

구체적으로:

- 이동 직후 `cached ref`가 stale object가 되어 `position/rotation/size`가 비는 경우가 있음
- `tempGroup` 재생성 이후 instance 참조가 바뀌는 것으로 보임
- 따라서 live instance 우선 조회가 필요함
- 일부 검증은 DOM이 아니라 runtime state를 더 직접적으로 읽어야 함

즉 지금 단계는:

- Playwright 도입 단계는 끝남
- RENOBIT 전용 helper 계층 설계는 진행됨
- TC-1369 완전 통과는 아직 아님

---

## 4. Confluence 문서와 비교

관련 문서:

- `Playwright 자동화`
- `Playwright 프로젝트 설정 및 테스트 실행 가이드`
- `Playwright 테스트 파일 탐색 및 실행 메커니즘 요약`

## 4.1 같은 점

현재 방식은 Confluence 문서와 큰 방향은 같다.

- Playwright를 별도 프로젝트로 둠
- `baseURL` 기반으로 대상 서버에 붙음
- `tests/*.spec.*` 구조 사용
- `npm test`, `npm run test:headed`, `npm run test:ui` 사용
- 실패 시 스크린샷/리포트 확인

즉 프로젝트 분리, 실행 방식, 결과 확인 방식은 문서와 일치한다.

## 4.2 다른 점

Confluence 문서는 일반적인 Playwright 프로젝트 설명에 가깝고, RENOBIT의 런타임 특수성은 거의 반영되어 있지 않다.

문서 대비 현재 실제 차이:

- Confluence는 `baseURL`에 붙어 로그인 후 테스트한다고 설명
- 실제 RENOBIT는 로그인만으로 바로 테스트 가능한 상태가 항상 보장되지 않음
- Confluence는 example spec 중심
- 실제 RENOBIT는 helper 없이는 TC 수준 자동화가 거의 불가능
- Confluence는 주로 DOM/화면 중심 설명
- 실제 RENOBIT는 facade command, page state, threeLayer state 접근이 필요

정리하면:

- Confluence 문서는 Playwright 프로젝트 시작 가이드로는 충분
- 하지만 RENOBIT 검증 자동화를 하려면 추가 설계가 반드시 필요

---

## 5. 지금 방식에서 더 필요한 것

## 5.1 필수

### 활성 페이지 보장 로직 안정화

- 로그인 후 기존 페이지를 여는 기준 명확화
- 페이지가 정말 없을 때만 신규 페이지 생성
- page tree focus/root가 비어 있는 경우 복구 로직 보완

### live instance 기준 상태 조회

- stale cached ref보다 현재 `_comInstanceList` 또는 `getComInstanceByName()` 우선
- `position`, `rotation`, `size`를 어디서 읽을지 기준 확정
- `appendElement.position`과 `setter.position`의 관계 정리

### helper 분리 고도화

권장 분리:

- `helpers/renobit-auth.js`
- `helpers/renobit-page.js`
- `helpers/renobit-three.js`
- `helpers/renobit-state.js`

지금은 하나 파일에 있지만, TC가 늘어나면 분리하는 게 맞다.

## 5.2 테스트 전략 측면

### smoke와 scenario 분리

초기에는 아래처럼 나누는 것이 좋다.

- smoke:
  - 로그인
  - 에디터 진입
  - 페이지 열기
  - 3D 레이어 전환
  - T/R/S 버튼 노출

- scenario:
  - TC-1369 다중 선택 이동
  - 저장 후 새로고침 유지
  - 방향키 이동
  - 회전/스케일 유지

### UI 검증과 runtime 검증 분리

한 spec에서 둘 다 하되, 논리는 구분하는 편이 좋다.

- UI 검증: 버튼 보임, 모드 변경
- runtime 검증: position/rotation/scale 값

## 5.3 환경 측면

### 테스트 대상 데이터셋 고정

현재는 로컬 데이터 상태에 따라 page list, start page, 라이선스 상태가 달라질 수 있다.

그래서 자동화 안정성을 위해 필요하다.

- 테스트용 계정 고정
- 테스트용 page 데이터 고정
- 테스트 실행 전 초기 상태를 맞추는 절차 정의

### war 배포 기준 절차 문서화

실제 목표가 `war`를 풀어서 localhost에 올린 뒤 검증하는 것이라면 아래가 필요하다.

1. Tomcat 기동
2. 대상 버전 배포
3. 접속 주소 확인
4. 테스트 계정 확인
5. Playwright 실행

이 절차가 문서로 고정되어야 같은 방식으로 재현 가능하다.

---

## 6. 현재 권장 운영 방식

가장 현실적인 운영 방식은 아래다.

### 1단계: smoke 안정화

- 로그인
- 에디터 진입
- 활성 페이지 확보
- 3D 레이어 전환
- Box 생성
- T/R/S 버튼 확인

### 2단계: helper 안정화

- 페이지 열기 helper
- 다중 선택 helper
- live state reader helper
- 저장/새로고침 helper

### 3단계: TC 자동화

- TC-1369-01
- TC-1369-02
- TC-1369-03

즉 바로 모든 TC를 자동화하기보다, 먼저 RENOBIT용 helper를 안정화한 뒤 TC를 얹는 방식이 맞다.

---

## 7. 결론

현재 `dev/e2e` 구조와 Playwright 사용 방식은 Confluence 문서의 방향과는 맞다.

다만 RENOBIT는 일반 웹앱보다 내부 상태 의존성이 강해서, Confluence 문서 수준만으로는 TC 자동화를 바로 만들 수 없다.

현재 추가로 필요한 핵심은 3가지다.

- 활성 페이지 보장 로직 안정화
- 3D live instance 상태 조회 기준 확정
- RENOBIT 전용 helper 계층 분리

이 3개가 정리되면 TC-1369 같은 검증 시나리오는 반복 가능한 spec으로 안정화할 수 있다.

---

## Quick Start

1. Start Tomcat with the desired RENOBIT version (e.g., `docker compose up -d db tomcat-3.5.0`).
2. Verify `http://127.0.0.1:6284/renobit/login.do` is reachable.
3. Run `npm install` and `npx playwright install` inside `/Users/dayoung/dev/e2e` if not already done.
4. Execute `npm test` or `npm run test:headed` depending on whether you need UI playback.
5. Open the HTML report with `npm run report` after failure for screenshots/traces.

## TC-1369 Progress

- **TC-1369-01**: login → editor → 3D multi select smoke (in progress)
- **TC-1369-02**: transform mode buttons (pending helper stability)
- **TC-1369-03**: arrow-key move for multi selection (pending state reader)

## Helper Design Principles

- Keep helpers focused on facade command interactions (`login`, `switchLayer`, `move`, `save`).
- Keep spec files focused on expectations (e.g., `position` deltas, transform control states).
- Favor live instance reads for runtime state (`_comInstanceList`, `getComInstanceByName`) before cached refs.
- Encapsulate flaky initialization (page creation, temp group) so specs stay concise.

## Test Page 규약

- 모든 TC는 `tc-` 접두사를 가진 페이지/컴포넌트를 이용합니다. 각 실행 전 `cleanupComponents(page, 'tc-')`로 남은 내용을 삭제합니다.
- 표준 테스트 페이지 이름을 정해둡니다 (예: `tc-page-3d`). helper가 로그인 직후 이 페이지를 열고, `pageManager.currentPageInfo`의 `id/name`이 지켜진 상태인지 확인합니다.
- init page는 반드시 비어 있어야 하며, 3D 레이어 이외의 element가 없는 상태를 보장하는 검증(예: `pageManager.currentPageInfo.props.setter.width/height` 체크)을 추가합니다.
- `packages`나 필요한 레이어 배치는 fixture JSON 또는 `window.wemb.editorFacade` command로 미리 구성하고, 테스트가 그 상태를 전제로 실행되도록 문서화합니다.
- 위 규약을 따르면 TC에서 반복적으로 “페이지 초기화” 로직을 작성할 필요 없이 helper만 호출해도 테스트 환경이 일정하게 유지됩니다.

## 테스트 환경 구성

1. **Tomcat/RENOBIT 배포**
   - 원하는 버전의 WAR를 `renobit/versions/<version>`에 둔 뒤 `docker compose up -d db tomcat-<version>`으로 Tomcat을 띄웁니다.
   - `http://127.0.0.1:6284/renobit/login.do`가 접근 가능한지 확인하고, `admin / didi0205` 계정이 Editor 접근 가능해야 합니다.
2. **로컬 데이터 준비**
   - 테스트 전 `Tc` 전용 데이터를 초기화하는 스크립트를 실행하거나, `pageTreeDataManager.addPage`로 기본 페이지를 미리 만들어 둡니다.
   - `license_yn = Y` 등 필수 설정은 DB 또는 초기화 스크립트에서 맞춥니다.
3. **Playwright 환경**
   - `dev/e2e`에서 `npm install`을 실행하고 `npx playwright install`로 chromium을 맞춥니다.
   - `PLAYWRIGHT_BASE_URL`을 설정할 경우 `playwright.config.js`의 `baseURL`을 덮어씌울 수 있습니다.
4. **실행 절차**
   1. Tomcat + DB 컨테이너 시작
   2. 필요한 페이지/packaging 상태를 확인 또는 재구성
   3. `npm test` 또는 `npm run test:headed`로 검증
   4. 실패한 경우 `npm run report` 또는 `npx playwright show-report`로 결과 확인

위 환경 구성과 규약을 문서화하면 새로운 TC를 추가하거나 다른 팀원이 테스트를 실행할 때 일관된 기반이 됩니다.
