# RENOBIT_QA_통합_최종.xlsx

AI 작업용 변환본이며, `E2E 구현` 열은 현재 `/Users/dayoung/dev/e2e/tests` 기준 실제 스펙이 있는 항목만 보수적으로 체크했습니다.

## Coverage Summary

| Sheet | Marked |
| --- | ---: |
| Admin.csv | 0 |
| Code Box.csv | 2 |
| Components.csv | 0 |
| GUI Option 3D.csv | 0 |
| Help.csv | 0 |
| Instance List.csv | 0 |
| Manager.csv | 4 |
| Page.csv | 4 |
| Properties.csv | 0 |
| 공통·로그인.csv | 5 |

## Admin

| 에픽/기능 | 서브 기능 | TC ID | 제목 | Precondition | Test Steps | Expected Result | 상태 | 비고 | Playwright 가능 | 비고 | E2E 구현 | 구현 근거 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ▼ admin |  |  |  |  |  |  |  |  |  |  |  |  |
| admin | 상단 옵션 > 언어 | QATC-816 | 상단 옵션 > 한국어 버튼 > 영어 | - | 상단 한국어 버튼 선택 > ENGLISH 선택 | 페이지가 영어로 표출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 상단 옵션 > 언어 | QATC-817 | 상단 옵션 > 한국어 버튼 > 중국어(간체) | - | 상단 한국어 버튼 선택 > 중국어(간체) 선택 | 페이지가 중국어(간체)로 표출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 상단 옵션 > 언어 | QATC-818 | 상단 옵션 > 한국어 버튼 > 중국어(번체) | - | 상단 한국어 버튼 선택 > 중국어(번체) 선택 | 페이지가 중국어(번체)로 표출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 사용자 관리 | QATC-819 | 사용자 관리 > 사용자 리스트 | - | 사용자 관리 메뉴 선택 > 사용자 리스트 확인 | 사용자 정보 확인, 수정, 삭제 가능(관리자 제외) | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 사용자 관리 | QATC-820 | 사용자 관리 > 사용자 추가 버튼 | - | 사용자 관리 메뉴 선택 > 사용자 추가 버튼 선택 | 사용자 추가 팝업 노출, 필수정보 입력 시 추가 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 사용자 관리 | QATC-821 | 사용자 관리 > 계정 잠금 버튼 | - | 사용자 관리 > 액션 변경 > 사용자 수정 팝업 > 계정 잠금 > 로그아웃 후 로그인 시도 | 설정한 계정 로그인 불가 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 권한 관리 | QATC-822 | 권한 관리 > 리스트 추가/삭제 | - | 권한 관리 메뉴 선택 > 권한 리스트 확인 | 권한 리스트 노출, 추가/삭제 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 권한 관리 | QATC-823 | 권한관리 > 권한별 설정 | - | 권한 관리 메뉴 선택 > 페이지 등록 확인 | Renobit 페이지가 트리로 노출, 권한별 설정 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 권한 관리 | QATC-826 | 권한 관리 > 사용자 추가/삭제 | - | 권한 관리 메뉴 선택 > 권한 사용자 리스트 확인 | 권한별 사용자 추가/삭제 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 라이선스 관리 | QATC-827 | 라이선스 관리 | - | 라이선스 관리 메뉴 > Renobit 탭 > 라이선스 변경 버튼 선택 | 라이선스 키, 상용/트라이얼, 3D 사용 여부, IP, 사용자/세션 라이선스 설정 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 보안 정책 관리 | QATC-829 | 보안 정책 관리 > 초기 비밀번호 옵션 | - | 보안 정책 관리 메뉴 선택 > 초기 비밀번호 옵션 확인 | 초기 비밀번호 설정 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 보안 정책 관리 | QATC-832 | 보안 정책 관리 > 비밀번호 정책 > 사용 체크박스 | - | 보안 정책 관리 메뉴 선택 > 비밀번호 정책 > 사용 체크박스 확인 | 보안정책 사용/미사용 변경 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 보안 정책 관리 | QATC-834 | 보안 정책 관리 > 비밀번호 자릿수 옵션 | - | 비밀번호 정책 > 자릿수 옵션 확인 | 비밀번호 자릿수 지정 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 보안 정책 관리 | QATC-836 | 보안 정책 관리 > 비밀번호 조합 옵션 | - | 비밀번호 정책 > 조합 옵션 확인 | 기본, 영문/숫자, 영문/숫자/특수문자 조합 설정 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 보안 정책 관리 | QATC-838 | 보안 정책 관리 > 연속된 숫자/문자 옵션 | - | 비밀번호 정책 > 연속성 옵션 확인 | 1111, aaaa 등 연속 패턴 허용 여부 설정 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 보안 정책 관리 | QATC-839 | 보안 정책 관리 > 비밀번호 변경 주기 옵션 | - | 비밀번호 정책 > 변경주기 옵션 확인 | 일 단위 설정 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 보안 정책 관리 | QATC-840 | 보안 정책 관리 > 비밀번호 오류 허용 횟수 옵션 | - | 비밀번호 정책 > 오류허용 횟수 옵션 확인 | 잠금 전 허용 횟수 설정 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 상단 옵션 > setting | QATC-877 | 상단 옵션 > setting 버튼 (동기화) | - | Setting 버튼 > 동기화 | 메뉴 설정 내용과 Admin 메뉴 동기화 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 상단 옵션 > setting | QATC-878 | 상단 옵션 > setting 버튼 (추가) | - | Setting 버튼 > 추가 | 메뉴 추가 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 상단 옵션 > setting | QATC-879 | 상단 옵션 > setting 버튼 | - | Setting 버튼 선택 | 메뉴 설정 팝업 노출, 순서 변경/추가/동기화 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 상단 옵션 | QATC-881 | 상단 옵션 > 로그아웃 버튼 | - | 상단 Logout 버튼 선택 | 현재 로그인 계정 로그아웃 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 개인 환경설정 | QATC-883 | 개인 환경설정 > 메뉴관리 | - | 계정 우측 설정버튼 > 메뉴관리 탭 확인 | Renobit 초기 페이지 설정 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 개인 환경설정 | QATC-884 | 개인 환경설정 > 개인정보 | - | admin 설정버튼 > 개인정보 탭 확인 | 계정 정보 및 비밀번호 변경 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 사용자 관리 | QATC-886 | 사용자 관리 > 사용자 검색 옵션 | - | 사용자 관리 메뉴 > 검색 옵션 확인 | 이름, 아이디, 연락처, 부서명으로 검색 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 라이선스 관리 | QATC-888 | 라이선스 관리 > RENOBIT 탭 | - | 라이선스 관리 메뉴 > Renobit 탭 확인 | 현재 적용 라이선스 정보 노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 보안 정책 관리 | QATC-904 | 보안 정책 관리 > 접속 정책 (2차 인증 사용) | - | 관리자 2차 인증 사용 체크 > 뷰어에서 관리자 모드 접속 시도 | 2차 인증 팝업(PW 입력) 노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 보안 정책 관리 | QATC-906 | 보안 정책 관리 > 접속 정책 (2차 인증 미사용) | - | 관리자 2차 인증 미체크 > 뷰어에서 관리자 모드 접속 시도 | 2차 인증 팝업 미노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 접속 이력 | QATC-908 | 접속 이력 | - | 접속 이력 메뉴 > 리스트 확인 | 아이디, 이름, 로그인/로그아웃 시간, 로그아웃 타입, 클라이언트 IP 확인 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 접속 이력 | QATC-909 | 접속이력 (검색 옵션) | - | 접속 이력 메뉴 > 상단 검색 옵션 확인 | 접속 이력/현재 접속자 구분, 시간/기간 및 이름/아이디 필터링 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 접속 로그 | QATC-911 | 접속 로그 | - | 접속 로그 메뉴 > 리스트 확인 | 아이디, IP, 로그타입, 액션, 결과, 내용, 시간 확인 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 접속 로그 | QATC-912 | 접속로그 (검색 옵션) | - | 접속 로그 메뉴 > 상단 검색 옵션 확인 | 기간, 아이디, 로그타입, 내용별 필터링 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 폰트 관리 | QATC-1529 | 폰트 관리 (추가) | - | 폰트 관리 메뉴 > 추가 동작 확인 | Drag&Drop, 파일 선택으로 폰트 추가 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 폰트 관리 | QATC-1530 | 폰트 관리 (폰트 트리) | - | 폰트 관리 메뉴 > 폰트 트리 메뉴 확인 | 추가된 폰트 확인 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| admin | 폰트 관리 | QATC-1531 | 폰트 관리 (폰트 삭제) | - | 폰트 관리 메뉴 > 폰트 삭제 동작 확인 | 우클릭으로 삭제 가능, Basic 폰트는 삭제 불가 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ 호환성 |  |  |  |  |  |  |  |  |  |  |  |  |
| 호환성 | 페이지 이동 | QATC-914 | 페이지 이동 > RENOBIT to Admin | - | Renobit Editor에서 Admin 이동 확인 | Admin으로 정상 이동 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| 호환성 | 로그인 테스트 | QATC-915 | 로그인 테스트 > RENOBIT 선 로그인 | - | Renobit 선 로그인 후 Admin 로그인 페이지 새로고침 | 한 솔루션 로그인 시 다른 솔루션도 동일 계정 로그인 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| 호환성 | 로그인 테스트 | QATC-916 | 로그인 테스트 > Admin 선 로그인 | - | Admin 선 로그인 후 Renobit 로그인 페이지 새로고침 | 동일하게 SSO 로그인 유지 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |

