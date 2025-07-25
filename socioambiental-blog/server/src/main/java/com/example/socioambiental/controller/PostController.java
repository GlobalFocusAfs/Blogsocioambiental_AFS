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
    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    // Get a post by id
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        Optional<Post> post = postRepository.findById(id);
        if (post.isPresent()) {
            return ResponseEntity.ok(post.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Create a new post
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        Post savedPost = postRepository.save(post);
        return new ResponseEntity<>(savedPost, HttpStatus.CREATED);
    }

    // Update a post by id
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable String id, @RequestBody Post postDetails) {
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
    }

    // Delete a post by id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        Optional<Post> optionalPost = postRepository.findById(id);
        if (!optionalPost.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        postRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
