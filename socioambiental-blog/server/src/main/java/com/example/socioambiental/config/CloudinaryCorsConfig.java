package com.example.socioambiental.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CloudinaryCorsConfig {

    // CORS configuration moved to GlobalCorsConfig to avoid conflicts
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        // Disabled to prevent CORS conflicts - use GlobalCorsConfig instead
        return null;
    }
}
