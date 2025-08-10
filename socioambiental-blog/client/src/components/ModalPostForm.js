import React, { useState } from 'react';
import PostForm from './PostForm';
import './ModalPostForm.css';

function ModalPostForm({ isOpen, onClose, onPostCreated }) {
  if (!isOpen) return null;

  const handlePostCreated = async (postData) => {
    try {
      await onPostCreated(postData);
      onClose();
    } catch (error) {
      console.error('Erro ao criar post:', error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>Nova Publicação</h2>
        <PostForm onSubmit={handlePostCreated} onCancel={onClose} />
      </div>
    </div>
  );
}

export default ModalPostForm;
