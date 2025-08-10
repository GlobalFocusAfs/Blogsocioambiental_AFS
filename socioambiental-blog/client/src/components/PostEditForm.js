import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PostEditForm({ post: initialPost, onSubmit, onCancel }) {
  const [post, setPost] = useState({
    title: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (initialPost) {
      setPost({
        title: initialPost.title || '',
        content: initialPost.content || ''
      });
    }
  }, [initialPost]);

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
      // Enviar apenas título e conteúdo para atualização
      const postData = {
        title: post.title,
        content: post.content
      };
      
      await onSubmit(postData);
    } catch (error) {
      setErrorMessage("Erro ao atualizar a publicação. Verifique os dados e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Editar Publicação</h2>
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
            rows="10"
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-button" disabled={isSubmitting}>
            Cancelar
          </button>
          <button type="submit" disabled={isSubmitting} className="submit-button">
            {isSubmitting ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostEditForm;
