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
        System.out.println("Java Runtime Version: " + System.getProperty("java.version"));
        System.out.println("Java Runtime Vendor: " + System.getProperty("java.vendor"));
        System.out.println("Java Runtime Name: " + System.getProperty("java.runtime.name"));
        System.out.println("Java TLS Protocols: " + System.getProperty("https.protocols"));
        int maxRetries = 3;
        int retryCount = 0;
        while (retryCount < maxRetries) {
            try {
                MongoClients.create(connectionString).getDatabase("admin").runCommand(new Document("ping", 1));
                System.out.println("✅ Conexão com MongoDB verificada com sucesso!");
                return;
            } catch (Exception e) {
                retryCount++;
                System.err.println("❌ Falha na conexão com MongoDB, tentativa " + retryCount + " de " + maxRetries);
                e.printStackTrace();
                try {
                    Thread.sleep(5000); // wait 5 seconds before retry
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
            }
        }
        System.err.println("❌ Não foi possível conectar ao MongoDB após " + maxRetries + " tentativas.");
        // Do not exit, allow app to continue running for debugging
    }
}
