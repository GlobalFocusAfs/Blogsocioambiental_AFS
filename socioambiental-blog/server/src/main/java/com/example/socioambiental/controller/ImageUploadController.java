package com.example.socioambiental.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ImageUploadController {

    // Usar caminho absoluto para garantir compatibilidade com Render
    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";
    
    @PostMapping("/upload-multiple")
    public ResponseEntity<?> uploadMultipleImages(@RequestParam("images") MultipartFile[] images) {
        try {
            List<String> uploadedFiles = new ArrayList<>();
            
            // Garantir que o diretório existe
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            for (MultipartFile image : images) {
                if (!image.isEmpty()) {
                    String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                    
                    // Salvar no diretório uploads/
                    Path filePath = uploadPath.resolve(fileName);
                    Files.write(filePath, image.getBytes());
                    
                    uploadedFiles.add(fileName);
                }
            }
            
            return ResponseEntity.ok(uploadedFiles);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao fazer upload das imagens: " + e.getMessage());
        }
    }
}
