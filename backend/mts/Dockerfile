FROM eclipse-temurin:21-jre-noble

WORKDIR /app

COPY build/libs/mts.jar app.jar

USER 10001:10001

EXPOSE 8083

ENTRYPOINT ["java", "-jar", "app.jar"]
