# RENOBIT 3.5.0 TC Catalog Draft

작성일: 2026-04-08

기준서:
- [RENOBIT_3.5.0_JIRA_QA_TESTCASE.md](/Users/dayoung/dev/e2e/tests/basic/renobit-3.5.0-common/RENOBIT_3.5.0_JIRA_QA_TESTCASE.md)

분류 기준:
- `Happy Path`: 정상 경로의 기본 기능
- `Negative`: 실패 입력/권한/오류 확인
- `Edge`: 경계 상태, readOnly, stale ref, 빈 상태
- `Environment`: 배포/서버 설정 선행 필요

자동화 기준:
- `Yes`: 현재 Playwright 기준 자동화 대상
- `Pending`: 문서화 완료, 자동화 후순위
- `No`: 환경 전제 또는 현재 범위 외

## Common

| TC ID | Title | Type | Automation | Notes |
| --- | --- | --- | --- | --- |
| TC-R35-COM-001 | Editor 권한 로그인 후 에디터 진입 | Happy Path | Yes | 기본 진입 smoke |
| TC-R35-COM-002 | Common Header - Viewer 링크 이동 | Happy Path | Yes | 새 창 이동 확인 |
| TC-R35-COM-003 | Common Header - Admin 링크 이동 | Happy Path | Yes | 새 창 이동 확인 |
| TC-R35-COM-004 | Common Header - Logout 동작 | Edge | Yes | 세션 종료 확인 |
| TC-R35-COM-005 | Common Toolbar - Copy/Cut/Paste/Delete 기본 상태 | Happy Path | Yes | 공통 툴바 표시 |
| TC-R35-COM-006 | Common Toolbar - Layer 영역 기본 버튼 표시 | Happy Path | Yes | UI 노출 확인 |
| TC-R35-COM-007 | Common Toolbar - View 영역 기본 버튼 표시 | Happy Path | Yes | UI 노출 확인 |
| TC-R35-COM-008 | Common Toolbar - Mobile Master 영역 기본 버튼 표시 | Happy Path | Yes | UI 노출 확인 |
| TC-R35-COM-009 | Common Header - Zoom 토글 표시 | Happy Path | Yes | 표시 상태 확인 |
| TC-R35-COM-010 | Common Header - Device/View 선택 combobox 표시 | Happy Path | Yes | 표시 상태 확인 |
| TC-R35-COM-011 | Empty State - 활성 페이지 미존재 메시지 표시 | Edge | Yes | 빈 상태 검증 |

## Page

| TC ID | Title | Type | Automation | Notes |
| --- | --- | --- | --- | --- |
| TC-R35-PAGE-001 | 신규 페이지 생성 | Happy Path | Yes | tree/currentPageInfo 기반 |
| TC-R35-PAGE-002 | 신규 그룹 생성 | Happy Path | Yes | tree/currentPageInfo 기반 |
| TC-R35-PAGE-003 | 신규 마스터 페이지 생성 | Happy Path | Yes | tree/currentPageInfo 기반 |
| TC-R35-PAGE-004 | Import Page 모달 표시 | Happy Path | Yes | 모달 노출 확인 |
| TC-R35-PAGE-005 | Export Current Page 다운로드 시작 | Happy Path | Yes | 다운로드 트리거 확인 |
| TC-R35-PAGE-006 | Export Pages 모달에서 선택 페이지 다운로드 | Happy Path | Yes | 선택 후 다운로드 확인 |
| TC-R35-PAGE-007 | Import Total Data 파일 선택 TC | Happy Path | Pending | 완료 팝업 기준 보강 필요 |
| TC-R35-PAGE-008 | Export Total Data 모달 표시 | Happy Path | Pending | 전체 선택 흐름 보강 필요 |

## Resource

| TC ID | Title | Type | Automation | Notes |
| --- | --- | --- | --- | --- |
| TC-R35-RES-001 | Images 탭 노출 | Happy Path | Yes | 탭 전환 smoke |
| TC-R35-RES-002 | Background 탭 노출 | Happy Path | Yes | 탭 전환 smoke |
| TC-R35-RES-003 | Icons 탭 노출 | Happy Path | Yes | 탭 전환 smoke |
| TC-R35-RES-004 | Button Images 탭 노출 | Happy Path | Yes | 탭 전환 smoke |
| TC-R35-RES-005 | Sprite Clip 탭 노출 | Happy Path | Yes | 탭 전환 smoke |
| TC-R35-RES-006 | State Clip 탭 노출 | Happy Path | Yes | 탭 전환 smoke |
| TC-R35-RES-007 | GLTF 탭 노출 | Happy Path | Yes | 탭 전환 smoke |
| TC-R35-RES-008 | Lottie 탭 노출 | Happy Path | Yes | 탭 전환 smoke |
| TC-R35-RES-009 | Asset Resource GLTF 탭 노출 | Happy Path | Yes | 탭 전환 smoke |
| TC-R35-RES-010 | HDR 탭 노출 | Happy Path | Yes | 탭 전환 smoke |

