FROM eclipse-temurin:17-jdk-jammy as builder

WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src
RUN chmod +x ./mvnw
ENV MAVEN_OPTS="-XX:+TieredCompilation -XX:TieredStopAtLevel=1"
ENV MAVEN_CLI_OPTS="--batch-mode --errors --fail-at-end --show-version"
RUN ./mvnw clean package -DskipTests -T 1C

FROM eclipse-temurin:17-jre-jammy

WORKDIR /app
RUN apt-get update && \
    apt-get install -y ca-certificates && \
    update-ca-certificates
ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
COPY --from=builder /app/target/*.jar app.jar
ENV PORT=8080
EXPOSE $PORT
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:$PORT/actuator/health || exit 1
CMD ["java", "-jar", "app.jar"]
