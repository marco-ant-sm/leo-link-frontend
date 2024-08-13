
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ element: Component, ...rest }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access');
            if (token) {
                try {
                    // Realiza una solicitud al backend para validar el token
                    const response = await axios.get('http://localhost:8000/api/validate_token/', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setIsAuthenticated(response.status === 200); // Establece autenticación basada en la respuesta
                } catch {
                    setIsAuthenticated(false); // Considera que no está autenticado si hay un error
                }
            } else {
                setIsAuthenticated(false);
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? Component : <Navigate to="/signUp" />;
};

export default PrivateRoute;
