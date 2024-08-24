import React, { useState } from 'react';
import axios from 'axios';

const CreateEvent = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('access');
        if (!token) {
            setError('No token found');
            return;
        }

        try {
            await axios.post('http://localhost:8000/api/events/', {
                nombre,
                descripcion,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            setSuccess('Event created successfully');
            setNombre('');
            setDescripcion('');
        } catch (error) {
            setError('Error creating event');
        }
    };

    return (
        <div>
            <h1>Create Event</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Descripción:</label>
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Event</button>
                {error && <div>{error}</div>}
                {success && <div>{success}</div>}
            </form>
        </div>
    );
};

export default CreateEvent;