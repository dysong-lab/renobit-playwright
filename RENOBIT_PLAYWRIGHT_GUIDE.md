# RENOBIT 3.5.0 Playwright 가이드

작성 기준: 2026-04-08 / `dev/e2e` / RENOBIT 3.5.0

---

## 현재 상태

```
39 passed / 4 skipped / 0 failed
```

통과하는 TC: Common, Page, Resource, Dataset, 3D, CodeBox
스킵 TC: DS-004, DS-005, DS-007, DS-008 (selector 미확정, 별도 TODO 주석으로 관리)

---

## 실행 방법

```bash
# /Users/dayoung/dev/e2e 에서 실행
npm test                  # headless
npm run test:headed       # 브라우저 창 띄워서 실행
npm run test:ui           # Playwright UI 모드
npm run report            # HTML 리포트 열기
```

특정 TC만 실행:

```bash
npx playwright test tests/basic/renobit-3.5.0-common/tc-page.spec.js --grep "PAGE-001"
```

---

## 설정 핵심

`playwright.config.js`에서 반드시 확인해야 할 것:

```js
fullyParallel: false,
workers: 1,
```

`workers: 1`이 필수인 이유: TC-R35-COM-004 (로그아웃 TC)가 서버 세션을 무효화하기 때문이다.
기본 workers 설정(CPU 코어 기반)으로 병렬 실행하면 다른 테스트의 API 호출이 세션 없이 실패한다.

---

## Helper 구조

`tests/helpers/renobit.js` — 모든 RENOBIT 조작을 담당하는 단일 헬퍼 파일.

### 세션/에디터 준비

| 함수 | 역할 |
|------|------|
| `ensureEditorSession(page)` | 로그인 확인 → 에디터 준비 대기 → 활성 페이지 보장 |
| `waitForEditorReady(page)` | editorFacade, mainPageComponent, _readyCompleted, treeData 등 편집기 준비 완료 조건 확인 |
| `waitForActiveEditorPage(page, pageId)` | currentPageInfo.id, threeLayer, isLoaded === true 확인 |
| `loginAsEditor(page)` | 로그인 페이지에서 admin 로그인, 새 페이지 생성 후 에디터 진입 대기 |

### 페이지 조작

| 함수 | 역할 |
|------|------|
| `createPageByType(page, { type, name })` | page / group / master 타입 신규 페이지 생성 |
| `ensureTestPage(page, pageName)` | 특정 이름의 페이지가 없으면 생성, 있으면 열기 |
| `findPageIdByName(page, pageName)` | treeData에서 이름으로 pageId 조회 |
| `closeCreatePageModalIfVisible(page)` | createPageModal이 열려 있으면 닫기 |

### 3D 조작

| 함수 | 역할 |
|------|------|
| `switchToTwoLayer(page)` | 2D 레이어 전환 |
| `switchToThreeLayer(page)` | 3D 레이어 전환 |
| `addThreeBox(page, name, position)` | BoxComponent 추가 후 인스턴스 준비 대기 |
| `selectThreeComponents(page, names)` | 다중 선택 + tempGroup 생성 |
| `setThreeTransformMode(page, mode)` | T/R/S 모드 전환 |
| `applyTempGroupTransform(page, type, value)` | tempGroup rotate/scale 적용 |
| `getComponentState(page, name)` | live instance 기준 position/rotation/size 조회 |
| `getSelectedComponentStates(page, names)` | 다중 선택 상태 일괄 조회 |
| `savePage(page)` | 페이지 저장 |
| `cleanupComponents(page, prefix)` | 접두사로 시작하는 컴포넌트 일괄 삭제 |

---

## waitForEditorReady 조건 설명

`waitForEditorReady`가 확인하는 조건 (소스 분석 기반):

```js
window.wemb?.editorFacade &&          // facade 초기화
window.wemb?.mainPageComponent &&      // Vue 컴포넌트 마운트
window.wemb?.$createPageModal &&       // 페이지 생성 모달 준비
editorProxy._readyCompleted === true && // PrepStartUpCommand 완료
pageTreeDataManager?._rootId &&         // 페이지 트리 루트 설정
pageTreeDataManager?.focusTargetId &&   // 포커스 대상 설정
Array.isArray(pageTreeDataManager?.treeData) // 트리 데이터 로드
```

- `_readyCompleted`는 `updateAppState(READY_COMPLETED)` 시 true가 됨 (페이지 열기와 무관)
- `threeLayer`는 페이지 의존적이므로 이 조건에 포함하면 안 됨
- `isLoaded === true`는 `OpenPageCommand._completedLoadAllResource` 완료 신호 (페이지 전용)

---

## RENOBIT 자동화 범위 구분

### Playwright로 자동화 가능한 것

- 로그인/로그아웃
- 메뉴/버튼 클릭 및 노출 확인
- 팝업/모달 열림·닫힘
- 페이지 생성/그룹/마스터 생성
- 탭 전환 및 리소스 매니저 조작
- Dataset Manager 진입 및 폼 필드 확인
- 3D Box 생성 및 다중 선택 이동/회전/스케일
- 저장 후 새로고침 유지 확인
- `window.wemb` 내부 상태 읽기 (`page.evaluate` 활용)

### Playwright 단독으로 불가능한 것

- 서버 설정 파일 수정 (`context-security.xml`, `globals.properties`)
- Tomcat 재기동 / WAR 배포
- SSO 인증 경로 허용 설정
- API timeout / connection 설정
- feature flag on/off

이 항목들은 TC의 Precondition으로 분리하고, Playwright spec에 직접 넣지 않는다.
자세한 분류: `docs/renobit-playwright-limitations-and-deployment.md`

---

## 스킵된 TC 관리

현재 4개 TC는 `test.skip`으로 처리됨:

| TC | 스킵 이유 |
|----|-----------|
| DS-004 Dataset 파일 가져오기 | DatasetList import event 체인 재현 불가 |
| DS-005 Dataset 파일 내보내기 | FileManager download 신호 재현 불가 |
| DS-007 DB Query 타입 | selector 미확정 |
| DS-008 TIM 타입 | selector 미확정 |

각 TC에 TODO 주석으로 활성화 조건이 기술되어 있음.

---

## stale reference 주의사항

컴포넌트 이동·삭제 후 내부 인스턴스가 재생성될 수 있다.
캐시된 참조 대신 `getComInstanceByName(name)`으로 매번 live instance를 읽어야 한다.

```js
const inst = window.wemb?.mainPageComponent?.getComInstanceByName?.(name);
```