## Code Box

| 에픽/기능 | 서브 기능 | TC ID | 제목 | Precondition | Test Steps | Expected Result | 상태 | 비고 | Playwright 가능 | 비고 | E2E 구현 | 구현 근거 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ▼ Code Box 열기 / 헤더 |  |  |  |  |  |  |  |  |  |  |  |  |
| Code Box | 열기 | QATC-3196 | 페이지 열기 | - | RENOBIT edit-menu-bar > Code box 클릭 | visual.do#/codeBox 새 페이지에서 열림 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 | 완료 | tc-codebox.spec.js / TC-R35-CB-002 |
| Code Box | 헤더 | QATC-3200 | Instance Name & Id | Code Box page > 헤더 | 헤더 > Instance Name & Id 확인 | 선택한 페이지/컴포넌트 이름과 ID 표시, 인스턴스 ID 클릭 시 복사 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 | 완료 | tc-codebox.spec.js / TC-R35-CB-002 |
| Code Box | 헤더 | QATC-3201 | Format code | Code Box page > 헤더 | 헤더 > Format code | 작성 코드 정렬 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code Box | 헤더/Apply | QATC-3204 | Apply — 정상 코드 | Code Box page > 헤더 | 정상 코드 작성 후 헤더 > Apply | 인스턴스에 즉시 코드 결과 적용 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code Box | 헤더/Apply | QATC-3205 | Apply — 비정상 코드 | Code Box page > 헤더 | 비정상 코드 작성 후 헤더 > Apply | 코드 반영되지 않음 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code Box | 헤더/Apply | QATC-3208 | Apply — 편집 중 이탈 | Code Box page > 헤더 | CSS/JS 편집 중 다른 인스턴스/페이지 선택 | 저장하지 않은 변경사항 alert 노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code Box | 헤더/Apply | QATC-3209 | Apply — 페이지 저장 | Code Box page > 헤더 | 헤더 > Apply 후 페이지 저장 | 페이지 저장 후 코드 즉시 적용 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ Side List |  |  |  |  |  |  |  |  |  |  |  |  |
| Code Box | Side List | QATC-3115 | Side list 구성 확인 | - | Code Box page > Side list | Instance List / Group item List / Instance Options / Default Code Snippet / Sample Code / SVG style 노출 | 대기 | ⚠️ 직접 계열 대비 Group item List 추가됨 (3.3.0 신규) | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code Box | Instance List | QATC-3121 | 리스트 노출 | - | Side list > Instance List | 페이지 내 인스턴스가 2D/3D 레이어별 리스트 출력 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code Box | Instance List | QATC-3123 | 검색 | - | Side list > Instance List > 검색 입력 | 검색 결과 노출, 미매칭 시 No Data | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code Box | TabulatorTable | QATC-3127 | TabulatorTable — 기본 코드 | - | Components > DataViz > Tabulator Table 배치 → Code Box > Instance List 선택 | 기본 HTML/CSS/JS 코드 확인 | 대기 | 3.3.0: ResizeObserver / star formatter 포함된 확장 예제 | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code Box | TabulatorTable | QATC-3130 | TabulatorTable — 수정 후 Apply | - | Instance List > index 선택 후 코드 수정 → Apply | Apply 적용 확인 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code Box | TabulatorTable | QATC-3132 | TabulatorTable — 수정 후 Format code | - | Instance List > index 선택 후 코드 수정 → Format code | Format code 적용 확인 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code Box | Echart | QATC-3134 | Echart — 기본 코드 | - | Components > DataViz > Echart 배치 → Code Box > Instance List 선택 | 기본 HTML/CSS/JS 코드 확인 | 대기 | 3.3.0: bar + line 조합 예제 | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code Box | Echart | QATC-3136 | Echart — 수정 후 Apply | - | Instance List > index 선택 후 코드 수정 → Apply | Apply 적용 및 Format code 적용 확인 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code Box | SVG/Color | QATC-3188 | Color Theme — Event Color | - | Side list > Instance List > SVG style > Color Theme | Event Color 적용, 상태별 색상 확인, 복사 alert 노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code Box | SVG/Color | QATC-3189 | Color Theme — Gradient | - | Side list > Instance List > SVG style > Color Theme | linear / radial gradient 적용 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code Box | SVG/Animation | QATC-3190 | Animation — blink | - | CSS 내 Instance ID 입력 | blink 애니메이션 적용 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code Box | SVG/Animation | QATC-3191 | Animation — pulse | - | CSS 내 Instance ID 입력 | pulse 애니메이션 적용 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code Box | SVG/Animation | QATC-3192 | Animation — rotate | - | CSS 내 Instance ID 입력 | rotate 애니메이션 적용 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code Box | SVG/Animation | QATC-3193 | Animation — animate tag | - | Side list > Instance List > SVG style > Animation | animate tag 효과 적용 | 대기 | 본문에 SVG animate 태그 예시 코드 포함 | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ Box 영역 |  |  |  |  |  |  |  |  |  |  |  |  |
| Code Box | Box | QATC-3213 | HTML / CSS / JS 코드 작성 | - | Box 영역에서 HTML/CSS/JS 작성 | 구조/스타일/동작 자유 정의 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code Box | Box | QATC-3216 | CSS / JS 코드 작성 | - | Box 영역에서 CSS/JS만 작성 | HTML 구조 고정, 스타일과 동작만 제어 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code Box | Box | QATC-3218 | JS 코드 작성 | - | Box 영역에서 JS만 작성 | 스타일/구조 변경 없이 JS로 동작 제어 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code Box | Box/Preview | QATC-3220 | Preview — 실시간 코드 실행 | - | Box 영역 코드 작성 | 작성한 JS가 Preview에 즉시 반영 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code Box | Box/Preview | QATC-3221 | Preview — Viewer 반영 | - | Box 영역 코드 작성 후 Viewer 확인 | 최종 Viewer에는 기존 이벤트에 코드 적용 후 반영 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code Box | Box/활용 | QATC-3223 | 코드 활용 — 인스턴스 ID 활용 | - | Box 영역에서 인스턴스 ID로 JS 접근 및 CSS 스타일링 | 인스턴스 ID 기반 접근 정상 동작 | 대기 | 본문에 2D 접근 예제 + 3D 팝업용 page/html/css/js 대형 예제 포함 | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |

## Components

