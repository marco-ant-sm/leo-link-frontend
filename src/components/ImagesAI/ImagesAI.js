// Componente imagenes ia
import React, { useState } from 'react';
import axios from 'axios';

const ImagesAI = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [result, setResult] = useState(null); // Estado para almacenar el resultado

    const handleImageChange = (event) => {
        setSelectedImage(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedImage) return;

        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target.result;
        };

        reader.readAsDataURL(selectedImage);

        img.onload = async () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const targetWidth = 224;
            const targetHeight = 224;
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
            const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight).data;
            const imgArray = Array.from(imgData).map(pixel => pixel / 255.0);

            try {
                const response = await axios.post('http://localhost:5000/api', {
                    imageArray: imgArray,
                });
                
                // Actualiza el estado con el resultado de la respuesta
                setResult(response.data.result);
            } catch (error) {
                console.error('Error uploading image data', error);
            }
        };
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleImageChange} />
                <button type="submit">Enviar imagen</button>
            </form>
            {result && <p>Resultado: {result}</p>} {/* Mostrar el resultado si existe */}
        </div>
    );
};

export default ImagesAI;