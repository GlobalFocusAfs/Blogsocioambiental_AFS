import React, { useState } from 'react';
import axios from 'axios';

const CloudinaryUpload = ({ onImageUploaded, onImageRemoved, currentImageUrl }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/api/cloudinary/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            onImageUploaded(response.data.url, response.data.publicId);
            setUploading(false);
        } catch (err) {
            setError('Erro ao fazer upload da imagem');
            setUploading(false);
        }
    };

    const handleRemoveImage = async () => {
        if (currentImageUrl && onImageRemoved) {
            onImageRemoved();
        }
    };

    return (
        <div className="cloudinary-upload">
            {!currentImageUrl ? (
                <>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="form-control"
                    />
                    {uploading && <p className="text-info">Enviando imagem...</p>}
                    {error && <p className="text-danger">{error}</p>}
                </>
            ) : (
                <div className="image-preview-container">
                    <p className="text-success">✓ Imagem enviada com sucesso!</p>
                    <button 
                        type="button" 
                        onClick={handleRemoveImage}
                        className="btn btn-danger btn-sm"
                    >
                        Remover Imagem
                    </button>
                </div>
            )}
        </div>
    );
};

export default CloudinaryUpload;
