import React from 'react';
import './HomeUser.css';
// import UserNavbar from '../UserNavbar/UserNavbar';
import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link} from 'react-router-dom';
import { format, parseISO, isSameDay } from 'date-fns';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function HomeUser() {
    const defaultImage = '/img/default-logo.jpg';
    const [events, setEvents] = useState([]);
    const [userCategories, setUserCategories] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    //Beneficios
    const [benefitEvents, setBenefitEvents] = useState([]);
    const [benefitCategories, setBenefitCategories] = useState([]);
    const [filteredBenefitEvents, setFilteredBenefitEvents] = useState([]);

    //Descuentos
    const [descuentosEvents, setDescuentosEvents] = useState([]);
    const [descuentosCategories, setDescuentosCategories] = useState([]);
    const [filteredDescuentosEvents, setFilteredDescuentosEvents] = useState([]);

    //Practicas
    const [practicasEvents, setPracticasEvents] = useState([]);
    const [practicasCategories, setPracticasCategories] = useState([]);
    const [filteredPracticasEvents, setFilteredPracticasEvents] = useState([]);
    
    const [error, setError] = useState(null);
    const [currentUserData, setCurrentUserData] = useState({});
    const navigate = useNavigate();

    const hasEventEnded = (fechaFin, horaFin) => {
        const fechaEvento = new Date(fechaFin + 'T00:00:00'); // Asegurarse de que se interprete como medianoche en la zona horaria local
        const horaEvento = new Date(`${fechaFin}T${horaFin}`);
        const now = new Date();
    
        // Si la fecha del evento es mayor que ahora, es válido
        if (fechaEvento > now) {
            return false; // Evento válido
        }
    
        // Si la fecha del evento es igual a ahora, comprobamos la hora
        if (isSameDay(fechaEvento, now)) {
            console.log('que onda hora', horaEvento);
            console.log('que onda now', now);
            return horaEvento < now; // Solo válido si la hora de fin es mayor que ahora
        }
    
        // Si la fecha del evento es menor que ahora, no es válido
        return true; // Evento no válido
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/events/', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access')}`
                    }
                });

                const now = new Date();  // Fecha y hora actual
                const eventos = [];
                const beneficios = [];
                const descuentos = [];
                const practicas = [];

                //Corregido fechas
                response.data.forEach(evento => {
                    const now = new Date();
                
                    if (evento.tipo_e === 'evento' && evento.disponible) {
                        const fechaEvento = new Date(evento.fecha_fin_evento + 'T00:00:00');
                        const horaEvento = new Date(`${evento.fecha_fin_evento}T${evento.hora_fin_evento}`);
                
                        // Verifica si el evento ha terminado utilizando la función hasEventEnded
                        if (hasEventEnded(evento.fecha_fin_evento, evento.hora_fin_evento)) {
                            return; // El evento ha terminado, lo descartamos
                        }
                        eventos.push(evento);
                    } else if (evento.tipo_e === 'beneficio') {
                        const fechaFin = evento.fecha_fin_beneficio ? new Date(evento.fecha_fin_beneficio + 'T00:00:00') : null;
                
                        // Si no hay fecha_fin, lo consideramos válido
                        if (!fechaFin || fechaFin > now) {
                            beneficios.push(evento);
                        }
                    } else if (evento.tipo_e === 'descuento') {
                        const fechaFin = evento.fecha_fin_descuento ? new Date(evento.fecha_fin_descuento + 'T00:00:00') : null;
                
                        // Si no hay fecha_fin, lo consideramos válido
                        if (!fechaFin || fechaFin > now) {
                            descuentos.push(evento);
                        }
                    } else if (evento.tipo_e === 'practica') {
                        const fechaFin = evento.fecha_fin_practica ? new Date(evento.fecha_fin_practica + 'T00:00:00') : null;
                
                        // Si no hay fecha_fin, lo consideramos válido
                        if (!fechaFin || fechaFin > now) {
                            practicas.push(evento);
                        }
                    }
                });

                // response.data.forEach(evento => {
                //     if (evento.tipo_e === 'evento') {
                //         const fechaEvento = new Date(evento.fecha_fin_evento);
                //         const horaEvento = new Date(`${evento.fecha_fin_evento}T${evento.hora_fin_evento}`);

                //         // Verifica si el evento ha terminado
                //         if (fechaEvento < now || (isSameDay(fechaEvento, now) && horaEvento < now)) {
                //             return; // El evento ha terminado, lo descartamos
                //         }
                //         eventos.push(evento);
                //     } else if (evento.tipo_e === 'beneficio') {
                //         const fechaFin = evento.fecha_fin_beneficio ? new Date(evento.fecha_fin_beneficio) : null;

                //         // Si no hay fecha_fin, lo consideramos válido
                //         if (!fechaFin || fechaFin > now) {
                //             beneficios.push(evento);
                //         }
                //     } else if (evento.tipo_e === 'descuento') {
                //         const fechaFin = evento.fecha_fin_descuento ? new Date(evento.fecha_fin_descuento) : null;

                //         // Si no hay fecha_fin, lo consideramos válido
                //         if (!fechaFin || fechaFin > now) {
                //             descuentos.push(evento);
                //         }
                //     } else if (evento.tipo_e === 'practica') {
                //         const fechaFin = evento.fecha_fin_practica ? new Date(evento.fecha_fin_practica) : null;

                //         // Si no hay fecha_fin, lo consideramos válido
                //         if (!fechaFin || fechaFin > now) {
                //             practicas.push(evento);
                //         }
                //     }
                // });

                setEvents(eventos);
                setBenefitEvents(beneficios);
                setDescuentosEvents(descuentos);
                setPracticasEvents(practicas);
            } catch (error) {
                setError('Error fetching events');
                console.error(error.response.data);
            }
        };
        // const fetchEvents = async () => {
        //     try {
        //         const response = await axios.get('http://localhost:8000/api/events/', {
        //             headers: {
        //                 'Authorization': `Bearer ${localStorage.getItem('access')}`
        //             }
        //         });
        //         const eventos = response.data.filter(evento => evento.tipo_e === 'evento');
        //         setEvents(eventos);

        //         const beneficios = response.data.filter(evento => evento.tipo_e === 'beneficio');
        //         setBenefitEvents(beneficios);
        //     } catch (error) {
        //         setError('Error fetching events');
        //         console.error(error.response.data);
        //     }
        // };
        fetchEvents();
    }, []);
    
    useEffect(() => {
        const fetchUserCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/user/categories/', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access')}`
                    }
                });
                const categorias = response.data.categorias_preferidas || [];
                setUserCategories(categorias.filter(categoria => categoria.tipo_e === 'evento'));
                setBenefitCategories(categorias.filter(categoria => categoria.tipo_e === 'beneficio'));
                setDescuentosCategories(categorias.filter(categoria => categoria.tipo_e === 'descuento'));
                setPracticasCategories(categorias.filter(categoria => categoria.tipo_e === 'practica'));
            } catch (error) {
                console.error('Error fetching user categories', error);
            }
        };

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
        
                // Verificar si el usuario está baneado
                if (response.data.baneo) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Acceso Denegado',
                        text: 'Has sido baneado, comunícate con un administrador.',
                    }).then(() => {
                        localStorage.removeItem('access'); // Elimina el token del localStorage
                        localStorage.removeItem('refresh');
                        localStorage.removeItem('user');
                        navigate('/'); // Redirige a la página principal o login
                    });
                    return; // Salir de la función
                }
        
                // Si no está baneado, continuar con la asignación de datos
                setCurrentUserData(response.data);
        
            } catch (error) {
                setError('Error al obtener el perfil del usuario');
                console.error(error);
            }
        };

        fetchUserProfile();
        fetchUserCategories();
    }, []);

    useEffect(() => {
        document.body.style.overflow = 'auto'; // Asegúrate de que el overflow esté habilitado
        return () => {
            document.body.style.overflow = ''; // Limpia el estilo cuando el componente se desmonta
        };
    }, []);

    //Filtrar eventos tipo evento
    useEffect(() => {
        const filterEvents = () => {
            let categorizedEvents = [];
            let randomEvents = [];
            const allEvents = [...events];
    
            if (userCategories.length > 0) {
                // Filtra eventos que coinciden con las categorías preferidas del usuario
                categorizedEvents = events.filter(evento =>
                    evento.categorias.some(categoria =>
                        userCategories.some(userCat => userCat.id === categoria.id)
                    )
                );
    
                // Asegúrate de que los eventos no se repitan
                categorizedEvents = Array.from(new Set(categorizedEvents.map(event => event.id)))
                    .map(id => categorizedEvents.find(event => event.id === id));
            }
    
            if (categorizedEvents.length >= 9) {
                setFilteredEvents(categorizedEvents.slice(0, 9));
            } else {
                // Si no hay suficientes eventos categorizados, añadir eventos aleatorios
                randomEvents = allEvents.filter(evento => !categorizedEvents.some(catEvent => catEvent.id === evento.id));
                randomEvents = [...randomEvents].sort(() => 0.5 - Math.random()).slice(0, 9 - categorizedEvents.length);
                setFilteredEvents([...categorizedEvents, ...randomEvents]);
            }
        };
    
        filterEvents();
    }, [events, userCategories]);
    
    const getCarouselItems = () => {
        const sections = [];
        for (let i = 0; i < filteredEvents.length; i += 3) {
            sections.push(filteredEvents.slice(i, i + 3));
        }
        return sections;
    };
    
    // Usar getCarouselItems para renderizar el carrusel
    const carouselItems = getCarouselItems();

    //Filtrar tipo beneficio
    useEffect(() => {
        const filterBenefitEvents = () => {
            let categorizedBenefits = [];
            let randomBenefits = [];
            const allBenefits = [...benefitEvents];
    
            if (benefitCategories.length > 0) {
                // Filtra eventos que coinciden con las categorías preferidas del usuario
                categorizedBenefits = benefitEvents.filter(evento =>
                    evento.categorias.some(categoria =>
                        benefitCategories.some(userCat => userCat.id === categoria.id)
                    )
                );
    
                // Asegúrate de que los eventos no se repitan
                categorizedBenefits = Array.from(new Set(categorizedBenefits.map(event => event.id)))
                    .map(id => categorizedBenefits.find(event => event.id === id));
            }
    
            if (categorizedBenefits.length >= 9) {
                setFilteredBenefitEvents(categorizedBenefits.slice(0, 9));
            } else {
                // Si no hay suficientes eventos categorizados, añadir eventos aleatorios
                randomBenefits = allBenefits.filter(evento => !categorizedBenefits.some(catEvent => catEvent.id === evento.id));
                randomBenefits = [...randomBenefits].sort(() => 0.5 - Math.random()).slice(0, 9 - categorizedBenefits.length);
                setFilteredBenefitEvents([...categorizedBenefits, ...randomBenefits]);
            }
        };
    
        filterBenefitEvents();
    }, [benefitEvents, benefitCategories]);

    const getBenefitCarouselItems = () => {
        const sections = [];
        for (let i = 0; i < filteredBenefitEvents.length; i += 3) {
            sections.push(filteredBenefitEvents.slice(i, i + 3));
        }
        return sections;
    };
    
    // Usar getBenefitCarouselItems para renderizar el carrusel de beneficios
    const benefitCarouselItems = getBenefitCarouselItems();

    //Filtrar tipo descuento
    useEffect(() => {
        const filterDescuentoEvents = () => {
            let categorizedDescuentos = [];
            let randomDescuentos = [];
            const allDescuentos = [...descuentosEvents];
    
            if (descuentosCategories.length > 0) {
                // Filtra eventos que coinciden con las categorías preferidas del usuario
                categorizedDescuentos = descuentosEvents.filter(evento =>
                    evento.categorias.some(categoria =>
                        descuentosCategories.some(userCat => userCat.id === categoria.id)
                    )
                );
    
                // Asegúrate de que los eventos no se repitan
                categorizedDescuentos = Array.from(new Set(categorizedDescuentos.map(event => event.id)))
                    .map(id => categorizedDescuentos.find(event => event.id === id));
            }
    
            if (categorizedDescuentos.length >= 9) {
                setFilteredDescuentosEvents(categorizedDescuentos.slice(0, 9));
            } else {
                // Si no hay suficientes eventos categorizados, añadir eventos aleatorios
                randomDescuentos = allDescuentos.filter(evento => !categorizedDescuentos.some(catEvent => catEvent.id === evento.id));
                randomDescuentos = [...randomDescuentos].sort(() => 0.5 - Math.random()).slice(0, 9 - categorizedDescuentos.length);
                setFilteredDescuentosEvents([...categorizedDescuentos, ...randomDescuentos]);
            }
        };
    
        filterDescuentoEvents();
    }, [descuentosEvents, descuentosCategories]);

    const getDescuentoCarouselItems = () => {
        const sections = [];
        for (let i = 0; i < filteredDescuentosEvents.length; i += 3) {
            sections.push(filteredDescuentosEvents.slice(i, i + 3));
        }
        return sections;
    };
    
    // Usar getBenefitCarouselItems para renderizar el carrusel de beneficios
    const descuentoCarouselItems = getDescuentoCarouselItems();
    
    //Filtrar tipo Practicas
    useEffect(() => {
        const filterPracticaEvents = () => {
            let categorizedPracticas = [];
            let randomPracticas = [];
            const allPracticas = [...practicasEvents];
    
            if (practicasCategories.length > 0) {
                // Filtra eventos que coinciden con las categorías preferidas del usuario
                categorizedPracticas = practicasEvents.filter(evento =>
                    evento.categorias.some(categoria =>
                        practicasCategories.some(userCat => userCat.id === categoria.id)
                    )
                );
    
                // Asegúrate de que los eventos no se repitan
                categorizedPracticas = Array.from(new Set(categorizedPracticas.map(event => event.id)))
                    .map(id => categorizedPracticas.find(event => event.id === id));
            }
    
            if (categorizedPracticas.length >= 9) {
                setFilteredPracticasEvents(categorizedPracticas.slice(0, 9));
            } else {
                // Si no hay suficientes eventos categorizados, añadir eventos aleatorios
                randomPracticas = allPracticas.filter(evento => !categorizedPracticas.some(catEvent => catEvent.id === evento.id));
                randomPracticas = [...randomPracticas].sort(() => 0.5 - Math.random()).slice(0, 9 - categorizedPracticas.length);
                setFilteredPracticasEvents([...categorizedPracticas, ...randomPracticas]);
            }
        };
    
        filterPracticaEvents();
    }, [practicasEvents, practicasCategories]);

    const getPracticaCarouselItems = () => {
        const sections = [];
        for (let i = 0; i < filteredPracticasEvents.length; i += 3) {
            sections.push(filteredPracticasEvents.slice(i, i + 3));
        }
        return sections;
    };
    
    // Usar getBenefitCarouselItems para renderizar el carrusel de beneficios
    const practicaCarouselItems = getPracticaCarouselItems();

    const truncateDescription = (descripcion, maxLength) => {
        if (descripcion.length > maxLength) {
            return descripcion.substring(0, maxLength) + '...';
        }
        return descripcion;
    };

    return (
        <div>
            <Helmet>
                <title>Home</title>
            </Helmet>

            <style>
                {`
                    /* Estilo para hacer las flechas siempre visibles */
                    .carousel-control-prev,
                    .carousel-control-next {
                        width: 8%;
                        opacity: 0.7; /* Semi-transparente para no distraer demasiado */
                        transition: opacity 0.2s;
                    }

                    .carousel-control-prev:hover,
                    .carousel-control-next:hover {
                        opacity: 1; /* Opacidad completa al pasar el ratón sobre las flechas */
                    }

                    .carousel-control-prev-icon,
                    .carousel-control-next-icon {
                        background-color: rgba(0, 0, 0, 0.5); /* Fondo oscuro para mejorar la visibilidad */
                        border-radius: 50%;
                    }
                `}
            </style>
            
            {/* iNICIO */}
            <section className="container my-5">
                <div className="d-flex align-items-center mb-4">
                    <span>
                        <i className="fa-solid fa-house house-main" />
                    </span>
                    <div className="d-flex align-items-center w-100 mx-2">
                        <h2>Inicio</h2>
                    </div>
                </div>

                <div className="d-flex align-items-center mb-4">
                    <div className="d-flex align-items-center w-100 mx-2">
                        <h2>Eventos Recomendados</h2>
                        <div className="flex-grow-1 ms-2">
                            <hr />
                        </div>
                    </div>
                </div>

                {/* Carousel para Inicio */}
                <div id="inicioCarousel" className="carousel carousel-dark slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        {/* Primer seccion del carrousel con maximo 3 cards */}
                        {carouselItems.map((section, index) => (
                            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                <div className="row">
                                    {section.map(event => (
                                        <div className="col-md-4 mb-4" key={event.id}>
                                            <Link to={`/event/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                <div className="card preview-event-home">
                                                    <div className="ratio ratio-16x9">
                                                        <img src={event.imagen ? event.imagen : defaultImage} alt="event" className="w-100 h-100 object-fit-cover" />
                                                    </div>
                                                    <div className="card-body">
                                                        <h5 className="card-title">{event.nombre}</h5>
                                                        <p className="card-text">{truncateDescription(event.descripcion, 45)}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#inicioCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#inicioCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </section>
            
            {/* EVENTOS */}
            <section className="container my-5">
                <div className="d-flex align-items-center w-100 mb-4">
                    <h2>Beneficios Recomendados</h2>
                    <div className="flex-grow-1 ms-2">
                        <hr />
                    </div>
                </div>
                
                {/* Carousel para Beneficios */}
                <div id="eventosCarousel" className="carousel carousel-dark slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                    {benefitCarouselItems.map((section, index) => (
                        <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                            <div className="row">
                                {section.map(event => (
                                    <div className="col-md-4 mb-4" key={event.id}>
                                        <Link to={`/beneficio/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <div className="card preview-event-home">
                                                <div className="ratio ratio-16x9">
                                                    <img src={event.imagen ? event.imagen : defaultImage} alt="event" className="w-100 h-100 object-fit-cover" />
                                                </div>
                                                <div className="card-body">
                                                    <h5 className="card-title">{event.nombre}</h5>
                                                    <p className="card-text">{truncateDescription(event.descripcion, 45)}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                        {/* Puedes añadir más slides aquí si es necesario */}
                    </div>
                    <button className="carousel-control-prev custom-carousel-control" type="button" data-bs-target="#eventosCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next custom-carousel-control" type="button" data-bs-target="#eventosCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </section>
            
            {/* Descuentos */}
            <section className="container my-5">
                <div className="d-flex align-items-center w-100 mb-4">
                    <h2>Descuentos Recomendados</h2>
                    <div className="flex-grow-1 ms-2">
                        <hr />
                    </div>
                </div>
                
                {/* Carousel para Descuentos */}
                <div id="descuentosCarousel" className="carousel carousel-dark slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        {descuentoCarouselItems.map((section, index) => (
                            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                <div className="row">
                                    {section.map(event => (
                                        <div className="col-md-4 mb-4" key={event.id}>
                                            <Link to={`/descuento/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                <div className="card preview-event-home">
                                                    <div className="ratio ratio-16x9">
                                                        <img src={event.imagen ? event.imagen : defaultImage} alt="event" className="w-100 h-100 object-fit-cover" />
                                                    </div>
                                                    <div className="card-body">
                                                        <h5 className="card-title">{event.nombre}</h5>
                                                        <p className="card-text">{truncateDescription(event.descripcion, 45)}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {/* Puedes añadir más slides aquí si es necesario */}
                    </div>
                    <button className="carousel-control-prev custom-carousel-control" type="button" data-bs-target="#descuentosCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next custom-carousel-control" type="button" data-bs-target="#descuentosCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </section>

            {/* Practicas */}
            <section className="container my-5">
                <div className="d-flex align-items-center w-100 mb-4">
                    <h2>Prácticas Recomendadas</h2>
                    <div className="flex-grow-1 ms-2">
                        <hr />
                    </div>
                </div>
                
                {/* Carousel para Practicas */}
                <div id="profesionalesCarousel" className="carousel carousel-dark slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        {practicaCarouselItems.map((section, index) => (
                            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                <div className="row">
                                    {section.map(event => (
                                        <div className="col-md-4 mb-4" key={event.id}>
                                            <Link to={`/practica/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                <div className="card preview-event-home">
                                                    <div className="ratio ratio-16x9">
                                                        <img src={event.imagen ? event.imagen : defaultImage} alt="event" className="w-100 h-100 object-fit-cover" />
                                                    </div>
                                                    <div className="card-body">
                                                        <h5 className="card-title">{event.nombre}</h5>
                                                        <p className="card-text">{truncateDescription(event.descripcion, 45)}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {/* Puedes añadir más slides aquí si es necesario */}
                    </div>
                    <button className="carousel-control-prev custom-carousel-control" type="button" data-bs-target="#profesionalesCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next custom-carousel-control" type="button" data-bs-target="#profesionalesCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </section>
        </div>
    );
}

export default HomeUser;
