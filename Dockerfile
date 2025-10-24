FROM eclipse-temurin:21-jdk

EXPOSE 9090

WORKDIR /root

COPY ./pom.xml /root
COPY ./.mvn /root/.mvn
COPY ./mvnw /root

RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline


COPY ./src /root/src

RUN ./mvnw clean install -DskipTests

ENTRYPOINT ["java", "-jar", "/root/target/proyecto-spring-0.0.1-SNAPSHOT.jar"]