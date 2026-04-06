# Release 3.5.0 E2E 커버리지 메모

## 기준 문서

- Confluence: `Release 3.5.0 Test Cases`
- 페이지: `2871623706`

## 현재 작성된 spec

- `e2e/tests/tc-1358-script-editor-lock.spec.js`
  - TC-1358-01
  - TC-1358-02
  - TC-1358-03
  - TC-1358-04
- `e2e/tests/tc-1369-editor-3d-multiselect.spec.js`
  - TC-1369-03 중심
  - TC-1369-01의 저장/복원 일부
- `e2e/tests/tc-1369-editor-3d-toolbar-mode.spec.js`
  - TC-1369-02
- `e2e/tests/tc-1381-page-delete-confirm.spec.js`
  - TC-1381-01
  - TC-1381-02
  - TC-1381-03
  - TC-1381-04

## 이번에 적용한 방향

- 페이지 준비는 `pageName` 기반 tree data 대기보다 `pageId` 기반 editor ready 확인을 우선 사용한다.
- 이미 helper가 안정화된 흐름만 먼저 자동화한다.
- 설정 파일 변경, 네트워크/메모리/브라우저 호환성, DevTools 의존 항목은 후순위로 둔다.

## 다음 우선순위

- TC-1369-04: 3D 다중 선택 해제 및 페이지 이동 엣지 케이스
- TC-1369-05: 다중 선택 시 속성 패널 표시 조건
- TC-1408-02: Script Editor Copy ID 동작
- TC-1373-04: Ctrl+9 회귀

## 후순위 또는 별도 환경 필요

- config 수정이 필요한 항목: TC-1365, TC-1416, TC-1418
- DevTools/Network/Memory 검증이 핵심인 항목: TC-1294, TC-1375, TC-1394, TC-1398
- 빌드/개발서버/브라우저 매트릭스 항목: TC-1367, TC-1412, TC-1413, TC-1419
