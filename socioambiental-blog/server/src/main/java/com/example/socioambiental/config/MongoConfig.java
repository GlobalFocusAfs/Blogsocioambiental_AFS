package com.example.socioambiental.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

import javax.net.ssl.SSLContext;
import java.util.concurrent.TimeUnit;

@Configuration
public class MongoConfig {

    @Bean
    public MongoClient mongoClient() {
        // Removed ssl=true and tls=true from connection string to avoid redundancy
        String connectionString = "mongodb+srv://usuarioBlog:usuarioBlog@cluster0.bqekblt.mongodb.net/socioambiental-blog?retryWrites=true&w=majority&tlsAllowInvalidCertificates=true";

        MongoClientSettings settings = MongoClientSettings.builder()
                .applyConnectionString(new ConnectionString(connectionString))
                .applyToSslSettings(builder -> {
                    builder.enabled(true);
                    builder.invalidHostNameAllowed(true); // Align with application.properties
                    builder.context(getSSLContext());
                })
                .applyToClusterSettings(builder ->
                        builder.serverSelectionTimeout(30, TimeUnit.SECONDS))
                .build();

        return MongoClients.create(settings);
    }

    private SSLContext getSSLContext() {
        try {
            // Explicitly set SSLContext to TLSv1.2 for compatibility
            SSLContext sslContext = SSLContext.getInstance("TLSv1.2");
            sslContext.init(null, null, null);
            return sslContext;
        } catch (Exception e) {
            throw new RuntimeException("Failed to get TLSv1.2 SSLContext", e);
        }
    }

    @Bean
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoClient(), "socioambiental-blog");
    }
}
