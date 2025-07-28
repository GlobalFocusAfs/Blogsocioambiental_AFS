FROM eclipse-temurin:17-jdk-jammy

# Configuração de timezone e certificados
RUN apt-get update && \
    apt-get install -y tzdata ca-certificates && \
    ln -sf /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime && \
    update-ca-certificates

WORKDIR /app
COPY . .

# Build da aplicação
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# Configuração SSL explícita
ENV JAVA_OPTS="-Djavax.net.ssl.trustStore=/etc/ssl/certs/ca-certificates.crt \
               -Djdk.tls.client.protocols=TLSv1.2 \
               -Dhttps.protocols=TLSv1.2"

EXPOSE 8080
CMD ["java", "-jar", "target/*.jar"]
