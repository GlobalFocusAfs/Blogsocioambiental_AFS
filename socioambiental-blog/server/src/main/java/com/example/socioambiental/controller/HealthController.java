package com.example.socioambiental.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping("/ping")
    public String pingMongoDB() {
        try {
            mongoTemplate.executeCommand("{ ping: 1 }");
            return "Conexão com MongoDB OK!";
        } catch (Exception e) {
            return "Erro na conexão: " + e.getMessage();
        }
    }

    @GetMapping("/health")
    public Map<String, Object> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "socioambiental-blog");
        response.put("timestamp", System.currentTimeMillis());
        
        try {
            mongoTemplate.executeCommand("{ ping: 1 }");
            response.put("database", "CONNECTED");
        } catch (Exception e) {
            response.put("database", "ERROR: " + e.getMessage());
        }
        
        return response;
    }

    @GetMapping("/wake-up")
    public Map<String, Object> wakeUp() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Serviço ativado com sucesso!");
        response.put("status", "AWAKE");
        response.put("timestamp", System.currentTimeMillis());
        
        // Forçar uma consulta no banco para manter a conexão ativa
        try {
            long count = mongoTemplate.getCollection("posts").estimatedDocumentCount();
            response.put("postsCount", count);
            response.put("database", "ACTIVE");
        } catch (Exception e) {
            response.put("database", "ERROR: " + e.getMessage());
        }
        
        return response;
    }
}
