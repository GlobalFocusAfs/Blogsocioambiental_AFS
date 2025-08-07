package com.example.socioambiental.config;

import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class UploadDirectoryInitializer {

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    @PostConstruct
    public void init() {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                System.out.println("✅ Diretório de uploads criado: " + uploadPath.toAbsolutePath());
            } else {
                System.out.println("✅ Diretório de uploads já existe: " + uploadPath.toAbsolutePath());
            }
        } catch (IOException e) {
            System.err.println("❌ Erro ao criar diretório de uploads: " + e.getMessage());
        }
    }
}
