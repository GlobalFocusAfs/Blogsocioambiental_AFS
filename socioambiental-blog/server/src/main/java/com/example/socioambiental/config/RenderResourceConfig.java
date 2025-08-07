package com.example.socioambiental.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class RenderResourceConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Configuração específica para Render
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:./uploads/");
        
        // Garantir que o diretório uploads seja acessível
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:./uploads/");
    }
}
