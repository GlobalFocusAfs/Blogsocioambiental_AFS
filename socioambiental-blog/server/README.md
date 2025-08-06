# MongoDB SSL Connection Fix Instructions

To fix the SSL connection issue with MongoDB Atlas, please follow these steps:

1. **Update MongoDB Connection String**

In `src/main/resources/application.properties`, ensure your connection string includes:

```
spring.data.mongodb.uri=mongodb+srv://usuarioBlog:usuarioBlog@cluster0.bqekblt.mongodb.net/socioambiental-blog?ssl=true&retryWrites=false&w=majority
```

2. **Update Dockerfile**

Make sure your `Dockerfile` includes installation of CA certificates and sets the timezone to avoid SSL issues:

```dockerfile
FROM eclipse-temurin:17-jdk-jammy as builder
WORKDIR /app
RUN apt-get update && \
    apt-get install -y maven && \
    rm -rf /var/lib/apt/lists/*
COPY pom.xml .
COPY src src
ENV MAVEN_OPTS="-XX:+TieredCompilation -XX:TieredStopAtLevel=1"
ENV MAVEN_CLI_OPTS="--batch-mode --errors --fail-at-end --show-version"
RUN mvn clean package -DskipTests -T 1C

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
ENTRYPOINT ["java", "-Dhttps.protocols=TLSv1.2", "-Djdk.tls.client.protocols=TLSv1.2", "-jar", "app.jar"]
```

3. **Update MongoDB Driver Version (Optional)**

In `pom.xml`, update the MongoDB driver version to 4.9.1 to ensure compatibility:

```xml
<dependency>
    <groupId>org.mongodb</groupId>
    <artifactId>mongodb-driver-sync</artifactId>
    <version>4.9.1</version>
</dependency>
```

4. **Render Environment Variables**

Add the following environment variables in your Render service settings:

| Key       | Value                                                                                      |
|-----------|--------------------------------------------------------------------------------------------|
| JAVA_OPTS | -Djavax.net.ssl.trustStore=/etc/ssl/certs/java/cacerts -Djavax.net.ssl.trustStorePassword=changeit |
| MONGO_SSL | true                                                                                       |

5. **Final Steps**

- Commit your changes.
- Push to GitHub.
- Trigger a new deploy on Render.

This should resolve the SSL handshake errors with MongoDB Atlas.

# Notes

- The error "Received fatal alert: internal_error" usually indicates the container cannot validate MongoDB Atlas SSL certificates.
- Setting the timezone correctly in the container helps avoid SSL issues related to time differences.
- Installing CA certificates in both build and runtime stages ensures proper SSL validation.
