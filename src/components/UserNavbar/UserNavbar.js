import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {toast} from 'react-hot-toast';
import axios from 'axios';
import './UserNavbar.css';
import Swal from 'sweetalert2';

function UserNavbar() {
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();
    //Categorias de eventos
    const [categoriasE, setCategoriasE] = useState([]);
    const [categoriasB, setCategoriasB] = useState([]);
    const [categoriasD, setCategoriasD] = useState([]);
    const [categoriasP, setCategoriasP] = useState([]);
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
    const [notificaciones, setNotificaciones] = useState([]);

    const [showNotification, setShowNotification] = useState(false);

    //Editar perfil de usuario
    const [descripcion, setDescripcion] = useState('');
    const [imagen, setImagen] = useState(null);
    const [currentUserData, setCurrentUserData] = useState({});
    const [eliminarImagen, setEliminarImagen] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [fileInputKey, setFileInputKey] = useState(0);
    const [telefono, setTelefono] = useState('');

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('access');

        if (!token) {
            setError('No se encontró token de autenticación');
            return;
        }

        try {
            const response = await axios.get('http://localhost:8000/api/user/profile/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setCurrentUserData(response.data);
            setDescripcion(response.data.descripcion);
            setTelefono(response.data.telefono);
            const fullName = `${response.data.nombre} ${response.data.apellidos}`;
            setUserName(fullName);

        } catch (error) {
            setError('Error al obtener el perfil del usuario');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);


    //Verificar si la imagen es apropiada
    const verificarImagen = async (imagen) => {
        const img = new Image();
        const reader = new FileReader();
    
        return new Promise((resolve, reject) => {
            reader.onload = (e) => {
                img.src = e.target.result;
            };
    
            img.onload = async () => {
                const canvas = document.createElement('canvas');
                canvas.width = 224;
                canvas.height = 224;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, 224, 224);
                const imgData = ctx.getImageData(0, 0, 224, 224).data;
                const imgArray = Array.from(imgData).map(pixel => pixel / 255.0);
    
                try {
                    const response = await axios.post('http://localhost:5000/api', { imageArray: imgArray });
                    resolve(response.data.result);
                } catch {
                    reject('Error verificando la imagen');
                }
            };
    
            reader.readAsDataURL(imagen);
        });
    };

    
    const handleUserUpdateSubmit = async (event) => {
        event.preventDefault();

        //validar imagen
        if (imagen) {
            Swal.fire({
                title: 'Validando contenido de la imagen...',
                html: '<style>.swal2-html { max-height: 150px; overflow: hidden; }</style>' +
                      '<div class="d-flex justify-content-center">' +
                      '<div class="spinner-border text-success" role="status">' +
                      '<span class="visually-hidden">Cargando...</span>' +
                      '</div></div>',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                const resultadoVerificacion = await verificarImagen(imagen);
                if (resultadoVerificacion === 'Desnudos.') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'La imagen es inapropiada. Por favor, selecciona otra.',
                    });
                    return;
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error,
                });
                return;
            }
        }
    
        const token = localStorage.getItem('access');
        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se encontró token de autenticación',
            });
            return;
        }
    
        const formData = new FormData();
        formData.append('descripcion', descripcion);
        formData.append('telefono', telefono);
    
        // Reset imagen if it's not being sent
        if (eliminarImagen && !imagen) {
            formData.append('eliminar_imagen', true);
        } else if (imagen) {
            formData.append('imagen', imagen);
        }
    
        try {
            await axios.patch(`http://localhost:8000/api/user/update-user-profile/`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            // Reset fields
            setImagen(null); // Reset image selection
            setEliminarImagen(false); // Uncheck the delete checkbox
            setDescripcion(''); // Clear the description
            setFileInputKey(prevKey => prevKey + 1);
    
            // Fetch the updated user profile
            await fetchUserProfile(); // Asegúrate de que esta función esté definida en tu componente
    
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Perfil actualizado correctamente',
            });
        } catch (error) {
            const errorMessage = error.response?.data?.errors 
                ? Object.values(error.response.data.errors).flat().join(', ') 
                : 'Error al actualizar el perfil';
    
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
            });
        }
    };

    // Función para manejar el clic en el botón
    const handleNotificationButtonClick = async () => {
        try {
            await axios.post('http://localhost:8000/api/notificaciones/marcar-leidas/', {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }
            });
            // Después de marcar las notificaciones como leídas, actualiza el estado para que no se muestre el indicador
            setShowNotification(false);
            // Actualiza las notificaciones
            fetchNotificaciones();
        } catch (error) {
            console.error('Error marcando notificaciones como leídas', error);
        }
    };

    //Fake

    const showEvents = () => {
        navigate('/showAllevents');
        const closeButton = document.querySelector('.btn-close');
        closeButton?.click();
    };

    const showDescuentos = () => {
        navigate('/showAllDescuentos');
        const closeButton = document.querySelector('.btn-close');
        closeButton?.click();
    };

    const showPracticas = () => {
        navigate('/showAllPracticas');
        const closeButton = document.querySelector('.btn-close');
        closeButton?.click();
    };

    const goHome = () => {
        navigate('/home');
        const closeButton = document.querySelector('.btn-close');
        closeButton?.click();
    };

    const showBeneficios = () => {
        navigate('/showAllBeneficios');
        const closeButton = document.querySelector('.btn-close');
        closeButton?.click();
    };

    //Funcion para buscar en la barra de busqueda
    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Evita el envío del formulario y la recarga de la página
    
        const searchInput = e.target.elements.search.value;
        const category = e.target.elements.category.value;
    
        if (category === '1') {
            navigate(`/showAllEvents?search=${encodeURIComponent(searchInput)}`);        
        }else if (category === '3') {
            navigate(`/showAllBeneficios?search=${encodeURIComponent(searchInput)}`);
        }else if (category === '2') {
            navigate(`/showAllDescuentos?search=${encodeURIComponent(searchInput)}`);
        }else if (category === '4') {
            navigate(`/showAllPracticas?search=${encodeURIComponent(searchInput)}`);
        }else{
            toast.error('Elige una categoria para buscar', { style: {
                background:"#101010",
                color:"#fff",
                bordeRadius:"5px"
            }
            });
            return;
        }
    };

    useEffect(() => {
        document.body.style.overflow = 'auto';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    useEffect(() => {
        // Limpia el padding-right y overflow en el body
        const originalPaddingRight = document.body.style.paddingRight;
        const originalOverflow = document.body.style.overflow;
        
        document.body.style.paddingRight = '0';
        document.body.style.overflow = 'auto';

        return () => {
            document.body.style.paddingRight = originalPaddingRight;
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    useEffect(() => {

        // Function to handle keydown events
        const handleKeyDown = (event) => {
          // Check if the pressed key is 'a' or 'A'
          if (event.key === 'a' || event.key === 'A') {
            // Ignore the action if the focus is on an input field
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
              return;
            }
            
            // Get the button that toggles the offcanvas menu
            const toggleButton = document.querySelector('.navbar-toggler');
            // Get the button that closes the offcanvas menu
            const closeButton = document.querySelector('.btn-close');
            // Get the offcanvas element
            const offcanvas = document.querySelector('#offcanvasDarkNavbar');
            
            // Check if the offcanvas menu is currently visible
            if (offcanvas.classList.contains('show')) {
              // If the offcanvas menu is visible, simulate a click on the close button
              closeButton?.click();
            } else {
              // If the offcanvas menu is not visible, simulate a click on the toggle button
              toggleButton?.click();
            }
          }
        };
    
        // Add the keydown event listener when the component mounts
        document.addEventListener('keydown', handleKeyDown);
    
        // Clean up the event listener when the component unmounts
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
        };
      }, []); // Empty dependency array ensures this effect runs only once on mount

    
    // Fetch categories
    const fetchCategorias = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/categories/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }
            });
            const categoriasEvento = response.data.filter(categoria => categoria.tipo_e === 'evento');
            setCategoriasE(categoriasEvento);
            const categoriasBeneficio = response.data.filter(categoria => categoria.tipo_e === 'beneficio');
            setCategoriasB(categoriasBeneficio);
            const categoriasDescuento = response.data.filter(categoria => categoria.tipo_e === 'descuento');
            setCategoriasD(categoriasDescuento);
            const categoriasPractica = response.data.filter(categoria => categoria.tipo_e === 'practica');
            setCategoriasP(categoriasPractica);

        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

    // Fetch user categories
    const fetchUserCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/user/categories/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }
            });
            setCategoriasSeleccionadas(response.data.categorias_preferidas_ids || []);
        } catch (error) {
            console.error('Error fetching user categories', error);
        }
    };

    useEffect(() => {
        fetchCategorias();
        fetchUserCategories();
    }, []);

    // Update user categories
    const updateUserCategories = async (categorias) => {
        try {
            await axios.patch('http://localhost:8000/api/user/update-categories/', {
                categorias_ids: categorias
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }
            });
        } catch (error) {
            console.error('Error updating user categories', error);
        }
    };

    // Handle category click
    const handleCategoriaClick = async (categoriaId) => {
        const nuevaSeleccion = categoriasSeleccionadas.includes(categoriaId)
            ? categoriasSeleccionadas.filter(id => id !== categoriaId)
            : [...categoriasSeleccionadas, categoriaId];

        setCategoriasSeleccionadas(nuevaSeleccion);
        await updateUserCategories(nuevaSeleccion);
        console.log("Categorias actualizadas");
    };


    //Fetch notifications
    const fetchNotificaciones = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/notificaciones/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }
            });
            const notificacionesData = response.data;
            setNotificaciones(notificacionesData);
            // Verifica si hay notificaciones no leídas
            const tieneNotificacionesNoLeidas = notificacionesData.some(notificacion => !notificacion.leida);
            setShowNotification(tieneNotificacionesNoLeidas);
        } catch (error) {
            Error('Error obteniendo las notificaciones');
        }
    };

    useEffect(() => {
        fetchNotificaciones();
    }, []);
    
    //Cerrar modal de notificaciones
    const closeNotificationsModal = () =>{
        const closeNotificationsButton = document.querySelector('.btn-close-notifications');
        closeNotificationsButton?.click();
    }

    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);
    const isUnmounted = useRef(false);
    
    //Conectar con el socket de notificaciones
    useEffect(() => {
        isUnmounted.current = false;

        const connectWebSocket = () => {
            const token = localStorage.getItem('access');
            socketRef.current = new WebSocket(`ws://localhost:8000/ws/notifications/?token=${token}`);

            socketRef.current.onopen = () => {
                console.log('WebSocket conectado');
                setIsConnected(true);
            };

            socketRef.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                toast.custom((t) => (
                    <div
                        style={{
                            background: '#000', // Fondo negro
                            color: '#fff', // Texto blanco
                            padding: '16px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '16px',
                        }}
                    >
                        📅 {data.message} {/* Emoji de calendario */}
                    </div>
                ), {
                    duration: 3000, // Duración en milisegundos
                });
                fetchNotificaciones(); 
            };

            socketRef.current.onerror = () => {
                console.error('Error en WebSocket:');
            };

            socketRef.current.onclose = () => {
                console.log('WebSocket desconectado. Intentando reconectar...');
                setIsConnected(false);
                if (!isUnmounted.current) {
                    setTimeout(connectWebSocket, 3000);
                }
            };
        };

        connectWebSocket();

        return () => {
            isUnmounted.current = true;
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }
        };
    }, []);


    //Socket tolerante a fallos
    useEffect(() => {
        let heartbeatSocket = null;
        let heartbeatTimeout = null;
        let reconnectTimeout = null;
    
        const resetHeartbeatTimeout = () => {
          if (heartbeatTimeout) clearTimeout(heartbeatTimeout);
          heartbeatTimeout = setTimeout(() => {
            console.log("No se recibió heartbeat en 10 segundos, cerrando sesión...");
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error de conexion, por favor intente iniciar sesión más tarde.',
            });
            closeSessionAndRedirect();
          }, 20000);
        };
    
        const closeSessionAndRedirect = () => {
          console.log("Cerrando sesión y redirigiendo...");
          localStorage.removeItem('access');
          if (heartbeatSocket) {
            heartbeatSocket.close();
          }
          localStorage.removeItem('access'); // Elimina el token del localStorage
          localStorage.removeItem('refresh');
          localStorage.removeItem('user'); // Elimina el usuario
          navigate('/');
        };
    
        const connectWebSocket = () => {
          const token = localStorage.getItem('access');
          if (!token) {
            console.log("No hay token, no se intenta conexión");
            return;
          }
    
          heartbeatSocket = new WebSocket(`ws://localhost:8000/ws/heartbeat/?token=${token}`);
    
          heartbeatSocket.onopen = () => {
            console.log('Heartbeat WebSocket conectado');
            resetHeartbeatTimeout();
          };
    
          heartbeatSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'ping') {
              console.log('Ping recibido de Django');
              heartbeatSocket.send(JSON.stringify({type: 'pong'}));
              resetHeartbeatTimeout();
            }
          };
    
          heartbeatSocket.onerror = (error) => {
            console.error('Error en Heartbeat WebSocket:', error);
          };
    
          heartbeatSocket.onclose = () => {
            console.log('Heartbeat WebSocket desconectado');
            if (reconnectTimeout) clearTimeout(reconnectTimeout);
            reconnectTimeout = setTimeout(connectWebSocket, 5000);
          };
        };
    
        connectWebSocket();
    
        const checkConnectionStatus = setInterval(() => {
          if (heartbeatSocket && heartbeatSocket.readyState !== WebSocket.OPEN) {
            console.log("WebSocket no está abierto, intentando reconectar...");
            connectWebSocket();
          }
        }, 10000);
    
        return () => {
          if (heartbeatSocket) {
            heartbeatSocket.close();
          }
          if (heartbeatTimeout) clearTimeout(heartbeatTimeout);
          if (reconnectTimeout) clearTimeout(reconnectTimeout);
          clearInterval(checkConnectionStatus);
        };
      }, []); 

    const goCreateEvent = () => {
        navigate('/crearEvento');
        const closeButton = document.querySelector('.btn-close');
        closeButton?.click();
    }

    const goCreateDescuento = () => {
        navigate('/crearDescuento');
        const closeButton = document.querySelector('.btn-close');
        closeButton?.click();
    }

    const goCreatePractica = () => {
        navigate('/crearPractica');
        const closeButton = document.querySelector('.btn-close');
        closeButton?.click();
    }

    const goAdminUsers = () => {
        navigate('/administrarUsuarios');
        const closeButton = document.querySelector('.btn-close');
        closeButton?.click();
    }

    const goCreateUser = () => {
        navigate('/crearUsuario');
        const closeButton = document.querySelector('.btn-close');
        closeButton?.click();
    }

    const goCreateBeneficio = () => {
        navigate('/crearBeneficio');
        const closeButton = document.querySelector('.btn-close');
        closeButton?.click();
    }

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const handlePasswordChangeSubmit = async (event) => {
        event.preventDefault();
    
        // Validaciones
        if (newPassword.length < 8) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La nueva contraseña debe tener al menos 8 caracteres.',
            });
            return;
        }
    
        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las contraseñas no coinciden.',
            });
            return;
        }
    
        const token = localStorage.getItem('access');
        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se encontró token de autenticación',
            });
            return;
        }
    
        try {
            const response = await axios.patch(`http://localhost:8000/api/user/update-password/`, {
                new_password: newPassword,
                confirm_password: confirmPassword,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            setNewPassword('');
            setConfirmPassword('');
            setPasswordSuccess(response.data.detail);
            setPasswordError('');
    
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Contraseña Actualizada con Éxito',
            });
        } catch (error) {
            const errorMessage = error.response?.data?.detail || 'Error al actualizar la contraseña';
            setPasswordError(errorMessage);
            setPasswordSuccess('');
    
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
            });
        }
    };

    return (
        <>
            {/* In app navbar */}
            <nav className="navbar navbar-dark bg-dark sticky-top text-light">
            <div className="container-fluid d-flex">
                <Link to='/home'>
                <img
                src="/img/Logo-Universidad.png"
                alt="logo universidad de guadalajara"
                width={182}
                height={84}
                />
                </Link>
                {/* Search bar */}
                <form
                className="d-flex mt-3 justify-content-center align-self-center first-search"
                role="search"
                onSubmit={handleSearchSubmit}
                >
                    <div className="outside-search d-flex">
                        <div className="search-icon d-flex ms-2">
                        <i className="fa-solid fa-magnifying-glass" />
                        </div>
                        <input
                        name='search'
                        className="form-control me-2 border-0"
                        type="search"
                        placeholder="Buscar"
                        aria-label="Search"
                        required
                        />
                        <div className="vr bg-dark" />
                        <select
                        name='category'
                        className="form-select border-0"
                        aria-label="Default select example"
                        >
                        <option selected="">Categoria</option>
                        <option value={1}>Evento</option>
                        <option value={3}>Beneficio</option>
                        <option value={2}>Descuento</option>
                        <option value={4}>Práctica</option>
                        </select>
                    </div>
                    <button className="btn btn-danger search-button-nav" type="submit">
                        <i className="fa-solid fa-magnifying-glass" />
                    </button>
                </form>
                {/* End search bar */}
                <div className="align-self-end d-flex">
                <p className="user-name-nav pt-3">{userName}</p>
                {/* Button user options */}
                <div className="btn-group">
                    <button
                    type="button"
                    className="btn text-light dropdown-toggle"
                    data-bs-toggle="dropdown"
                    data-bs-display="static"
                    aria-expanded="false"
                    >
                    <span className="user-image-nav">
                        {currentUserData.imagen ? (
                            <img
                                src={currentUserData.imagen}
                                alt="User"
                                style={{
                                    width: '37px',
                                    height: '37px',
                                    borderRadius: '50%', // Hace que la imagen sea circular
                                    objectFit: 'cover', // Asegura que la imagen cubra el contenedor
                                }}
                            />
                        ) : (
                            <i className="bi bi-person-circle" />
                        )}
                    </span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end bg-dark">
                    <li>
                        <button className="dropdown-item config-user" type="button" data-bs-toggle="modal" data-bs-target="#configModal">
                        Configuración
                        </button>
                    </li>
                    <li>
                        <button className="dropdown-item config-user" 
                        type="button"
                        onClick={() => {
                            localStorage.removeItem('access'); // Elimina el token del localStorage
                            localStorage.removeItem('refresh');
                            localStorage.removeItem('user'); // Elimina el usuario
                            navigate('/'); // Redirige al usuario a la landing page

                        }}
                        >
                        Cerrar Sesión
                        </button>
                    </li>
                    </ul>
                </div>
                {/* Notifications */}

                <button type="button" 
                class="btn text-light" 
                onClick={handleNotificationButtonClick}
                data-bs-toggle="modal"
                data-bs-target="#notificationsModal"
                >
                    <span class="user-image-nav position-relative">
                    <i class="bi bi-bell align-self-center"></i>
                    {showNotification && (
                    <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
                    <span className="visually-hidden">New alerts</span>
                    </span>
                    )}
                    </span>
                </button>

            {/* Hasta aqui las notificaciones */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasDarkNavbar"
                    aria-controls="offcanvasDarkNavbar"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>
                </div>
                <div
                className="offcanvas offcanvas-end text-bg-dark"
                tabIndex={-1}
                id="offcanvasDarkNavbar"
                aria-labelledby="offcanvasDarkNavbarLabel"
                >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">
                    Leo-Link
                    </h5>
                    <button
                    type="button"
                    className="btn-close btn-close-white"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                    />
                </div>
                <div className="offcanvas-body">
                    <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                        <li className="nav-item">
                            <a className="nav-link active" onClick={goHome} style={{ cursor: 'pointer' }}>
                            <span><i class="fa-solid fa-house"></i></span> Inicio
                            </a>
                        </li>
                        
                        <li className="nav-item">
                            <a className="nav-link active" onClick={showEvents} style={{ cursor: 'pointer' }}>
                            <span><i class="fa-solid fa-calendar-days"></i></span> Eventos
                            </a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link active"  onClick={showBeneficios} style={{ cursor: 'pointer' }}>
                            <span><i class="fa-brands fa-google-scholar"></i></span> Beneficios
                            </a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link active" onClick={showDescuentos} style={{ cursor: 'pointer' }}>
                            <span><i class="fa-solid fa-percent"></i></span> Descuentos
                            </a>
                        </li>
                        
                        <li className="nav-item">
                            <a className="nav-link active" onClick={showPracticas} style={{ cursor: 'pointer' }} >
                            <span><i class="fa-solid fa-business-time"></i></span> Prácticas Profesionales
                            </a>
                        </li>

                    
                        {/* <li className="nav-item">
                            <a className="nav-link active" href="#">
                            <span><i class="fa-solid fa-circle-info"></i></span> Servicios Escolares IA
                            </a>
                        </li> */}

                        {/* hidden search bar */}
                        <form className="d-flex mt-3 second-search" role="search" onSubmit={handleSearchSubmit}>
                        <div className="outside-search d-flex">
                            <div className="search-icon d-flex ms-2">
                            <i className="fa-solid fa-magnifying-glass" />
                            </div>
                            <input
                            name='search'
                            className="form-control me-2 border-0"
                            type="search"
                            placeholder="Buscar"
                            aria-label="Search"
                            />
                            <div className="vr bg-dark" />
                            <select
                            name='category'
                            className="form-select border-0"
                            aria-label="Default select example"
                            >
                            <option selected="">Categoria</option>
                            <option value={1}>Evento</option>
                            <option value={3}>Beneficio</option>
                            <option value={2}>Descuento</option>
                            <option value={4}>Práctica</option>
                            </select>
                        </div>
                        <button className="btn btn-danger search-button-nav" type="submit">
                            <i className="fa-solid fa-magnifying-glass" />
                        </button>
                        </form>
                        <hr/>
                        <p className="main-info-title mb-1">Tipo de cuenta: {currentUserData.permiso_u}</p>
                        {/* Permisos de usuario */}
                        <>
                            {['admin', 'docente', 'empresa', 'grupo_personal'].includes(currentUserData.permiso_u) && (
                                <>
                                    {/* Nav item */}
                                    <li className="nav-item dropdown">
                                        <a
                                            className="nav-link active dropdown-toggle"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <span><i className="bi bi-plus-circle-fill"></i></span> Crear Publicación
                                        </a>
                                        <ul className="dropdown-menu dropdown-menu-dark">
                                            {currentUserData.permiso_u === 'docente' && (
                                                <>
                                                    <li>
                                                        <button className="dropdown-item" onClick={goCreateEvent}>
                                                            Evento
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button className="dropdown-item" onClick={goCreateBeneficio}>
                                                            Beneficio
                                                        </button>
                                                    </li>
                                                </>
                                            )}
                                            {currentUserData.permiso_u === 'grupo_personal' && (
                                                <>
                                                    <li>
                                                        <button className="dropdown-item" onClick={goCreateEvent}>
                                                            Evento
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button className="dropdown-item" onClick={goCreateBeneficio}>
                                                            Beneficio
                                                        </button>
                                                    </li>
                                                </>
                                            )}
                                            {currentUserData.permiso_u === 'empresa' && (
                                                <>
                                                    <li>
                                                        <button className="dropdown-item" onClick={goCreatePractica}>
                                                            Prácticas Profesionales
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button className="dropdown-item" onClick={goCreateEvent}>
                                                            Evento
                                                        </button>
                                                    </li>
                                                </>
                                            )}
                                            {currentUserData.permiso_u === 'admin' && (
                                                <>
                                                    <li>
                                                        <button className="dropdown-item" onClick={goCreateEvent}>
                                                            Evento
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button className="dropdown-item" onClick={goCreateBeneficio}>
                                                            Beneficio
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button className="dropdown-item" onClick={goCreateDescuento}>
                                                            Descuento
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button className="dropdown-item" onClick={goCreatePractica}>
                                                            Prácticas Profesionales
                                                        </button>
                                                    </li>
                                                </>
                                            )}
                                        </ul>
                                    </li>

                                    {/* Otras opciones siempre disponibles para los administradores */}
                                    {currentUserData.permiso_u === 'admin' && (
                                        <>
                                            <li className="nav-item">
                                                <a className="nav-link active" onClick={goCreateUser} style={{ cursor: 'pointer' }}>
                                                    <span><i className="fa-solid fa-user-plus"></i></span> Crear Cuentas
                                                </a>
                                            </li>

                                            <li className="nav-item">
                                                <a className="nav-link active" onClick={goAdminUsers} style={{ cursor: 'pointer' }}>
                                                    <span><i className="fa-solid fa-users"></i></span> Administrar Usuarios
                                                </a>
                                            </li>
                                        </>
                                    )}
                                </>
                            )}
                        </>
                        {/* Fin Permisos de usuario */}
                    </ul>

                    {/* End Nav item */}
                </div>
                </div>
            </div>
            </nav>
            {/* End in app navbar */}

            {/* User configuration modal */}
            <style>
                {`
                    .btn-close {
                        color: white;
                        filter: invert(1);
                    }
                    /* Cambia el color del texto de las pestañas no activas a blanco */
                    .nav-tabs .nav-link {
                        color: #ffffff; /* Blanco para el texto de las pestañas inactivas */
                    }
                    .nav-tabs .nav-link.active {
                        color: #ffffff; /* Blanco para el texto de la pestaña activa también, para mantener consistencia */
                        background-color: #212529;
                    }
                    .content-box {
                        border-radius: 3px;
                    }
                `}
            </style>

            {/* Modal User configuration*/}
            <div className="modal fade" id="configModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg"> {/* Modal más grande */}
                    <div className="modal-content bg-dark text-light">
                    {/* Encabezado del Modal */}
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Configuración de la Cuenta</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    {/* Cuerpo del Modal */}
                    <div className="modal-body">
                        {/* Pestañas */}
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <a className="nav-link active" id="home-tab" data-bs-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Notificaciones</a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a className="nav-link" id="profile-tab" data-bs-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Configuración de Usuario</a>
                        </li>
                        </ul>
                        {/* Contenido de las Pestañas */}
                        <div className="tab-content mt-3" id="myTabContent">
                        <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                            <div className="p-3 border border-light bg-light text-dark content-box" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                <h5>Categorías</h5>
                                <p>Selecciona las categorias por cada sección de las que te gustaría recibir notificaciones.</p>
                                <hr />
                                <h5>Eventos</h5>
                                {categoriasE.map(categoria => (
                                    <button
                                        key={categoria.id}
                                        className={`btn btn-${categoriasSeleccionadas.includes(categoria.id) ? 'danger' : 'success'} btn-sm me-3 my-2 rounded-pill`}
                                        onClick={() => handleCategoriaClick(categoria.id)}
                                    >
                                        {categoria.nombre}
                                    </button>
                                ))}
                                <hr />
                                <h5>Beneficios</h5>
                                {categoriasB.map(categoria => (
                                    <button
                                        key={categoria.id}
                                        className={`btn btn-${categoriasSeleccionadas.includes(categoria.id) ? 'danger' : 'success'} btn-sm me-3 my-2 rounded-pill`}
                                        onClick={() => handleCategoriaClick(categoria.id)}
                                    >
                                        {categoria.nombre}
                                    </button>
                                ))}

                                <hr />
                                <h5>Descuentos</h5>
                                {categoriasD.map(categoria => (
                                    <button
                                        key={categoria.id}
                                        className={`btn btn-${categoriasSeleccionadas.includes(categoria.id) ? 'danger' : 'success'} btn-sm me-3 my-2 rounded-pill`}
                                        onClick={() => handleCategoriaClick(categoria.id)}
                                    >
                                        {categoria.nombre}
                                    </button>
                                ))}

                                <hr />
                                <h5>Prácticas</h5>
                                {categoriasP.map(categoria => (
                                    <button
                                        key={categoria.id}
                                        className={`btn btn-${categoriasSeleccionadas.includes(categoria.id) ? 'danger' : 'success'} btn-sm me-3 my-2 rounded-pill`}
                                        onClick={() => handleCategoriaClick(categoria.id)}
                                    >
                                        {categoria.nombre}
                                    </button>
                                ))}

                            </div>
                        </div>
                        {/* Editar perfil del usuario */}
                        <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                            <div className="p-3 border border-light bg-light text-dark content-box" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <h5>Perfil del Usuario</h5>
                                <form className="m-auto p-5" onSubmit={handleUserUpdateSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="descripcion" className="form-label">Descripción (Opcional)</label>
                                        <textarea
                                            className="form-control"
                                            id="descripcion"
                                            value={descripcion}
                                            onChange={(e) => setDescripcion(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="telefono" className="form-label">Teléfono (Opcional)</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            id="telefono"
                                            value={telefono}
                                            onChange={(e) => setTelefono(e.target.value)}
                                            maxLength={15}
                                        />
                                    </div>

                                    
                                    <div className="mb-3">
                                        <label htmlFor="imagen" className="form-label">Imagen (Opcional)</label>
                                        <input
                                             key={fileInputKey}
                                            type="file"
                                            className="form-control"
                                            id="imagen"
                                            accept="image/*"
                                            onChange={(e) => {
                                                setImagen(e.target.files[0] || null); // Si no se selecciona un archivo, establece a null
                                            }}
                                        />
                                    </div>

                                    {currentUserData.imagen && (
                                        <div className="mb-3">
                                            <label className="form-check-label">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input me-1"
                                                    checked={eliminarImagen}
                                                    onChange={(e) => setEliminarImagen(e.target.checked)}
                                                />
                                                Eliminar imagen actual
                                            </label>
                                        </div>
                                    )}

                                    <button type="submit" className="btn btn-primary mt-3">Actualizar Perfil</button>

                                    {error && <div className="mt-3 text-danger">{error}</div>}
                                    {success && <div className="mt-3 text-success">{success}</div>}
                                </form>
                                
                                {currentUserData.email && !currentUserData.email.endsWith('@alumnos.udg.mx') && 
                                    !currentUserData.email.endsWith('@academicos.udg.mx') && (
                                        <>
                                            <h5 className='mt-3'>Cambiar Contraseña</h5>
                                            <form className="m-auto p-5" onSubmit={handlePasswordChangeSubmit}>
                                                <div className="mb-3">
                                                    <label htmlFor="newPassword" className="form-label">Nueva Contraseña</label>
                                                    <div className="position-relative">
                                                        <input
                                                            type={showNewPassword ? 'text' : 'password'}
                                                            className="form-control pe-5"
                                                            id="newPassword"
                                                            value={newPassword}
                                                            onChange={(e) => setNewPassword(e.target.value)}
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-light position-absolute top-50 end-0 translate-middle-y border-0"
                                                            style={{ right: '10px', transform: 'translateY(-50%)' }}
                                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                                        >
                                                            {showNewPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                                                    <div className="position-relative">
                                                        <input
                                                            type={showConfirmPassword ? 'text' : 'password'}
                                                            className="form-control pe-5"
                                                            id="confirmPassword"
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-light position-absolute top-50 end-0 translate-middle-y border-0"
                                                            style={{ right: '10px', transform: 'translateY(-50%)' }}
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        >
                                                            {showConfirmPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                                                        </button>
                                                    </div>
                                                </div>

                                                <button type="submit" className="btn btn-primary mt-3">Actualizar Contraseña</button>

                                                {/* {passwordError && <div className="mt-3 text-danger">{passwordError}</div>}
                                                {passwordSuccess && <div className="mt-3 text-success">{passwordSuccess}</div>} */}
                                            </form>
                                        </>
                                    )}

                            </div>
                        </div>
                        </div>
                    </div>
                    {/* Pie del Modal */}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cerrar</button> {/* Botón de cerrar rojo */}
                    </div>
                    </div>
                </div>
            </div>
            {/* End Modal User configuration*/}

            {/* Modal notifications */}
            <div className="modal fade custom-modal" id="notificationsModal" tabIndex="-1" aria-labelledby="notificationsModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="notificationsModalLabel">Mis Notificaciones</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div className="modal-body">
                            {/* Lista de notificaciones */}

                            {notificaciones.length === 0 ? (
                                <div className="no-notifications-message">
                                    Actualmente no tienes notificaciones.
                                </div>
                            ) : (
                                notificaciones.map((notificacion, index) => (
                                    <Link
                                        to={notificacion.tipo_e === 'evento'
                                            ? `/event/${notificacion.evento.id}`
                                            : notificacion.tipo_e === 'beneficio'
                                            ? `/beneficio/${notificacion.evento.id}`
                                            : notificacion.tipo_e === 'descuento'
                                            ? `/descuento/${notificacion.evento.id}`
                                            :  notificacion.tipo_e === 'practica'
                                            ? `/practica/${notificacion.evento.id}`
                                            : '#'
                                            }
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                        onClick={closeNotificationsModal}
                                        key={index}
                                    >
                                        <div className="list-group">
                                            <div className="list-group-item">
                                                <div className="notification-title">
                                                    {notificacion.tipo_e === 'evento'
                                                        ? 'Nuevo evento'
                                                        : notificacion.tipo_e === 'beneficio'
                                                        ? 'Nuevo beneficio'
                                                        : notificacion.tipo_e === 'descuento'
                                                        ? 'Nuevo descuento'
                                                        : notificacion.tipo_e === 'practica'
                                                        ? 'Nueva Práctica'
                                                        :'Nueva notificación' // Título por defecto en caso de otro tipo
                                                    }
                                                </div>
                                                <div className="notification-body">{notificacion.mensaje}</div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger btn-close-notifications" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* End Modal notifications */}

            {/* Css notifications */}
            <style>
                {`
                    .custom-modal .modal-content {
                        border-radius: 1rem;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .custom-modal .list-group-item {
                        border: 1px solid #dee2e6;
                        border-radius: .75rem;
                        margin-bottom: .5rem;
                        padding: 1rem;
                        background-color: #f8f9fa;
                        transition: background-color 0.2s ease-in-out;
                    }
                    .custom-modal .list-group-item:hover {
                        background-color: #e9ecef;
                        cursor: pointer;
                    }
                    .custom-modal .notification-title {
                        font-weight: 500;
                        margin-bottom: .5rem;
                    }
                    .custom-modal .notification-body {
                        color: #6c757d;
                    }
                `}
        </style>
        </>
    );
  }
  
  export default UserNavbar;