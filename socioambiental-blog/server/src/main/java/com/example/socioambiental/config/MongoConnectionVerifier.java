package com.example.socioambiental.config;

import com.mongodb.client.MongoClients;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;

@Configuration
public class MongoConnectionVerifier {

    @Value("${spring.data.mongodb.uri}")
    private String connectionString;

    @PostConstruct
    public void verifyConnection() {
        try {
            MongoClients.create(connectionString).getDatabase("admin").runCommand(new Document("ping", 1));
            System.out.println("✅ Conexão com MongoDB verificada com sucesso!");
        } catch (Exception e) {
            System.err.println("❌ Falha na conexão com MongoDB:");
            e.printStackTrace();
            System.exit(1);
        }
    }
}
