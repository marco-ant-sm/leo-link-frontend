import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {toast} from 'react-hot-toast';

import './UserNavbar.css';

function UserNavbar() {
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();
    //Fake
    const [showNotification, setShowNotification] = useState(true);

    // Función para manejar el clic en el botón
    const handleButtonClick = () => {
        setShowNotification(false);
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
            if (document.activeElement.tagName === 'INPUT') {
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
                        <button className="dropdown-item config-user" type="button">
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

                {/* <div class="btn-group">
                    <button type="button" 
                    class="btn text-light dropdown-toggle" 
                    data-bs-toggle="dropdown" data-bs-display="static" 
                    aria-expanded="false"
                    onClick={handleButtonClick}
                    >
                        <span class="user-image-nav position-relative">
                        <i class="bi bi-bell align-self-center"></i>
                        <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
                        <span className="visually-hidden">New alerts</span>
                        </span>
                        </span>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-start dropdown-menu-lg-end bg-dark">
                        <li><button class="dropdown-item config-user" type="button">Recomendación: Club de algoritmia!</button></li>
                        <li><button class="dropdown-item config-user" type="button">Recomendación: Feria del empleo!</button></li>
                        <li><button class="dropdown-item config-user" type="button">Recomendación: Nuevo beneficio Jira Premium!</button></li>
                    </ul>
                </div> */}

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
                    <li className="nav-item dropdown">
                        <a
                        className="nav-link active dropdown-toggle"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        >
                        <span><i class="fa-solid fa-calendar-days"></i></span> Eventos
                        </a>
                        <ul className="dropdown-menu dropdown-menu-dark">
                            <li>
                                <button className="dropdown-item" onClick={showEvents}>
                                Todos los eventos
                                </button>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                Crecimiento laboral
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                Deportivo
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                Recreativo
                                </a>
                            </li>
                        </ul>
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
                                <button className="dropdown-item" onClick={showEvents}>
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
        </>
    );
  }
  
  export default UserNavbar;