FROM gradle:9.4.1-jdk25 AS build
WORKDIR /app

COPY gradle gradle
COPY gradlew settings.gradle* build.gradle* gradle.properties ./
COPY . .

RUN chmod +x gradlew && ./gradlew bootJar --no-daemon

FROM eclipse-temurin:25-jre
WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]

LABEL org.opencontainers.image.source="https://github.com/DefinitelyNotSimon13/trichter-monorepo"
LABEL org.opencontainers.image.license="MIT"
