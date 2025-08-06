package com.example.socioambiental.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;

@Document(collection = "posts")
public class Post {
    @Id
    private String id;
    private String title;
    private String content;
    private String imageFilename;  // Mantido para compatibilidade
    private List<String> imageFilenames; // Novo campo para múltiplas imagens
    private Date createdAt;
    private String author;
    private Date expirationDate; // Nova propriedade para data de expiração
    
    // Constructors
    public Post() {
        this.createdAt = new Date(); // Auto-set creation date
    }

    public Post(String title, String content, String imageFilename, String author) {
        this.title = title;
        this.content = content;
        this.imageFilename = imageFilename;
        this.author = author;
        this.createdAt = new Date();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getImageFilename() {
        return imageFilename;
    }

    public void setImageFilename(String imageFilename) {
        this.imageFilename = imageFilename;
    }

    public List<String> getImageFilenames() {
        return imageFilenames;
    }

    public void setImageFilenames(List<String> imageFilenames) {
        this.imageFilenames = imageFilenames;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Date getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(Date expirationDate) {
        this.expirationDate = expirationDate;
    }

    // toString() method for debugging
    @Override
    public String toString() {
        return "Post{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", imageFilename='" + imageFilename + '\'' +
                ", createdAt=" + createdAt +
                ", author='" + author + '\'' +
                ", expirationDate=" + expirationDate +
                '}';
    }
}
