FROM eclipse-temurin:17-jdk-jammy as builder

# Instala dependências SSL
RUN apt-get update && \
    apt-get install -y ca-certificates openssl && \
    update-ca-certificates --fresh && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy

# Configuração SSL correta
RUN apt-get update && \
    apt-get install -y ca-certificates openssl && \
    update-ca-certificates --fresh && \
    rm -rf /var/lib/apt/lists/* && \
    mkdir -p /etc/ssl/certs/java && \
    /usr/bin/printf '\xfe\xed\xfe\xed\x00\x00\x00\x02\x00\x00\x00\x00\xe2\x68\x6e\x45\xfb\x43\xdf\xa4\xd9\x92\xdd\x41\xce\xb6\xb2\x1c\x63\x30\xd7\x92' > /etc/ssl/certs/java/cacerts && \
    chmod 644 /etc/ssl/certs/java/cacerts && \
    find /usr/share/ca-certificates -type f -name '*.crt' -exec keytool -importcert \
        -keystore /etc/ssl/certs/java/cacerts \
        -storepass changeit \
        -noprompt \
        -file {} \;

WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# Variáveis de ambiente SSL
ENV JAVA_OPTS="-Djdk.tls.client.protocols=TLSv1.2 \
               -Djavax.net.ssl.trustStore=/etc/ssl/certs/java/cacerts \
               -Djavax.net.ssl.trustStorePassword=changeit"

EXPOSE 8080
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
