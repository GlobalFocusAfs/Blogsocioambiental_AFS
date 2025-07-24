# Build stage (JDK)
FROM eclipse-temurin:17-jdk-jammy as builder
WORKDIR /app

# 1. Instala o Maven diretamente (ignora o wrapper)
RUN apt-get update && \
    apt-get install -y maven && \
    rm -rf /var/lib/apt/lists/*

# 2. Copia os arquivos do projeto
COPY pom.xml .
COPY src src

# 3. Configurações otimizadas para o Render
ENV MAVEN_OPTS="-XX:+TieredCompilation -XX:TieredStopAtLevel=1"
ENV MAVEN_CLI_OPTS="--batch-mode --errors --fail-at-end --show-version"

# 4. Build da aplicação
RUN mvn clean package -DskipTests -T 1C

# Runtime stage (JRE - imagem menor)
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copia apenas o .jar do estágio de build
COPY --from=builder /app/target/*.jar app.jar

# Configurações para o Render
ENV PORT=8080
EXPOSE $PORT

# Health check (opcional)
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:$PORT/actuator/health || exit 1

# Comando de execução
ENTRYPOINT ["java", "-jar", "app.jar"]