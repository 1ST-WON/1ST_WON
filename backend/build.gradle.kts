import org.springframework.boot.gradle.plugin.SpringBootPlugin
import com.diffplug.gradle.spotless.SpotlessExtension

plugins {
    base
    alias(libs.plugins.spring.boot) apply false
    alias(libs.plugins.spotless) apply false
}

val javaVersion = libs.versions.java.get()

allprojects {
    group = "com.woncoin"

    repositories {
        mavenCentral()
    }
}

subprojects {
    apply(plugin = "java")
    apply(plugin = "org.springframework.boot")
    apply(plugin = "com.diffplug.spotless")

    extensions.configure<JavaPluginExtension> {
        toolchain {
            languageVersion = JavaLanguageVersion.of(javaVersion)
            vendor = JvmVendorSpec.ADOPTIUM
        }
    }

    extensions.configure<SpotlessExtension> {
        java {
            googleJavaFormat()
        }
    }

    dependencies {
        add("implementation", platform(SpringBootPlugin.BOM_COORDINATES))

        add("implementation", "org.springframework.boot:spring-boot-starter-webmvc")
        add("implementation", "org.springframework.boot:spring-boot-starter-validation")
        add("implementation", "org.springframework.boot:spring-boot-starter-data-jpa")

        add("runtimeOnly", "org.postgresql:postgresql")

        add("compileOnly", "org.projectlombok:lombok")
        add("annotationProcessor", platform(SpringBootPlugin.BOM_COORDINATES))
        add("annotationProcessor", "org.projectlombok:lombok")

        add("testImplementation", "org.springframework.boot:spring-boot-starter-test")
        add("testRuntimeOnly", "org.junit.platform:junit-platform-launcher")
    }

    tasks.withType<Test>().configureEach {
        useJUnitPlatform()
    }

    tasks.named<Jar>("jar") {
        enabled = false
    }
}

tasks.wrapper {
    gradleVersion = libs.versions.gradle.get()
}

tasks.named("build") {
    dependsOn(":issuer:build", ":broker:build", ":mts:build")
}

tasks.named("clean") {
    dependsOn(":issuer:clean", ":broker:clean", ":mts:clean")
}
