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
  const [comments, setComments] = useState([]);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editPassword, setEditPassword] = useState('');
  const [editError, setEditError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditConfirm = async () => {
    if (!editPassword.trim()) {
      setEditError('Por favor, informe a senha.');
      return;
    }
    setIsEditing(true);
    setEditError(null);
    try {
      // Validar senha no backend antes de permitir edição
      await axios.post(`${process.env.REACT_APP_API_BASE_URL || 'https://blogsocioambiental-afs-1.onrender.com'}/posts/${id}/validate-password`, {
        password: editPassword,
      });
      setShowEditModal(false);
      setEditPassword('');
      setEditError(null);
      // Redirecionar para página de edição (supondo que exista)
      navigate(`/edit-post/${id}`);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setEditError('Senha incorreta.');
      } else {
        setEditError('Erro ao validar a senha.');
      }
    } finally {
      setIsEditing(false);
    }
  };

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
      {(post.imageUrl || post.imageFilename) && (
        <img
          src={post.imageUrl ? post.imageUrl : buildImageUrl(post.imageFilename)}
          alt={post.title}
          className="post-image"
          style={{ cursor: 'pointer' }}
          title="Clique para ver a imagem completa"
          onClick={() => {
            window.open(
              post.imageUrl ? post.imageUrl : buildImageUrl(post.imageFilename),
              '_blank',
              'noopener,noreferrer'
            );
          }}
          onError={(e) => handleImageError(e, post.imageUrl ? post.imageUrl : buildImageUrl(post.imageFilename))}
        />
      )}
      <p className="post-content">{post.content}</p>
      
      <div className="post-actions">
        <button className="delete-button" onClick={handleDeleteClick}>
          <span>🗑️</span>
          Excluir
        </button>
        <button className="edit-button" onClick={() => setShowEditModal(true)}>
          <span>✏️</span>
          Editar
        </button>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay" onClick={handleDeleteCancel}>
          <div className="modal-content enhanced-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔐 Confirmar Exclusão</h3>
              <button className="modal-close" onClick={handleDeleteCancel}>×</button>
            </div>
            <div className="modal-body">
              <p>Tem certeza que deseja excluir esta publicação?</p>
              <p className="modal-warning">Esta ação não pode ser desfeita.</p>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Digite a senha de exclusão"
                disabled={isDeleting}
                className="modal-input"
              />
              {deleteError && <div className="error-message">{deleteError}</div>}
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={handleDeleteCancel} disabled={isDeleting}>
                Cancelar
              </button>
              <button className="delete-confirm-button" onClick={handleDeleteConfirm} disabled={isDeleting}>
                {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay" onClick={() => { setShowEditModal(false); setEditPassword(''); setEditError(null); }}>
          <div className="modal-content enhanced-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔐 Confirmar Edição</h3>
              <button className="modal-close" onClick={() => { setShowEditModal(false); setEditPassword(''); setEditError(null); }}>×</button>
            </div>
            <div className="modal-body">
              <p>Por favor, confirme sua senha para editar esta publicação.</p>
              <input
                type="password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                placeholder="Digite a senha de edição"
                disabled={isEditing}
                className="modal-input"
              />
              {editError && <div className="error-message">{editError}</div>}
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={() => { setShowEditModal(false); setEditPassword(''); setEditError(null); }} disabled={isEditing}>
                Cancelar
              </button>
              <button className="edit-confirm-button" onClick={handleEditConfirm} disabled={isEditing}>
                {isEditing ? 'Validando...' : 'Confirmar Edição'}
              </button>
            </div>
          </div>
        </div>
      )}
      
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
