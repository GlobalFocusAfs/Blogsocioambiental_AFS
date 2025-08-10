import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getPreviewImageUrl, handleImageError, getOptimizedImageUrl } from '../utils/imageUrlUtils';

const PostItem = ({ post }) => {
  const navigateToPost = () => {
    window.location.href = `/post/${post.id}`;
  };

  // Função para extrair um trecho do conteúdo
  const getExcerpt = (content, maxLength = 100) => {
    if (!content) return '';
    const stripped = content.replace(/<[^>]*>/g, '');
    return stripped.length > maxLength 
      ? stripped.substring(0, maxLength) + '...' 
      : stripped;
  };

  return (
    <article 
      className="post-card" 
      onClick={navigateToPost}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => { if (e.key === 'Enter') navigateToPost(); }}
      aria-label={`Ler post: ${post.title}`}
    >
      {(post.imageUrl || post.imageFilename) && (
        <div className="post-image-container">
          <img 
            src={getOptimizedImageUrl(post.imageUrl || getPreviewImageUrl(post.imageFilename), 400, 200)} 
            alt={post.title || 'Imagem do post'} 
            className="post-image"
            onError={(e) => {
              handleImageError(e);
            }}
            loading="lazy"
          />
          {post.category && (
            <span className="category-badge">{post.category}</span>
          )}
        </div>
      )}
      
      <div className="post-content">
        <h3 className="post-title">{post.title}</h3>
        <p className="post-excerpt">{getExcerpt(post.content)}</p>
        
        <div className="post-meta">
          <span className="post-author">{post.author || 'Anônimo'}</span>
          <span className="post-date">• {format(new Date(post.createdAt), 'dd/MM/yyyy', { locale: ptBR })}</span>
        </div>
      </div>
    </article>
  );
};

export default PostItem;
