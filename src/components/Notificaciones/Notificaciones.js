import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notificaciones = () => {
    const [notificaciones, setNotificaciones] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        let socket;

        const connectWebSocket = () => {
            const token = localStorage.getItem('access');
            socket = new WebSocket(`ws://localhost:8000/ws/notifications/?token=${token}`);
        
            socket.onopen = () => {
                console.log('WebSocket conectado');
            };
        
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log('Nueva notificación recibida:', data.message);
                fetchNotificaciones(); // Volver a cargar las notificaciones
            };
        
            socket.onerror = (error) => {
                console.error('Error en WebSocket:', error);
                setError('Error en la conexión WebSocket');
            };
        
            socket.onclose = (event) => {
                console.log('WebSocket desconectado. Intentando reconectar...', event.code, event.reason);
                setTimeout(connectWebSocket, 3000);
            };
        };

        connectWebSocket();

        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, []);

    const fetchNotificaciones = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/notificaciones/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }
            });
            setNotificaciones(response.data);
        } catch (error) {
            setError('Error obteniendo las notificaciones');
        }
    };

    useEffect(() => {
        fetchNotificaciones();
    }, []);

    return (
        <div>
            <h2>Tus notificaciones</h2>
            {error && <p>{error}</p>}
            <ul>
                {notificaciones.map((notificacion, index) => (
                    <li key={index}>{notificacion.mensaje}</li>
                ))}
            </ul>
        </div>
    );
};

export default Notificaciones;