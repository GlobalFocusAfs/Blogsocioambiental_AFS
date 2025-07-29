package com.example.socioambiental.controller;

import com.example.socioambiental.model.Post;
import com.example.socioambiental.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            e.printStackTrace();
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
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao buscar publicação: " + e.getMessage());
        }
    }

    // Create a new post
    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody Post post) {
        try {
            Post savedPost = postRepository.save(post);
            return new ResponseEntity<>(savedPost, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao criar publicação: " + e.getMessage());
        }
    }

    // Update a post by id
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable String id, @RequestBody Post postDetails) {
        try {
            Optional<Post> optionalPost = postRepository.findById(id);
            if (!optionalPost.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            Post post = optionalPost.get();
            post.setTitle(postDetails.getTitle());
            post.setContent(postDetails.getContent());
            post.setImageFilename(postDetails.getImageFilename());
            post.setAuthor(postDetails.getAuthor());
            // We do not update createdAt to preserve original creation date

            Post updatedPost = postRepository.save(post);
            return ResponseEntity.ok(updatedPost);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao atualizar publicação: " + e.getMessage());
        }
    }

    // Delete a post by id
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable String id) {
        try {
            Optional<Post> optionalPost = postRepository.findById(id);
            if (!optionalPost.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            postRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao deletar publicação: " + e.getMessage());
        }
    }
}
