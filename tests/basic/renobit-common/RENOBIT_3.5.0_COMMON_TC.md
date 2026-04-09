# RENOBIT 3.5.0 Common Regression Test Cases

기준 환경
- Base URL: `http://10.23.128.203:9000`
- 로그인 계정: `admin / wemb@#@#`
- 대상: `RENOBIT 3.5.0`
- 목적: 라이브러리 업데이트 또는 공통 기능 회귀 점검 시 재사용할 기본 기능 기준 TC

공통 합격 기준
- 기능이 정상 동작해야 한다.
- 필요한 화면 또는 모달이 정상 표출되어야 한다.
- 저장 또는 다운로드가 필요한 경우 정상 완료되어야 한다.
- 치명적인 콘솔 에러 없이 다음 동작을 이어서 수행할 수 있어야 한다.

## Common

### TC-R35-COM-001 Editor 권한 로그인 후 에디터 진입
Preconditions
- RENOBIT 3.5.0 서버가 정상 기동 중이어야 한다.
- `admin` 계정이 유효하고 Editor 체크 옵션이 노출되어야 한다.
- 로그인 페이지 `/renobit/login.do` 에 정상 접근 가능해야 한다.

Expected Results
- 로그인 요청 후 `/renobit/visual.do#/` URL로 이동해야 한다.
- `mainPageComponent.isLoaded` 값이 `true` 가 되어 에디터 초기화가 완료되어야 한다.
- `threeLayer` 및 페이지 생성 모달이 준비되어 이후 회귀 TC의 시작점으로 사용할 수 있어야 한다.

### TC-R35-COM-002 Common Header - Viewer 링크 이동
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- Viewer 링크가 header 영역에 노출되어 있어야 한다.

Expected Results
- Viewer 링크 클릭 시 새 창 또는 새 페이지가 열려야 한다.
- 이동된 URL 이 viewer 경로를 포함해야 한다.
- 기존 에디터 세션은 유지되어야 한다.

### TC-R35-COM-003 Common Header - Admin 링크 이동
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- Admin 링크가 header 영역에 노출되어 있어야 한다.

Expected Results
- Admin 링크 클릭 시 새 창 또는 새 페이지가 열려야 한다.
- 이동된 URL 이 admin 경로를 포함해야 한다.
- 기존 에디터 세션은 유지되어야 한다.

### TC-R35-COM-004 Common Header - Logout 동작
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- Logout 링크가 header 영역에 노출되어 있어야 한다.

Expected Results
- Logout 실행 후 로그인 페이지 또는 재인증이 필요한 상태로 이동해야 한다.
- 기존 editor session 은 더 이상 유효하지 않아야 한다.

### TC-R35-COM-005 Common Toolbar - Copy/Cut/Paste/Delete 기본 상태
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- 공통 toolbar 영역이 노출되어 있어야 한다.

Expected Results
- Copy, Cut, Paste, Delete 버튼이 표시되어야 한다.
- 초기 상태에서 선택 대상이 없으면 비활성 또는 실행 불가 상태가 유지되어야 한다.

### TC-R35-COM-006 Common Toolbar - Layer 영역 기본 버튼 표시
Preconditions
- 에디터 로그인 완료 상태여야 한다.

Expected Results
- Layer 영역의 기본 버튼이 표시되어야 한다.
- 2D, 3D, Master, Layer 관련 전환 UI 가 노출되어야 한다.

### TC-R35-COM-007 Common Toolbar - View 영역 기본 버튼 표시
Preconditions
- 에디터 로그인 완료 상태여야 한다.

Expected Results
- View 영역의 기본 버튼이 표시되어야 한다.
- 보기 관련 버튼이 공통 header 또는 toolbar 에서 식별 가능해야 한다.

<!-- ### TC-R35-COM-008 Common Toolbar - Mobile Master 영역 기본 버튼 표시
Preconditions
- 에디터 로그인 완료 상태여야 한다.

Expected Results
- Mobile Master 관련 버튼 또는 토글 영역이 표시되어야 한다. -->

### TC-R35-COM-009 Common Header - Zoom 토글 표시
Preconditions
- 에디터 로그인 완료 상태여야 한다.

Expected Results
- Zoom 표시 또는 zoom control UI 가 보여야 한다.
- 사용자가 현재 편집 배율을 확인할 수 있어야 한다.

<!-- ### TC-R35-COM-010 Common Header - Device/View 선택 combobox 표시
Preconditions
- 에디터 로그인 완료 상태여야 한다.

Expected Results
- Device 또는 View 선택용 combobox 가 표시되어야 한다.
- 선택 UI 는 비정상 스크립트 에러 없이 열릴 수 있어야 한다. -->

