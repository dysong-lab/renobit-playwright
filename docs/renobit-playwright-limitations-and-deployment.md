# RENOBIT Playwright 적용 한계와 로컬 배포 전제

작성일: 2026-04-08

## 목적

RENOBIT 3.5.0에서 Playwright를 적용할 때 왜 기본적인 브라우저 조작만으로는 부족한지, 그리고 어떤 항목은 로컬 배포 파일 수정과 서버 재기동이 선행되어야 하는지 정리한다.

이 문서는 테스트 코드 작성 기준서라기보다, Playwright 적용 범위와 비적용 범위를 구분하기 위한 운영 문서다.

## 1. Playwright가 RENOBIT에서 동작하는 방식

일반 웹앱은 상태가 DOM에 바로 반영되는 경우가 많아서 `locator`, `click`, `fill`만으로 검증이 끝난다. RENOBIT은 다르다.

RENOBIT은 브라우저 UI 뒤에 `window.wemb` 기반 런타임 객체가 있고, 실제 상태는 DOM보다 내부 객체에 더 많이 남는다.

```text
일반 앱: 클릭 → DOM 업데이트 → locator로 읽음
RENOBIT: 클릭 → facade command 실행 → 내부 객체 변화 → evaluate로 읽음
```

즉, 화면에 보이는 요소만으로 끝나는 TC는 Playwright로 잘 맞지만, 3D 상태, 페이지 객체, 선택 상태, 저장 후 복원 같은 항목은 `page.evaluate()`를 같이 써야 한다.

## 2. Playwright로 가능한 것

Playwright는 다음 항목에 적합하다.

- 로그인 화면 입력 및 이동 확인
- 메뉴/버튼 클릭
- 팝업 열림/닫힘 확인
- 목록/탭/패널 노출 여부 확인
- 저장 버튼 클릭 후 UI 반응 확인
- 새로고침 후 화면 복원 여부 확인
- 브라우저에서 직접 확인 가능한 API 호출 결과 확인

이 범위는 브라우저 관점의 사용자 경험을 검증하는 영역이다.

## 3. Playwright만으로 부족한 것

다음 항목은 Playwright 단독으로 다루기 어렵다.

- 서버 설정 파일 수정
- Tomcat 또는 WAS 재기동
- 배포 파일 반영
- 인증 정책 변경
- 프록시/timeout/global properties 변경
- 기능 flag 설정 변경

예를 들면 아래와 같은 작업이다.

```xml
<intercept-url pattern="/api/sso/*" access="permitAll" />
```

이런 항목은 브라우저 테스트가 아니라 배포 전제조건이다. Playwright spec 안에 넣기보다, `manual precondition` 또는 별도 setup 문서로 빼는 것이 맞다.

## 4. 로컬 배포 파일 수정이 필요한 이유

RENOBIT 3.5.0의 일부 기능은 브라우저에서 보이는 UI보다 서버 설정에 먼저 의존한다.

대표적으로 아래가 있다.

- SSO 흐름
- API timeout / connection 설정
- 기능 flag on/off
- 로그아웃 API
- MyBatis XML 동적 갱신
- 메모리 또는 커넥션 누수 확인 전제

이 항목들은 브라우저에서 버튼을 눌러도, 서버 설정이 맞지 않으면 테스트가 시작조차 되지 않는다.

따라서 문서와 TC는 다음처럼 분리하는 것이 맞다.

1. `Precondition`
- context-security.xml 수정
- globals.properties 수정
- 배포 파일 반영
- 서버 재기동

2. `Test step`
- 브라우저에서 로그인
- 메뉴 이동
- 기능 실행

3. `Expected result`
- UI가 정상 노출되어야 함
- 에러가 프론트로 직접 노출되지 않아야 함
- 서버 설정에 맞는 동작이 보여야 함

## 5. RENOBIT에서 특히 주의할 점

### 5.1 DOM에 없는 상태는 `page.evaluate()`로 읽어야 한다

3D position, rotation, size 같은 값은 DOM 텍스트로 보이지 않는다. 이런 값은 `window.wemb` 내부 객체에서 읽어야 한다.

```js
const state = await page.evaluate((name) => {
  const inst = window.wemb?.mainPageComponent?.getComInstanceByName?.(name);
  if (!inst) return null;
  return {
    position: inst.position,
    rotation: inst.rotation,
    size: inst.size,
  };
}, 'tc-box-1');
```

### 5.2 stale reference 문제가 자주 생긴다

컴포넌트를 이동하거나 삭제하면 내부 인스턴스가 다시 만들어질 수 있다. 이때 캐시된 참조는 무효가 된다.

해결 방식은 `cachedRefs`보다 매번 `getComInstanceByName()`으로 live instance를 다시 읽는 것이다.

### 5.3 `currentPageInfo`가 비어 있는 시점이 있다

로그인 직후 에디터 URL에 진입해도 `currentPageInfo`가 비어 있을 수 있다.

이 상태에서 바로 페이지 생성이나 3D 조작을 시작하면 실패한다.

따라서 Playwright helper는 다음 순서로 대기해야 한다.

1. editor facade 초기화 대기
2. pageManager.currentPageInfo 확인
3. 필요 시 페이지 생성 또는 활성 페이지 보장
4. 그 다음 실제 테스트 수행

## 6. 추천 분리 구조

Playwright helper는 앱 조작용과 상태 조회용으로 나누는 것이 좋다.

```text
tests/helpers/
  renobit-auth.js    ← 로그인, 에디터 준비 대기
  renobit-page.js    ← 페이지 열기, 활성 페이지 보장
  renobit-three.js   ← 3D box 생성, 다중 선택, 모드 전환
  renobit-state.js   ← 런타임 상태 읽기
```

이렇게 나누면 spec은 "무엇을 기대하는가"에 집중할 수 있고, helper는 "어떻게 조작하는가"에 집중할 수 있다.

## 7. 적용 우선순위

1. 브라우저에서 바로 확인 가능한 기본 기능부터 자동화한다.
2. `window.wemb` 기반 런타임 상태는 helper로만 감싼다.
3. 로컬 배포 파일 수정이 필요한 항목은 별도 precondition 문서로 분리한다.
4. `SSO`, `timeout`, `feature flag`, `MyBatis`, `memory` 같은 항목은 배포/서버 전제와 함께 관리한다.

## 8. 결론

RENOBIT에서 Playwright는 브라우저 테스트 도구로는 충분히 유효하지만, 전부를 해결하지는 못한다.

실제 적용을 위해서는 다음 두 축을 동시에 관리해야 한다.

- 브라우저에서 보이는 기능 검증
- 로컬 배포 파일과 서버 설정 전제 정리

즉, Playwright spec만 잘 쓰는 것으로 끝나지 않고, 어떤 테스트가 `브라우저 책임`인지 `배포 책임`인지 먼저 나눠야 한다.