| 에픽/기능 | 서브 기능 | TC ID | 제목 | Precondition | Test Steps | Expected Result | 상태 | 비고 | Playwright 가능 | 비고 | E2E 구현 | 구현 근거 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ▼ 구성 (패널 및 드래그&드롭) |  |  |  |  |  |  |  |  |  |  |  |  |
| Components | Pack 목록 | QATC-957 | 컴포넌트 Pack 목록 (2D) | 2D 레이어 | 컴포넌트 패널 클릭 | Bootstrap / DataViz / Template Pack 목록 표출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Components | Pack 목록 | QATC-958 | Pack 그룹 하위 목록 (2D) | 2D 레이어 | 컴포넌트 패널 클릭 → Bootstrap / DataViz / Template의 ▶ 클릭 | Bootstrap: Contents/DataDisplay/Forms/Fundamental/Interactive/Navigation<br>DataViz: Echart/TabulatorTable<br>Template: FreeCode/Group | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Components | Pack 목록 | QATC-959 | 드래그&드롭 / 더블클릭 (2D) | 2D 레이어 | Pack 하위 컴포넌트를 에디터 영역으로 드래그&드롭 | 에디터 영역에 컴포넌트 배치됨 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Components | Pack 목록 | QATC-961 | 컴포넌트 Pack 목록 (3D) | 3D 레이어 | 컴포넌트 패널 클릭 | 컴포넌트 Pack 목록 표출 (Three) | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Components | Pack 목록 | QATC-965 | Pack 하위 목록 (3D) | 3D 레이어 | 컴포넌트 패널 클릭 → Three의 ▶ 클릭 | Three: 2D Geometry / 3D Geometry / Modeling 표출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Components | Pack 목록 | QATC-968 | 드래그&드롭 / 더블클릭 (3D) | 3D 레이어 | Pack 하위 컴포넌트를 에디터 영역으로 드래그&드롭 | 에디터 영역에 컴포넌트 배치됨 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ 2D — Bootstrap |  |  |  |  |  |  |  |  |  |  |  |  |
| Components | Bootstrap/Contents | QATC-975 | Figures | 2D 레이어 | Bootstrap > Contents > Figures 드래그&드롭 | 이미지와 캡션 조합 콘텐츠 노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Components | Bootstrap/Contents | QATC-976 | Images | 2D 레이어 | Bootstrap > Contents > Images 드래그&드롭 | 반응형 이미지/스타일 적용 노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Components | Bootstrap/Contents | QATC-977 | Tables | 2D 레이어 | Bootstrap > Contents > Tables 드래그&드롭 | 정렬/반응형/스타일 가능한 테이블 노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Components | Bootstrap/Contents | QATC-978 | Typography | 2D 레이어 | Bootstrap > Contents > Typography 드래그&드롭 | 다양한 텍스트 구성 노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Components | Bootstrap/DataDisplay | QATC-979 | Accordion | 2D 레이어 | Bootstrap > DataDisplay > Accordion 드래그&드롭 | 아코디언 UI 노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Components | Bootstrap/DataDisplay | QATC-980 | Card | 2D 레이어 | Bootstrap > DataDisplay > Card 드래그&드롭 | 카드 레이아웃 노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Components | Bootstrap/기타 | 기타 다수 | DataDisplay~Navigation 하위 항목 | 2D 레이어 | Bootstrap > [그룹] > [컴포넌트] 드래그&드롭 | 선택한 컴포넌트가 캔버스에 정상 배치/노출 | 대기 | DataDisplay / Forms / Fundamental / Interactive / Navigation 각 하위 항목 동일 패턴 | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ 2D — DataViz |  |  |  |  |  |  |  |  |  |  |  |  |
| Components | DataViz/Echart | QATC-1039 | Echart — 배치 | 2D 레이어 | DataViz > Echart 드래그&드롭 | 다양한 차트와 커스터마이징 옵션 노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Components | DataViz/Echart | QATC-1040 | Echart — 데이터 확인 | 2D 레이어 | Echart 배치 → CodeBox completed/preview 동일 설정 → Apply | visual / visualViewer에서 데이터 확인 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Components | DataViz/Echart | QATC-1047 | 컴포넌트 활용 — Echart | 2D 레이어 | 에디터 배치 → CodeBox preview 이벤트 확인 | Echart 예제 코드 적용 확인 (본문 기준) | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Components | DataViz/TabulatorTable | QATC-1042 | TabulatorTable — 배치 | 2D 레이어 | DataViz > TabulatorTable 드래그&드롭 | 정렬/필터/편집/반응형 레이아웃 테이블 노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Components | DataViz/TabulatorTable | QATC-1043 | TabulatorTable — 데이터 확인 | 2D 레이어 | TabulatorTable 배치 → CodeBox completed/preview 동일 설정 → Apply | visual / visualViewer에서 데이터 확인 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Components | DataViz/TabulatorTable | QATC-1044 | TabulatorTable — destroy | 2D 레이어 | 페이지 이동 스니펫 적용 후 devtools에서 destroy 흐름 확인 | 이동 페이지에서 TabulatorTable 정상 노출 및 인스턴스 정상 동작 확인 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Components | DataViz/TabulatorTable | QATC-1049 | 컴포넌트 활용 — TabulatorTable | 2D 레이어 | 에디터 배치 → CodeBox preview 이벤트 확인 | TabulatorTable 예제 코드 적용 확인 (본문 기준) | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Components | DataViz | QATC-1050 | 컴포넌트 활용 — Apply | 2D 레이어 | CodeBox preview 확인 후 Apply | 에디터 레이어에서 코드 결과 확인 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ 2D — Template |  |  |  |  |  |  |  |  |  |  |  |  |
| Components | Template/FreeCode | QATC-1054 | FreeCode — HTML/CSS/JS 코드 작성 | 2D 레이어 | Template > FreeCode > Codebox 드래그&드롭 | HTML/CSS/JS 코드 작성 및 실행 확인 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Components | Template/FreeCode | QATC-1055 | FreeCode — Lottie | 2D 레이어 | FreeCode 배치 → Resource Manager 파일 선택 → HTML/JS/CSS 입력 | visual / visualViewer에서 HTML/JS/CSS 적용 확인 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Components | Template/FreeCode | QATC-1059 | FreeCode — HDR Default Code Snippet | 2D 레이어 | FreeCode 배치 → Default Code Snippet > HDR Load 저장 | visual / visualViewer에서 적용 확인 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Components | Template | QATC-1061 | Group | 2D 레이어 | Template > Group 드래그&드롭 | 레이아웃 유지, 그룹 단위 이동, 반응형 디자인 적용 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |

## GUI Option 3D

| 에픽/기능 | 서브 기능 | TC ID | 제목 | Precondition | Test Steps | Expected Result | 상태 | 비고 | Playwright 가능 | 비고 | E2E 구현 | 구현 근거 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ▼ 목록 확인 |  |  |  |  |  |  |  |  |  |  |  |  |
| GUI Option 3D | 목록 | QATC-1215 | GUI Option 목록 | - | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | controls / shadowMap / camera / ambiantLight / directionalLight / directionalLightHelper / directionalLightPosition / directionalLightTargetPosition / directionalLightShadow / directionalLightShadowCameraHelper / directionalLightShadowCamera 노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ Controls |  |  |  |  |  |  |  |  |  |  |  |  |
| GUI Option 3D | Controls | QATC-1223 | controls | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > controls | Expected Result 미기재 — 별도 확인 필요 | 대기 | ⚠️ Expected Result 미기재 | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| GUI Option 3D | Controls | QATC-1244 | autoRotate | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > controls | 카메라 자동 회전 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| GUI Option 3D | Controls | QATC-1245 | autoRotateSpeed | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > controls | 자동 회전 속도 설정, 기본값 2.0 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| GUI Option 3D | Controls | QATC-1247 | enable | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > controls | 컨트롤 자체 활성화 여부 (true / false) | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| GUI Option 3D | Controls | QATC-1249 | enableZoom | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > controls | 마우스 휠로 확대/축소 가능 여부 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| GUI Option 3D | Controls | QATC-1251 | enablePan | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > controls | 오른쪽 드래그로 화면 이동 가능 여부 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| GUI Option 3D | Controls | QATC-1254 | minDistance | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > controls | 카메라가 타겟에 가장 가까이 갈 수 있는 거리 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| GUI Option 3D | Controls | QATC-1256 | maxDistance | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > controls | 카메라가 타겟에서 가장 멀리 떨어질 수 있는 거리 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| GUI Option 3D | Controls | QATC-1258 | minPolarAngle | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > controls | 위쪽으로 올릴 수 있는 각도의 최솟값 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| GUI Option 3D | Controls | QATC-1260 | maxPolarAngle | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > controls | 아래쪽으로 내릴 수 있는 각도의 최댓값 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ ShadowMap |  |  |  |  |  |  |  |  |  |  |  |  |
| GUI Option 3D | ShadowMap | QATC-1226 | shadowMap — enable | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > shadowMap | 카메라 시점 기준 shadowMap 영역을 어두운 영역으로 표현 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| GUI Option 3D | ShadowMap | QATC-1230 | type — BasicShadowMap | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > shadowMap > type | 기본 그림자 방식, 빠르지만 경계가 딱딱하고 계단 현상 발생 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| GUI Option 3D | ShadowMap | QATC-1231 | type — PCFShadowMap | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > shadowMap > type | 기본적인 부드러운 경계 제공 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| GUI Option 3D | ShadowMap | QATC-1233 | type — PCFSoftShadowMap | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > shadowMap > type | 더 부드럽고 자연스러운 그림자, 성능은 약간 낮음 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| GUI Option 3D | ShadowMap | QATC-1235 | type — VSMShadowMap | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > shadowMap > type | 고급 그림자와 블러 지원, 광원 퍼짐 효과 표현 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ Camera |  |  |  |  |  |  |  |  |  |  |  |  |
| GUI Option 3D | Camera | QATC-1239 | fov | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > camera | 수직 방향 시야각 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| GUI Option 3D | Camera | QATC-1241 | near | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > camera | 이 거리보다 가까운 물체는 보이지 않음 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| GUI Option 3D | Camera | QATC-1242 | far | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > camera | 이 거리보다 멀리 있는 물체는 보이지 않음 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ Ambient Light |  |  |  |  |  |  |  |  |  |  |  |  |
| GUI Option 3D | Ambient Light | QATC-1297 | visible | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > ambiantLight | 사용 여부 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| GUI Option 3D | Ambient Light | QATC-1298 | intensity | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > ambiantLight | 밝기 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| GUI Option 3D | Ambient Light | QATC-1300 | color | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > ambiantLight | 빛의 색상 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ Directional Light |  |  |  |  |  |  |  |  |  |  |  |  |
| GUI Option 3D | Directional Light | QATC-1305 | directionalLight — visible | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > directionalLight | 사용 여부 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| GUI Option 3D | Directional Light | QATC-1307 | directionalLight — castShadow | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > directionalLight | 그림자 생성 여부 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| GUI Option 3D | Directional Light | QATC-1308 | directionalLight — intensity | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > directionalLight | 빛의 세기 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| GUI Option 3D | Directional Light | QATC-1310 | directionalLight — color | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > directionalLight | 빛 색상 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| GUI Option 3D | Directional Light | QATC-1557 | directionalLightPosition — visible | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > directionalLightPosition | 빛의 방향 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| GUI Option 3D | Directional Light | QATC-1313 | directionalLightTargetPosition | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > directionalLightTargetPosition | 빛이 향하는 방향의 x/y/z축 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| GUI Option 3D | Directional Light | QATC-1315 | directionalLightShadow | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option | toolbar > 3D 선택 > threeLayerPage 선택 > GUI option > directionalLightShadow | 그림자 생성 및 관련 x/y/z축 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ 3D Geometry (진입: toolbar > 3D > 3D 컴포넌트 선택 > GUI option > TorusComponent) |  |  |  |  |  |  |  |  |  |  |  |  |
| GUI Option 3D | 3D Geometry | QATC-1349 | position | toolbar > 3D 선택 > 3D 컴포넌트 선택 > GUI option > TorusComponent | GUI option > TorusComponent > position | x(좌우) / y(상하) / z(앞뒤) 위치 조정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| GUI Option 3D | 3D Geometry | QATC-1351 | rotation | toolbar > 3D 선택 > 3D 컴포넌트 선택 > GUI option > TorusComponent | GUI option > TorusComponent > rotation | x/y/z 축 회전 제어 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| GUI Option 3D | 3D Geometry | QATC-1353 | scale | toolbar > 3D 선택 > 3D 컴포넌트 선택 > GUI option > TorusComponent | GUI option > TorusComponent > scale | x/y/z 축 크기 조절 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| GUI Option 3D | 3D Geometry | QATC-1355 | material | toolbar > 3D 선택 > 3D 컴포넌트 선택 > GUI option > TorusComponent | GUI option > TorusComponent > material | transparent / opacity / side / color / emissive / wireframe / roughness / metalness 등 표면 속성 제어 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| GUI Option 3D | 3D Geometry | QATC-1357 | geometry | toolbar > 3D 선택 > 3D 컴포넌트 선택 > GUI option > TorusComponent | GUI option > TorusComponent > geometry | Box / Sphere 같은 기하학 정보 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |

