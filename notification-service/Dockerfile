# Build stage
FROM maven:3.9.6-eclipse-temurin-21-jammy AS build
WORKDIR /app
# Copy the parent pom first
COPY pom.xml .
# Copy the service code
COPY notification-service/pom.xml notification-service/
COPY notification-service/src notification-service/src
# Build only the notification-service module
RUN mvn clean package -DskipTests -pl notification-service -am

# Run stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/notification-service/target/*.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:-default}", "-jar", "app.jar"]
