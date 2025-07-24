import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PostForm({ post: initialPost, onSubmit, onCancel }) {
  const [post, setPost] = useState({
    title: '',
    content: '',
    imageFilename: '',
    author: 'Anônimo'
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (initialPost) {
      setPost({
        title: initialPost.title || '',
        content: initialPost.content || '',
        imageFilename: initialPost.imageFilename || '',
        author: initialPost.author || 'Anônimo'
      });
      if (initialPost.imageFilename) {
        setPreviewImage(`http://localhost:8080/uploads/${initialPost.imageFilename}`);
      }
    }
  }, [initialPost]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setPost({...post, imageFilename: ''});
      setPreviewImage(null);
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8080/api/upload', formData);
      setPost({...post, imageFilename: response.data.filename || response.data});
      
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload failed:", error);
      setErrorMessage("Erro ao enviar imagem. Tente novamente.");
      setPost({...post, imageFilename: ''});
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setPost({...post, imageFilename: ''});
    setPreviewImage(null);
    setErrorMessage(null);
    if (onCancel) onCancel();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!post.title.trim()) {
      setErrorMessage("O título é obrigatório.");
      return;
    }
    if (!post.content.trim()) {
      setErrorMessage("O conteúdo é obrigatório.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(post);
    } catch (error) {
      setErrorMessage("Erro ao criar a publicação. Verifique os dados e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{initialPost ? 'Editar Publicação' : 'Nova Publicação'}</h2>
      {errorMessage && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título</label>
          <input
            type="text"
            id="title"
            name="title"
            value={post.title}
            onChange={(e) => setPost({...post, title: e.target.value})}
            disabled={isSubmitting || isUploading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Conteúdo</label>
          <textarea
            id="content"
            name="content"
            value={post.content}
            onChange={(e) => setPost({...post, content: e.target.value})}
            disabled={isSubmitting || isUploading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageFile">Imagem (opcional)</label>
          <input
            type="file"
            id="imageFile"
            name="imageFile"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading || isSubmitting}
          />
          {isUploading && <p>Enviando imagem...</p>}
          {previewImage && (
            <img 
              src={previewImage} 
              alt="Preview" 
              style={{maxWidth: '100%', maxHeight: '200px', marginTop: '10px'}}
            />
          )}
        </div>

        <div className="form-group">
          <label htmlFor="author">Autor (opcional)</label>
          <input
            type="text"
            id="author"
            name="author"
            value={post.author}
            onChange={(e) => setPost({...post, author: e.target.value})}
            placeholder="Seu nome ou Anônimo"
            disabled={isSubmitting || isUploading}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="cancel-button" disabled={isSubmitting || isUploading}>
            Cancelar
          </button>
          <button type="submit" disabled={isUploading || isSubmitting} className="submit-button">
            {isSubmitting ? (initialPost ? 'Atualizando...' : 'Publicando...') : (initialPost ? 'Atualizar' : 'Publicar')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostForm;
