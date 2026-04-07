# RENOBIT Playwright 적용 현황 및 문제 정리

> 작성일: 2026-04-03
> 
> 
> 기준 환경: `dev/e2e` / RENOBIT 3.5.0 / `http://10.23.128.203:9000`
> 

---

## 1. Playwright가 RENOBIT에서 동작하는 방식

### 일반 웹앱 vs RENOBIT

일반 웹앱은 상태가 DOM에 반영되기 때문에 Playwright의 `locator`, `click`, `fill`만으로 대부분의 테스트가 가능하다.

```
일반 앱: 클릭 → DOM 업데이트 → locator로 읽음
RENOBIT: 클릭 → facade command 실행 → 내부 객체 변화 → evaluate로 읽음
```

RENOBIT의 3D 상태(position, rotation, size)는 HTML에 노출되지 않는다. `window.wemb` 내부 객체에만 존재하기 때문에, 상태를 읽거나 명령을 실행하려면 반드시 `page.evaluate()`를 써야 한다.

### `page.evaluate()`란

브라우저 안으로 함수를 던져서 실행하고 결과를 Node.js 쪽으로 받아오는 것이다.

```jsx
// 브라우저 내부 객체를 직접 읽는 예시
const position = await page.evaluate((name) => {
  const inst = window.wemb?.mainPageComponent?.getComInstanceByName?.(name);
  return {
    position: inst?.position,
    rotation: inst?.rotation,
    size: inst?.size,
  };
}, 'tc-box-1');
```

**주의:** evaluate로 가져올 수 있는 값은 JSON으로 직렬화 가능한 plain 값만 가능하다. 클래스 인스턴스 전체를 가져오면 메서드가 다 날아가고 빈 객체가 된다. 필요한 필드만 꺼내서 반환해야 한다.

### `window.wemb` 구조

```
window.wemb
  ├── editorFacade          ← 에디터 조작 API (컴포넌트 생성, 페이지 열기 등)
  ├── pageManager           ← 현재 활성 페이지 상태
  ├── mainPageComponent     ← 현재 페이지의 컴포넌트 인스턴스 접근
  └── pageTreeDataManager   ← 전체 페이지 목록
```

콘솔에서 먼저 확인하고 evaluate에 넣는 방식이 가장 빠르다. 콘솔에서 되면 evaluate에서도 된다.

---

## 2. helper 설계 원칙

### 핵심 원칙

```
helper → 앱을 조작하는 방법 (how)
spec   → 기대 결과와 검증 조건 (what)
```

spec에 모든 조작을 직접 쓰면 TC가 늘어날수록 중복 코드가 폭발한다. helper로 분리하면 조작 방식이 바뀌어도 helper만 수정하면 된다.

### 권장 파일 분리 구조

```
tests/helpers/
  renobit-auth.js    ← 로그인, 에디터 준비 대기
  renobit-page.js    ← 페이지 열기, 활성 페이지 보장, 초기화
  renobit-three.js   ← 3D box 생성, 다중 선택, transform 모드 전환
  renobit-state.js   ← 런타임 상태 읽기 (position, rotation, size)
```

현재는 `renobit.js` 하나에 모여 있는 상태이며, TC가 늘어나면 위 구조로 분리하는 것이 맞다.

### 로컬 모드 vs 배포 모드 분기

```jsx
const isDeploymentMode = process.env.TEST_MODE === 'deployment';

export async function ensureActivePage(page) {
  if (isDeploymentMode) {
    // 배포 모드: 현재 열린 페이지가 있는지만 확인, 조작 안 함
    await page.waitForFunction(() => !!window.wemb.pageManager.currentPageInfo);
    return;
  }
  // 로컬 모드: 없으면 생성까지 함
}
```

---

## 3. 현재 TC-1369 테스트 흐름

파일 위치: `/Users/dayoung/dev/e2e/tests/tc-1369-editor-3d-multiselect.spec.js`

```
1. 로그인
2. 에디터 준비 완료 대기 (window.wemb.editorFacade 초기화 확인)
3. 활성 페이지 보장 (currentPageInfo 확인 → 없으면 생성)
4. 3D 레이어 전환
5. 3D Box 두 개 생성
6. 다중 선택
7. T/R/S 모드 전환
8. 이동/회전/스케일 검증
9. 저장
10. 새로고침 후 값 유지 여부 검증
```

현재 진행 상태:

| TC | 내용 | 상태 |
| --- | --- | --- |
| TC-1369-01 | login → editor → 3D multi select smoke | 진행 중 |
| TC-1369-02 | transform mode buttons | helper 안정화 대기 |
| TC-1369-03 | arrow-key move for multi selection | state reader 완성 대기 |

---

## 4. 현재 확인된 문제

### 핵심 문제: stale cached ref

**현상:** 3D 컴포넌트를 이동한 직후 `position/rotation/size`를 읽으면 빈 값이 나온다.

**원인:** 이동 후 RENOBIT 내부에서 `tempGroup`이 재생성된다. 이때 이전에 캐시해둔 인스턴스 참조(ref)가 stale(무효)이 된다. `list.find()`나 `cachedRefs`로 가져온 객체가 이미 죽은 객체를 가리키고 있어서 필드가 비는 것이다.

