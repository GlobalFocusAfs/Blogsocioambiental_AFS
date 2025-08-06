package com.example.socioambiental.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);
    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            logger.warn("Tentativa de upload de arquivo vazio.");
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", "Arquivo vazio"));
        }
        // Verificar se o arquivo é uma imagem
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            logger.warn("Tentativa de upload de arquivo não imagem: tipo=" + contentType);
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", "Apenas arquivos de imagem são permitidos."));
        }
        try {
            // Cria diretório se não existir
            java.nio.file.Path uploadPath = java.nio.file.Paths.get(UPLOAD_DIR);
            if (!java.nio.file.Files.exists(uploadPath)) {
                java.nio.file.Files.createDirectories(uploadPath);
                logger.info("Diretório de upload criado: " + UPLOAD_DIR);
            }

            // Gera nome único para o arquivo
            String filename = java.util.UUID.randomUUID() + "_" + file.getOriginalFilename();
            java.nio.file.Path path = java.nio.file.Paths.get(UPLOAD_DIR + filename);

            // Salva o arquivo
            java.nio.file.Files.write(path, file.getBytes());

            logger.info("Arquivo enviado com sucesso: " + filename);

            // Return proper JSON object instead of JSON string
            return ResponseEntity.ok().body(java.util.Collections.singletonMap("filename", filename));
        } catch (java.io.IOException e) {
            logger.error("Erro ao fazer upload do arquivo", e);
            return ResponseEntity.internalServerError().body(java.util.Collections.singletonMap("error", "Erro ao fazer upload"));
        }
    }
}
