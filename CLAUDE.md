@AGENTS.md

루트 AGENTS.md와 backend/AGENTS.md를 먼저 읽어.
backend/ 폴더에 Spring Boot 뼈대만 만들어 줘.
- Spring Boot 4.1, Java 21, Gradle Kotlin DSL, Gradle wrapper 포함
- 패키지 com.woncoin, 메인 클래스 하나만
- 의존성: web, validation, data-jpa, PostgreSQL 드라이버, Flyway, Lombok, test
- 버전 숫자는 gradle/libs.versions.toml에만 쓴다. build.gradle.kts에 버전 숫자를 쓰지 마.
- backend/에 이미 있는 AGENTS.md, CLAUDE.md는 절대 덮어쓰지 마
- DB 접속 정보는 환경 변수로 받는다. 실제 비밀번호를 파일에 쓰지 마. 루트 .env.example의 DB_PASSWORD를 쓴다.
- infra/docker-compose.yml을 만들고 PostgreSQL 18 서비스 하나만 넣어. 비밀번호는 .env에서 읽는다.
- src/main/resources/db/migration/ 폴더와 마이그레이션 파일은 만들지 마.
- 기능 코드, 예시 컨트롤러는 만들지 마.
- 끝나면 docker compose로 DB를 띄우고 앱이 켜지는지 확인하고,
  실행한 명령과 만든 파일 목록을 보여 줘. 커밋은 하지 마.
