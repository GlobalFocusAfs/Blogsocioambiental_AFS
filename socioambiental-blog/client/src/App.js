import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import PostDetail from './components/PostDetail';
import keepAliveService from './utils/keepAlive';
import './styles.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
    
    // Iniciar serviço de keep-alive apenas em produção
    if (process.env.NODE_ENV === 'production') {
      keepAliveService.start();
    }

    // Limpar quando o componente desmontar
    return () => {
      if (process.env.NODE_ENV === 'production') {
        keepAliveService.stop();
      }
    };
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL || 'https://blogsocioambiental-afs-1.onrender.com'}/posts`);
      // O backend já retorna os posts ordenados, então não precisa ordenar no frontend
      setPosts(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Erro ao carregar as publicações. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPost = async (post) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL || 'https://blogsocioambiental-afs-1.onrender.com'}/posts`, post);
      fetchPosts(); // Atualiza a lista após criar novo post
      setShowModal(false); // Fecha o modal
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Erro ao criar a publicação. Verifique os dados e tente novamente.');
    }
  };

  const handleUpdatePost = async (postId, updatedPost) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL || 'https://blogsocioambiental-afs-1.onrender.com'}/posts/${postId}`, updatedPost);
      fetchPosts(); // Atualiza a lista após atualizar o post
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Erro ao atualizar a publicação. Verifique os dados e tente novamente.');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL || 'https://blogsocioambiental-afs-1.onrender.com'}/posts/${postId}`);
      fetchPosts(); // Atualiza a lista após deletar
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Erro ao excluir a publicação.');
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Blog de Responsabilidade Socioambiental</h1>
        <p>Compartilhe ideias e ações para um mundo melhor</p>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={
            <>
              {error && <div className="error-message">{error}</div>}

              {isLoading ? (
                <div className="loading">Carregando publicações...</div>
              ) : (
                <>
                  <h2 className="section-title">Últimas Publicações</h2>
                  {posts.length === 0 ? (
                    <p className="no-posts">Nenhuma publicação encontrada. Seja o primeiro a compartilhar!</p>
                  ) : (
                    <PostList 
                      posts={posts} 
                      onDelete={handleDeletePost} 
                    />
                  )}
                  <div style={{textAlign: 'center', marginTop: '40px'}}>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => setShowModal(true)}
                    >
                      📝 Criar Nova Publicação
                    </button>
                  </div>
                </>
              )}

              {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                      <h2>Criar Nova Publicação</h2>
                      <button 
                        className="modal-close" 
                        onClick={() => setShowModal(false)}
                      >
                        ×
                      </button>
                    </div>
                    <div style={{padding: '20px 30px 30px 30px'}}>
                      <PostForm 
                        onSubmit={handleNewPost} 
                        onCancel={() => setShowModal(false)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          } />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/post/:id/edit" element={
            <EditPostWrapper 
              onUpdate={handleUpdatePost} 
            />
          } />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Blog Socioambiental - Todos os direitos reservados</p>
      </footer>
    </div>
  );
}

/* Estilos para o footer */
const footerStyle = {
  backgroundColor: '#1b5e20',
  color: 'white',
  textAlign: 'center',
  padding: '20px',
  marginTop: 'auto',
  fontSize: '0.9rem'
};

const AppFooter = () => (
  <footer style={footerStyle}>
    <p>© {new Date().getFullYear()} Blog Socioambiental - Todos os direitos reservados</p>
  </footer>
);

function EditPostWrapper({ onUpdate }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL || 'https://blogsocioambiental-afs-1.onrender.com'}/posts/${id}`);
        setPost(response.data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar a publicação para edição.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (updatedPost) => {
    await onUpdate(id, updatedPost);
    navigate(`/post/${id}`);
  };

  if (loading) {
    return <div className="loading">Carregando publicação para edição...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!post) {
    return <div className="error-message">Publicação não encontrada.</div>;
  }

  return (
    <PostForm 
      post={post} 
      onSubmit={handleSubmit} 
      onCancel={() => navigate(`/post/${id}`)} 
    />
  );
}

export default App;
