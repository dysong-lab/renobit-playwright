# RENOBIT 3.5.0 Release QA Test Cases

Source:
- Jira Epic: `QATC-4203 [RENOBIT] 3.5.0 릴리즈 항목`
- Label: `RENOBIT`
- Scope: 3.5.0 release cutover / regression verification

Note:
- Jira description이 비어 있는 항목은 summary와 release context를 기준으로 실행 문장으로 보강했다.
- 일부 항목은 현재 문서용으로 `manual` 성격의 사전 조건을 포함한다.

## QATC-4203 - [RENOBIT] 3.5.0 릴리즈 항목

Description:
- 3.5.0 릴리즈에 포함된 핵심 기능, 회귀 수정, 안정화 항목을 묶은 상위 Epic이다.

Preconditions:
- 3.5.0 릴리즈 산출물이 배포되어 있어야 한다.
- RENOBIT 에디터와 통합관리자 접속 경로가 모두 확인 가능해야 한다.
- 릴리즈에 포함된 각 하위 수정 항목의 영향 범위를 재현할 수 있어야 한다.

Expected Results:
- 각 하위 항목이 릴리즈 환경에서 정상 동작해야 한다.
- 기존 회귀가 재발하지 않아야 한다.
- 기능별 검증 결과와 버그 수정 결과가 일관되게 Pass로 확인되어야 한다.

### QATC-4210 - ECO 관련 front 기능 flag로 제외 설정

Description:
- `asset_config.json`의 `enabled` 플래그로 ECO 기능 전체 ON/OFF를 제어한다.

Preconditions:
- ECO 관련 front 기능이 포함된 3.5.0 릴리즈 빌드가 준비되어 있어야 한다.
- `asset_config.json`의 `enabled` 값을 변경할 수 있어야 한다.

Expected Results:
- `enabled=false`일 때 ECO front 기능이 제외되어야 한다.
- `enabled=true`일 때 ECO front 기능이 다시 노출되어야 한다.

### QATC-4217 - EDITOR 3D 다중 선택 기능 업데이트

Description:
- 기존 ALT+드래그 선택을 제거하고 Ctrl+클릭 기반의 임시 Group 다중 선택을 적용한다.
- 3D 선택 모드용 T/R/S 버튼이 정상 전환되어야 한다.

Preconditions:
- 3D 에디터가 실행되어 있어야 한다.
- 3D 오브젝트가 복수 개 배치된 상태여야 한다.

Expected Results:
- Ctrl+클릭으로 다중 선택이 가능해야 한다.
- T/R/S 모드 버튼 전환이 정상 동작해야 한다.
- 기존 ALT+드래그 비동작 이슈가 재발하지 않아야 한다.

### QATC-4231 - 3D GUI Mesh 검색 기능

Description:
- 3D GUI Mesh를 검색해서 대상 컴포넌트를 빠르게 찾을 수 있어야 한다.

Preconditions:
- 3D GUI 목록이 로드되어 있어야 한다.
- 검색 가능한 Mesh 데이터가 최소 1개 이상 존재해야 한다.

Expected Results:
- 검색어 입력 시 일치하는 Mesh만 필터링되어 보여야 한다.
- 검색 결과 선택이 정상적으로 가능해야 한다.

### QATC-4232 - Babel 7 전환 후 PrimaryInfoTemplate 클래스 프로퍼티 초기화 에러

Description:
- Babel 7 전환 이후 발생하던 클래스 프로퍼티 초기화 예외를 해결한다.

Preconditions:
- Babel 7 전환이 반영된 3.5.0 빌드여야 한다.
- PrimaryInfoTemplate이 로딩되는 화면을 열 수 있어야 한다.

Expected Results:
- PrimaryInfoTemplate 로딩 시 초기화 에러가 발생하지 않아야 한다.
- 관련 화면 진입이 정상적으로 완료되어야 한다.

### QATC-4251 - 페이지 CSS ID를 에디터에서는 적용되지 않게 하는 방법

Description:
- 에디터 내부 구조와 충돌하는 `#id` 셀렉터를 피하도록 CSS ID 처리 방식을 변경한다.

Preconditions:
- 페이지 속성에서 CSS ID를 지정할 수 있어야 한다.
- 스크립트 에디터에서 ID 복사 동작을 확인할 수 있어야 한다.

Expected Results:
- 에디터 내부 DOM 충돌 없이 페이지 CSS ID가 처리되어야 한다.
- ID 복사 결과가 에디터 친화적인 클래스 셀렉터 형태로 반영되어야 한다.

