import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
	id("org.springframework.boot") version "2.3.5.RELEASE"
	id("io.spring.dependency-management") version "1.0.10.RELEASE"
	id("org.jetbrains.kotlin.plugin.jpa") version "1.5.0-M1"
	kotlin("jvm") version "1.4.21"
	kotlin("plugin.spring") version "1.3.72"
	kotlin("plugin.serialization") version "1.4.21"
}

group = "com.lozanov"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_11

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-parent:2.4.4")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa:2.4.0")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("io.jsonwebtoken:jjwt:0.9.1")
	implementation("javax.persistence:javax.persistence-api:2.2")
	implementation("javax.xml.bind:jaxb-api:2.4.0-b180830.0359")
	implementation("com.h2database:h2")
	implementation("commons-fileupload:commons-fileupload:1.4")
	implementation("junit:junit:4.12")
	runtimeOnly("mysql:mysql-connector-java")
	implementation("javax.validation:validation-api:2.0.1.Final")
	implementation("io.projectreactor.kotlin:reactor-kotlin-extensions")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
	implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor")
	implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.0.1")
	// test scope but w/e
	implementation("org.springframework:spring-test")
	implementation("org.seleniumhq.selenium:selenium-java:3.4.0")
	implementation("org.mockito:mockito-core:2.21.0")
	testImplementation("org.springframework.boot:spring-boot-starter-test") {
		exclude(group = "org.junit.vintage", module = "junit-vintage-engine")
	}
	testImplementation("io.projectreactor:reactor-test")
}

tasks.withType<Test> {
	useJUnitPlatform()
}

tasks.withType<KotlinCompile> {
	kotlinOptions {
		freeCompilerArgs = listOf("-Xjsr305=strict")
		jvmTarget = "11"
	}
}
