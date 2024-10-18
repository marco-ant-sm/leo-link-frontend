import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ShowAllDescuentos.css';
import UserNavbar from '../UserNavbar/UserNavbar';
import { Link, useLocation } from 'react-router-dom';


function ShowAllDescuentos() {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
    const [error, setError] = useState(null);
    const location = useLocation();
    const defaultImage = '/img/default-logo.jpg';
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [myEventsFilter, setMyEventsFilter] = useState(false);
    const [currentUserData, setCurrentUserData] = useState(null);

    useEffect(() => {
        document.body.style.overflow = 'auto'; // Asegúrate de que el overflow esté habilitado
        return () => {
            document.body.style.overflow = ''; // Limpia el estilo cuando el componente se desmonta
        };
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const search = queryParams.get('search');
        if (search) {
            setSearchTerm(decodeURIComponent(search));
        }
    }, [location.search]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/events/', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access')}`
                    }
                });
                const tiposDescuento= response.data.filter(evento => evento.tipo_e === 'descuento');
                setEvents(tiposDescuento);

            } catch (error) {
                setError('Error fetching events');
                console.error(error.response.data);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/categories/', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access')}`
                    }
                });

                const categoriasEvento = response.data.filter(categoria => categoria.tipo_e === 'descuento');
                setCategories(categoriasEvento);

            } catch (error) {
                setError('Error fetching categories');
                console.error(error.response.data);
            }
        };

        const fetchUserProfile = async () => {
            const token = localStorage.getItem('access');

            if (!token) {
                setError('No token found');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8000/api/user/profile/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setCurrentUserData(response.data);
            } catch (error) {
                setError('Error fetching user profile');
                console.error(error);
            }
        };

        fetchEvents();
        fetchCategories();
        fetchUserProfile();
    }, []);


    //Filtro de categorias agregar y eliminar categorias
    const handleCategoryChange = (event) => {
        const { value, checked } = event.target;
        setSelectedCategories(prev =>
            checked
                ? [...prev, value]
                : prev.filter(category => category !== value)
        );
    };


    // Filtrar eventos basado en el término de búsqueda y las categorías seleccionadas
    const filteredEvents = events.filter((event) => {
        const matchesSearchTerm = event.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategories = selectedCategories.length === 0 || event.categorias_ids.some(categoryId => selectedCategories.includes(String(categoryId)));
        const matchesUserFilter = !myEventsFilter || event.usuario.id === currentUserData?.id;
        return matchesSearchTerm && matchesCategories && matchesUserFilter;
    });

    // Filtrar eventos basado en el término de búsqueda
    // const filteredEvents = events.filter((event) =>
    //     event.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    // if (error) {
    //     return <div>{error}</div>;
    // }


    const hasDescuentoEnded = (fechaFinDescuento) => {
        const now = new Date();
        const fechaFin = fechaFinDescuento ? new Date(fechaFinDescuento + 'T00:00:00') : null;
    
        // Si no hay fecha_fin, lo consideramos válido
        return !fechaFin || fechaFin > now;
    };
    
    // const hasDescuentoEnded = (fechaFinDescuento) => {
    //     const now = new Date();
    //     const fechaFin = fechaFinDescuento ? new Date(fechaFinDescuento) : null;
    
    //     // Si no hay fecha_fin, lo consideramos válido
    //     return !fechaFin || fechaFin > now;
    // };

    const truncateDescription = (descripcion, maxLength) => {
        if (descripcion.length > maxLength) {
            return descripcion.substring(0, maxLength) + '...';
        }
        return descripcion;
    };


    return (
        <div>
            {/* <UserNavbar/> */}
            <section className="container my-5">
                {/* INICIO - Título, barra y botón de filtro */}
                <h1 className="mb-4">Descuentos</h1>
                <div className="d-flex justify-content-between mb-4">
                    <div className="input-group w-50">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Buscar" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} // Actualizar el estado al escribir
                        />
                    </div>
                    {/* Filtros de categorias para los eventos */}
                    <div className="dropdown">
                        <button
                            className="btn btn-outline-secondary dropdown-toggle"
                            type="button"
                            id="filtrosDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={16}
                                height={16}
                                fill="currentColor"
                                className="bi bi-funnel"
                                viewBox="0 0 16 16"
                            >
                                <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z" />
                            </svg>
                            Filtros
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="filtrosDropdown">
                            {/* Filtro para mis eventos */}
                            <li>
                                <div className="form-check m-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="myEventsFilter"
                                        checked={myEventsFilter}
                                        onChange={(e) => setMyEventsFilter(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="myEventsFilter">
                                        Mis Descuentos
                                    </label>
                                </div>
                            </li>
                            {/* Fin de filtro para mis eventos */}

                            {categories.map(category => (
                                <li key={category.id}>
                                    <div className="form-check m-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value={category.id}
                                            onChange={handleCategoryChange}
                                        />
                                        <label className="form-check-label">
                                            {category.nombre}
                                        </label>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Fin de filtros de categorias para los eventos */}

                </div>
            </section>
            {/* FIN - Título, barra y botón de filtro */}

            {/* Descuentos disponibles */}
            <section className="container my-5">
                <div className="d-flex align-items-center w-100 mb-4">
                    <h2>Descuentos disponibles</h2>
                    <div className="flex-grow-1 ms-2">
                        <hr />
                    </div>
                </div>
                <div className="row">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                            <div className="col-md-4 mb-4" key={event.id}>
                                <Link to={`/descuento/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="card preview-event-allevents">
                                        <div className="ratio ratio-16x9">
                                            <img src={event.imagen ? event.imagen : defaultImage} alt="event" className="w-100 h-100 object-fit-cover" />
                                        </div>
                                        <div className="card-body">
                                            <h5 className="card-title">{event.nombre} {!hasDescuentoEnded(event.fecha_fin_descuento) && <span className='text-danger'>(Vencido)</span>}</h5>
                                            <p className="card-text">{truncateDescription(event.descripcion, 45)}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>No se encontraron Descuentos</p>
                    )}
                </div>
            </section>
        </div>
    );
}

export default ShowAllDescuentos;