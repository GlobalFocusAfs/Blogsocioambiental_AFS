# Build stage
FROM eclipse-temurin:17-jdk-jammy as builder

# Instala certificados root atualizados e libssl1.1
RUN apt-get update && \
    apt-get install -y maven ca-certificates libssl3 tzdata && \
    update-ca-certificates && \
    ln -sf /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime

WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-jammy

# Configura certificados, libssl1.1 e timezone
RUN apt-get update && \
    apt-get install -y ca-certificates libssl3 tzdata && \
    update-ca-certificates && \
    mkdir -p /etc/ssl/certs/java && \
    cp /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/java/cacerts && \
    ln -sf /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime

WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# Variáveis essenciais
ENV PORT=8080 \
    TZ=America/Sao_Paulo \
    JAVA_OPTS="-Djavax.net.ssl.trustStore=/etc/ssl/certs/java/cacerts \
               -Djavax.net.ssl.trustStorePassword=changeit \
               -Djdk.tls.client.protocols=TLSv1.2 \
               -Dhttps.protocols=TLSv1.2 \
               -Djavax.net.debug=ssl"

EXPOSE $PORT
CMD ["java", "-jar", "app.jar"]
