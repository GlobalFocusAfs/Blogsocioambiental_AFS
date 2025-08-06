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

    private static final String UPLOAD_DIR = "server/uploads/";
    private static final String UPLOAD_DIR_ROOT = "uploads/";

    @PostMapping("/upload-multiple")
    public ResponseEntity<?> uploadMultipleImages(@RequestParam("images") MultipartFile[] images) {
        try {
            List<String> uploadedFiles = new ArrayList<>();
            
            for (MultipartFile image : images) {
                if (!image.isEmpty()) {
                    String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                    
                    // Salvar no diretório server/uploads/
                    Path filePath = Paths.get(UPLOAD_DIR + fileName);
                    Files.createDirectories(filePath.getParent());
                    Files.write(filePath, image.getBytes());
                    
                    // Também salvar uma cópia no diretório uploads/ raiz para compatibilidade
                    Path rootFilePath = Paths.get(UPLOAD_DIR_ROOT + fileName);
                    Files.createDirectories(rootFilePath.getParent());
                    Files.write(rootFilePath, image.getBytes());
                    
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
