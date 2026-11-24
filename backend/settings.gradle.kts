// settings 파일의 plugins 블록에서는 Version Catalog를 쓸 수 없어 버전을 여기 직접 적는다 (ADR-50 예외).
plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "1.0.0"
}

rootProject.name = "won-coin-backend"
