package com.example.socioambiental.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class RenderResourceConfig implements WebMvcConfigurer {

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Configuração específica para Render com caminho absoluto
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + UPLOAD_DIR);
        
        // Garantir que o diretório uploads seja acessível
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + UPLOAD_DIR);
    }
}
