import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const RecoverPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            // Guarda el token en el localStorage
            localStorage.setItem('access', token);
            
            // Redirige al usuario a su cuenta
            navigate('/home');
        } else {
            navigate('/');
        }
    }, [token, navigate]);

    return (
        <div>
            <h2>Acceso de recuperación de contraseña</h2>
            <p>Serás redirigido a tu cuenta para cambiar tu contraseña.</p>
        </div>
    );
};

export default RecoverPassword;