### TC-R35-COM-011 Empty State - 활성 페이지 미존재 메시지 표시
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- 활성 페이지가 없는 상태여야 한다.

Expected Results
- 활성 페이지가 존재하지 않는다는 empty state 메시지가 표시되어야 한다.
- 사용자가 신규 페이지 생성 흐름으로 이동할 수 있어야 한다.

## Page

### TC-R35-PAGE-001 신규 페이지 생성
Preconditions
- 에디터 로그인 완료 후 create page modal 을 호출할 수 있어야 한다.
- 페이지 트리 데이터가 로드되어 생성 결과를 확인할 수 있어야 한다.

Expected Results
- 신규 생성 팝업이 표시되어야 한다.
- 입력한 이름으로 `type=page` 항목이 페이지 트리에 생성되어야 한다.
- 생성 후 추가 페이지 작업을 이어서 수행할 수 있어야 한다.

### TC-R35-PAGE-002 신규 그룹 생성
Preconditions
- 에디터 로그인 완료 후 create page modal 을 호출할 수 있어야 한다.
- 페이지 트리 데이터가 로드되어 생성 결과를 확인할 수 있어야 한다.

Expected Results
- 신규 생성 팝업에서 group 생성 흐름이 정상 동작해야 한다.
- 입력한 이름으로 `type=group` 항목이 페이지 트리에 생성되어야 한다.
- 그룹 생성 후 다른 페이지/폴더 생성 흐름이 깨지지 않아야 한다.

### TC-R35-PAGE-003 신규 마스터 페이지 생성
Preconditions
- 에디터 로그인 완료 후 create page modal 을 호출할 수 있어야 한다.
- 마스터 페이지 생성 권한 및 UI가 정상 동작해야 한다.

Expected Results
- 신규 생성 팝업에서 master 생성 흐름이 정상 동작해야 한다.
- 입력한 이름으로 `type=master` 항목이 페이지 트리에 생성되어야 한다.
- 페이지 트리와 내부 current page 상태가 불일치하지 않아야 한다.

### TC-R35-PAGE-004 Import Page 모달 표시
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- `fixtures/page.json` 파일이 준비되어 있어야 한다.

Expected Results
- `page.json` 선택 후 import modal 이 표시되어야 한다.
- 사용자가 import 실행 여부를 판단할 수 있는 primary 버튼이 보여야 한다.

### TC-R35-PAGE-005 Export Current Page 다운로드 시작
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- 현재 활성 페이지가 존재해야 한다.

Expected Results
- 다운로드 이벤트가 발생해야 한다.
- 다운로드 파일명은 `pages.json` 이어야 한다.

### TC-R35-PAGE-006 Export Pages 모달에서 선택 페이지 다운로드
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- 내보낼 대상 페이지가 페이지 목록에 존재해야 한다.

Expected Results
- Export Pages 모달이 표시되어야 한다.
- 페이지 검색과 체크가 정상 동작해야 한다.
- 내보내기 실행 시 `pages.json` 다운로드가 시작되어야 한다.

### TC-R35-PAGE-007 Import Total Data 파일 선택 TC
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- `fixtures/total_data.zip` 파일이 준비되어 있어야 한다.

Expected Results
- 통합 가져오기 명령 실행 후 zip 파일 선택 입력이 오류 없이 처리되어야 한다.
- 실운영 환경에서는 통합 가져오기 완료 팝업이 표시되어야 한다.

### TC-R35-PAGE-008 Export Total Data 모달 표시
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- 내보내기 가능한 페이지가 존재해야 한다.

Expected Results
- 통합 내보내기 모달이 표시되어야 한다.
- 전체 선택 체크박스와 내보내기 버튼이 노출되어야 한다.

## Resource

### TC-R35-RES-001 Images 탭 노출
### TC-R35-RES-002 Background 탭 노출
### TC-R35-RES-003 Icons 탭 노출
### TC-R35-RES-004 Button Images 탭 노출
### TC-R35-RES-005 Sprite Clip 탭 노출
### TC-R35-RES-006 State Clip 탭 노출
### TC-R35-RES-007 GLTF 탭 노출
### TC-R35-RES-008 Lottie 탭 노출
### TC-R35-RES-009 HDR 탭 노출
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- Resource Manager 모달이 열린 상태여야 한다.

Expected Results
- 각 탭이 Resource Manager 내에 표시되어야 한다.
- 해당 탭이 해당 리소스 유형의 업로드 대상 카테고리로 식별 가능해야 한다.

### TC-R35-RES-010 기본 활성 탭은 Images
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- Resource Manager 모달이 열린 상태여야 한다.

