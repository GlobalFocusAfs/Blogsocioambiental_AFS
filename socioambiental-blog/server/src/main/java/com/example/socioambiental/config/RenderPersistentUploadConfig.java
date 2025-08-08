package com.example.socioambiental.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class RenderPersistentUploadConfig implements WebMvcConfigurer {

    // Usar diretório persistente no Render
    private static final String RENDER_UPLOAD_DIR = "/opt/render/project/uploads/";
    private static final String FALLBACK_UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    @PostConstruct
    public void init() {
        // Tenta criar diretório persistente do Render
        try {
            Path renderPath = Paths.get(RENDER_UPLOAD_DIR);
            if (!Files.exists(renderPath)) {
                Files.createDirectories(renderPath);
                System.out.println("✅ Diretório persistente Render criado: " + renderPath.toAbsolutePath());
            }
        } catch (IOException e) {
            System.err.println("⚠️ Diretório persistente não disponível, usando fallback: " + e.getMessage());
            
            // Fallback para diretório local
            try {
                Path fallbackPath = Paths.get(FALLBACK_UPLOAD_DIR);
                if (!Files.exists(fallbackPath)) {
                    Files.createDirectories(fallbackPath);
                    System.out.println("✅ Diretório fallback criado: " + fallbackPath.toAbsolutePath());
                }
            } catch (IOException ex) {
                System.err.println("❌ Erro ao criar diretório fallback: " + ex.getMessage());
            }
        }
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Configuração para diretório persistente do Render
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + RENDER_UPLOAD_DIR)
                .addResourceLocations("file:" + FALLBACK_UPLOAD_DIR);
        
        // Configuração adicional para compatibilidade
        registry.addResourceHandler("/static/**")
                .addResourceLocations("file:" + RENDER_UPLOAD_DIR)
                .addResourceLocations("file:" + FALLBACK_UPLOAD_DIR);
    }

    public static String getUploadDirectory() {
        Path renderPath = Paths.get(RENDER_UPLOAD_DIR);
        if (Files.exists(renderPath)) {
            return RENDER_UPLOAD_DIR;
        }
        return FALLBACK_UPLOAD_DIR;
    }
}