## Help

| 에픽/기능 | 서브 기능 | TC ID | 제목 | Precondition | Test Steps | Expected Result | 상태 | 비고 | Playwright 가능 | 비고 | E2E 구현 | 구현 근거 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ▼ Information |  |  |  |  |  |  |  |  |  |  |  |  |
| Information | 레이어 팝업 | QATC-1177 | 레이어 팝업 | - | Help > information 클릭 > 레이어 팝업 | 레노빗 정보 노출됨. 예: Product Info version, server, packs(2d_pack, Bootstrap, DataViz, Template, Three) | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ Code compiler |  |  |  |  |  |  |  |  |  |  |  |  |
| Code compiler | 화면 전환 | QATC-1181 | 화면 전환 | - | Help > Code compiler 클릭 > 화면 전환 | codeCompiler 화면으로 전환됨 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code compiler | 화면 구성 | QATC-1182 | 화면 > 구성 | - | Help > Code compiler | 1. ES6 to ES5 문구 노출<br>2. ES6 코드 입력 영역 / Compiled code 입력 영역 노출<br>3. Compile 버튼 노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code compiler | 화면 > ES6 Code 입력 영역 | QATC-1184 | 화면 > ES6 Code 입력 영역 | - | Help > Code compiler > ES6 code | 미기재 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code compiler | 화면 > Compiled Code 영역 | QATC-1186 | 화면 > Compiled Code 영역 | - | Help > Code compiler > Compiled code 영역 | 1. Compiled code! 플레이스홀더 문구 노출<br>2. 영역 클릭 시 하이라이트 진해짐 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code compiler | 코드 입력 후 Compile | QATC-1187 | 코드 입력 후 Compile 버튼 클릭 | - | Help > Code compiler > ES6 code 입력 > Compile 버튼 클릭 | Compiled code 입력 영역 내 코드 노출됨 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code compiler | 잘못된 코드 입력 후 Compile | QATC-1189 | 잘못된 코드 입력 후 Compile 버튼 클릭 | - | Help > Code compiler > ES6 code 입력 > Compile 버튼 클릭 | 얼럿 팝업에 "Code cannot be compiled. SyntaxError: Missing semicolon.(1:5)" 노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Code compiler | 코드 미입력 후 Compile | QATC-1193 | 코드 미입력 후 Compile 버튼 클릭 | - | Help > Code compiler > Compile 버튼 클릭 | "use strict"; | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ FPS Show/Hide |  |  |  |  |  |  |  |  |  |  |  |  |
| FPS Show/Hide | 정보 | QATC-1195 | FPS Show/Hide [Ctrl+Alt+4] > 정보 | - | Help > FPS Show/Hide [Ctrl+Alt+4] | 우측 하단 FPS 정보 노출됨 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ Manual |  |  |  |  |  |  |  |  |  |  |  |  |
| Manual | 전환 | QATC-1197 | Manual > 전환 | - | Help > Manual | 레노빗 매뉴얼 화면으로 전환됨 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |

## Instance List

| 에픽/기능 | 서브 기능 | TC ID | 제목 | Precondition | Test Steps | Expected Result | 상태 | 비고 | Playwright 가능 | 비고 | E2E 구현 | 구현 근거 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ▼ 구성 (공통 진입: 인스턴스 패널 클릭) |  |  |  |  |  |  |  |  |  |  |  |  |
| Instance List | 검색 | QATC-1523 | 검색 — 검색어 있음 | - | 인스턴스 패널 클릭 → 컴포넌트 인스턴스명 입력 | 입력한 검색어에 해당하는 컴포넌트가 검색됨 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Instance List | 검색 | QATC-1524 | 검색 — 검색어 없음 | - | 인스턴스 패널 클릭 → 존재하지 않는 인스턴스명 입력 | 리스트 내 아무것도 노출되지 않음 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Instance List | 선택 연동 | QATC-1525 | 인스턴스 리스트 → 에디터 영역 | - | 인스턴스 패널 클릭 → 리스트에서 배치된 컴포넌트 항목 클릭 | 에디터 영역에서 선택한 컴포넌트가 표시됨 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Instance List | 선택 연동 | QATC-1526 | 에디터 영역 → 인스턴스 리스트 | - | 인스턴스 패널 클릭 → 에디터 영역에서 컴포넌트 클릭 | 인스턴스 패널 리스트에 선택한 컴포넌트가 표시됨 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Instance List | 아이콘 | QATC-1527 | Visible (눈 아이콘) | - | 인스턴스 패널 클릭 → 눈 모양 아이콘 클릭 | 에디터 영역에서 해당 컴포넌트가 보이지 않음 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Instance List | 아이콘 | QATC-1528 | Lock (자물쇠 아이콘) | - | 인스턴스 패널 클릭 → 자물쇠 모양 아이콘 클릭 | 컴포넌트 편집이 되지 않음 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |

## Manager