Expected Results
- 진입 직후 `Images` 탭이 active 상태여야 한다.

### TC-R35-RES-011 Import Resources 파일 선택 TC
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- `fixtures/resources.zip` 파일이 준비되어 있어야 한다.

Expected Results
- 리소스 가져오기 명령 실행 후 zip 파일 선택 입력이 오류 없이 처리되어야 한다.
- 실운영 환경에서는 리소스 추가 성공 메시지가 노출되어야 한다.

### TC-R35-RES-012 Export Resources 모달 표시
Preconditions
- 에디터 로그인 완료 상태여야 한다.

Expected Results
- Export Resources 모달이 표시되어야 한다.
- 내보낼 리소스를 선택할 수 있는 화면이 보여야 한다.

## Dataset

### TC-R35-DS-001 Dataset Manager 기본 레이아웃
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- Dataset Manager 라우트에 접근 가능해야 한다.

Expected Results
- Dataset Manager 컨테이너, 목록, 메인 탭이 노출되어야 한다.
- 데이터셋 생성 탭과 환경설정 탭이 보여야 한다.
- 초기 상태에서는 데이터셋 수정 탭이 노출되지 않아야 한다.

### TC-R35-DS-002 Create Dataset 기본 폼 필드
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- Dataset Manager 진입이 완료되어야 한다.

Expected Results
- 데이터셋명, 설명 입력 필드와 중복확인, 미리보기, 완료 버튼이 표시되어야 한다.

### TC-R35-DS-003 Dataset Import Popup 표시
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- `DatasetListMediator` view 가 초기화되어 있어야 한다.

Expected Results
- Dataset import popup 이 열려야 한다.
- `fixture_dataset` 이 목록에 표시되어야 한다.
- 추가하기 또는 primary action 버튼이 보여야 한다.

### TC-R35-DS-004 Dataset 파일 가져오기 TC
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- Dataset Manager 진입이 완료되어야 한다.
- `.json` 형식의 dataset fixture 파일이 준비되어 있어야 한다.

Expected Results
- 파일 가져오기 다이얼로그가 열려야 한다.
- fixture dataset 목록이 표시되어야 한다.
- 추가하기 실행 후 가져오기 완료 메시지가 표시되어야 한다.

상태
- 현재 자동화는 `pending`

### TC-R35-DS-005 Dataset 파일 내보내기 TC
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- Dataset Manager 진입이 완료되어야 한다.
- 내보낼 수 있는 dataset 이 존재해야 한다.

Expected Results
- 파일 내보내기 다이얼로그가 열려야 한다.
- 대상 dataset 선택 후 내보내기 실행이 가능해야 한다.
- 완료 메시지 또는 다운로드 시작이 확인되어야 한다.

상태
- 현재 자동화는 `pending`

### TC-R35-DS-006 REST API 타입 데이터셋 생성/수정 TC
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- Dataset Manager 진입이 완료되어야 한다.
- REST API request settings 입력 필드 selector 가 확정되어야 한다.

Expected Results
- 데이터셋명, 설명, 주기, method, url, headers, body 입력이 저장 가능해야 한다.
- 실행 결과 미리보기가 정상 노출되어야 한다.
- 저장 후 정상적으로 수정되었습니다 팝업이 표시되어야 한다.

상태
- 현재 자동화는 `pending`

### TC-R35-DS-007 DB Query 타입 데이터셋 생성/수정 TC
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- Dataset Manager 진입이 완료되어야 한다.
- DB Query 편집기와 파라미터 입력 selector 가 확정되어야 한다.

Expected Results
- 쿼리, 파라미터명, 기본값 입력이 저장 가능해야 한다.
- 실행 결과 미리보기가 정상 노출되어야 한다.
- 저장 후 정상적으로 수정되었습니다 팝업이 표시되어야 한다.

상태
- 현재 자동화는 `pending`

### TC-R35-DS-008 TIM 타입 데이터셋 설정 TC
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- Dataset Manager 진입이 완료되어야 한다.
- TIM URL 선택 및 검증 흐름 selector 가 확정되어야 한다.

Expected Results
- TIM 타입 선택과 TIM URL 지정이 가능해야 한다.
- TIM 연동 설정을 저장 가능한 상태로 유지해야 한다.

상태
- 현재 자동화는 `pending`

<!-- ## Component Manager

