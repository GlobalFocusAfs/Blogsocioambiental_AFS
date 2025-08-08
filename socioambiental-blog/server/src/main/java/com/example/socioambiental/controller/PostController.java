package com.example.socioambiental.controller;

import com.example.socioambiental.model.Post;
import com.example.socioambiental.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.socioambiental.controller.PasswordRequest;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    // Get all posts ordered by createdAt descending
    @GetMapping
    public ResponseEntity<?> getAllPosts() {
        try {
            return ResponseEntity.ok(postRepository.findAllByOrderByCreatedAtDesc());
        } catch (Exception e) {
            // Log completo da exceção
            e.printStackTrace();
            System.err.println("Erro detalhado: " + e.toString());
            for (StackTraceElement element : e.getStackTrace()) {
                System.err.println("\tat " + element);
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao buscar publicações: " + e.getMessage());
        }
    }

    // Get a post by id
    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable String id) {
        try {
            Optional<Post> post = postRepository.findById(id);
            if (post.isPresent()) {
                return ResponseEntity.ok(post.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            // Log completo da exceção
            e.printStackTrace();
            System.err.println("Erro detalhado: " + e.toString());
            for (StackTraceElement element : e.getStackTrace()) {
                System.err.println("\tat " + element);
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao buscar publicação: " + e.getMessage());
        }
    }

    // Create a new post
    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody Post post) {
        try {
            // Calcular a data de expiração com base na opção selecionada
            if (post.getExpirationDate() != null) {
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(new Date());
                calendar.add(Calendar.DAY_OF_MONTH, getDaysToAdd(post.getExpirationDate()));
                post.setExpirationDate(calendar.getTime());
            }
            Post savedPost = postRepository.save(post);
            return new ResponseEntity<>(savedPost, HttpStatus.CREATED);
        } catch (Exception e) {
            // Log completo da exceção
            e.printStackTrace();
            System.err.println("Erro detalhado: " + e.toString());
            for (StackTraceElement element : e.getStackTrace()) {
                System.err.println("\tat " + element);
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao criar publicação: " + e.getMessage());
        }
    }

    // Método auxiliar para calcular dias a adicionar com base na data de expiração
    private int getDaysToAdd(Date expirationDate) {
        // Esta é uma implementação simplificada. Na prática, você pode querer usar uma lógica mais complexa
        // para determinar os dias com base em um enum ou valor específico enviado pelo frontend.
        // Por enquanto, assumiremos que expirationDate contém a data alvo e calcularemos os dias até ela.
        if (expirationDate != null) {
            long diffInMillies = expirationDate.getTime() - new Date().getTime();
            long days = diffInMillies / (1000 * 60 * 60 * 24);
            return (int) days;
        }
        return 0; // Permanente
    }

    // Update a post by id with password validation
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable String id, @RequestParam String password, @RequestBody Post postDetails) {
        try {
            // Verificar senha
            if (!"yagomelhordomundo".equals(password)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Senha incorreta.");
            }

            Optional<Post> optionalPost = postRepository.findById(id);
            if (!optionalPost.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            Post post = optionalPost.get();
            post.setTitle(postDetails.getTitle());
            post.setContent(postDetails.getContent());
            post.setImageFilename(postDetails.getImageFilename());
            post.setImageFilenames(postDetails.getImageFilenames());
            post.setAuthor(postDetails.getAuthor());
            // Atualizar data de expiração se fornecida
            if (postDetails.getExpirationDate() != null) {
                post.setExpirationDate(postDetails.getExpirationDate());
            }
            // We do not update createdAt to preserve original creation date

            Post updatedPost = postRepository.save(post);
            return ResponseEntity.ok(updatedPost);
        } catch (Exception e) {
            // Log completo da exceção
            e.printStackTrace();
            System.err.println("Erro detalhado: " + e.toString());
            for (StackTraceElement element : e.getStackTrace()) {
                System.err.println("\tat " + element);
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao atualizar publicação: " + e.getMessage());
        }
    }

    // Endpoint para validar senha antes de editar
    @PostMapping("/{id}/validate-password")
    public ResponseEntity<?> validatePassword(@PathVariable String id, @RequestBody PasswordRequest passwordRequest) {
        if ("yagomelhordomundo".equals(passwordRequest.getPassword())) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Senha incorreta.");
        }
    }

    // Delete a post by id with password protection
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable String id, @RequestParam String password) {
        try {
            // Verificar senha
            if (!"yagomelhordomundo".equals(password)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Senha incorreta.");
            }
            
            Optional<Post> optionalPost = postRepository.findById(id);
            if (!optionalPost.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            postRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            // Log completo da exceção
            e.printStackTrace();
            System.err.println("Erro detalhado: " + e.toString());
            for (StackTraceElement element : e.getStackTrace()) {
                System.err.println("\tat " + element);
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao deletar publicação: " + e.getMessage());
        }
    }
}