| 에픽/기능 | 서브 기능 | TC ID | 제목 | Precondition | Test Steps | Expected Result | 상태 | 비고 | Playwright 가능 | 비고 | E2E 구현 | 구현 근거 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ▼ 2d_pack 업로드 |  |  |  |  |  |  |  |  |  |  |  |  |
| Manager | 2d_pack | QATC-2997 | 마우스 오버 | - | 통합관리자 > Package > 2d_pack 업로드 → Manager 메뉴 마우스오버 | Menuset Manager / Template Manager 메뉴 숨김 해제되어 노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ Dataset Manager |  |  |  |  |  |  |  |  |  |  |  |  |
| Manager | 파일 | QATC-3001 | 파일 내보내기 | Manager > Dataset Manager | Dataset Manager > 파일 내보내기 > 내보내기할 JSON 파일 선택 | 전체 데이터셋 목록이 JSON 파일로 다운로드 | 대기 |  | △ | selector 미확정 또는 파일 I/O — 수동 검증 병행 필요 |  |  |
| Manager | 파일 | QATC-3004 | 파일 가져오기 | Manager > Dataset Manager | Dataset Manager > 파일 가져오기 > 내보낸 JSON 파일 선택 | 내보낸 파일 로드 후 저장 | 대기 |  | △ | selector 미확정 또는 파일 I/O — 수동 검증 병행 필요 |  |  |
| Manager | 타입/DB Query | QATC-3006 | 데이터셋 생성 — DB Query | Manager > Dataset Manager | Dataset Manager > DB Query 클릭 | Static / Dynamic / 멀티데이터소스 체크박스 / Static 코드영역 노출 | 대기 |  | △ | selector 미확정 또는 파일 I/O — 수동 검증 병행 필요 |  |  |
| Manager | 타입/TIM | QATC-3008 | 데이터셋 생성 — TIM | Manager > Dataset Manager | Dataset Manager > TIM 클릭 | TIM URL / TIM Worker / TIM Worker URL 입력영역 노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Manager | 타입/REST API | QATC-3010 | 데이터셋 생성 — REST API | Method: POST | Dataset Manager > REST API 클릭 → URL 입력 → Header Content-Type: application/json;charset=UTF-8 → JSON body 입력 → 미리보기 → Network Response 확인 | 미리보기 정상 노출 및 Response 정상 반환 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 | 완료 | tc-dataset.spec.js / TC-R35-DS-006 |
| Manager | DB Query 세부 | QATC-3012 | DB Query — Static | Manager > Dataset Manager | Static 선택 → SELECT문 작성 → #{userId} 파라미터 생성/추가 | 작성된 스크립트 정상 실행 | 대기 |  | △ | selector 미확정 또는 파일 I/O — 수동 검증 병행 필요 |  |  |
| Manager | DB Query 세부 | QATC-3014 | DB Query — Dynamic | Manager > Dataset Manager | Dataset Manager > 데이터셋 생성 > Dynamic | Dynamic list 항목 정상 노출 | 대기 |  | △ | selector 미확정 또는 파일 I/O — 수동 검증 병행 필요 |  |  |
| Manager | 필드 입력 | QATC-3051 | 데이터셋 명 | Manager > Dataset Manager | 임의 이름 입력 / 중복 확인 → 영문자 또는 영문자+숫자 형식 입력 | 형식 오류 메시지 또는 사용 가능한 이름 안내 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 | 완료 | tc-dataset.spec.js / TC-R35-DS-002, TC-R35-DS-006 |
| Manager | 필드 입력 | QATC-3054 | 설명 | Manager > Dataset Manager | 설명 입력 | 자유형식 입력 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 | 완료 | tc-dataset.spec.js / TC-R35-DS-006 |
| Manager | 필드 입력 | QATC-3056 | 주기 | Manager > Dataset Manager | 주기 텍스트박스 입력 | 제한 없이 입력 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 | 완료 | tc-dataset.spec.js / TC-R35-DS-006 |
| Manager | 필드 입력 | QATC-3058 | 주기 — 최초 한번 실행 | Manager > Dataset Manager | 최초 한번 실행 체크박스 클릭 | 텍스트박스 dim 처리, 최초 1회 실행 동작 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Manager | 관리 | QATC-3045 | 수정 | Manager > Dataset Manager | 임의 dataset의 modify 아이콘 클릭 → 내용 수정 → 데이터셋 수정 클릭 | 기존 내용이 편집영역에 로드되고 수정 후 저장 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Manager | 관리 | QATC-3047 | 복제 | Manager > Dataset Manager | 임의 dataset의 duplication 아이콘 클릭 | 동일 내용 복제, 이름 뒤에 _copy 추가 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Manager | 관리 | QATC-3049 | 삭제 | Manager > Dataset Manager | 임의 dataset의 delete 아이콘 클릭 | 데이터셋 삭제 및 목록 제거 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ Resource Manager |  |  |  |  |  |  |  |  |  |  |  |  |
| Manager | Image | QATC-3062 | Image — 이미지 선택 | - | Image 탭 > + 버튼 클릭 > 이미지 선택 | 이미지 추가 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Manager | Image | QATC-3065 | Image — 적용 | Bootstrap > Contents > Image 드래그드롭 배치 | Code Box > Instance Options > Import Resource URL에서 이미지 선택 후 HTML src에 경로 반영 | 적용 이미지 정상 노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Manager | Background | QATC-3067 | Background — 이미지 선택 | - | Background 탭 > + 버튼 클릭 > 이미지 선택 | 이미지 추가 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Manager | Background | QATC-3069 | Background — 적용 | - | Resource Manager background 이미지 추가/삭제 → Layer Background 적용 | 적용 색상/이미지 정상 노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Manager | Icons | QATC-3071 | Icons — 이미지 선택 | - | Icons 탭 > + 버튼 클릭 > 이미지 선택 | 이미지 추가 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Manager | Icons | QATC-3073 | Icons — 적용 | - | Template > FreeCode 추가 후 codebox 코드로 이미지 적용 | 아이콘 및 지정 동작 정상 동작 | 대기 | Button Images 계열(QATC-3076~)도 동일 구조 | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Manager | Lottie | QATC-3093 | Lottie — 파일 추가 | lottie-player src 예시 코드 참고 | Resource Manager > Lottie 탭 > 파일 추가 | Lottie 파일 추가 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Manager | Lottie | QATC-3096 | Lottie — 적용 | - | FreeCode > Instance Option에서 lottie 파일 선택 후 Import Resource URL 적용 | visual / Viewer 정상 적용 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Manager | HDR | QATC-3098 | HDR — 파일 추가 | THREE.RGBELoader, venice_sunset.hdr, envMap 적용 코드 참고 | ModelLoader 배치 → GLTF 선택 → Codebox > Default Code Snippet > HDR Load → Resource 적용 | HDR 파일 정상 업로드 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Manager | HDR | QATC-3100 | HDR — 적용 | - | HDR 파일 선택 후 Viewer 확인 | Viewer에 HDR 파일 정상 적용 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Manager | GLTF(DCIM) | QATC-3102 | GLTF — 파일 추가 | DCIM PACK 추가 | GLTF 탭 > + 버튼 클릭 > zip 파일 선택 | zip 파일 업로드 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Manager | GLTF(DCIM) | QATC-3104 | GLTF — 적용 | DCIM PACK 추가 | ModelLoader 드래그드롭 → Properties > Resource > Asset Resource GLTF 선택 | visual / Viewer에 GLTF 정상 적용 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ Template Manager |  |  |  |  |  |  |  |  |  |  |  |  |
| Manager | Template | QATC-3109 | 가져오기 | Manager > Template Manager 레이어 팝업 | Template Manager 팝업 > 가져오기 버튼 | 가져오기 완료 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Manager | Template | QATC-3112 | 내보내기 — 버튼 활성화 | Manager > Template Manager 레이어 팝업 | Template Manager 팝업 > 내보내기 버튼 | Custom 항목이 추가된 경우에만 버튼 활성화 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Manager | Template | QATC-3116 | 내보내기 — Export 영상 생성 | Manager > Template Manager 레이어 팝업 | Template Manager 팝업 > 내보내기 버튼 | Custom 목록에 입력한 항목 추가 시 생성 | 대기 |  | △ | selector 미확정 또는 파일 I/O — 수동 검증 병행 필요 |  |  |
| Manager | Template | QATC-3119 | 내보내기 — Add | Manager > Template Manager 레이어 팝업 | Template Manager 팝업 > 내보내기 버튼 | Custom 목록에 입력 항목 추가 확인 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ Language Manager (공통 Precondition: 테이블 내 데이터 존재) |  |  |  |  |  |  |  |  |  |  |  |  |
| Manager | Language | QATC-3125 | Add | 테이블 내 데이터 존재 | Main toolbar > Multilingual editor 클릭 → text area 입력 → Add | 입력 정보가 페이지 하단 테이블 컬럼에 매칭되어 정렬 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Manager | Language | QATC-3128 | File Import | 데이터 유무 무관 | 다국어 에디터 > File Import | 파일 선택 후 테이블 컬럼 매칭 정렬, 중복 시 덮어쓰기 컨펌 팝업 | 대기 |  | △ | selector 미확정 또는 파일 I/O — 수동 검증 병행 필요 |  |  |
| Manager | Language | QATC-3133 | File Export | 테이블 내 데이터 존재 | 다국어 에디터 > File Export | 내보내기 완료 얼럿 및 파일 다운로드 | 대기 |  | △ | selector 미확정 또는 파일 I/O — 수동 검증 병행 필요 |  |  |
| Manager | Language | QATC-3135 | Delete | 테이블 내 데이터 존재 | 다국어 에디터 > Delete | 선택한 내용 삭제 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Manager | Language | QATC-3137 | Delete All | 테이블 내 데이터 존재 | 다국어 에디터 > Delete All | 모든 내용 삭제 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Manager | Language | QATC-3139 | Edit | 테이블 내 데이터 존재 | 다국어 에디터 > Edit | text area 수정 가능 상태로 변경 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Manager | Language | QATC-3141 | Copy to clipboard | 테이블 내 데이터 존재 | 다국어 에디터 > Copy to clipboard | copied 얼럿 노출 및 테이블 내용 복사 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |

## Page