### TC-R35-CM-001 AmCharts Area 배치
### TC-R35-CM-002 AmCharts Column Line 배치
### TC-R35-CM-003 Active Group Btn 배치
### TC-R35-CM-004 Up/Down Status 배치
### TC-R35-CM-005 Compass 배치
### TC-R35-CM-006 Dropdown Field 배치
### TC-R35-CM-007 Textarea Field 배치
### TC-R35-CM-008 Basic Menu 배치
### TC-R35-CM-009 Tree Panel 배치
### TC-R35-CM-010 Progress Bar 배치
### TC-R35-CM-011 Progress Triangle 배치
### TC-R35-CM-012 Figures 배치
### TC-R35-CM-013 Typography 배치
### TC-R35-CM-014 Accordion 배치
### TC-R35-CM-015 Toasts 배치
### TC-R35-CM-016 Echart 배치
### TC-R35-CM-017 Echart Scatter 배치
### TC-R35-CM-018 TabulatorTable 배치
### TC-R35-CM-019 Group 배치
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- 편집 가능한 테스트 페이지가 열려 있어야 한다.
- 2D 레이어가 활성화되어 있어야 한다.

Expected Results
- 해당 카테고리에서 선택한 컴포넌트를 페이지에 배치할 수 있어야 한다.
- 배치 직후 `mainPageComponent` 에서 해당 인스턴스를 조회할 수 있어야 한다.

### TC-R35-CM-020 2d_pack > Network Service 하위 배치
### TC-R35-CM-021 2d_pack > Numeric 하위 배치
### TC-R35-CM-022 2d_pack > Sprite 하위 배치
### TC-R35-CM-023 2d_pack > State 하위 배치
### TC-R35-CM-024 Bootstrap > Forms 하위 배치
### TC-R35-CM-025 Bootstrap > Fundamental 하위 배치
### TC-R35-CM-026 Bootstrap > Interactive 하위 배치
### TC-R35-CM-027 Bootstrap > Navigation 하위 배치
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- 컴포넌트 매니저의 실제 selector 또는 command 파라미터가 확정되어야 한다.

Expected Results
- 각 하위 카테고리 범위의 컴포넌트를 모두 배치할 수 있어야 한다.
- 배치 후 저장 가능한 상태를 유지해야 한다.

상태
- 현재 자동화는 `pending`

### TC-R35-CM-028 2D Properties > Active Group Btn 수정
### TC-R35-CM-029 2D Properties > Figures 수정
### TC-R35-CM-030 2D Properties > Echart 수정
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- 속성 패널 selector 와 값 반영 기준이 확정되어야 한다.

Expected Results
- `Size`, `Position`, `Transform`, `Layout`, `FlexItem`, `Spacing`, `Label`, `Background`, `Border`, `Font-Type` 수정이 가능해야 한다.
- 수정 후 저장 가능한 상태를 유지해야 한다.

상태
- 현재 자동화는 `pending` -->

## CodeBox

### TC-R35-CB-001 Template > FreeCode > CodeBox 배치
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- 편집 가능한 테스트 페이지가 열려 있어야 한다.
- 2D 레이어가 활성화되어 있어야 한다.

Expected Results
- `FreeCode` 컴포넌트가 페이지에 배치되어야 한다.
- 배치 직후 `mainPageComponent` 에서 해당 인스턴스를 조회할 수 있어야 한다.

### TC-R35-CB-002 CodeBox 편집기 열기
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- CodeBox 컴포넌트가 배치되어 있어야 한다.
- 선택한 인스턴스를 대상으로 script editor 를 열 수 있어야 한다.

Expected Results
- `/#/codeBox` 팝업이 열려야 한다.
- 팝업 내부 편집 대상이 방금 선택한 `FreeCode` 인스턴스로 표시되어야 한다.
- 이후 HTML/CSS/JS 입력 테스트의 시작점으로 사용할 수 있어야 한다.

## 3D

### TC-R35-3D-001 3D 레이어 전환 후 T/R/S 툴바 표시
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- 3D 레이어를 포함한 편집 가능한 테스트 페이지가 열려 있어야 한다.

Expected Results
- 3D 레이어 전환 후 `activeLayer.name` 이 `_threeLayer` 여야 한다.
- Box 두 개 다중 선택 시 temp group 이 생성되어야 한다.
- `T/R/S` 버튼이 노출되어야 하고 2D 레이어 전환 시 다시 숨겨져야 한다.

### TC-R35-3D-002 3D 다중 선택 후 이동/회전/스케일 적용 및 저장 유지
Preconditions
- 에디터 로그인 완료 상태여야 한다.
- 3D 레이어 전환이 가능해야 한다.
- Box 컴포넌트를 배치할 수 있는 편집 상태여야 한다.

Expected Results
- 다중 선택 후 이동, 회전, 스케일이 두 컴포넌트에 함께 반영되어야 한다.
- 저장 후 새로고침해도 `position`, `rotation`, `size` 값이 유지되어야 한다.