**오늘 시도한 수정 (Cursor):**

```jsx
// 수정 전: cachedRefs를 먼저 확인
const instance =
  cachedRefs[instanceName] ||
  list.find((item) => item.name === instanceName) ||
  window.wemb?.mainPageComponent?.getComInstanceByName?.(instanceName);

// 수정 후: live instance를 먼저 확인
const instance =
  list.find((item) => item.name === instanceName) ||
  window.wemb?.mainPageComponent?.getComInstanceByName?.(instanceName) ||
  cachedRefs[instanceName];
```

**왜 이것도 부족한가:** `list` 자체가 이동 전 시점의 snapshot이기 때문에 `list.find()`로 찾아도 여전히 stale 객체일 수 있다.

**올바른 해결 방향:**

이동 후 상태를 읽을 때는 `list`나 `cachedRefs`를 전혀 참조하지 않고, `getComInstanceByName`으로만 매번 새로 조회해야 한다.

```jsx
// renobit-state.js — 이동 후 상태 조회는 이 방식만 사용
export async function getComponentState(page, name) {
  return await page.evaluate((instanceName) => {
    const inst = window.wemb?.mainPageComponent?.getComInstanceByName?.(instanceName);
    if (!inst) return null;
    return {
      position: inst.position,
      rotation: inst.rotation,
      size: inst.size,
    };
  }, name);
}
```

### 로그인 직후 `currentPageInfo`가 비어있는 문제

로그인 후 에디터 URL로 진입해도 `currentPageInfo`가 null인 상태가 존재한다. 아직 페이지가 열리지 않은 것이다. 이 상태에서 바로 3D 조작을 시도하면 에러가 난다.

**필요한 처리:**

```jsx
// 1. editorFacade 초기화까지 대기
await page.waitForFunction(() => !!window.wemb?.editorFacade);

// 2. currentPageInfo가 있는지 확인
const hasPage = await page.evaluate(() => !!window.wemb.pageManager.currentPageInfo);

// 3. 없으면 페이지 생성 후 열기
if (!hasPage) {
  await page.evaluate(() => {
    window.wemb.editorFacade.initCreatePage(); // 또는 addPage()
  });
  await page.waitForFunction(() => !!window.wemb.pageManager.currentPageInfo);
}
```

**현재 상태:** `initCreatePage()` 호출을 helper에 넣기 전에, 로그인 직후 실제로 `currentPageInfo`가 비어있는지 먼저 콘솔로 확인하는 단계에서 멈춘 상태.

---

## 5. 다음에 해야 할 것

### 즉시 (현재 블로킹 해소)

1. **currentPageInfo 비어있는지 콘솔에서 직접 확인**
    - RENOBIT 로그인 후 콘솔에서 `window.wemb.pageManager.currentPageInfo` 출력
    - null이면 `initCreatePage()` helper에 추가
    - null이 아니면 다른 원인 탐색
2. **getComponentState를 live instance 전용으로 교체**
    - `renobit.js` 261번째 줄 근처 상태 조회 로직에서 `cachedRefs`, `list.find()` 제거
    - `getComInstanceByName`만 사용하도록 단순화

### 안정화 이후

1. **helper 파일 분리** (`auth` / `page` / `three` / `state`)
2. **smoke TC 먼저 완전 통과** (로그인 → 에디터 → 페이지 열기 → 3D 전환 → Box 생성 → 버튼 확인)
3. **TC-1369-01 통과 후 TC-1369-02, 03 순서로 진행**

---

## 6. 테스트 환경 구성 요약

```bash
# 1. Tomcat + DB 시작
docker compose up -d db tomcat-3.5.0

# 2. 접속 확인
open <http://10.23.128.203:9000/renobit/login.do>

# 3. Playwright 의존성 설치 (최초 1회)
cd /Users/dayoung/dev/e2e
npm install
npx playwright install

# 4. 테스트 실행
npm test                  # headless
npm run test:headed       # 브라우저 창 띄워서
npm run test:ui           # UI 모드 (특정 spec 선택 실행)

# 5. 실패 시 리포트 확인
npm run report
```

### Test Page 규약

- 모든 TC는 `tc-` 접두사를 가진 페이지/컴포넌트 사용
- 표준 테스트 페이지 이름: `tc-page-3d`
- 각 TC 실행 전 `cleanupComponents(page, 'tc-')`로 이전 상태 정리
- init page는 반드시 빈 상태 (3D 레이어 외 element 없음)

---

## 7. 핵심 요약

| 항목 | 내용 |
| --- | --- |
| Playwright 도입 | 완료 |
| 로그인 / 에디터 진입 | 정상 동작 |
| 3D 레이어 전환 / Box 생성 | 가능 |
| 다중 선택 / T·R·S 버튼 | 접근 가능 |
| **stale ref 문제** | **미해결 — live instance 조회로 교체 필요** |
| **currentPageInfo 비어있는 문제** | **확인 중 — initCreatePage() 투입 여부 판단 중** |
| TC-1369 완전 통과 | 아직 |
