# Page helper 업데이트 요약

## 배경
기존 `ensureTestPage`는 `pageTreeDataManager.treeData`에 `pageName`이 올라오는 것을 기다렸습니다. 하지만 tree data가 아직 준비되지 않았거나 생성된 이름이 미묘하게 달라지는 경우가 많아, `beforeEach` 단계에서 DOM을 건드리기도 전에 30초 타임아웃이 나던 문제가 있었습니다.

## 새로운 흐름
1. `findPageIdByName(page, pageName)`는 기존 페이지가 있으면 ID만 확인하고, 없으면 모달을 열어 이름을 입력하고 생성합니다. 이때 tree data 전체를 기다리지 않고 곧바로 `currentPageInfo`가 새 페이지를 가리키는지만 체크합니다.
2. `ensureTestPage()`는 확정된 `pageId`를 반환하고, 그 ID를 기반으로 `waitForActiveEditorPage(page, pageId)`를 호출하여 `currentPageInfo.id`, `_isOpenPage`, `threeLayer`, `isLoaded/isLoading` 상태를 기다립니다.
3. Spec들은 이 반환값을 저장해서 reload나 재검증 단계에서 계속 재사용하므로 더 이상 tree data나 이름을 다시 찾지 않습니다.

## 왜 잘 동작하는가
- 한 번 생성된 페이지의 `id`는 변하지 않지만 이름은 tree data 동기화 지연 중에 바뀔 수 있습니다. ID를 기준으로 하면 30초짜리 `waitForFunction`이 실행되지 않아 타임아웃이 사라집니다.
- `tc-1369`처럼 생성 후 바로 DOM을 다루는 테스트도, reload 이후 동일한 ID로 다시 로딩을 확인하기 때문에 tree data가 아직 완전히 반영되지 않아도 안정적으로 작동합니다.
- 이름 기반 대기를 제거하니, 오른쪽 클릭/삭제처럼 tree data가 아직 갱신되지 않은 상태에서도 `beforeEach` 훅이 실패하지 않고 계속 진행됩니다.
