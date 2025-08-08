import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getImageUrl } from '../utils/imageUtils';

const PostItem = ({ post }) => {
  const navigateToPost = () => {
    window.location.href = `/post/${post.id}`;
  };

  return (
    <div className="post-card" onClick={navigateToPost} style={{ cursor: 'pointer' }} role="button" tabIndex={0} onKeyPress={(e) => { if (e.key === 'Enter') navigateToPost(); }}>
      {post.imageFilename && (
        <img 
          src={getImageUrl(post.imageFilename)} 
          alt={post.title || 'Imagem do post'} 
          className="post-image"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkltYWdlbSBuw6NvIGVuc29yYWRhPC90ZXh0Pgo8L3N2Zz4K';
            e.target.alt = 'Imagem não disponível';
          }}
        />
      )}
      <div className="post-content">
        <h3 className="post-title">{post.title}</h3>
        <div className="post-meta" aria-label={`Autor: ${post.author || 'Anônimo'}, Data: ${format(new Date(post.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`}>
          Por {post.author || 'Anônimo'} • {format(new Date(post.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
        </div>
        <p>{post.content}</p>
      </div>
    </div>
  );
};

export default PostItem;
