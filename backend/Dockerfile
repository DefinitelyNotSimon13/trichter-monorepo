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

ARG REPO_URL
ARG VCS_REF
ARG BUILD_DATE

LABEL org.opencontainers.image.source="${REPO_URL}" \
      org.opencontainers.image.url="${REPO_URL}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.created="${BUILD_DATE}"
