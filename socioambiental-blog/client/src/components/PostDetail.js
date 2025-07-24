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
    </div>
  );
};

export default PostDetail;
