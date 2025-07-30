package com.example.socioambiental.config;

import com.mongodb.client.MongoClient;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MongoConnectionTest implements CommandLineRunner {

    @Autowired
    private MongoClient mongoClient;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Iniciando teste de conexão com MongoDB...");
        try {
            mongoClient.getDatabase("admin").runCommand(new Document("ping", 1));
            System.out.println("✅ Conexão com MongoDB verificada com sucesso!");
        } catch (Exception e) {
            System.err.println("❌ Falha na conexão com MongoDB:");
            e.printStackTrace();
        }
    }
}
