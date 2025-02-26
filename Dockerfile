FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY target/*.jar app.jar
ENV PORT=10000
EXPOSE 10000
CMD ["java", "-jar", "app.jar"] 