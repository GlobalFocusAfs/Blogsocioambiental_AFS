import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, ZoomIn, ZoomOut, X } from 'lucide-react';
import { buildImageUrl, handleImageError } from '../utils/imageUrlUtils';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL || 'https://blogsocioambiental-afs-1.onrender.com'}/posts/${id}`);
        setPost(response.data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar a publicação.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL || 'https://blogsocioambiental-afs-1.onrender.com'}/api/posts/${id}/comments`);
        setComments(response.data);
      } catch (err) {
        setError('Erro ao carregar os comentários.');
      }
    };
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentContent.trim()) {
      setCommentError('Por favor, preencha nome e comentário.');
      return;
    }
    setCommentError(null);
    setCommentSubmitting(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL || 'https://blogsocioambiental-afs-1.onrender.com'}/api/posts/${id}/comments`, {
        author: commentAuthor,
        content: commentContent,
      });
      setCommentAuthor('');
      setCommentContent('');
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL || 'https://blogsocioambiental-afs-1.onrender.com'}/api/posts/${id}/comments`);
      setComments(response.data);
    } catch (err) {
      setCommentError('Erro ao enviar o comentário. Tente novamente.');
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletePassword.trim()) {
      setDeleteError('Por favor, informe a senha.');
      return;
    }
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL || 'https://blogsocioambiental-afs-1.onrender.com'}/posts/${id}?password=${deletePassword}`);
      navigate('/');
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setDeleteError('Senha incorreta.');
      } else {
        setDeleteError('Erro ao excluir a publicação.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeletePassword('');
    setDeleteError(null);
  };

  if (loading) {
    return <div className="loading">Carregando publicação...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!post) {
    return <div className="error-message">Publicação não encontrada.</div>;
  }

  return (
    <div className="post-detail-container">
      <h2 className="post-title">{post.title}</h2>
      <div className="post-meta">
        Por {post.author || 'Anônimo'} • {format(new Date(post.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
      </div>
      {post.imageFilename && (
        <img
          src={buildImageUrl(post.imageFilename)}
          alt={post.title}
          className="post-image"
          style={{ cursor: 'pointer' }}
          title="Clique para ver a imagem completa"
          onClick={() => {
            window.open(
              buildImageUrl(post.imageFilename),
              '_blank',
              'noopener,noreferrer'
            );
          }}
          onError={(e) => handleImageError(e, buildImageUrl(post.imageFilename))}
        />
      )}
      <p className="post-content">{post.content}</p>
      
      <div className="post-actions">
        <button className="delete-button" onClick={handleDeleteClick}>
          Excluir Publicação
        </button>
      </div>
      
      <section className="comments-section">
        <h3>Comentários</h3>
        {comments.length === 0 ? (
          <p className="no-comments">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
        ) : (
          <ul className="comments-list">
            {comments.map((comment) => (
            <li key={comment.id} className="comment-item">
                <div className="comment-header">
                  <strong>{comment.author || 'Anônimo'}:</strong>
                  <span className="comment-date">
                    {format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </span>
                </div>
                <p className="comment-content">{comment.content}</p>
              </li>
            ))}
          </ul>
        )}
        
        <form onSubmit={handleCommentSubmit} className="comment-form">
          {commentError && <div className="error-message">{commentError}</div>}
          <div className="form-group">
            <label htmlFor="commentAuthor">Nome</label>
            <input
              id="commentAuthor"
              type="text"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              disabled={commentSubmitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="commentContent">Comentário</label>
            <textarea
              id="commentContent"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              disabled={commentSubmitting}
            />
          </div>
          <button type="submit" className="submit-button" disabled={commentSubmitting}>
            {commentSubmitting ? 'Enviando...' : 'Enviar Comentário'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default PostDetail;
