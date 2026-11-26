plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "1.0.0"
}

rootProject.name = "won-coin-backend"

include("issuer")
include("broker")
include("mts")