| 에픽/기능 | 서브 기능 | TC ID | 제목 | Precondition | Test Steps | Expected Result | 상태 | 비고 | Playwright 가능 | 비고 | E2E 구현 | 구현 근거 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ▼ New Page |  |  |  |  |  |  |  |  |  |  |  |  |
| Page | New Page | QATC-3215 | 신규 생성 팝업 | - | New > page 클릭 | 팝업창 표출: 신규 페이지(id, 이름) / 신규 그룹(이름) / 신규 마스터(Mobile Master 체크박스, id, 이름) | 대기 | 구버전(933): Page > New page 아이콘 → 3.3.0: New > page 경로 변경 | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Page | New Page | QATC-3217 | 신규 생성 — 신규 페이지 | - | New page > 신규 페이지 선택 → 이름 입력 → 생성 클릭 | 신규 페이지 생성됨 (아이디는 고유 값) | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 | 완료 | tc-page.spec.js / TC-R35-PAGE-001 |
| Page | New Page | QATC-3219 | 신규 생성 — 신규 그룹 | - | New > Group → 이름 입력 → 생성 클릭 | 신규 그룹 생성됨 | 대기 | 구버전(935): New page > 신규 그룹 선택 → 3.3.0: New > Group 경로 변경 | O | UI 조작 + page.evaluate()로 자동화 가능 | 완료 | tc-page.spec.js / TC-R35-PAGE-002 |
| Page | New Page | QATC-3222 | 신규 생성 — 신규 마스터 | - | New page > 신규 마스터 선택 → 이름 입력 → 생성 클릭 | 신규 마스터 페이지 생성됨 (아이디는 고유 값) | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 | 완료 | tc-page.spec.js / TC-R35-PAGE-003 |
| Page | New Page | QATC-3224 | 모바일 마스터 | - | New page > 신규 마스터 선택 > Mobile Master 선택 → 이름 입력 → 생성 클릭 | mobile master page 생성 확인, toolbar 모바일 마스터 버튼 활성, 모바일 화면 확인 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ Master Page 저장 옵션 |  |  |  |  |  |  |  |  |  |  |  |  |
| Page | Master Page | QATC-3199 | Master Page — 셀렉트박스 | 마스터/2D/3D 페이지 각각 생성 | 마스터 페이지에 Navbar 드래그드롭 → 2D 또는 3D 페이지 저장 → Properties > Refer Page | Refer Page에 셀렉트박스 노출 | 대기 | 3.3.0: Properties > Refer Page 경로 명시 추가 | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Page | Master Page | QATC-3202 | Master Page — Refer Page 미선택 | 마스터/2D/3D 페이지 각각 생성 | 위와 동일 → Refer Page 미선택 상태 확인 | select box 영역에 'Select a page' 노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Page | Master Page | QATC-3203 | Master Page — Refer Page 선택 | 마스터/2D/3D 페이지 각각 생성 | 위와 동일 → Refer Page에서 페이지 선택 | 선택한 페이지 고정 노출, 셀렉트박스 우측 Go to 버튼 노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Page | Master Page | QATC-3206 | 일반 Page — Master Page 지정된 경우 | - | 마스터/2D/3D 페이지 생성 → Navbar 드래그드롭 → 2D 또는 3D 페이지 저장 | 해당 마스터페이지명 노출, Go to Master page 버튼 노출 및 랜딩 확인 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Page | Master Page | QATC-3207 | 일반 Page — 포함저장 체크 해제 | ① 마스터/2D/3D 페이지 생성 및 참조 설정<br>② 마스터 페이지에 Navbar 배치<br>③ 일반 페이지 저장<br>④ '마스터 페이지 포함 저장' 체크 후 Navbar 위치 변경 후 저장<br>⑤ 다시 Navbar 위치 변경 후 체크 해제 후 저장 | Precondition 순서대로 진행 | Navbar가 이전과 동일하게 위치함 (체크 해제 → 마스터에 반영 안됨) | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Page | Master Page | QATC-3210 | 일반 Page — 포함저장 체크 | ① 마스터/2D/3D 페이지 생성 및 참조 설정<br>② 마스터 페이지에 Navbar 배치<br>③ 일반 페이지 저장<br>④ '마스터 페이지 포함 저장' 체크 후 Navbar 위치 변경 후 저장 | Precondition 순서대로 진행 후 마스터 페이지 오픈 | Navbar가 다른 위치로 이동되어 있음 (체크 → 마스터에 반영됨) | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Page | Master Page | QATC-3211 | 일반 Page — Master Page 미지정 | - | 마스터/2D/3D 페이지 생성 → Navbar 드래그드롭 → 저장 → Properties > Master Page | No Master Page 노출 | 대기 | 3.3.0: Properties > Master Page 경로 명시 추가 | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ Save |  |  |  |  |  |  |  |  |  |  |  |  |
| Page | Save | QATC-3226 | Save | - | 신규 페이지 생성 → 임의 컴포넌트 드래그&드롭 → 저장 클릭 | 변경된 컴포넌트들이 저장됨 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Page | Save | QATC-3227 | Save as | - | 신규 페이지 생성 → 임의 컴포넌트 드래그&드롭 → 다른 이름으로 저장 클릭 | 기존 페이지 이름_copy page 생성됨 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ Page 컨텍스트 메뉴 |  |  |  |  |  |  |  |  |  |  |  |  |
| Page | 컨텍스트 메뉴 | QATC-3229 | New — Group / Page / Master | - | 신규 페이지 우클릭 → New > Group / Page / Master 클릭 | Group / Page / Master 생성 팝업창 표출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Page | 컨텍스트 메뉴 | QATC-3230 | Rename | - | 신규 페이지 우클릭 → Rename 클릭 | 페이지 이름 수정 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Page | 컨텍스트 메뉴 | QATC-3231 | Delete | - | 신규 페이지 우클릭 → Delete → 삭제 클릭 | 페이지 삭제됨 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 | 완료 | tc-1381-page-delete-confirm.spec.js |
| Page | 컨텍스트 메뉴 | QATC-3232 | Update — Init page | - | 신규 페이지 우클릭 → Update > Init page 클릭 | 로그인 시 해당 페이지가 표출됨 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |

## Properties