### QATC-4252 - REST API > read timeout, connection timeout > config 설정

Description:
- REST API/TIM 데이터셋 호출 시 timeout과 connection pool 설정을 글로벌 설정에서 제어한다.

Preconditions:
- `globals.properties`의 timeout/pool 설정을 변경할 수 있어야 한다.
- REST API 또는 TIM 데이터셋 실행 경로가 존재해야 한다.

Expected Results:
- read timeout과 connection timeout이 설정값에 맞게 적용되어야 한다.
- 데이터셋 호출이 timeout 설정을 따르며 안정적으로 수행되어야 한다.

### QATC-4254 - 상세 에러메시지 노출 취약점

Description:
- 서버 내부 에러가 프론트 응답으로 상세 노출되지 않도록 막고 로그로만 남긴다.

Preconditions:
- RENOBIT와 admin 모두에서 에러를 유발할 수 있어야 한다.
- 상세 에러 메시지 노출 경로를 재현할 수 있어야 한다.

Expected Results:
- 프론트에는 상세 서버 에러가 노출되지 않아야 한다.
- 내부 로그에는 필요한 에러 정보가 남아야 한다.

### QATC-4255 - 커스텀 컴포넌트에 locales 폴더가 없을 때 ko-KR.json 404 에러 발생

Description:
- locales 폴더가 없는 커스텀 컴포넌트에서 불필요한 ko-KR.json 요청이 발생하지 않도록 수정한다.

Preconditions:
- locales 폴더가 없는 커스텀 컴포넌트를 배치할 수 있어야 한다.
- 네트워크 404 요청을 확인할 수 있어야 한다.

Expected Results:
- locales 부재 상황에서 404 요청이 발생하지 않아야 한다.
- 커스텀 컴포넌트가 정상적으로 로드되어야 한다.

### QATC-4256 - 마스터 페이지와 참조 페이지의 Instance name 같은 경우 컴포넌트 삭제 시 레이어 작업이 반대로 적용되는 버그

Description:
- 동일 Instance name을 가진 마스터/참조 페이지에서 삭제 작업이 반대로 전파되는 문제를 수정한다.

Preconditions:
- 마스터 페이지와 참조 페이지에 동일 Instance name이 존재해야 한다.
- 삭제 동작을 수행할 수 있어야 한다.

Expected Results:
- 삭제/해제 동작이 올바른 레이어에만 반영되어야 한다.
- 동일 이름 인스턴스에서 반대 방향 작업이 발생하지 않아야 한다.

### QATC-4257 - Popup > rowGap, columnGap 속성 적용되지 않음

Description:
- Popup 컴포넌트에서 rowGap / columnGap 속성이 정상 반영되도록 수정한다.

Preconditions:
- Popup 컴포넌트를 배치할 수 있어야 한다.
- rowGap / columnGap 속성을 조정할 수 있어야 한다.

Expected Results:
- rowGap과 columnGap 값이 화면에 반영되어야 한다.
- grid 관련 속성이 gap 값을 덮어쓰지 않아야 한다.

### QATC-4258 - popup 닫기 후 Master Layer에 PopupWindow 누적되는 현상

Description:
- 팝업 닫기 시 masterLayer 참조 맵에서 파괴된 PopupWindow 인스턴스를 정리한다.

Preconditions:
- PopupWindow를 반복해서 열고 닫을 수 있어야 한다.
- masterLayer의 instance map 상태를 확인할 수 있어야 한다.

Expected Results:
- 닫힌 PopupWindow가 masterLayer에 누적되지 않아야 한다.
- 반복 열기/닫기 후에도 참조 맵이 정상적으로 정리되어야 한다.

#### QATC-4290 - 반복 열기/닫기

Description:
- 팝업을 반복해서 열고 닫을 때 누적 현상이 재발하지 않는지 확인한다.

Preconditions:
- PopupWindow를 열 수 있는 실행 화면이 준비되어 있어야 한다.

Expected Results:
- 반복 동작 후에도 닫힌 팝업 인스턴스가 남지 않아야 한다.

#### QATC-4291 - 마스터 레이어 다른 컴포넌트

Description:
- 팝업 정리 로직이 마스터 레이어의 다른 컴포넌트에 영향을 주지 않는지 확인한다.

Preconditions:
- 마스터 레이어에 여러 컴포넌트가 존재해야 한다.

Expected Results:
- 다른 컴포넌트가 비정상적으로 제거되거나 변형되지 않아야 한다.

### QATC-4259 - TREE를 그릴 때 누락된 ID(parent, prev_id)가 있을 경우 방어로직(데이터갱신)

