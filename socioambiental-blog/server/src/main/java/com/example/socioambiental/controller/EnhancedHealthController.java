package com.example.socioambiental.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class EnhancedHealthController {

    @CrossOrigin(origins = {
        "http://localhost:3000",
        "https://blogsocioambiental-afs-1itd.vercel.app",
        "https://*.vercel.app"
    })
    @GetMapping("/health")
    public Map<String, String> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        response.put("service", "socioambiental-blog-backend");
        return response;
    }
}
