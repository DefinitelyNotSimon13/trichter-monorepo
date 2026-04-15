FROM eclipse-temurin:25-jre

WORKDIR /app

ARG REPO_URL
ARG VCS_REF
ARG BUILD_DATE

LABEL org.opencontainers.image.source=$REPO_URL
LABEL org.opencontainers.image.revision=$VCS_REF
LABEL org.opencontainers.image.created=$BUILD_DATE
LABEL org.opencontainers.image.license=MIT

COPY backend/build/libs/*.jar /app/app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
