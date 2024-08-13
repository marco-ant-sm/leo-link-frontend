import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const user = {
            nombre: params.get('nombre'),
            apellidos: params.get('apellidos'),
            access: params.get('access'),
            refresh: params.get('refresh')
        };

        // Verifica los datos del usuario
        if (user.nombre && user.apellidos && user.access && user.refresh) {
            localStorage.setItem('user', JSON.stringify({
                nombre: user.nombre,
                apellidos: user.apellidos
            }));
            localStorage.setItem('access', user.access);
            localStorage.setItem('refresh', user.refresh);
            if (window.location.pathname !== '/event') {
                navigate('/event');
            }
        } else {
            if (window.location.pathname !== '/signUp') {
                navigate('/signUp');
            }
        }
    }, [location.search, navigate]);

    return <div>Redirigiendo...</div>;
};

export default LoginSuccess;




// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const LoginSuccess = () => {
//     const navigate = useNavigate();

//     useEffect(() => {
//         const params = new URLSearchParams(window.location.search);
//         const user = {
//             email: params.get('email'),
//             nombre: params.get('nombre'),
//             apellidos: params.get('apellidos'),
//         };

//         console.log('User Data:', user); // Verifica qué datos estás obteniendo

//         if (user.email && user.nombre && user.apellidos) {
//             localStorage.setItem('user', JSON.stringify(user));
//             console.log('exito');
//             navigate('/');
//         } else {
//             console.log('error');
//             navigate('/error');
//         }
//     }, [navigate]);

//     return <div>Redirigiendo...</div>;
// };

// export default LoginSuccess;
