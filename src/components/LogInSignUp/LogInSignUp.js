import React, { useState } from 'react';
import './LogInSignUp.css';
import Footer from '../Footer/Footer';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function LogInSignUp() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate(); // Para redirigir después del inicio de sesión

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // standard login
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/token/', formData);
            localStorage.setItem('access', response.data.access); // Almacenar el token
            localStorage.setItem('refresh', response.data.refresh); // Almacenar el token de refresco

            const token = localStorage.getItem('access');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    localStorage.setItem('user', JSON.stringify({
                        email: `${decodedToken.email}`,
                        nombre: `${decodedToken.nombre}`,
                        apellidos: `${decodedToken.apellidos}`
                    }));
                } catch (error) {
                    console.error('Error decoding token:', error);
                }
            }

            navigate('/event'); 
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    };


    // login and register with google
    const onGoogleLoginSuccess = () => {
        const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
        
        // Define tu client_id y redirect_uri directamente
        const CLIENT_ID = '886400823646-j30fpmf338u33sp46dg8khvi27qn9mmc.apps.googleusercontent.com';
        const REDIRECT_URI = 'http://localhost:8000/auth/api/login/google/'; // Cambia esto si es necesario
    
        const scope = [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
        ].join(' ');
    
        const params = {
            response_type: 'code',
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            prompt: 'select_account',
            access_type: 'offline',
            scope
        };
    
        const urlParams = new URLSearchParams(params).toString();
        window.location = `${GOOGLE_AUTH_URL}?${urlParams}`;
    };

    return (
        <div className="container-fluid single-section bg-dark d-flex">
            <Helmet>
                <title>Iniciar Sesión</title>
            </Helmet>
            <div className="container align-self-center justify-content-center d-flex mt-5">
                <div className="row">
                    <div className="col-12 justify-content-center mb-3 mb-md-5 d-flex">
                        <div className="justify-content-center">
                            <img
                                className="logo"
                                src="./img/Logo-Universidad.png"
                                alt="logo universidad de guadalajara"
                            />
                        </div>
                    </div>
                    <div className="justify-content-center text-center text-light">
                        <h1 className="main-title">Leo Link</h1>
                    </div>
                    <div className="col-12 bg-light p-5 form-login bg-dark">
                        <form className="m-auto p-5" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="exampleInputEmail1" className="form-label">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="exampleInputEmail1"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    aria-describedby="emailHelp"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputPassword1" className="form-label">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="exampleInputPassword1"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <button type="submit" className="btn log-in me-2 mt-2 mt-md-0">
                                Iniciar Sesión
                            </button>
                            {/* botón de Google */}
                            <button
                                className="gsi-material-button mt-3 mt-md-0"
                                style={{ width: 180 }}
                                type="button"
                                onClick={onGoogleLoginSuccess}
                            >
                                <div className="gsi-material-button-state" />
                                <div className="gsi-material-button-content-wrapper">
                                    <div className="gsi-material-button-icon">
                                        <svg
                                            version="1.1"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 48 48"
                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                            style={{ display: "block" }}
                                        >
                                            <path
                                                fill="#EA4335"
                                                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                                            />
                                            <path
                                                fill="#4285F4"
                                                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                                            />
                                            <path fill="none" d="M0 0h48v48H0z" />
                                        </svg>
                                    </div>
                                    <span className="gsi-material-button-contents">
                                        Registrarse con Google
                                    </span>
                                    <span style={{ display: "none" }}>Sign up with Google</span>
                                </div>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default LogInSignUp;