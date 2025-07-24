import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PostItem = ({ post }) => {
  const openPostInNewTab = () => {
    const url = `${window.location.origin}/post/${post.id}`;
    window.open(url, '_blank');
  };

  return (
    <div className="post-card" onClick={openPostInNewTab} style={{ cursor: 'pointer' }}>
      {post.imageFilename && (
        <img 
          src={`http://localhost:8080/uploads/${post.imageFilename}`} 
          alt={post.title} 
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
          Por {post.author || 'Anônimo'} • {format(new Date(post.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
        </div>
        <p>{post.content}</p>
      </div>
    </div>
  );
};

export default PostItem;
