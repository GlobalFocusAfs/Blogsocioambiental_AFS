# Use official OpenJDK 17 image
FROM eclipse-temurin:17-jdk-jammy as builder

# Set working directory
WORKDIR /app

# Copy only the necessary files for build (faster than copying everything)
COPY socioambiental-blog/server/pom.xml .
COPY socioambiental-blog/server/mvnw .
COPY socioambiental-blog/server/.mvn .mvn

# Download dependencies (cached unless pom.xml changes)
RUN ./mvnw dependency:go-offline -B

# Copy source files
COPY socioambiental-blog/server/src src

# Build the application (creates JAR in target/)
RUN ./mvnw clean package -DskipTests

# Runtime stage (smaller image)
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copy JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Set environment variables
ENV PORT=8080
EXPOSE $PORT

# Run the application
CMD ["java", "-jar", "app.jar"]