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

@Configuration
public class MongoConfig {

    @Value("${spring.data.mongodb.uri}")
    private String connectionString;

    @Value("${spring.data.mongodb.ssl.enabled:false}")
    private boolean sslEnabled;

    @Value("${spring.data.mongodb.ssl.invalid-host-name-allowed:false}")
    private boolean invalidHostNameAllowed;

    @Bean
    public MongoClient mongoClient() {
        MongoClientSettings.Builder builder = MongoClientSettings.builder()
                .applyConnectionString(new ConnectionString(connectionString))
                .applyToClusterSettings(clusterBuilder ->
                        clusterBuilder.serverSelectionTimeout(30, TimeUnit.SECONDS));

        if (sslEnabled) {
            builder.applyToSslSettings(sslBuilder ->
                    sslBuilder.enabled(true)
                              .invalidHostNameAllowed(invalidHostNameAllowed));
        } else {
            builder.applyToSslSettings(sslBuilder -> sslBuilder.enabled(false));
        }

        MongoClientSettings settings = builder.build();

        return MongoClients.create(settings);
    }

    @Bean
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoClient(), "socioambiental-blog");
    }
}
