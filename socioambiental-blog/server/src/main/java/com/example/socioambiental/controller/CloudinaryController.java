package com.example.socioambiental.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cloudinary")
public class CloudinaryController {

    @Autowired
    private Cloudinary cloudinary;

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        Map<String, String> response = new HashMap<>();
        
        if (file.isEmpty()) {
            response.put("error", "Arquivo vazio");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        
        try {
            // Fazer upload para Cloudinary
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "resource_type", "auto",
                "folder", "socioambiental-blog"
            ));
            
            String imageUrl = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");
            
            response.put("url", imageUrl);
            response.put("publicId", publicId);
            response.put("message", "Imagem enviada com sucesso!");
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            response.put("error", "Erro ao fazer upload: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/delete/{publicId}")
    public ResponseEntity<Map<String, String>> deleteImage(@PathVariable String publicId) {
        Map<String, String> response = new HashMap<>();
        
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            response.put("message", "Imagem deletada com sucesso!");
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            response.put("error", "Erro ao deletar imagem: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "Cloudinary service is running");
        return ResponseEntity.ok(response);
    }
}