| 에픽/기능 | 서브 기능 | TC ID | 제목 | Precondition | Test Steps | Expected Result | 상태 | 비고 | Playwright 가능 | 비고 | E2E 구현 | 구현 근거 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ▼ 개요 — Page Attribute 선택별 제공 항목 |  |  |  |  |  |  |  |  |  |  |  |  |
| Properties | 개요 | QATC-1161 | 공통 (컴포넌트/도큐먼트) | - | 컴포넌트 클릭 → 우측 Page attribute > Properties | 선택한 document/component에 따라 정보 제공 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | 개요 | QATC-1172 | twoLayer Page | - | twoLayer Page 클릭 → 우측 Page attribute | Document / Size / Radius / Spacing / Layout / Custom Style Popup / 3D Properties 항목 제공 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | 개요 | QATC-1173 | 2D Component | - | 2D Component 클릭 → 우측 Page attribute | Primary / Instance Name / Size / Position / Transform / Layout / FlexItem / Spacing / Border 항목 제공 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | 개요 | QATC-1174 | 3D Component | - | 3D Component 클릭 → 우측 Page attribute | Primary / Instance Name / Label / Resource 항목 제공 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ two/three Layer Page — Document |  |  |  |  |  |  |  |  |  |  |  |  |
| Properties | Document | QATC-1175 | Document — id | twoLayer Page 클릭 → 우측 Page attribute > Properties | Properties > Document | 해당 페이지 인스턴스 아이디 표기, id 중복 생성 불가 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Document | QATC-1176 | Document — name | twoLayer Page 클릭 → 우측 Page attribute > Properties | Properties > Document | 해당 페이지 이름 표기 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Document/Z-index | QATC-1178 | Z-index — 2D를 3D보다 높게 | twoLayer Page 클릭 → 우측 Page attribute > Properties | Properties > Document > Z-index 설정 → 개발자도구 확인 | 페이지 순서 변경되어 3D 컴포넌트 위에 노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Document/Z-index | QATC-1179 | Z-index — 동일 값 | twoLayer Page 클릭 → 우측 Page attribute > Properties | Properties > Document > Z-index 설정 → 개발자도구 확인 | 페이지 기본값으로 노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Document/Z-index | QATC-1180 | Z-index — 2D를 3D보다 낮게 | twoLayer Page 클릭 → 우측 Page attribute > Properties | Properties > Document > Z-index 설정 → 개발자도구 확인 | 페이지 순서 변경되어 3D 컴포넌트 아래에 노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ two/three Layer Page — Size / 3D Properties |  |  |  |  |  |  |  |  |  |  |  |  |
| Properties | Size | QATC-1183 | Size — Width | twoLayer Page 클릭 → 우측 Page attribute > Properties | Properties > Size | width 변경 가능, 단위: PX / % / EM / REM / VW / VH | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Size | QATC-1185 | Size — Height | twoLayer Page 클릭 → 우측 Page attribute > Properties | Properties > Size | height 변경 가능, 단위: PX / % / EM / REM / VW / VH | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | 3D Properties | QATC-1207 | 3D Properties — x | twoLayer Page 클릭 → 우측 Page attribute > Properties | Properties > 3D Properties | 3D 공간 가로축 위치 표시 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | 3D Properties | QATC-1208 | 3D Properties — y | twoLayer Page 클릭 → 우측 Page attribute > Properties | Properties > 3D Properties | 3D 공간 세로축 위치 표시 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | 3D Properties | QATC-1209 | 3D Properties — z | twoLayer Page 클릭 → 우측 Page attribute > Properties | Properties > 3D Properties | 3D 공간 깊이축 위치 표시 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | 3D Properties | QATC-1210 | 3D Properties — save | twoLayer Page 클릭 → 우측 Page attribute > Properties | Properties > 3D Properties | 설정값 저장, 화면 각도 고정, 얼럿 팝업 노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | 3D Properties | QATC-1211 | 3D Properties — reset | twoLayer Page 클릭 → 우측 Page attribute > Properties | Properties > 3D Properties | 설정값 리셋 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | 3D Properties | QATC-1212 | 3D Properties — Grid X | twoLayer Page 클릭 → 우측 Page attribute > Properties | Properties > 3D Properties | 3D 공간 가로축 그리드 간격 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | 3D Properties | QATC-1213 | 3D Properties — Grid Y | twoLayer Page 클릭 → 우측 Page attribute > Properties | Properties > 3D Properties | 3D 공간 깊이축 그리드 간격 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ 2D Component — Properties |  |  |  |  |  |  |  |  |  |  |  |  |
| Properties | Instance Name | QATC-1216 | Instance Name | 2D Component 클릭 → 우측 Page attribute > Properties | Properties > Instance Name | 인스턴스명 노출 및 수정 가능, 중복 시 경고 얼럿 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Size | QATC-1217 | Size — Width | 2D Component 클릭 → 우측 Page attribute > Properties | Properties > Size | 크기 변경 가능, 단위: PX / % / EM / REM / VW / VH | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Size | QATC-1218 | Size — Height | 2D Component 클릭 → 우측 Page attribute > Properties | Properties > Size | 크기 변경 가능, 단위: PX / % / EM / REM / VW / VH | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Size | QATC-1219 | Size — Min W | 2D Component 클릭 → 우측 Page attribute > Properties | Properties > Size | 최소 너비 변경 확인 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Size | QATC-1220 | Size — Max W | 2D Component 클릭 → 우측 Page attribute > Properties | Properties > Size | 최대 너비 변경 확인 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Size | QATC-1221 | Size — Min H | 2D Component 클릭 → 우측 Page attribute > Properties | Properties > Size | 최소 높이 변경 확인 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Size | QATC-1222 | Size — Max H | 2D Component 클릭 → 우측 Page attribute > Properties | Properties > Size | 최대 높이 변경 확인 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Border | QATC-1290 | Border — Type | 2D Component 클릭 → 우측 Page attribute > Properties | Properties > Border > Type | none / solid / insert / outset / ridge / groove / double / dotted / dashed / hidden / initial | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Border | QATC-1291 | Border — Width | 2D Component 클릭 → 우측 Page attribute > Properties | Properties > Border > Width | 너비 두께 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Border | QATC-1292 | Border — All | 2D Component 클릭 → 우측 Page attribute > Properties | Properties > Border > All | 모든 테두리 두께 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Border | QATC-1293 | Border — Top Left | 2D Component 클릭 → 우측 Page attribute > Properties | Properties > Border | 좌측 상단 테두리 두께 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Border | QATC-1294 | Border — Top Right | 2D Component 클릭 → 우측 Page attribute > Properties | Properties > Border | 우측 상단 테두리 두께 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Border | QATC-1295 | Border — Bottom Left | 2D Component 클릭 → 우측 Page attribute > Properties | Properties > Border | 좌측 하단 테두리 두께 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Border | QATC-1296 | Border — Bottom Right | 2D Component 클릭 → 우측 Page attribute > Properties | Properties > Border | 우측 하단 테두리 두께 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ 3D Component — Properties |  |  |  |  |  |  |  |  |  |  |  |  |
| Properties | Instance Name | QATC-1299 | Instance Name | 3D Component 클릭 → 우측 Page attribute > Properties | Properties > Instance Name | 인스턴스 이름 노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Label | QATC-1301 | Label — Use | 3D Component 클릭 → 우측 Page attribute > Properties | Properties > Label | default 상태 N | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Label | QATC-1302 | Label — Text | 3D Component 클릭 → 우측 Page attribute > Properties | Properties > Label | 해당 3D 컴포넌트 설명 텍스트 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Label | QATC-1303 | Label — x | 3D Component 클릭 → 우측 Page attribute > Properties | Properties > Label | Text 상하 위치 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Label | QATC-1304 | Label — y | 3D Component 클릭 → 우측 Page attribute > Properties | Properties > Label | Text 좌우 위치 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Label | QATC-1306 | Label — Font Type | 3D Component 클릭 → 우측 Page attribute > Properties | Properties > Label | Text 폰트 타입 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Label | QATC-1309 | Label — Font Size | 3D Component 클릭 → 우측 Page attribute > Properties | Properties > Label | Text 사이즈 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Label | QATC-1311 | Label — Font Color | 3D Component 클릭 → 우측 Page attribute > Properties | Properties > Label | Text 색상 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Label | QATC-1312 | Label — Border Size | 3D Component 클릭 → 우측 Page attribute > Properties | Properties > Label | Label 경계 크기 적용 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Label | QATC-1314 | Label — Border Type | 3D Component 클릭 → 우측 Page attribute > Properties | Properties > Label | Label 테두리 스타일 적용 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Label | QATC-1316 | Label — Border Color | 3D Component 클릭 → 우측 Page attribute > Properties | Properties > Label | Label 테두리 색상 적용 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Label | QATC-1317 | Label — bg Color | 3D Component 클릭 → 우측 Page attribute > Properties | Properties > Label | 배경색 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Label | QATC-1318 | Label — Alpha | 3D Component 클릭 → 우측 Page attribute > Properties | Properties > Label | 슬라이더에 따라 배경색 투명도 변경 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Label | QATC-1320 | Label — Line Connect | 3D Component 클릭 → 우측 Page attribute > Properties | Properties > Label | 텍스트와 컴포넌트를 연결선으로 이어줌 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ Background |  |  |  |  |  |  |  |  |  |  |  |  |
| Properties | Stage | QATC-1322 | Stage — Color | Page attribute > Background | Background > Stage | Stage 색상 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Stage | QATC-1323 | Stage — Image | Page attribute > Background | Background > Stage | Stage background image 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Stage | QATC-1324 | Stage — reset | Page attribute > Background | Background > Stage | Stage 설정 초기화 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Common | QATC-1325 | Common — Color | Page attribute > Background | Background > Common | Common 색상 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Common | QATC-1326 | Common — Image | Page attribute > Background | Background > Common | Common background image 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Common | QATC-1327 | Common — reset | Page attribute > Background | Background > Common | Common 설정 초기화 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Page | QATC-1328 | Page — use | Page attribute > Background | Background > Page > use | Page 색상 변경 사용 여부, 활성화 시 color/image 하위 항목 노출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Page | QATC-1329 | Page — Color | Page attribute > Background | Background > Page | Page 색상 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Page | QATC-1331 | Page — Image | Page attribute > Background | Background > Page | Page image 설정 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Page | QATC-1332 | Page — reset | Page attribute > Background | Background > Page | Page 설정 초기화 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ Assets (공통: 2D=NO DATA, 3D=이미지+필터+드래그&드롭 가능) |  |  |  |  |  |  |  |  |  |  |  |  |
| Properties | Assets | QATC-1336 | UPS | Page attribute > Assets | Assets 탭 > UPS 확인 | 값 미기재 — 별도 확인 필요 | 대기 | ⚠️ Expected Result 미기재 | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Assets | QATC-1337 | Access | Page attribute > Assets | Assets 탭 > Access 확인 | 2D: NO DATA / 3D: 이미지 노출 및 Assets 필터 활성화, 드래그&드롭 가능 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Assets | QATC-1338~1356 | Backup ~ WaterLeak | Page attribute > Assets | Assets 탭 > 각 타입 확인 | 2D: NO DATA / 3D: 이미지 노출 및 Assets 필터 활성화, 드래그&드롭 가능 | 대기 | Backup/CCTV/EarthQuake/Fire/Gasleak/Rack/Server/Storage/TempHumiSensor/Themohygrostat/WaterLeak — 동일 패턴 | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ Assets Outline |  |  |  |  |  |  |  |  |  |  |  |  |
| Properties | SelectBox | QATC-1358~1366 | SelectBox — UPS/Access/Backup/CCTV/EarthQuake/Fire/Gasleak/MDM | Page attribute > Assets Outline | SelectBox에서 각 타입 선택 | 해당 타입 선택 시 Assets 목록 필터링 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| Properties | Set up fields | QATC-1389~1400 | Set up asset fields — PDU/Rack/Server/Storage/TempHumiSensor/Themohygrostat/WaterLeak | Page attribute > Assets Outline | 각 타입별 표시 필드 설정 | 타입별 표시 필드 설정 적용 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |

