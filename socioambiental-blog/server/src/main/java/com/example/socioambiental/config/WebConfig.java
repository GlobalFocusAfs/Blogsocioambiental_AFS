package com.example.socioambiental.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // CORS configuration moved to GlobalCorsConfig to avoid conflicts
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Disabled to prevent CORS conflicts - use GlobalCorsConfig instead
    }
}
