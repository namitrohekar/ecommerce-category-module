# ── Stage 1: Build ─────────────────────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom first to cache dependencies separately from source
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Copy source and build (skip tests — run them in CI, not at image build time)
COPY src ./src
RUN mvn package -DskipTests -q

# ── Stage 2: Runtime ───────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the fat JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Render injects PORT env var — Spring Boot reads it via SERVER_PORT
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
