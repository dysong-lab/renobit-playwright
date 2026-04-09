# RENOBIT TC 설계 원칙

작성일: 2026-04-08

## 목적

RENOBIT 3.5.0의 테스트 케이스는 코드 구현보다 TC 설계가 먼저다.

이 문서는 TC를 어떤 기준으로 나누고, 어떤 항목을 자동화하고, 어떤 항목을 환경 전제로 분리할지 정리하기 위한 기준 문서다.

## 1. 기본 원칙

### 1) TC는 사용자 행위 기준으로 작성한다

TC는 내부 구현이 아니라 사용자가 실제로 수행하는 동작 기준으로 쓴다.

좋은 예:
- 페이지 생성
- 페이지 내보내기
- 리소스 업로드
- REST API 데이터셋 수정
- SSO 로그인
- CodeBox 열기

나쁜 예:
- `pageTreeDataManager.treeData` 확인
- `mainPageComponent.getComInstanceByName()` 확인
- mediator 메서드 직접 호출

### 2) 하나의 TC는 하나의 목적만 검증한다

한 TC 안에 생성, 저장, 복원, 내부 상태 확인을 모두 넣지 않는다.

권장 구조:
- 1 TC = 1 사용자 목표
- 1 TC = 1 주요 기대결과
- 보조 검증은 필요 최소한만 넣는다

### 3) 기대결과는 사용자가 체감하는 결과로 쓴다

좋은 기대결과:
- 새 페이지가 목록에 보여야 한다.
- 팝업이 닫혀야 한다.
- 상세 에러 메시지가 노출되지 않아야 한다.
- 저장 후 새로고침해도 값이 유지되어야 한다.

나쁜 기대결과:
- 내부 객체 참조가 null이 아니어야 한다.
- 특정 private field 값이 변해야 한다.

## 2. TC를 나누는 기준

### 2-1. Happy Path

사용자가 정상 경로로 수행하는 기본 기능이다.

예:
- 로그인
- 페이지 생성
- export/import
- 리소스 업로드
- Dataset REST API 수정
- 3D 다중 선택

이 범위는 Playwright 자동화의 1차 대상이다.

### 2-2. Edge Case

정상 경로는 아니지만 자주 깨지거나 회귀 위험이 큰 케이스다.

예:
- 빈 상태
- 권한 없음
- readOnly
- 동일 이름 인스턴스
- stale ref
- 잘못된 입력

### 2-3. Environment Case

브라우저 조작보다 배포/설정이 먼저 필요한 케이스다.

예:
- `context-security.xml` 수정
- `globals.properties` 수정
- WAR 반영
- Tomcat 재기동
- SSO permitAll 설정 변경

이 항목은 Playwright spec 안에 직접 넣지 말고, 별도 precondition 문서나 수동 점검 절차로 분리한다.

## 3. RENOBIT용 TC 분류

### 브라우저 TC

브라우저 화면에서 바로 확인 가능한 항목이다.

- 공통 진입
- Page
- Resource
- Dataset
- 3D
- CodeBox 열기
- admin / viewer / logout

### 환경 TC

사전 설정과 배포 조건이 필요한 항목이다.

- SSO 인증 경로 허용
- API timeout / connection 설정
- feature flag on/off
- MyBatis XML 동적 갱신
- 상세 에러 메시지 노출 차단

### 기술 검증 TC

브라우저 결과 외에 런타임 상태나 네트워크 로그를 확인해야 하는 항목이다.

- 3D position / rotation / size 유지
- stale ref 재생성
- network response
- memory leak
- connection close

## 4. TC 작성 템플릿

권장 템플릿은 아래와 같다.

```md
TC ID:
제목:
목적:
Precondition:
Steps:
Expected Result:
비고:
자동화 여부:
```

### 작성 규칙

- 제목은 `행동 + 대상 + 결과` 순서로 쓴다.
- Precondition은 코드가 아니라 상태를 쓴다.
- Expected Result는 사용자가 확인 가능한 결과를 쓴다.
- 자동화 여부는 `Yes / No / Pending` 중 하나로 고정한다.

## 5. RENOBIT에 맞는 우선순위

### 1순위

기본 사용자 흐름을 먼저 잡는다.

- 로그인
- 공통 진입
- Page
- Resource
- Dataset 기본 기능
- 3D 기본 기능

### 2순위

기본 흐름의 유지 조건을 검증한다.

- 저장/복원
- 새로고침 후 유지
- readOnly
- 권한/잠금
- 다중 선택

### 3순위

환경 의존성이 큰 항목을 분리한다.

- SSO
- WAR / 배포
- timeout
- feature flag
- MyBatis 동적 갱신

### 4순위

진단 성격의 항목은 별도 분리한다.

- 메모리
- 네트워크
- 성능
- DevTools 확인

## 6. Playwright 자동화 원칙

### 1) 브라우저에서 보이는 것만 자동화의 기본 대상으로 삼는다

브라우저에서 바로 관찰 가능한 기능은 자동화 우선순위가 높다.

### 2) 내부 상태는 helper로 감싼다

`window.wemb` 내부 객체를 직접 spec에 쓰지 말고 helper 함수로 묶는다.

### 3) 배포 전제는 spec에 넣지 않는다

서버 설정 파일 수정, 재기동, 배포 반영은 Playwright spec의 역할이 아니다.

### 4) 불안정한 케이스는 먼저 문서화한다

자동화가 어렵거나 UI가 자주 바뀌는 항목은 먼저 문서 기준으로 고정하고, 이후 helper를 안정화한다.

## 7. 실무 적용 순서

1. `RENOBIT_3.5.0_JIRA_QA_TESTCASE.md`를 기준서로 삼고, 필요할 때만 Jira 원문을 역추적한다.
2. 기준서의 TC를 기능군별 카탈로그로 정리한다.
3. 각 TC를 Happy Path / Negative / Edge / Environment로 분류한다.
4. 브라우저 TC부터 자동화한다.
5. 기술 검증 TC는 helper와 상태 조회를 안정화한 뒤 넣는다.
6. 환경 TC는 별도 setup 문서로 관리한다.

## 8. 결론

RENOBIT에서는 코드보다 TC 설계가 먼저다.

TC는 내부 구현이 아니라 사용자 행위와 기대결과를 기준으로 작성해야 한다.
Playwright는 브라우저 검증 도구로 쓰고, 배포/환경 변경은 별도 전제로 분리해야 한다.
