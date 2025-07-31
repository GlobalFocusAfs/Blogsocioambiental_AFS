package com.example.socioambiental.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.concurrent.TimeUnit;
import javax.net.ssl.SSLContext;

@Configuration
public class MongoConfig {

    @Value("${spring.data.mongodb.uri}")
    private String connectionString;

    @Bean
    public MongoClient mongoClient() {
        MongoClientSettings.Builder builder = MongoClientSettings.builder()
                .applyConnectionString(new ConnectionString(connectionString))
                .applyToClusterSettings(clusterBuilder ->
                        clusterBuilder.serverSelectionTimeout(30, TimeUnit.SECONDS))
                // Habilitar SSL para conexão com MongoDB Atlas
                .applyToSslSettings(sslBuilder -> sslBuilder.enabled(true))
                .applyToSocketSettings(socketBuilder -> socketBuilder.connectTimeout(30, TimeUnit.SECONDS))
                .applyToConnectionPoolSettings(poolBuilder -> poolBuilder.maxWaitTime(30, TimeUnit.SECONDS));

        // Forçar uso do TLS 1.2
        try {
            SSLContext sslContext = SSLContext.getInstance("TLSv1.2");
            sslContext.init(null, null, null);
            builder.applyToSslSettings(sslBuilder -> sslBuilder.context(sslContext));
        } catch (Exception e) {
            throw new RuntimeException("Erro ao configurar SSLContext para TLSv1.2", e);
        }
        /*
        // Removido o forçamento do TLSv1.2 para permitir que o driver negocie a versão TLS automaticamente
        /*
        try {
            SSLContext sslContext = SSLContext.getInstance("TLSv1.2");
            sslContext.init(null, null, null);
            builder.applyToSslSettings(sslBuilder -> sslBuilder.context(sslContext));
        } catch (Exception e) {
            throw new RuntimeException("Erro ao configurar SSLContext para TLSv1.2", e);
        }
        */

        MongoClientSettings settings = builder.build();

        try {
            return MongoClients.create(settings);
        } catch (Exception e) {
            System.err.println("Erro ao criar MongoClient: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Bean
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoClient(), "socioambiental-blog");
    }
}