## Dataset

| TC ID | Title | Type | Automation | Notes |
| --- | --- | --- | --- | --- |
| TC-R35-DS-001 | Dataset Manager 기본 레이아웃 | Happy Path | Yes | 기본 진입 smoke |
| TC-R35-DS-002 | Create Dataset 기본 폼 필드 | Happy Path | Yes | 입력 필드 노출 확인 |
| TC-R35-DS-003 | Dataset Import Popup 표시 | Happy Path | Yes | 팝업 노출 확인 |
| TC-R35-DS-004 | Dataset 파일 가져오기 TC | Environment | Pending | file chain 안정화 필요 |
| TC-R35-DS-005 | Dataset 파일 내보내기 TC | Environment | Pending | download chain 안정화 필요 |
| TC-R35-DS-006 | REST API 타입 데이터셋 생성/수정 TC | Happy Path | Yes | form state 검증 범위 |
| TC-R35-DS-007 | DB Query 타입 데이터셋 생성/수정 TC | Environment | Pending | selector/편집기 경로 확인 필요 |
| TC-R35-DS-008 | TIM 타입 데이터셋 설정 TC | Environment | Pending | URL/selector 확정 필요 |

## CodeBox

| TC ID | Title | Type | Automation | Notes |
| --- | --- | --- | --- | --- |
| TC-R35-CB-001 | Template > FreeCode > CodeBox 배치 | Happy Path | Yes | 배치 smoke |
| TC-R35-CB-002 | CodeBox 편집기 열기 | Happy Path | Yes | `/#/codeBox` 팝업 확인 |

## 3D

| TC ID | Title | Type | Automation | Notes |
| --- | --- | --- | --- | --- |
| TC-R35-3D-001 | 3D 레이어 전환 후 T/R/S 툴바 표시 | Happy Path | Yes | 표시 smoke |
| TC-R35-3D-002 | 3D 다중 선택 이동/회전/스케일 후 저장 유지 | Edge | Yes | stale ref 방지 필요 |

## Catalog Update Rule

1. 기준서의 TC ID를 먼저 옮긴다.
2. `Type`을 Happy Path / Negative / Edge / Environment 중 하나로 지정한다.
3. 자동화 가능하면 `Automation=Yes`, 아니면 `Pending` 또는 `No`로 둔다.
4. 환경 전제는 `Notes`에 명시한다.
5. 새 spec이 추가되면 이 문서와 `PLAYWRIGHT_TC_CATALOG.csv`를 함께 갱신한다.

## Negative / Environment 정리

### Negative 후보

현재 기준서에서 별도 실패 검증으로 분리할 만한 항목은 다음과 같다.

- Common
  - 로그인 실패
  - 권한 없는 메뉴 진입 차단
  - logout 후 재접근 차단
- Page
  - 중복 페이지명 입력
  - 잘못된 파일 형식 import
  - 빈 파일 export/selection 실패
- Dataset
  - 잘못된 REST API URL
  - timeout 설정 누락 또는 초과 응답
  - DB Query 파라미터 누락
- CodeBox
  - readOnly 상태에서 편집 불가
- 3D
  - stale ref로 인한 값 갱신 실패
  - 다중 선택 해제 후 상태 불일치

### Environment 후보

현재 기준서에는 직접 자동화하기보다 환경 전제로 분리해야 할 항목이 섞여 있다.

- `context-security.xml` 수정이 필요한 SSO 케이스
- `globals.properties` timeout / pool 설정 변경이 필요한 Dataset 케이스
- WAR 반영 후 확인해야 하는 릴리즈 회귀 케이스
- feature flag on/off가 필요한 ECO 제외 케이스
- MyBatis XML 동적 갱신 확인 케이스

### 자동화 우선순위

1. `Happy Path`를 먼저 완성한다.
2. `Edge`는 helper가 안정화된 뒤 붙인다.
3. `Negative`는 사용자 영향이 큰 실패 경로만 우선 자동화한다.
4. `Environment`는 별도 setup 문서와 연동할 때만 자동화한다.

### 현재 권장 실행 순서

1. Common smoke
2. Page 기본 흐름
3. Resource 탭 노출
4. Dataset REST API
5. CodeBox 배치/오픈
6. 3D 기본 조작
7. Edge/Negative 보강
8. Environment 항목 문서화
