import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

const ImageViewer = ({ images, currentIndex, onClose, onNext, onPrev }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        onPrev();
        break;
      case 'ArrowRight':
        onNext();
        break;
      case '+':
        handleZoomIn();
        break;
      case '-':
        handleZoomOut();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="image-viewer-overlay" onClick={onClose}>
      <div className="image-viewer-container">
        {/* Header com controles */}
        <div className="image-viewer-header">
          <div className="image-counter">
            {currentIndex + 1} / {images.length}
          </div>
          <div className="image-controls">
            <button onClick={handleZoomOut} disabled={zoom <= 0.5}>
              <ZoomOut size={20} />
            </button>
            <span className="zoom-level">{Math.round(zoom * 100)}%</span>
            <button onClick={handleZoomIn} disabled={zoom >= 5}>
              <ZoomIn size={20} />
            </button>
            <button onClick={handleResetZoom}>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Reset</span>
            </button>
            <button onClick={onClose} className="close-button">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Conteúdo principal da imagem */}
        <div 
          className="image-viewer-content"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <img
            src={currentImage}
            alt={`Imagem ${currentIndex + 1}`}
            style={{
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain'
            }}
            draggable={false}
          />
        </div>

        {/* Navegação lateral */}
        {images.length > 1 && (
          <>
            <button 
              className="nav-button nav-prev"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={32} />
            </button>
            <button 
              className="nav-button nav-next"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              disabled={currentIndex === images.length - 1}
            >
              <ChevronRight size={32} />
            </button>
          </>
        )}

        {/* Miniaturas na parte inferior */}
        {images.length > 1 && (
          <div className="image-thumbnails">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Miniatura ${index + 1}`}
                className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  // Adicionar lógica para mudar de imagem
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;
