import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, ZoomIn, ZoomOut, X } from 'lucide-react';
import { buildImageUrl, handleImageError, getOptimizedImageUrl } from '../utils/imageUrlUtils';

const PostDetailFixed = () => {
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
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://blogsocioambiental-afs-1.onrender.com'}/posts/${id}/validate-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: editPassword }),
      });

      if (response.ok) {
        // Password is correct, navigate to edit page
        setShowEditModal(false);
        setEditPassword('');
        setEditError(null);
        navigate(`/edit-post/${id}`);
      } else if (response.status === 403) {
        setEditError('Senha incorreta.');
      } else {
        setEditError('Erro ao validar a senha.');
      }
    } catch (err) {
      console.error('Error validating password:', err);
      setEditError('Erro de conexão. Tente novamente.');
    } finally {
      setIsEditing(false);
    }
  };

  // Rest of the component remains the same...
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
          src={getOptimizedImageUrl(post.imageUrl || buildImageUrl(post.imageFilename), 800, 400)}
          alt={post.title}
          className="post-image"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      )}
      
      <p className="post-content">{post.content}</p>
      
      <div className="post-actions">
        <button className="edit-button" onClick={() => setShowEditModal(true)}>
          ✏️ Editar
        </button>
      </div>

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>🔐 Confirmar Edição</h3>
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
            
            <div className="modal-actions">
              <button onClick={() => {
                setShowEditModal(false);
                setEditPassword('');
                setEditError(null);
              }} disabled={isEditing}>
                Cancelar
              </button>
              <button onClick={handleEditConfirm} disabled={isEditing || !editPassword.trim()}>
                {isEditing ? 'Validando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetailFixed;
