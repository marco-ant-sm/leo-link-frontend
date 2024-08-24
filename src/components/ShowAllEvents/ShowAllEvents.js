import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ShowAllEvents.css';
import UserNavbar from '../UserNavbar/UserNavbar';
import { Link } from 'react-router-dom';

function ShowAllEvents() {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
    const [error, setError] = useState(null);

    useEffect(() => {
        document.body.style.overflow = 'auto'; // Asegúrate de que el overflow esté habilitado
        return () => {
            document.body.style.overflow = ''; // Limpia el estilo cuando el componente se desmonta
        };
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/events/', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access')}`
                    }
                });
                setEvents(response.data);
            } catch (error) {
                setError('Error fetching events');
                console.error(error.response.data);
            }
        };

        fetchEvents();
    }, []);

    // Filtrar eventos basado en el término de búsqueda
    const filteredEvents = events.filter((event) =>
        event.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <UserNavbar/>
            <section className="container my-5">
                {/* INICIO - Título, barra y botón de filtro */}
                <h1 className="mb-4">Eventos</h1>
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
                            {/* Icono Filtro */}
                            Filtros
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="filtrosDropdown">
                            <li><a className="dropdown-item">Filtro 1</a></li>
                            <li><a className="dropdown-item">Filtro 2</a></li>
                            <li><a className="dropdown-item">Filtro 3</a></li>
                        </ul>
                    </div>
                </div>
            </section>
            {/* FIN - Título, barra y botón de filtro */}

            {/* Recomendadas */}
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
                                <Link to={`/event/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="card preview-event-allevents">
                                        <div className="ratio ratio-16x9">
                                            <img src="./img/event-1.jpg" alt="event" className="w-100 h-100 object-fit-cover" />
                                        </div>
                                        <div className="card-body">
                                            <h5 className="card-title">{event.nombre}</h5>
                                            <p className="card-text">{event.descripcion}</p>
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

export default ShowAllEvents;