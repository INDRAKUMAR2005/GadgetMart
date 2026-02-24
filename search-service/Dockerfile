# Build stage
FROM maven:3.9.6-eclipse-temurin-21-jammy AS build
WORKDIR /app
COPY pom.xml .
COPY search-service search-service
RUN mvn clean package -DskipTests -pl search-service -am

# Run stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/search-service/target/*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:-default}", "-jar", "app.jar"]
