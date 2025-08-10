import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import PostDetail from './components/PostDetail';
import PostEditForm from './components/PostEditForm';
import { API_BASE_URL } from './utils/apiConfig';
import './styles-sophisticated.css';
import './styles-professional.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`);
      const data = await response.json();
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este post?')) {
      try {
        await fetch(`${API_BASE_URL}/posts/${id}?password=yagomelhordomundo`, {
          method: 'DELETE',
        });
        fetchPosts();
      } catch (error) {
        console.error('Erro ao deletar post:', error);
      }
    }
  };

  return (
    <Router>
      <div className="app-container">
        <header className="blog-header">
          <h1 className="blog-title">Blog Socioambiental</h1>
          <p className="blog-subtitle">Explorando questões ambientais e sustentabilidade</p>
        </header>

        <nav style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '2rem', 
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          borderRadius: '0.75rem'
        }}>
          <Link to="/" style={{ 
            color: '#2563eb', 
            textDecoration: 'none', 
            fontWeight: '600',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            transition: 'background-color 0.2s'
          }}>Home</Link>
          <Link to="/new" style={{ 
            color: '#2563eb', 
            textDecoration: 'none', 
            fontWeight: '600',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            transition: 'background-color 0.2s'
          }}>Novo Post</Link>
        </nav>

        <main>
          {loading ? (
            <div className="posts-grid">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-image"></div>
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ 
                      height: '1.5rem', 
                      background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
                      borderRadius: '0.25rem',
                      marginBottom: '1rem'
                    }}></div>
                    <div style={{ 
                      height: '1rem', 
                      background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
                      borderRadius: '0.25rem'
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<PostList posts={posts} onDelete={handleDelete} />} />
              <Route path="/new" element={<PostForm onPostCreated={fetchPosts} />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/edit/:id" element={<PostEditForm onPostUpdated={fetchPosts} />} />
            </Routes>
          )}
        </main>
      </div>
    </Router>
  );
}

export default App;