Description:
- TREE 렌더링 시 parent 또는 prev_id가 누락된 데이터에 대해 방어 로직을 적용한다.

Preconditions:
- TREE 갱신 과정에서 누락 ID가 포함된 데이터를 재현할 수 있어야 한다.

Expected Results:
- 누락 ID가 있어도 TREE 데이터 갱신이 중단되지 않아야 한다.
- 렌더링 오류 없이 데이터가 복구 또는 무시 처리되어야 한다.

### QATC-4260 - mac 단축키 검증 및 수정

Description:
- macOS 환경에서 에디터 단축키가 정상 동작하도록 검증하고 수정한다.

Preconditions:
- macOS 환경에서 RENOBIT를 실행할 수 있어야 한다.
- 단축키 입력을 테스트할 수 있어야 한다.

Expected Results:
- mac 전용 단축키가 정상적으로 인식되어야 한다.
- OS 차이로 인한 단축키 오작동이 없어야 한다.

### QATC-4261 - 에디터 단축키 처리를 event.key에서 event.code로 전환

Description:
- 단축키 판별을 `event.key`가 아니라 `event.code` 기반으로 전환한다.

Preconditions:
- 단축키 입력을 발생시킬 수 있어야 한다.

Expected Results:
- 키보드 레이아웃 차이와 무관하게 단축키가 동일하게 동작해야 한다.

### QATC-4262 - GLTF Animation 처리

Description:
- GLTF 애니메이션이 포함된 자산을 정상 처리한다.

Preconditions:
- GLTF Animation이 포함된 리소스를 로드할 수 있어야 한다.

Expected Results:
- GLTF 애니메이션이 깨지지 않고 재생되어야 한다.

### QATC-4263 - ECO 컴포넌트 metricCode 문자열 상수화 리팩터링

Description:
- ECO 컴포넌트에서 사용되는 metricCode 문자열을 상수화하여 유지보수성을 높인다.

Preconditions:
- ECO 컴포넌트가 포함된 화면이 있어야 한다.

Expected Results:
- metricCode 관련 동작이 기존과 동일하게 유지되어야 한다.
- 문자열 오타로 인한 동작 실패가 없어야 한다.

### QATC-4264 - dataset(fetchData) 메모리 누수

Description:
- dataset fetchData 경로에서 발생하는 메모리 누수를 수정한다.

Preconditions:
- 반복 fetchData 호출 시 메모리 증가를 관찰할 수 있어야 한다.

Expected Results:
- 반복 호출 후 메모리 누수가 발생하지 않아야 한다.

### QATC-4266 - 페이지 삭제 시 DELETE 입력 UX

Description:
- 페이지 삭제 시 DELETE 입력을 요구하는 UX를 정상적으로 동작시키는다.

Preconditions:
- 삭제 가능한 페이지가 존재해야 한다.

Expected Results:
- DELETE 입력 후에만 삭제가 진행되어야 한다.
- 잘못된 입력에는 삭제가 수행되지 않아야 한다.

### QATC-4267 - 관리자 메인 주소 변경

Description:
- 관리자 메인 진입 주소를 변경한다.

Preconditions:
- 관리자 진입 URL이 확인 가능해야 한다.

Expected Results:
- 변경된 주소로 관리자 메인 화면이 정상 진입되어야 한다.

### QATC-4268 - ECO Pack > SetInterval로 요청이 누적되는 현상 방지

Description:
- ECO Pack에서 SetInterval 기반 요청 누적을 방지한다.

Preconditions:
- ECO Pack 기능이 실행 중이어야 한다.

Expected Results:
- 반복 요청이 중복 누적되지 않아야 한다.
- 네트워크 요청 수가 제한적으로 유지되어야 한다.

### QATC-4269 - ECO pack > ActionPanel(Heatmap) > 데이터 Fetch 최적화

Description:
- Heatmap ActionPanel의 데이터 fetch를 최적화한다.

Preconditions:
- ECO Pack의 ActionPanel(Heatmap)을 실행할 수 있어야 한다.

Expected Results:
- 불필요한 fetch가 줄어들어야 한다.
- 화면은 기존과 동일하게 렌더링되어야 한다.

### QATC-4270 - CONSOLE GROUP

Description:
- 콘솔 그룹 관련 기능을 점검한다.

Preconditions:
- 콘솔 그룹이 포함된 화면이 있어야 한다.

Expected Results:
- 콘솔 그룹이 정상 표시되고 상호작용되어야 한다.

### QATC-4271 - Background common 기능 점검

Description:
- master/stage 배경 정보 저장 위치 교차 문제를 수정하고 배경 공통 기능을 점검한다.

