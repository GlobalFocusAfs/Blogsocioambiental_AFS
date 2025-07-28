FROM eclipse-temurin:17-jdk as builder

# Atualiza certificados e instala componentes SSL
RUN apt-get update && \
    apt-get install -y ca-certificates openssl && \
    update-ca-certificates

# Configura o ambiente para TLS 1.2
ENV SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt
ENV SSL_CERT_DIR=/etc/ssl/certs

WORKDIR /app
COPY . .
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre

# Configuração SSL crítica
RUN apt-get update && \
    apt-get install -y ca-certificates openssl && \
    update-ca-certificates && \
    mkdir -p /etc/ssl/certs/java && \
    cp /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/java/cacerts

# Define variáveis de ambiente essenciais
ENV JAVA_OPTS="-Djavax.net.ssl.trustStore=/etc/ssl/certs/java/cacerts \
               -Djavax.net.ssl.trustStorePassword=changeit \
               -Djdk.tls.client.protocols=TLSv1.2 \
               -Dhttps.protocols=TLSv1.2 \
               -Djavax.net.debug=ssl:handshake"

WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080
CMD ["java", "${JAVA_OPTS}", "-jar", "app.jar"]
