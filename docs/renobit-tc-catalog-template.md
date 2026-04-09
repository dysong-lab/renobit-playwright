# RENOBIT TC 카탈로그 템플릿

작성일: 2026-04-08

## 목적

`RENOBIT_3.5.0_JIRA_QA_TESTCASE.md`를 기준으로 TC를 기능군별로 재분류하고, 자동화 우선순위를 정하기 위한 작업용 템플릿이다.

이 문서는 Jira 원문을 다시 읽는 용도가 아니라, 이미 정리된 기준서를 실행 설계서로 바꾸기 위한 중간 산출물이다.

## 1. 카탈로그 원칙

- 기준서는 `RENOBIT_3.5.0_JIRA_QA_TESTCASE.md`로 둔다.
- Jira 원문은 누락 확인이 필요할 때만 참조한다.
- TC는 사용자 행위 중심으로 정리한다.
- 내부 구현이나 private state는 카탈로그 본문에 쓰지 않는다.
- 자동화 가능 여부는 별도 컬럼으로 분리한다.

## 2. 분류 기준

### Happy Path

정상 경로에서 사용자가 수행하는 기본 흐름이다.

예:
- 로그인
- 페이지 생성
- 리소스 업로드
- Dataset REST API 수정
- 3D 다중 선택

### Negative

잘못된 입력이나 실패 조건을 확인하는 케이스다.

예:
- 비밀번호 오류
- 권한 없음
- 잘못된 파일 형식
- 중복 이름

### Edge

정상 흐름과 가깝지만 회귀 위험이 큰 경계 조건이다.

예:
- 빈 상태
- readOnly
- stale ref
- 동일 이름 인스턴스
- 새로고침 후 유지

### Environment

배포/서버 설정이 선행되어야 하는 케이스다.

예:
- `context-security.xml`
- `globals.properties`
- WAR 반영
- SSO permitAll
- timeout / feature flag

## 3. 카탈로그 컬럼

권장 컬럼은 아래와 같다.

| TC ID | Epic | Feature | Title | Type | Priority | Automation | Spec File | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

### 컬럼 설명

- `TC ID`: Jira 또는 문서 기준 TC 식별자
- `Epic`: 상위 기능군
- `Feature`: 세부 기능
- `Title`: 사용자 관점 제목
- `Type`: Happy Path / Negative / Edge / Environment
- `Priority`: 자동화 우선순위
- `Automation`: Yes / No / Pending
- `Spec File`: 대응되는 Playwright spec
- `Notes`: skip 사유, 환경 전제, 리스크

## 4. 예시

| TC ID | Epic | Feature | Title | Type | Priority | Automation | Spec File | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| QATC-3997 | Page | New Page | 페이지 생성 | Happy Path | P1 | Yes | `tc-page.spec.js` | 기본 흐름 |
| QATC-4254 | Common | Security | 상세 에러메시지 차단 | Environment | P2 | No | - | 서버 설정 필요 |
| QATC-4274 | Code Box | ReadOnly | 코드박스 잠금 기능 | Edge | P2 | Yes | `tc-codebox.spec.js` | 기본 readOnly 확인 |

## 5. 작성 순서

1. `RENOBIT_3.5.0_JIRA_QA_TESTCASE.md`를 연다.
2. 기능군별로 TC를 묶는다.
3. 각 TC를 Happy Path / Negative / Edge / Environment로 분류한다.
4. 자동화 우선순위를 정한다.
5. Playwright spec과 1:1 매핑한다.
6. 환경 TC는 별도 문서 또는 setup 절차로 분리한다.

## 6. 운영 규칙

- 카탈로그는 한 번에 완벽하게 만들지 말고, 기능군 단위로 업데이트한다.
- 자동화 대상이 바뀌면 `Automation`과 `Spec File`만 우선 갱신한다.
- 환경 전제가 추가되면 `Notes`에 바로 적는다.
- 실패 원인이 코드인지 환경인지 구분이 안 되면 먼저 `Type`부터 재분류한다.

## 7. 결론

카탈로그는 문서와 코드 사이의 중간 계층이다.

기준서에서 TC를 바로 spec으로 옮기지 말고, 먼저 카탈로그에서 분류와 우선순위를 정리해야 한다.