## 공통·로그인

| 에픽/기능 | 서브 기능 | TC ID | 제목 | Precondition | Test Steps | Expected Result | 상태 | 비고 | Playwright 가능 | 비고 | E2E 구현 | 구현 근거 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ▼ 공통 |  |  |  |  |  |  |  |  |  |  |  |  |
| 공통 | - | QATC-2933 | War 업데이트 | 1. tb_dataset > rest_api 컬럼 변경<br>2. 쿼리 실행 | - | war 변경 후 버전 업데이트 확인 | 대기 |  | X | 서버/배포 설정 필요 — Precondition으로 분리 |  |  |
| 공통 | SSO Lock | QATC-2934 | SSO sign_id Lock — N→Y | lock 컬럼 N→Y 설정 | Postman: pre-persist(sign_id) → /api/sso/login<br>(renobit/admin 각각)<br><br>【셋업】<br>① context-security.xml에서 /api/sso/* permitAll 주석 해제<br>② tb_user 테이블 lock 컬럼 N→Y<br>   UPDATE tb_user SET lock='Y' WHERE sign_id='테스트계정';<br>③ Tomcat 재시작 | 로그인 차단 — 에러 응답 반환 | 대기 | 구버전(833): userid 기준 → 3.3.0: sign_id 기준 | X | 서버/배포 설정 필요 — Precondition으로 분리 |  |  |
| 공통 | SSO Lock | QATC-2935 | SSO sign_id Lock — Y→N | lock 컬럼 Y→N 설정 | Postman: pre-persist(sign_id) → /api/sso/login<br>(renobit/admin 각각)<br><br>【셋업】<br>① context-security.xml에서 /api/sso/* permitAll 주석 해제<br>② tb_user 테이블 lock 컬럼 Y→N<br>   UPDATE tb_user SET lock='N' WHERE sign_id='테스트계정';<br>③ Tomcat 재시작 | 로그인 허용 확인 | 대기 | 구버전(835): userid 기준 → 3.3.0: sign_id 기준 | X | 서버/배포 설정 필요 — Precondition으로 분리 |  |  |
| 공통 | SSO 토큰 Lock | QATC-3233 | SSO 토큰 Lock — N→Y | lock 컬럼 N→Y 설정 | Postman: pre-persist(token) → /api/sso/login<br>(renobit/admin 각각)<br><br>【셋업】<br>① context-security.xml permitAll 주석 해제<br>② globals.properties에 Globals.SignKeyPath=/opt/tomcat9/webapps/secret_key 추가<br>③ secret_key.zip을 해당 경로에 압축 해제<br>④ tb_user lock 컬럼 N→Y | 토큰 로그인 차단 확인 | 대기 | 🆕 3.3.0 신규 | X | 서버/배포 설정 필요 — Precondition으로 분리 |  |  |
| 공통 | SSO 토큰 Lock | QATC-3234 | SSO 토큰 Lock — Y→N | lock 컬럼 Y→N 설정 | Postman: pre-persist(token) → /api/sso/login<br>(renobit/admin 각각)<br><br>【셋업】<br>① context-security.xml permitAll 주석 해제<br>② globals.properties Globals.SignKeyPath 설정<br>③ secret_key.zip 압축 해제<br>④ tb_user lock 컬럼 Y→N | 토큰 로그인 허용 확인 | 대기 | 🆕 3.3.0 신규 | X | 서버/배포 설정 필요 — Precondition으로 분리 |  |  |
| 공통 | 메뉴 영역 | QATC-2936 | 메뉴 영역 — 패널 확인 | - | 패널 확인 | 9개 패널 표출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| 공통 | 메뉴 영역 | QATC-2947 | 메뉴 영역 — 패널 클릭 | - | 각 패널 클릭 | 1. Page: Project 하위항목<br>2. Components: 2D/3D Pack 목록<br>3. Instance List: 현재 페이지 컴포넌트<br>4. Group List<br>5. Manager: Dataset/Resource/Menuset/Template<br>6. Code Box: HTML/CSS/JS<br>7. Plugin: DCIM Pack 업로드 시<br>8. GUI Options: 3D 레이어 선택 시<br>9. Help: Information/Code compiler/FPS/Manual | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| 공통 | Main Toolbar | QATC-2938 | 통합 관리자 링크 | - | Main toolbar admin 클릭 | 통합관리자가 새창으로 실행됨 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 | 완료 | tc-common.spec.js / TC-R35-COM-003 |
| 공통 | Main Toolbar | QATC-2939 | 뷰어 링크 | - | Main toolbar Viewer 클릭 | Renobit 뷰어로 이동됨 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 | 완료 | tc-common.spec.js / TC-R35-COM-002 |
| 공통 | Main Toolbar | QATC-898 | 로그아웃 | - | Main toolbar Logout 클릭 | 현재 로그인된 계정이 로그아웃됨 | 대기 | ⚠️ 3.3.0 대응 키 없음 — 유지 여부 확인 필요 | O | UI 조작 + page.evaluate()로 자동화 가능 | 완료 | tc-common.spec.js / TC-R35-COM-004 |
| 공통 | 언어 설정 | QATC-2940 | 페이지 수정 중 언어 설정 | 1. 페이지 수정 상태<br>2. 한국어 설정 상태 | 한국어 클릭 → 영어/중국어 선택 → OK | 언어 변경 확인 팝업 노출, 적용 시 셀렉트박스/페이지 언어 변경 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| 공통 | 언어 설정 | QATC-2948 | 언어 설정 | 한국어 설정 상태 | 한국어 클릭 → 영어/중국어(간체/번체) 선택 → OK | 페이지 언어가 영어/중국어(간체)/중국어(번체)로 표출됨 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| 공통 | Zoom | QATC-2941 | Zoom 활성화 | 2D Layer | Main toolbar ZOOM 활성화 → shift+스크롤 | zoom In/Out 가능 | 대기 | 구버전(902): shift+스크롤 조건 없음 | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| 공통 | Zoom | QATC-2946 | Zoom 비활성화 | 2D Layer | Main toolbar ZOOM 비활성화 | 원본 크기와 위치로 페이지 초기화 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| 공통 | 메뉴 토글바 | QATC-2942 | 메뉴 토글바 | - | ◀, ▲, ▶ 클릭 | 좌측/상단/우측 메뉴바 접힘/펼침 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| 공통 | 레이어 툴바 | QATC-2943 | 레이어 툴바 — Layer | Layer | 2D / 3D 선택 | GUI 옵션 패널/컴포넌트 구성도 변경 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| 공통 | 레이어 툴바 | QATC-2944 | 레이어 툴바 — View(2D) | View | 2D 선택 | 2D 화면 표출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| 공통 | 레이어 툴바 | QATC-2945 | 레이어 툴바 — View(3D) | View | 3D 선택 | 3D 화면 표출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| ▼ 로그인 |  |  |  |  |  |  |  |  |  |  |  |  |
| 로그인 | 페이지 | QATC-2950 | 페이지 구성 | - | 레노빗 로그인 페이지 확인 | 이미지, ID/PW 입력 필드, 로그인 버튼 정상 표출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 | 완료 | renobit-login.spec.js, tc-common.spec.js / TC-R35-COM-001 |
| 로그인 | 뷰어 로그인 | QATC-2951 | 뷰어 로그인 — 불가 계정 | 로그인 불가능 계정 | 사용 불가능한 ID/PW 입력 | 로그인 불가 에러팝업 표출 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| 로그인 | 뷰어 로그인 | QATC-2952 | 뷰어 로그인 — 가능 계정 | 로그인 가능 계정 | 사용 가능한 ID/PW 입력, Editor 미선택 | Viewer 화면으로 이동 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
| 로그인 | 에디터 로그인 | QATC-2953 | 에디터 로그인 — Edit 권한 있음 | Edit 권한 있는 사용자 | 사용 가능한 ID/PW 입력, Editor 선택 | Editor 페이지로 이동 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 | 완료 | tc-common.spec.js / TC-R35-COM-001 |
| 로그인 | 에디터 로그인 | QATC-2954 | 에디터 로그인 — Edit 권한 없음 | Edit 권한 없는 사용자 | 사용 가능한 ID/PW 입력, Editor 선택 | Editor 페이지에 접근되지 않음 | 대기 |  | O | UI 조작 + page.evaluate()로 자동화 가능 |  |  |
