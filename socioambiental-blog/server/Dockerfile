# Build stage (JDK)
FROM eclipse-temurin:17-jdk-jammy as builder
WORKDIR /app

# 1. Primeiro copia apenas os arquivos do Maven (para otimizar cache)
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# 2. Configura Maven Wrapper e dependências
RUN chmod +x mvnw && \
    # Verifica conexão com repositório Maven
    ./mvnw -v && \
    # Baixa dependências com tolerância a erros SSL
    ./mvnw dependency:go-offline -B -Dmaven.wagon.http.ssl.insecure=true -Dmaven.wagon.http.ssl.allowall=true

# 3. Copia o código fonte
COPY src src

# 4. Build da aplicação
RUN ./mvnw clean package -DskipTests -T 1C -Dmaven.test.skip=true

# Runtime stage (JRE - imagem menor)
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copia apenas o .jar do estágio de build
COPY --from=builder /app/target/*.jar app.jar

# Configurações para o Render
ENV PORT=8080
EXPOSE $PORT

# Health check (opcional para o Render)
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:$PORT/actuator/health || exit 1

# Comando de execução (melhor usar ENTRYPOINT + CMD)
ENTRYPOINT ["java"]
CMD ["-jar", "app.jar"]