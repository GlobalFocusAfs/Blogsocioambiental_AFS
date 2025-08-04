package com.example.socioambiental.controller;

import com.example.socioambiental.model.Comment;
import com.example.socioambiental.repository.CommentRepository;
import com.example.socioambiental.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private PostRepository postRepository;

    // Get all comments for a post
    @GetMapping("/{postId}/comments")
    public ResponseEntity<?> getCommentsByPostId(@PathVariable String postId) {
        try {
            // Verificar se a postagem existe
            if (!postRepository.existsById(postId)) {
                return ResponseEntity.notFound().build();
            }
            
            List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            // Log completo da exceção
            e.printStackTrace();
            System.err.println("Erro detalhado: " + e.toString());
            for (StackTraceElement element : e.getStackTrace()) {
                System.err.println("\tat " + element);
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao buscar comentários: " + e.getMessage());
        }
    }

    // Create a new comment for a post
    @PostMapping("/{postId}/comments")
    public ResponseEntity<?> createComment(@PathVariable String postId, @RequestBody Comment comment) {
        try {
            // Verificar se a postagem existe
            if (!postRepository.existsById(postId)) {
                return ResponseEntity.notFound().build();
            }
            
            // Definir o postId no comentário
            comment.setPostId(postId);
            
            // Salvar o comentário
            Comment savedComment = commentRepository.save(comment);
            return new ResponseEntity<>(savedComment, HttpStatus.CREATED);
        } catch (Exception e) {
            // Log completo da exceção
            e.printStackTrace();
            System.err.println("Erro detalhado: " + e.toString());
            for (StackTraceElement element : e.getStackTrace()) {
                System.err.println("\tat " + element);
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao criar comentário: " + e.getMessage());
        }
    }
}
