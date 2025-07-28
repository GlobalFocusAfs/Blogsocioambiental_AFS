FROM eclipse-temurin:17-jdk as builder
WORKDIR /app

# 1. Copia primeiro os arquivos essenciais do Maven Wrapper
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# 2. Baixa as dependências (cacheável)
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# 3. Copia o código fonte
COPY src src

# 4. Build da aplicação
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app

# Configuração SSL
RUN apt-get update && \
    apt-get install -y ca-certificates && \
    update-ca-certificates

COPY --from=builder /app/target/*.jar app.jar

# Variáveis essenciais
ENV JAVA_OPTS="-Djavax.net.ssl.trustStore=/etc/ssl/certs/java/cacerts \
               -Djavax.net.ssl.trustStorePassword=changeit \
               -Djdk.tls.client.protocols=TLSv1.2"

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
