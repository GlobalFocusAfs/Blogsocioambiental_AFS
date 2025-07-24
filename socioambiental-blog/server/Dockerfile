# Build stage (JDK)
FROM eclipse-temurin:17-jdk-jammy as builder
WORKDIR /app

# Copia os arquivos do Maven primeiro (para otimizar cache)
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Baixa dependências (cacheado se o pom.xml não mudar)
RUN ./mvnw dependency:go-offline -B

# Copia o código fonte
COPY src src

# Compila o projeto
RUN ./mvnw clean package -DskipTests

# Runtime stage (JRE - imagem menor)
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copia o .jar do estágio de build
COPY --from=builder /app/target/*.jar app.jar

# Configura porta para o Render
ENV PORT=8080
EXPOSE $PORT

# Comando de execução
CMD ["java", "-jar", "app.jar"]