import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

import './UserNavbar.css';

function UserNavbar() {
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();



    useEffect(() => {
        const token = localStorage.getItem('access');

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const fullName = `${decodedToken.nombre} ${decodedToken.apellidos}`; // Assuming the token has first_name and last_name
                setUserName(fullName);
            } catch (error) {
                console.error('Error decoding token:', error);
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
                <img
                src="./img/Logo-Universidad.png"
                alt="logo universidad de guadalajara"
                width={182}
                height={84}
                />
                <form
                className="d-flex mt-3 justify-content-center align-self-center first-search"
                role="search"
                >
                <div className="outside-search d-flex">
                    <div className="search-icon d-flex ms-2">
                    <i className="fa-solid fa-magnifying-glass" />
                    </div>
                    <input
                    className="form-control me-2 border-0"
                    type="search"
                    placeholder="Buscar"
                    aria-label="Search"
                    />
                    <div className="vr bg-dark" />
                    <select
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
                            navigate('/'); // Redirige al usuario a la página de login
                        }}
                        >
                        Cerrar Sesión
                        </button>
                    </li>
                    </ul>
                </div>
                {/* Notifications */}
                {/* <div class="btn-group">
            <button type="button" class="btn text-light dropdown-toggle" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                <span class="user-image-nav position-relative">
                <i class="bi bi-bell align-self-center"></i>
                <span class="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
                    <span class="visually-hidden">New alerts</span>
                </span>
                </span>
            </button>
            <ul class="dropdown-menu dropdown-menu-start dropdown-menu-lg-end bg-dark">
                <li><button class="dropdown-item config-user" type="button">Recomendación: Club de algoritmia!</button></li>
                <li><button class="dropdown-item config-user" type="button">Recomendación: Feria del empleo!</button></li>
                <li><button class="dropdown-item config-user" type="button">Recomendación: Nuevo beneficio Jira Premium!</button></li>
            </ul>
            </div> */}
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
                        <a className="nav-link active" aria-current="page" href="#">
                        Inicio
                        </a>
                    </li>
                    <li className="nav-item dropdown">
                        <a
                        className="nav-link active dropdown-toggle"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        >
                        Eventos
                        </a>
                        <ul className="dropdown-menu dropdown-menu-dark">
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
                        Descuentos
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link active" href="#">
                        Beneficios
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link active" href="#">
                        Prácticas Profesionales
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link active" href="#">
                        Servicios Escolares IA
                        </a>
                    </li>
                    </ul>
                    {/* hidden search bar */}
                    <form className="d-flex mt-3 second-search" role="search">
                    <div className="outside-search d-flex">
                        <div className="search-icon d-flex ms-2">
                        <i className="fa-solid fa-magnifying-glass" />
                        </div>
                        <input
                        className="form-control me-2 border-0"
                        type="search"
                        placeholder="Buscar"
                        aria-label="Search"
                        />
                        <div className="vr bg-dark" />
                        <select
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
                </div>
                </div>
            </div>
            </nav>
            {/* End in app navbar */}
        </>
    );
  }
  
  export default UserNavbar;