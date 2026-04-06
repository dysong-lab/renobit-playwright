# Playwright 테스트 모드 비교

이 문서는 RENOBIT 검증에서 Playwright를 적용하는 두 가지 모드—로컬 소스 기반과 배포 아티팩트 기반—의 차이와 각각의 준비, 제한, 적용 대상을 정리합니다.

## 1. 로컬 소스 검증 (`source/front`)

- **목표**: 개발 중인 프론트 소스를 직접 열어 helper 수준의 동작(페이지 생성, 3D 객체 생성/선택, transform validation)을 빠르게 검증한다.
- **환경**
  - `node 16` 기반 로컬 모노레포(`source/front`)를 빌드하거나 dev server로 띄운 상태
  - Playwright는 `dev/e2e`에서 `baseURL=http://127.0.0.1:6284`
  - `Editor` 로그인 → helper로 page/box 생성 → 3D 검증 시나리오
- **용도**
  - helper 개발/디버깅
  - TC-1369처럼 실시간 runtime command 호출이 필요한 테스트
  - 페이지 초기 상태를 직접 조작해서 다수 스텝을 연달아 검증
- **제약**
  - 실제 배포 bundle과는 경로/빌드 설정이 다를 수 있음
  - 로컬 service가 항상 준비되어 있어야 함 (Tomcat or npm dev server)

## 2. 배포 파일 검증 (`renobit/versions/<ver>` WAR)

- **목표**: 실제 배포할 WAR/버전 폴더를 Tomcat에 배포한 상태에서 “배포산출물이 운영과 동일하게 동작하는지”를 검증한다.
- **환경**
  - `renobit/versions/3.5.0` 같은 정적 배포 폴더를 Tomcat에 올린 뒤 `http://127.0.0.1:6284/renobit`
  - Playwright `baseURL`은 배포 서버 (환경변수 `PLAYWRIGHT_BASE_URL`로 조절 가능)
  - 테스트는 주로 UI 흐름(로그인, Editor 진입, page dropdown, viewer rendering)과 스크린샷 비교, trace 캡처에 집중
- **용도**
  - 릴리즈 전 smoke/e2e (전체 flow, 라이선스 상태, 번들 JS 로딩)
  - WAR 수정 없이 최종 아티팩트가 문제 없는지 확인
  - CI에서 배포된 버전을 대상으로 회귀 확인
- **제약**
  - runtime command(예: `window.wemb.$createPageModal`)를 조작하지 않고, 기존 상태 그대로 확인
  - helper는 read-only (현재 페이지 열림 검사, 버튼 노출 여부 등)
  - 데이터 초기화가 어려움→ 배포 전 DB 상태를 확보해야 함

## 3. 공통 가이드

- `tests/helpers`는 **로컬/배포 공유할 수 있는 헬퍼**로 구성하되, 배포 모드에선 `ensureActivePage`처럼 많이 조작하지 않도록 guard 값을 둔다 (`isDeploymentMode` flag 등).
- `RENOBIT_PLAYWRIGHT_GUIDE.md`의 Quick Start(절차·스크립트)를 따라 환경을 세팅한 뒤, 위 두 모드 중 어떤 것을 실행할지 결정한다.
- 각 TC는 어떤 모드를 기준으로 작성했는지를 명시(label: `mode: local` vs `mode: deployment`).

이 문서를 기반으로 로컬과 배포 환경을 분리해 두면, helper/TC 설계가 보다 명확해지고 실행 시 혼동을 줄일 수 있습니다.
