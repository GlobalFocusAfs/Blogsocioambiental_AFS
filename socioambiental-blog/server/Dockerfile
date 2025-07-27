FROM eclipse-temurin:17-jdk-jammy as builder

# Configuração SSL/TLS para build stage
RUN apt-get update && \
    apt-get install -y ca-certificates openssl && \
    update-ca-certificates --fresh && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy

# Configuração SSL/TLS simplificada e funcional
RUN apt-get update && \
    apt-get install -y ca-certificates openssl && \
    update-ca-certificates --fresh && \
    rm -rf /var/lib/apt/lists/* && \
    mkdir -p /etc/ssl/certs/java && \
    keytool -importkeystore -srckeystore /etc/ssl/certs/ca-certificates.crt \
            -destkeystore /etc/ssl/certs/java/cacerts \
            -deststoretype jks \
            -deststorepass changeit \
            -noprompt

WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# Variáveis de ambiente para SSL
ENV JAVA_OPTS="-Djdk.tls.client.protocols=TLSv1.2 \
               -Djavax.net.ssl.trustStore=/etc/ssl/certs/java/cacerts \
               -Djavax.net.ssl.trustStorePassword=changeit"

EXPOSE 8080
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
