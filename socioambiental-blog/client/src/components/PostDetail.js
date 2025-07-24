import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/posts/${id}`);
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
        const response = await axios.get(`http://localhost:8080/api/posts/${id}/comments`);
        setComments(response.data);
      } catch (err) {
        console.error('Erro ao carregar comentários:', err);
      }
    };
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError(null);

    if (!commentContent.trim()) {
      setCommentError('O conteúdo do comentário é obrigatório.');
      return;
    }

    setCommentSubmitting(true);
    try {
      await axios.post(`http://localhost:8080/api/posts/${id}/comments`, {
        author: commentAuthor.trim() || 'Anônimo',
        content: commentContent.trim(),
      });
      setCommentAuthor('');
      setCommentContent('');
      // Refresh comments
      const response = await axios.get(`http://localhost:8080/api/posts/${id}/comments`);
      setComments(response.data);
    } catch (err) {
      setCommentError('Erro ao enviar comentário. Tente novamente.');
    } finally {
      setCommentSubmitting(false);
    }
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
    <div className="post-detail-container" style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <button
        onClick={() => {
          navigate('/');
        }}
        style={{ marginBottom: '20px', cursor: 'pointer' }}
      >
        &larr; Voltar
      </button>
      <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: '700', fontSize: '2.5rem', marginBottom: '10px' }}>{post.title}</h1>
      <div style={{ color: '#666', fontStyle: 'italic', marginBottom: '20px' }}>
        Por {post.author || 'Anônimo'} • {format(new Date(post.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
      </div>
      {post.imageFilename && (
        <img
          src={`http://localhost:8080/uploads/${post.imageFilename}`}
          alt={post.title}
          style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', marginBottom: '20px' }}
        />
      )}
      <p style={{ fontSize: '1.2rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{post.content}</p>

      <button
        onClick={() => {
          const password = window.prompt('Digite a senha para editar a publicação:');
          if (password === 'yagomelhordomundo') {
            navigate(`/post/${id}/edit`);
          } else {
            alert('Senha incorreta.');
          }
        }}
        style={{
          marginTop: '30px',
          marginRight: '10px',
          padding: '10px 20px',
          fontSize: '1rem',
          cursor: 'pointer',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        Editar
      </button>
      <button
        onClick={async () => {
          const password = window.prompt('Digite a senha para excluir a publicação:');
          if (password === 'yagomelhordomundo') {
            try {
              await axios.delete(`http://localhost:8080/api/posts/${id}`);
              alert('Publicação excluída com sucesso.');
              navigate('/');
            } catch (error) {
              alert('Erro ao excluir a publicação. Tente novamente.');
            }
          } else {
            alert('Senha incorreta.');
          }
        }}
        style={{
          marginTop: '30px',
          padding: '10px 20px',
          fontSize: '1rem',
          cursor: 'pointer',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        Excluir
      </button>

      {/* Comments Section */}
      <div className="comments-section" style={{ marginTop: '40px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: '700', fontSize: '2rem', marginBottom: '20px' }}>Comentários</h2>
        {comments.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: '#666' }}>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment" style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #ccc' }}>
              <p style={{ margin: '0 0 5px 0', fontWeight: '700', color: '#2e7d32' }}>{comment.author || 'Anônimo'}</p>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{comment.content}</p>
              <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '5px' }}>
                {format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
              </p>
            </div>
          ))
        )}

        {/* Add Comment Form */}
        <form onSubmit={handleCommentSubmit} style={{ marginTop: '30px' }}>
          {commentError && <p style={{ color: 'red', marginBottom: '10px' }}>{commentError}</p>}
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="commentAuthor" style={{ display: 'block', fontWeight: '700', marginBottom: '5px' }}>Nome (opcional)</label>
            <input
              id="commentAuthor"
              type="text"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              placeholder="Seu nome ou Anônimo"
              style={{ width: '100%', padding: '8px', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
              disabled={commentSubmitting}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="commentContent" style={{ display: 'block', fontWeight: '700', marginBottom: '5px' }}>Comentário</label>
            <textarea
              id="commentContent"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Escreva seu comentário aqui..."
              rows={4}
              style={{ width: '100%', padding: '8px', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
              disabled={commentSubmitting}
              required
            />
          </div>
          <button
            type="submit"
            disabled={commentSubmitting}
            style={{
              backgroundColor: '#4caf50',
              color: 'white',
              padding: '10px 20px',
              fontSize: '1rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {commentSubmitting ? 'Enviando...' : 'Enviar Comentário'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostDetail;
