package com.example.socioambiental.controller;

import com.example.socioambiental.model.Post;
import com.example.socioambiental.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(PostController.class);

    @GetMapping
    public List<Post> getAllPosts() {
        logger.info("Buscando todos os posts ordenados por data de criação.");
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable String id) {
        try {
            logger.info("Buscando post por id: " + id);
            return postRepository.findById(id)
                    .map(post -> ResponseEntity.ok(post))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Erro ao buscar publicação por id", e);
            return ResponseEntity.status(500).body("Erro interno ao buscar a publicação.");
        }
    }

    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody Post post) {
        try {
            logger.info("Recebendo post para criação: " + post.toString());
            if (post.getTitle() == null || post.getTitle().trim().isEmpty()) {
                logger.warn("Falha na criação do post: título vazio.");
                return ResponseEntity.badRequest().body("O título é obrigatório.");
            }
            if (post.getContent() == null || post.getContent().trim().isEmpty()) {
                logger.warn("Falha na criação do post: conteúdo vazio.");
                return ResponseEntity.badRequest().body("O conteúdo é obrigatório.");
            }
            if (post.getAuthor() == null || post.getAuthor().trim().isEmpty()) {
                post.setAuthor("Anônimo");
            }
            // Validar se imageFilename existe no diretório uploads, mas evitar travar se o arquivo não existir
            if (post.getImageFilename() != null && !post.getImageFilename().trim().isEmpty()) {
                java.nio.file.Path imagePath = java.nio.file.Paths.get("uploads", post.getImageFilename());
                try {
                    if (!java.nio.file.Files.exists(imagePath)) {
                        // Logar aviso, mas não bloquear a criação do post
                        logger.warn("Arquivo de imagem não encontrado no servidor: " + post.getImageFilename());
                    }
                } catch (Exception ex) {
                    logger.error("Erro ao verificar arquivo de imagem: " + post.getImageFilename(), ex);
                }
            }
            post.setCreatedAt(new Date());
            Post savedPost = postRepository.save(post);
            logger.info("Post criado com sucesso: " + savedPost.toString());
            return ResponseEntity.ok(savedPost);
        } catch (Exception e) {
            logger.error("Erro ao criar a publicação", e);
            return ResponseEntity.status(500).body("Erro interno ao criar a publicação.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable String id, @RequestBody Post updatedPost) {
        try {
            return postRepository.findById(id)
                    .map(post -> {
                        if (updatedPost.getTitle() == null || updatedPost.getTitle().trim().isEmpty()) {
                            logger.warn("Falha na atualização do post: título vazio.");
                            return ResponseEntity.badRequest().body("O título é obrigatório.");
                        }
                        if (updatedPost.getContent() == null || updatedPost.getContent().trim().isEmpty()) {
                            logger.warn("Falha na atualização do post: conteúdo vazio.");
                            return ResponseEntity.badRequest().body("O conteúdo é obrigatório.");
                        }
                        post.setTitle(updatedPost.getTitle());
                        post.setContent(updatedPost.getContent());
                        post.setAuthor(updatedPost.getAuthor() == null || updatedPost.getAuthor().trim().isEmpty() ? "Anônimo" : updatedPost.getAuthor());
                        post.setImageFilename(updatedPost.getImageFilename());
                        Post savedPost = postRepository.save(post);
                        logger.info("Post atualizado com sucesso: " + savedPost.toString());
                        return ResponseEntity.ok(savedPost);
                    })
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Erro ao atualizar a publicação", e);
            return ResponseEntity.status(500).body("Erro interno ao atualizar a publicação.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable String id) {
        try {
            if (!postRepository.existsById(id)) {
                logger.warn("Tentativa de exclusão de post inexistente: id=" + id);
                return ResponseEntity.notFound().build();
            }
            postRepository.deleteById(id);
            logger.info("Publicação excluída com sucesso: id=" + id);
            return ResponseEntity.ok().body("Publicação excluída com sucesso.");
        } catch (Exception e) {
            logger.error("Erro ao excluir a publicação", e);
            return ResponseEntity.status(500).body("Erro interno ao excluir a publicação.");
        }
    }
}
