FROM maven:3.9.5-eclipse-temurin-17 AS build
LABEL authors="sunilsahu"
WORKDIR /app
COPY ./pom.xml .
COPY ./src ./src
RUN mvn clean package -DskipTests

FROM arm64v8/openjdk
WORKDIR /app
COPY --from=build ./app/target/todoapi-0.0.1-SNAPSHOT.jar ./todoapi.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "todoapi.jar"]



ENTRYPOINT ["top", "-b"]