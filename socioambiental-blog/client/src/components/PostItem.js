import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PostItem = ({ post, imageBaseUrl = `${process.env.REACT_APP_API_BASE_URL || 'https://nova-pasta-actz.onrender.com'}/uploads` }) => {
  const navigateToPost = () => {
    window.location.href = `/post/${post.id}`;
  };

  return (
    <div className="post-card" onClick={navigateToPost} style={{ cursor: 'pointer' }} role="button" tabIndex={0} onKeyPress={(e) => { if (e.key === 'Enter') navigateToPost(); }}>
      {post.imageFilename && (
        <img 
          src={`${imageBaseUrl}/${post.imageFilename}`} 
          alt={post.title ? post.title : 'Imagem do post'} 
          className="post-image"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.alt = 'Imagem não disponível';
          }}
        />
      )}
      <div className="post-content">
        <h3 className="post-title">{post.title}</h3>
        <div className="post-meta">
          <span className="post-author">Por {post.author || 'Anônimo'}</span>
          <span className="post-date">{format(new Date(post.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
        </div>
        <p>{post.content}</p>
      </div>
    </div>
  );
};

export default PostItem;
