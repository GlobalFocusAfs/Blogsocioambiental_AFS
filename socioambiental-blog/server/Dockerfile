# Build stage
FROM eclipse-temurin:17-jdk-jammy as builder

# Configuração SSL/TLS crítica
RUN apt-get update && \
    apt-get install -y maven ca-certificates openssl && \
    update-ca-certificates --fresh && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-jammy

# Configuração SSL/TLS para runtime
RUN apt-get update && \
    apt-get install -y ca-certificates openssl && \
    update-ca-certificates --fresh && \
    mkdir -p /etc/ssl/certs/java && \
    /usr/bin/printf '\xfe\xed\xfe\xed\x00\x00\x00\x02\x00\x00\x00\x00\xe2\x68\x6e\x45\xfb\x43\xdf\xa4\xd9\x92\xdd\x41\xce\xb6\xb2\x1c\x63\x30\xd7\x92' > /etc/ssl/certs/java/cacerts && \
    /var/lib/dpkg/info/ca-certificates-java.postinst configure && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# Variáveis ESSENCIAIS para SSL
ENV PORT=8080 \
    TZ=America/Sao_Paulo \
    JAVA_OPTS="-Djdk.tls.client.protocols=TLSv1.2 \
               -Djavax.net.ssl.trustStore=/etc/ssl/certs/java/cacerts \
               -Djavax.net.ssl.trustStorePassword=changeit \
               -Dhttps.protocols=TLSv1.2 \
               -Djavax.net.debug=ssl:handshake:verbose"

EXPOSE $PORT
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
