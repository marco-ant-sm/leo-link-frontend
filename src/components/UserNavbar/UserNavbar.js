import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {toast} from 'react-hot-toast';
import axios from 'axios';
import './UserNavbar.css';

function UserNavbar() {
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();
    //Categorias de eventos
    const [categorias, setCategorias] = useState([]);
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
    const [notificaciones, setNotificaciones] = useState([]);

    //Fake
    const [showNotification, setShowNotification] = useState(false);

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
    };

    //Funcion para buscar en la barra de busqueda
    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Evita el envío del formulario y la recarga de la página
    
        const searchInput = e.target.elements.search.value;
        const category = e.target.elements.category.value;
    
        if (category === '1') {
            navigate(`/showAllEvents?search=${encodeURIComponent(searchInput)}`);
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
        document.body.style.overflow = 'auto'; // Asegúrate de que el overflow esté habilitado
        return () => {
            document.body.style.overflow = ''; // Limpia el estilo cuando el componente se desmonta
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
        const user = localStorage.getItem('user');

        if (user) {
            try {
                // Convierte la cadena JSON en un objeto JavaScript
                const userObj = JSON.parse(user);
                
                // Accede a las propiedades del objeto
                const fullName = `${userObj.nombre} ${userObj.apellidos}`;
                setUserName(fullName);
            } catch (error) {
                console.error('Error getting user:', error);
            }
        }

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
            setCategorias(response.data);
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

    
    //Conectar con el socket de notificaciones
    // useEffect(() => {
    //     let socket;

    //     const connectWebSocket = () => {
    //         const token = localStorage.getItem('access');
    //         socket = new WebSocket(`ws://localhost:8000/ws/notifications/?token=${token}`);
        
    //         socket.onopen = () => {
    //             console.log('WebSocket conectado');
    //         };
        
    //         socket.onmessage = (event) => {
    //             const data = JSON.parse(event.data);
    //             toast.success(data.message);
    //             fetchNotificaciones(); // Volver a cargar las notificaciones
    //         };
        
    //         socket.onerror = () => {
    //             console.error('Error en WebSocket:');
    //         };
        
    //         socket.onclose = () => {
    //             console.log('WebSocket desconectado. Intentando reconectar...');
    //             setTimeout(connectWebSocket, 3000);
    //         };
    //     };

    //     connectWebSocket();

    //     return () => {
    //         if (socket) {
    //             socket.close();
    //         }
    //     };
    // }, []);

    const goCreateEvent = () => {
        navigate('/crearEvento');
    }

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
                        <option value={2}>Descuento</option>
                        <option value={3}>Beneficio</option>
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
                        <i className="bi bi-person-circle" />
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
                        <Link className="nav-link active" aria-current="page" to='/home'>
                        <span><i class="fa-solid fa-house"></i></span> Inicio
                        </Link>
                    </li>
                    
                    <li className="nav-item">
                        <a className="nav-link active" onClick={showEvents} style={{ cursor: 'pointer' }}>
                        <span><i class="fa-solid fa-calendar-days"></i></span> Eventos
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link active" href="#">
                        <span><i class="fa-solid fa-percent"></i></span> Descuentos
                        </a>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link active" to={'/'}>
                        <span><i class="fa-brands fa-google-scholar"></i></span> Beneficios
                        </Link>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link active" href="#">
                        <span><i class="fa-solid fa-business-time"></i></span> Prácticas Profesionales
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link active" href="#">
                        <span><i class="fa-solid fa-circle-info"></i></span> Servicios Escolares IA
                        </a>
                    </li>
                    </ul>
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
                        <option value={2}>Descuento</option>
                        <option value={3}>Beneficio</option>
                        </select>
                    </div>
                    <button className="btn btn-danger search-button-nav" type="submit">
                        <i className="fa-solid fa-magnifying-glass" />
                    </button>
                    </form>
                    <hr/>
                    {/* Nav item */}
                    <li className="nav-item dropdown">
                        <a
                        className="nav-link active dropdown-toggle"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        >
                        <span><i class="bi bi-plus-circle-fill"></i></span> Crear Publicación
                        </a>
                        <ul className="dropdown-menu dropdown-menu-dark">
                            <li>
                                <button className="dropdown-item" onClick={goCreateEvent}>
                                Evento
                                </button>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                Descuento
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                Beneficio
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                Prácticas Profesionales
                                </a>
                            </li>
                        </ul>
                    </li>
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
                        <h5 className="modal-title" id="exampleModalLabel">Configuración de Usuario</h5>
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
                            <a className="nav-link" id="profile-tab" data-bs-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Perfil del Usuario</a>
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
                            {categorias.map(categoria => (
                                <button
                                    key={categoria.id}
                                    className={`btn btn-${categoriasSeleccionadas.includes(categoria.id) ? 'danger' : 'success'} btn-sm me-3 my-2 rounded-pill`}
                                    onClick={() => handleCategoriaClick(categoria.id)}
                                >
                                    {categoria.nombre}
                                </button>
                            ))}
                            <hr />
                            <h5>Siguiente tipo de publicacion</h5>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                            <div className="p-3 border border-light bg-light text-dark content-box" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <h5>Perfil del Usuario</h5>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in euismod orci, nec feugiat urna. Praesent et vehicula mi. Ut fringilla odio eu mi elementum, ac dictum dolor scelerisque. Integer feugiat purus eget sapien blandit tincidunt. Mauris vel eros est. Suspendisse ac scelerisque velit. Aliquam erat volutpat. Sed id diam nec justo bibendum cursus.</p>
                            <p>Curabitur volutpat magna sit amet sapien luctus, a fringilla lacus pellentesque. Ut commodo interdum risus, vel sodales enim fermentum nec. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tempor eros vel sapien tempor lacinia. Phasellus a justo ac sem euismod tincidunt.</p>
                            <p>Vestibulum nec sapien ac risus tempor gravida. Phasellus convallis nisl eget est congue, sed facilisis nisi tincidunt. Integer facilisis ligula sed velit facilisis varius. Aenean a libero a est tempus ullamcorper. Mauris ut est nec ante varius congue eget ac elit.</p>
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
                                        to={`/event/${notificacion.evento.id}`}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                        onClick={closeNotificationsModal}
                                        key={index}
                                    >
                                        <div className="list-group">
                                            <div className="list-group-item">
                                                <div className="notification-title">Nuevo evento</div>
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