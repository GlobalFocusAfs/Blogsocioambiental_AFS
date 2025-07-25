# Build stage
FROM eclipse-temurin:17-jdk-jammy as builder

# Instala certificados CA e timezone
RUN apt-get update && \
    apt-get install -y maven ca-certificates tzdata && \
    update-ca-certificates && \
    ln -sf /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime

WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-jammy

# Configura certificados e timezone
RUN apt-get update && \
    apt-get install -y ca-certificates tzdata && \
    update-ca-certificates && \
    ln -sf /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime

WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# Variáveis de ambiente críticas
ENV PORT=8080 \
    TZ=America/Sao_Paulo \
    JAVA_OPTS="-Djdk.tls.client.protocols=TLSv1.2 -Djavax.net.debug=ssl"

EXPOSE $PORT
CMD ["java", "-jar", "app.jar"]
