# backend/AGENTS.md (Spring Boot)

루트 AGENTS.md를 먼저 따른다. 아래는 백엔드에만 해당한다.

## 구조
- 기능별 패키지: com.woncoin.{기능}/controller, service, repository, domain(Entity), dto
- Web3j 호출·서명·키는 com.woncoin.blockchain 에서만. 다른 패키지에서 Web3j를 import하지 않는다.
- 공통(전역 예외, 설정, 금액 유틸)은 com.woncoin.common
- 호출은 controller → service → repository 한 방향. controller는 Entity를 반환하지 않고 DTO로 바꾼다.
- DTO는 Java record.

## Lombok
- 허용: @Getter, @RequiredArgsConstructor, @Slf4j, @NoArgsConstructor(access = PROTECTED),
  @Builder(생성자·정적 메서드에만)
- 금지: @Data, @Setter, @AllArgsConstructor, Entity의 @ToString·@EqualsAndHashCode
- 값 변경은 setter 대신 이름 있는 메서드(deposit 등)에서 규칙을 검사하며 한다.

## 예외·검증·트랜잭션
- Service는 BusinessException(에러코드)만 던진다. 응답은 @RestControllerAdvice 한 곳.
- 에러 코드는 기능별 enum(TokenErrorCode), 형식은 "도메인-번호"(TOKEN-001).
- controller에 try-catch 금지. catch 후 무시 금지.
- 형식 검사는 요청 DTO(@Valid), DB가 필요한 규칙은 Service.
- @Transactional은 Service에만. 조회는 readOnly = true.

## ⭐ 블록체인 거래 (되돌릴 수 없다)
- 순서: ① DB에 PENDING 저장·커밋 → ② 트랜잭션 밖에서 전송, txHash 받으면 SUBMITTED
  → ③ receipt 확인 후 COMPLETED / FAILED
- @Transactional 안에서 블록체인에 전송하지 않는다.
- nonce: 주소마다 한 줄(순서대로) 전송.
- 재시작 시 SUBMITTED는 결과만 다시 확인한다. 다시 보내지 않는다.
- 확정 블록 수, polling 주기는 설정값. 코드에 숫자를 쓰지 않는다.

## ⭐ 중복 요청 (멱등성)
- 돈·상태가 바뀌는 POST는 Idempotency-Key 헤더 필수(없으면 400).
- 키는 DB UNIQUE. 같은 키·같은 내용이면 처음 결과 반환, 다른 내용이면 409.

## 이벤트 수신
- polling. 마지막 처리 블록 번호를 DB에 저장하고 이어서 읽는다.
- (txHash, logIndex) UNIQUE. 백그라운드 작업은 ShedLock으로 한 곳에서만.

## 세 장부
- 연계장부(권리자 이름·주소, 수량 변경 사유)는 UPDATE로 덮어쓰지 않고 새 행을 추가한다.
- 수량 변경 사유 행에는 txHash를 함께 저장한다.
- 배분금 계산에는 기준 블록 번호를 기록한다.
- 회원 식별은 "신분증 종류 + 번호(암호화)". 주민번호 전용 칼럼을 만들지 않는다.
- 국적·한도 같은 투자 규칙은 서명 전에 Service에서 검사한다.

## API
- URL /api/v1/{복수형-kebab}. JSON camelCase. 금액·수량은 문자열.
- 실패 응답은 RFC 9457 Problem Details + code. 목록은 { items, page, size, totalCount }.
- 시간은 Instant, JSON은 ISO 8601 UTC. 주소·해시는 소문자로 저장·비교.
- _links(HATEOAS)는 상태가 바뀌는 리소스의 단건 응답에만.
- 컨트롤러·DTO를 바꾸면 openapi.json을 다시 생성해 같은 PR에 넣는다.

## DB 마이그레이션 (Flyway)
- 새 파일은 pnpm db:new 로만 만든다. 적용된 파일은 절대 수정하지 않는다.
- 한 번의 배포에는 옛 버전 앱과 호환되는 변경만. 삭제·이름 변경·NOT NULL 추가는 늘리기 → 옮기기 → 줄이기.

## 테스트
- Service 단위: BDDMockito(given/then) + AssertJ. 메서드 이름은 한국어(발행_한도를_넘으면_예외가_난다).
- Repository·마이그레이션·중복 요청·동시 요청·롤백: Testcontainers(PostgreSQL, Besu).
- assert 없는 테스트 금지. 버그 수정은 재현 테스트부터.

## 의존성
- 버전은 gradle/libs.versions.toml 에만. build.gradle.kts에 버전 숫자를 쓰지 않는다. Jitpack 금지.