Preconditions:
- master 페이지와 stage 페이지가 모두 존재해야 한다.

Expected Results:
- 배경 정보가 올바른 위치에 저장되어야 한다.
- 마스터 페이지에서 Page 섹션이 숨김 처리되어야 한다.

### QATC-4272 - 컴포넌트 더블클릭해서 페이지에 올리면 position:absoulute로 변환

Description:
- 컴포넌트를 더블클릭 또는 배치하면 absolute 기반 위치로 변환되도록 한다.

Preconditions:
- 배치 가능한 컴포넌트가 존재해야 한다.

Expected Results:
- 페이지에 올린 컴포넌트가 absolute positioning을 사용해야 한다.
- Group 드롭 동작이 정상 처리되어야 한다.

### QATC-4273 - 다른 타입 컴포넌트 멀티 선택 시 properties 패널 완전 공백

Description:
- 서로 다른 타입 컴포넌트 멀티 선택 시 properties 패널을 완전 공백 대신 공통 정보만 노출되도록 수정한다.

Preconditions:
- 서로 다른 타입의 컴포넌트를 2개 이상 배치해야 한다.

Expected Results:
- primary-info는 항상 보여야 한다.
- position 등 공통 값은 조건에 따라 표시되어야 한다.

### QATC-4274 - 코드박스 잠금 기능(readOnly)

Description:
- 스크립트 에디터에 잠금/해제 토글을 추가하고 기본 상태를 readOnly로 유지한다.

Preconditions:
- Codebox를 열 수 있어야 한다.

Expected Results:
- 기본 상태가 잠금(readOnly)이어야 한다.
- 잠금 해제 시 편집이 가능해야 한다.

### QATC-4340 - 데이터셋 DB Query 커넥션 close 누락

Description:
- DB Query에서 사용하는 유틸 클래스의 커넥션 close 누락을 수정한다.

Preconditions:
- DB Query 데이터셋 실행 경로가 있어야 한다.

Expected Results:
- 커넥션이 정상적으로 닫혀야 한다.
- 멀티 데이터소스 연결 테스트에서 누수가 발생하지 않아야 한다.

### QATC-4341 - 로그아웃 API 추가

Description:
- RENOBIT / admin 공통 로그아웃 API를 추가한다.

Preconditions:
- 로그인 세션이 존재해야 한다.

Expected Results:
- 로그아웃 API 호출 후 세션이 종료되어야 한다.

### QATC-4343 - MyBatis XML 동적 갱신

Description:
- 프로젝트 개발 환경에서 MyBatis XML을 서버 재기동 없이 동적으로 갱신할 수 있어야 한다.

Preconditions:
- `Globals.Mybatis.RefreshInterval` 설정이 가능해야 한다.
- 동적 갱신 대상 XML 파일을 수정할 수 있어야 한다.

Expected Results:
- 설정값에 따라 XML 변경이 자동 반영되어야 한다.
- 운영 환경에서는 동적 갱신이 비활성화되어야 한다.

### QATC-4345 - SSO 로그인 헤더 토큰 지원

Description:
- SSO 로그인 시 헤더 토큰을 함께 전달할 수 있어야 한다.

Preconditions:
- SSO 로그인 호출 경로와 토큰 헤더를 구성할 수 있어야 한다.

Expected Results:
- 토큰 헤더가 포함된 SSO 로그인이 정상 처리되어야 한다.

### QATC-4351 - 메모리 확인

Description:
- 릴리즈 후 메모리 사용 상태를 확인한다.

Preconditions:
- 대상 환경에서 장시간 실행 또는 부하 상태를 관찰할 수 있어야 한다.

Expected Results:
- 메모리 사용량이 비정상적으로 증가하지 않아야 한다.

## Release Coverage Summary

- Platform / Security: `QATC-4254`, `QATC-4341`, `QATC-4345`
- Editor / UI: `QATC-4217`, `QATC-4251`, `QATC-4257`, `QATC-4260`, `QATC-4261`, `QATC-4266`, `QATC-4272`, `QATC-4273`, `QATC-4274`
- 3D / Rendering: `QATC-4231`, `QATC-4232`, `QATC-4256`, `QATC-4258`, `QATC-4259`, `QATC-4262`
- Data / Dataset: `QATC-4252`, `QATC-4264`, `QATC-4340`, `QATC-4343`
- ECO / Performance: `QATC-4210`, `QATC-4263`, `QATC-4268`, `QATC-4269`, `QATC-4270`, `QATC-4271`, `QATC-4351`
