package com.example.socioambiental.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Configurar para servir arquivos estáticos da pasta uploads
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:server/uploads/");
        
        // Configurar para servir arquivos estáticos da pasta raiz uploads
        registry.addResourceHandler("/static/**")
                .addResourceLocations("file:uploads/");
    }
}
