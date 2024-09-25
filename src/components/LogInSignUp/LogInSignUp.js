import React, { useState, useEffect } from 'react';
import './LogInSignUp.css';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

function LogInSignUp() {

    const navigate = useNavigate(); // Para redirigir después del inicio de sesión

    useEffect(() => {
        document.body.style.overflow = 'auto'; // Asegúrate de que el overflow esté habilitado
        return () => {
            document.body.style.overflow = ''; // Limpia el estilo cuando el componente se desmonta
        };
    }, []);
    
    //Var to show password
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });


    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // standard login
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validación de campos vacíos
        if (!formData.email || !formData.password) {
            setAlert({
                show: true,
                message: 'Por favor ingrese todos los campos.',
                type: 'danger'
            });
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:8000/api/token/', formData);
            localStorage.setItem('access', response.data.access); 
            localStorage.setItem('refresh', response.data.refresh);
    
            const token = localStorage.getItem('access');
            if (token) {
                const decodedToken = jwtDecode(token);
                localStorage.setItem('user', JSON.stringify({
                    nombre: decodedToken.nombre,
                    apellidos: decodedToken.apellidos
                }));
            }
    
            navigate('/home'); 
        } catch (error) {
            console.error('Error al iniciar sesión:', error.response);
            if (error.response) {
                const errorMessage = error.response.data.message || 'Error al iniciar sesión, usuario o contraseña incorrectos.';
                setAlert({
                    show: true,
                    message: errorMessage,
                    type: 'danger'
                });
            } else {
                setAlert({
                    show: true,
                    message: 'Error en el servidor. Intente más tarde.',
                    type: 'danger'
                });
            }
        }
    };
    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     //Empty fields validation
    //     if (!formData.email || !formData.password) {
    //         setAlert({
    //             show: true,
    //             message: 'Por favor ingrese todos los campos.',
    //             type: 'danger'
    //         });
    //         return;
    //     }

    //     try {
    //         const response = await axios.post('http://localhost:8000/api/token/', formData);
    //         localStorage.setItem('access', response.data.access); // Almacenar el token
    //         localStorage.setItem('refresh', response.data.refresh); // Almacenar el token de refresco

    //         const token = localStorage.getItem('access');
    //         if (token) {
    //             try {
    //                 const decodedToken = jwtDecode(token);
    //                 localStorage.setItem('user', JSON.stringify({
    //                     nombre: `${decodedToken.nombre}`,
    //                     apellidos: `${decodedToken.apellidos}`
    //                 }));
    //             } catch (error) {
    //                 console.error('Error decoding token:', error);
    //             }
    //         }

    //         navigate('/home'); 
    //     } catch (error) {
    //         console.error('Error al iniciar sesión:', error);
    //         setAlert({
    //             show: true,
    //             message: 'Error al iniciar sesión, usuario o contraseña incorrectos.',
    //             type: 'danger'
    //         });
    //     }
    // };


    // login and register with google
    const onGoogleLoginSuccess = () => {
        const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
        
        // Client_id and redirect_uri
        const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
        const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
        console.log(CLIENT_ID);
        console.log(REDIRECT_URI);
    
        const scope = [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
        ].join(' ');
    
        const params = {
            response_type: 'code',
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            prompt: 'consent',
            access_type: 'offline',
            scope
        };
    
        const urlParams = new URLSearchParams(params).toString();
        window.location = `${GOOGLE_AUTH_URL}?${urlParams}`;
    };

    //Validate domain
    const location = useLocation(); // Para obtener parámetros de la URL

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const error = query.get('error');
        
        if (error === 'invalid_domain') {
            setAlert({
                show: true,
                message: 'Necesita logearse con un dominio de la red universitaria.',
                type: 'danger'
            });
        }
    }, [location.search]);

    //Recuperar Contraseña
    const [email, setEmail] = useState('');

    const handlePasswordRecovery = async (e) => {
        e.preventDefault();

         // Validar si el correo pertenece a los dominios de Google institucionales
         const forbiddenDomains = ['@alumnos.udg.mx', '@academicos.udg.mx'];
         const emailDomain = email.substring(email.lastIndexOf("@"));
 
         if (forbiddenDomains.includes(emailDomain)) {
             Swal.fire({
                 title: 'Correo no permitido',
                 text: 'No se puede recuperar la contraseña para correos institucionales de Google. Por favor, utiliza otro correo.',
                 icon: 'error',
                 confirmButtonText: 'Aceptar'
             });
             return; // Evita que se haga la petición a la API
         }

        try {
            const response = await axios.post('http://localhost:8000/api/recover-password/', { email });
            
            // Si el correo se envió exitosamente
            Swal.fire({
                title: 'Correo enviado',
                text: 'Se ha enviado un correo para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
        } catch (error) {
            if (error.response && error.response.status === 400) {
                // Si el correo no está registrado
                Swal.fire({
                    title: 'Correo no registrado',
                    text: 'El correo electrónico no está asociado a ninguna cuenta. Por favor, verifica y prueba de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            } else {
                // Si hay un error en el servidor u otro tipo de error
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al intentar enviar el correo. Por favor, inténtalo nuevamente más tarde.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        }
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
                            {/* Show alert */}
                            {alert.show && (
                                            <div className={`alert alert-${alert.type} alert-dismissible fade show text-center px-1`} role="alert">
                                                {alert.message}
                                            </div>
                                        )}
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
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputPassword1" className="form-label">
                                    Contraseña
                                </label>
                                <div className="position-relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="form-control pe-5"
                                        id="exampleInputPassword1"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-light position-absolute top-50 end-0 translate-middle-y border-0"
                                        style={{ right: '10px', transform: 'translateY(-50%)' }}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <i className="bi bi-eye-slash"></i>
                                        ) : (
                                            <i className="bi bi-eye"></i>
                                        )}
                                    </button>
                                </div>

                                <div className="text-end mt-1">
                                    <button
                                        type="button"
                                        className="btn btn-link p-0"
                                        style={{ textDecoration: 'none', color: 'white' }} // Añadir estilos aquí
                                        data-bs-toggle="modal"
                                        data-bs-target="#recoverPassword"
                                    >
                                        <p className='main-info-title m-0'>Recuperar contraseña</p>
                                    </button>
                                </div>
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
           {/* Modal Recuperar Contraseña */}
            <div className="modal fade" id="recoverPassword" tabIndex="-1" aria-labelledby="recoverPasswordModalLabel" aria-hidden="true">
                <style>
                    {`
                        .custom-modal {
                            border: 3px solid black; /* Borde negro alrededor del modal */
                        }

                        .modal-backdrop {
                            background-color: rgba(66, 112, 140, 0.8) !important; /* Sombra más clara (blanca) */
                        }
                    `}
                </style>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content custom-modal">
                        <div className="modal-header border-0">
                            <h5 className="modal-title" id="recoverPasswordModalLabel">Recuperar Contraseña</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handlePasswordRecovery}> 
                                <div className="mb-3">
                                    <label htmlFor="emailInput" className="form-label">Correo Electrónico</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        id="emailInput" 
                                        placeholder="Ingrese su correo electrónico" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100 log-in">Recuperar Contraseña</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LogInSignUp;