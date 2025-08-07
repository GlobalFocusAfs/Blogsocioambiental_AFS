package com.example.socioambiental.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Configuração para ambiente de produção (Render) com caminho absoluto
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + UPLOAD_DIR);
        
        // Configuração alternativa para compatibilidade
        registry.addResourceHandler("/static/**")
                .addResourceLocations("file:" + UPLOAD_DIR);
        
        // Configuração para ambiente local (fallback)
        registry.addResourceHandler("/local-uploads/**")
                .addResourceLocations("file:" + UPLOAD_DIR);
    }
}
