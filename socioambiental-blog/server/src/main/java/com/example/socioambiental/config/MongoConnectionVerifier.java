package com.example.socioambiental.config;

import com.mongodb.client.MongoClients;
import org.bson.Document;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;

@Configuration
public class MongoConnectionVerifier {

    @PostConstruct
    public void verifyConnection() {
        try {
            String uri = "mongodb+srv://usuarioBlog:usuarioBlog@cluster0.8kpiwei.mongodb.net/?retryWrites=true&w=majority";
            MongoClients.create(uri).getDatabase("admin").runCommand(new Document("ping", 1));
            System.out.println("✅ Conexão com MongoDB verificada com sucesso!");
        } catch (Exception e) {
            System.err.println("❌ Falha na conexão com MongoDB:");
            e.printStackTrace();
            System.exit(1);
        }
    }
}
