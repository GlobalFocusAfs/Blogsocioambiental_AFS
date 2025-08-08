import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CloudinaryUpload from './CloudinaryUpload';

function PostFormCloudinary({ post: initialPost, onSubmit, onCancel }) {
  const [post, setPost] = useState({
    title: '',
    content: '',
    imageUrl: '',
    imagePublicId: '',
    author: 'Anônimo',
    expirationDays: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (initialPost) {
      setPost({
        title: initialPost.title || '',
        content: initialPost.content || '',
        imageUrl: initialPost.imageUrl || '',
        imagePublicId: initialPost.imagePublicId || '',
        author: initialPost.author || 'Anônimo',
        expirationDays: initialPost.expirationDays || 0
      });
    }
  }, [initialPost]);

  const handleImageUploaded = (imageUrl, publicId) => {
    setPost({
      ...post,
      imageUrl: imageUrl,
      imagePublicId: publicId
    });
  };

  const handleImageRemoved = () => {
    setPost({
      ...post,
      imageUrl: '',
      imagePublicId: ''
    });
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
      const postData = {
        ...post,
        expirationDate: post.expirationDays > 0 
          ? new Date(Date.now() + post.expirationDays * 24 * 60 * 60 * 1000)
          : null
      };
      
      await onSubmit(postData);
    } catch (error) {
      setErrorMessage("Erro ao criar a publicação. Tente novamente.");
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="form-group">
          <label>Imagem (opcional)</label>
          <CloudinaryUpload 
            onImageUploaded={handleImageUploaded}
            onImageRemoved={handleImageRemoved}
            currentImageUrl={post.imageUrl}
          />
        </div>

        {post.imageUrl && (
          <div className="form-group">
            <label>Pré-visualização da Imagem</label>
            <img 
              src={post.imageUrl} 
              alt="Preview" 
              style={{maxWidth: '100%', maxHeight: '200px', marginTop: '10px'}}
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="author">Autor (opcional)</label>
          <input
            type="text"
            id="author"
            name="author"
            value={post.author}
            onChange={(e) => setPost({...post, author: e.target.value})}
            placeholder="Seu nome ou Anônimo"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="expirationDays">Tempo de permanência</label>
          <select
            id="expirationDays"
            name="expirationDays"
            value={post.expirationDays}
            onChange={(e) => setPost({...post, expirationDays: parseInt(e.target.value)})}
            disabled={isSubmitting}
          >
            <option value="0">Publicação permanente</option>
            <option value="10">10 dias</option>
            <option value="20">20 dias</option>
            <option value="30">30 dias</option>
            <option value="60">60 dias</option>
            <option value="90">90 dias</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-button" disabled={isSubmitting}>
            Cancelar
          </button>
          <button type="submit" disabled={isSubmitting} className="submit-button">
            {isSubmitting ? (initialPost ? 'Atualizando...' : 'Publicando...') : (initialPost ? 'Atualizar' : 'Publicar')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostFormCloudinary;
