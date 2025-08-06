package com.example.socioambiental.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
