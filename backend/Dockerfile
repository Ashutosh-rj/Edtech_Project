# ==========================================
# Multi-stage Dockerfile for all EdTech
# Spring Boot microservices.
#
# Build arg:
#   SERVICE_NAME — the module folder name
#                 (e.g. auth-service)
# ==========================================

# ---- Stage 1: Build ----
FROM maven:3.9-eclipse-temurin-17-alpine AS build

WORKDIR /app

# Copy parent POM first (for dependency layer caching)
COPY pom.xml .

# Copy every module POM so Maven can resolve the reactor
COPY discovery-server/pom.xml    discovery-server/
COPY config-server/pom.xml       config-server/
COPY api-gateway/pom.xml         api-gateway/
COPY auth-service/pom.xml        auth-service/
COPY user-service/pom.xml        user-service/
COPY course-service/pom.xml      course-service/
COPY lecture-service/pom.xml     lecture-service/
COPY enrollment-service/pom.xml  enrollment-service/
COPY review-service/pom.xml      review-service/
COPY quiz-service/pom.xml        quiz-service/
COPY notification-service/pom.xml notification-service/
COPY analytics-service/pom.xml   analytics-service/
COPY certificate-service/pom.xml certificate-service/

# Pre-download dependencies (cached layer)
RUN mvn dependency:go-offline -q

# Copy full source
COPY . .

# Build only the requested service (and its required modules)
ARG SERVICE_NAME
RUN mvn clean package -pl ${SERVICE_NAME} -am -DskipTests -q

# ---- Stage 2: Runtime ----
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

ARG SERVICE_NAME
COPY --from=build /app/${SERVICE_NAME}/target/*.jar app.jar

# Allow JVM tuning via env at runtime
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
