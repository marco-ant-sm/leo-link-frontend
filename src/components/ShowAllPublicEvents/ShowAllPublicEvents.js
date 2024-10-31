import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ShowAllPublicEvents.css';
import { Link, useLocation } from 'react-router-dom';
import { isSameDay } from 'date-fns';
import PublicNavbar from '../PublicNavbar/PublicNavbar';


function ShowAllPublicEvents() {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
    const [error, setError] = useState(null);
    const location = useLocation();
    const defaultImage = '/img/default-logo.jpg';
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        document.body.style.overflow = 'auto';
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
                const response = await axios.get('http://localhost:8000/api/public-events/');
                
                const tiposEvento = response.data.filter(evento => evento.tipo_e === 'evento' && evento.acceso_e === 'publico' && evento.disponible);
                setEvents(tiposEvento);
            } catch (error) {
                setError('Error fetching events');
                console.error(error.response.data);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/public-event-categories/');

                const categoriasEvento = response.data.filter(categoria => categoria.tipo_e === 'evento');
                setCategories(categoriasEvento);

            } catch (error) {
                setError('Error fetching categories');
                console.error(error.response.data);
            }
        };

        fetchEvents();
        fetchCategories();
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
        return matchesSearchTerm && matchesCategories;
    });

    // Filtrar eventos basado en el término de búsqueda
    // const filteredEvents = events.filter((event) =>
    //     event.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    // if (error) {
    //     return <div>{error}</div>;
    // }

    const hasEventEnded = (fechaFin, horaFin) => {
        const fechaEvento = new Date(fechaFin);
        const horaEvento = new Date(`${fechaFin}T${horaFin}`);
        const now = new Date();
    
        return fechaEvento < now || (isSameDay(fechaEvento, now) && horaEvento < now);
    };

    const truncateDescription = (descripcion, maxLength) => {
        if (descripcion.length > maxLength) {
            return descripcion.substring(0, maxLength) + '...';
        }
        return descripcion;
    };


    return (
        <div>
            <PublicNavbar/>
            <section className="container my-5">
                {/* INICIO - Título, barra y botón de filtro */}
                <h1 className="mb-4">Eventos Públicos</h1>
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

            {/* Eventos disponibles */}
            <section className="container my-5">
                <div className="d-flex align-items-center w-100 mb-4">
                    <h2>Eventos disponibles</h2>
                    <div className="flex-grow-1 ms-2">
                        <hr />
                    </div>
                </div>
                <div className="row">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                            <div className="col-md-4 mb-4" key={event.id}>
                                <Link to={`/public-event/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="card preview-event-allevents">
                                        <div className="ratio ratio-16x9">
                                            <img src={event.imagen ? event.imagen : defaultImage} alt="event" className="w-100 h-100 object-fit-cover" />
                                        </div>
                                        <div className="card-body">
                                            <h5 className="card-title">{event.nombre} {hasEventEnded(event.fecha_fin_evento, event.hora_fin_evento) && <span className='text-danger'>(Finalizado)</span>}</h5>
                                            <p className="card-text">{truncateDescription(event.descripcion, 45)}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>No se encontraron eventos</p>
                    )}
                </div>
            </section>
        </div>
    );
}

export default ShowAllPublicEvents;