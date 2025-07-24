# Build stage (JDK)
FROM eclipse-temurin:17-jdk-jammy as builder
WORKDIR /app

# Copia os arquivos necessários para o build
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Configura permissões e baixa dependências
RUN chmod +x mvnw && \
    ./mvnw dependency:go-offline -B

# Copia o código fonte e faz o build
COPY src src
RUN ./mvnw clean package -DskipTests -T 1C

# Runtime stage (JRE - imagem menor)
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copia o .jar do estágio de build
COPY --from=builder /app/target/*.jar app.jar

# Configurações para o Render
ENV PORT=8080
EXPOSE $PORT

# Comando de execução
ENTRYPOINT ["java", "-jar", "app.jar"]