package com.example.socioambiental.controller;

import com.example.socioambiental.service.ImageMigrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MigrationController {

    @Autowired
    private ImageMigrationService imageMigrationService;

    @PostMapping("/migrate-images")
    public ResponseEntity<?> migrateImages() {
        try {
            imageMigrationService.migrateImages();
            return ResponseEntity.ok("Migração de imagens iniciada com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Erro ao iniciar migração: " + e.getMessage());
        }
    }
}
