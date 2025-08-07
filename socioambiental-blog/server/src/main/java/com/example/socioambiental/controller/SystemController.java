package com.example.socioambiental.controller;

import com.example.socioambiental.model.Post;
import com.example.socioambiental.model.Comment;
import com.example.socioambiental.repository.PostRepository;
import com.example.socioambiental.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/system")
@CrossOrigin(origins = "*")
public class SystemController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    // Endpoint para verificar status completo
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getSystemStatus() {
        Map<String, Object> status = new HashMap<>();
        
        try {
            long postCount = postRepository.count();
            long commentCount = commentRepository.count();
            
            status.put("status", "running");
            status.put("timestamp", LocalDateTime.now().toString());
            status.put("postsCount", postCount);
            status.put("commentsCount", commentCount);
            status.put("database", "connected");
            status.put("message", "Sistema operacional!");
            
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            status.put("status", "error");
            status.put("error", e.getMessage());
            return ResponseEntity.status(500).body(status);
        }
    }

    // Endpoint para resetar e popular o banco com dados iniciais
    @PostMapping("/reset")
    public ResponseEntity<Map<String, Object>> resetAndPopulate() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Limpar dados existentes
            commentRepository.deleteAll();
            postRepository.deleteAll();
            
            // Criar posts de exemplo
            List<Post> samplePosts = createSamplePosts();
            List<Post> savedPosts = postRepository.saveAll(samplePosts);
            
            // Criar comentários de exemplo
            List<Comment> sampleComments = createSampleComments(savedPosts);
            commentRepository.saveAll(sampleComments);
            
            response.put("status", "success");
            response.put("message", "Sistema resetado e populado com sucesso!");
            response.put("postsCreated", savedPosts.size());
            response.put("commentsCreated", sampleComments.size());
            response.put("timestamp", LocalDateTime.now().toString());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Erro ao resetar sistema: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Endpoint para acionar o sistema (keep alive)
    @GetMapping("/wake-up")
    public ResponseEntity<Map<String, String>> wakeUp() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "awake");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("message", "Sistema acordado com sucesso!");
        return ResponseEntity.ok(response);
    }

    // Endpoint para verificar se há dados
    @GetMapping("/check-data")
    public ResponseEntity<Map<String, Object>> checkData() {
        Map<String, Object> response = new HashMap<>();
        
        long postCount = postRepository.count();
        boolean hasData = postCount > 0;
        
        response.put("hasData", hasData);
        response.put("postsCount", postCount);
        response.put("commentsCount", commentRepository.count());
        
        return ResponseEntity.ok(response);
    }

    private List<Post> createSamplePosts() {
        List<Post> posts = new ArrayList<>();
        
        Post post1 = new Post();
        post1.setTitle("🌱 A Importância da Sustentabilidade");
        post1.setContent("A sustentabilidade é fundamental para garantir um futuro melhor para as próximas gerações. Pequenas ações no nosso dia a dia podem fazer uma grande diferença no mundo.");
        post1.setAuthor("Equipe Socioambiental");
        post1.setImageUrl("https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3");
        post1.setCategory("Sustentabilidade");
        post1.setTags(Arrays.asList("meio-ambiente", "sustentabilidade", "futuro"));
        post1.setCreatedAt(LocalDateTime.now());
        posts.add(post1);

        Post post2 = new Post();
        post2.setTitle("🌍 Mudanças Climáticas: O Que Podemos Fazer?");
        post2.setContent("As mudanças climáticas são uma realidade que enfrentamos todos os dias. Aqui estão algumas ações práticas que você pode tomar para ajudar o planeta.");
        post2.setAuthor("Maria Silva");
        post2.setImageUrl("https://images.unsplash.com/photo-1569163139394-de44aa99b2c5?ixlib=rb-4.0.3");
        post2.setCategory("Clima");
        post2.setTags(Arrays.asList("clima", "ação", "mudança"));
        post2.setCreatedAt(LocalDateTime.now());
        posts.add(post2);

        Post post3 = new Post();
        post3.setTitle("♻️ Reciclagem: Guia Prático para Iniciantes");
        post3.setContent("Reciclar é mais simples do que parece! Este guia vai te ajudar a começar sua jornada na reciclagem de forma correta e eficiente.");
        post3.setAuthor("João Santos");
        post3.setImageUrl("https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-4.0.3");
        post3.setCategory("Reciclagem");
        post3.setTags(Arrays.asList("reciclagem", "guia", "prático"));
        post3.setCreatedAt(LocalDateTime.now());
        posts.add(post3);
    }
}