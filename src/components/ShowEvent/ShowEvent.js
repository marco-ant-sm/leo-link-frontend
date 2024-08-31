import './ShowEvent.css';
import UserNavbar from '../UserNavbar/UserNavbar';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';

function ShowEvent() {
    const { id } = useParams();  // Captura el ID del evento desde la URL
    const [eventData, setEventData] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [currentUserData, setCurrentUserData] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/events/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access')}`
                    }
                });
                setEventData(response.data);
            } catch (error) {
                setError('Error fetching event');
                console.error(error.response.data);
                navigate('/showAllEvents');
            }
        };

        const fetchComments = async (eventId) => {
            try {
                const response = await axios.get(`http://localhost:8000/api/eventos/${eventId}/comentarios/`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access')}`
                    }
                });
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments', error);
            }
        };

        fetchEvent();
        fetchComments(id);
    }, [id, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

    useEffect(() => {
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

    fetchUserProfile();
    }, []);

    const [newComment, setNewComment] = useState('');

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if(newComment.trim() === ''){
            console.log("Ingresa un comentario");
            return;
        }
        try {
            const response = await axios.post(`http://localhost:8000/api/eventos/${eventData.id}/comentarios/`, {
                comentario: newComment,
                evento: id
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }
            });
            setComments([...comments, response.data]);
            setNewComment('');
        } catch (error) {
            console.error('Error posting comment', error);
        }
    };

    const handleEdit = () => {
        navigate(`/updateEvent/${eventData.id}`);
    }

    const handleDelete = () => {
        console.log('eliminando...');
    }
    

    return (
        <>
            <UserNavbar/>
            <div className="general-color mb-5">
                {/* Item */}
                <section className='mt-5'>
                {/* Main info and image */}
                <div className="container">
                    <div className="row">
                    {/* Title */}
                    {/* Aqui en Nombre del evento va el nombre del evento*/}
                    <div className="col-12 pb-3 pb-lg-5">
                        <h1 className="main-title-event">{eventData.nombre}</h1>
                    </div>
                    {/* Item image */}
                    <div className="col-lg-8 col-xl-7 order-2 order-lg-1">
                        <img
                        src="/img/event-1.jpg"
                        alt="imagen del item"
                        className="img-item"
                        />
                    </div>
                    {/* Item main info */}
                    <div className="col-lg-4 col-xl-3 ps-lg-5 order-1 order-lg-2 mb-4 mb-lg-0">
                        <div className="main-info p-lg-3 p-3 p-lg-0">
                        <p className="main-info-title">Fecha</p>
                        <p>
                            {" "}
                            <span>
                            <i className="fas fa-calendar-alt" />
                            </span>{" "}
                            Jueves, 11 de julio de 2024 1:30 PM a 3:00 PM
                        </p>
                        <p className="main-info-title">Lugar</p>
                        <p>
                            {" "}
                            <span>
                            <i className="fas fa-map-marker-alt" />
                            </span>{" "}
                            Auditorio Dr. Nikolai V. Mitskievich (Módulo Y)
                        </p>
                        <p className="main-info-title">Categorias</p>
                        <p>
                            <span className="badge bg-info text-dark">Emprendimiento</span>{" "}
                            <span className="badge bg-info text-dark">Comida</span>{" "}
                            <span className="badge bg-info text-dark">Público</span>{" "}
                            <span className="badge bg-info text-dark">Quimica</span>
                        </p>
                        <p className="main-info-title">Autor</p>
                        {/* Aqui en Nombre autor va el nombre del usuario que creo el evento */}
                        <p>
                            {" "}
                            <span>
                            <i className="bi bi-person-circle" />
                            </span>{" "}
                            {eventData.usuario && `${eventData.usuario.nombre} ${eventData.usuario.apellidos}`}
                        </p>
                        {/* Botones para editar y borrar */}
                        {currentUserData && eventData.usuario && currentUserData.id === eventData.usuario.id && (
                            <div>
                                <button class="btn btn-warning btn-sm me-1"><i class="fa-regular fa-pen-to-square" onClick={handleEdit}></i></button>
                                <button class="btn btn-danger btn-sm"><i class="fa-solid fa-trash" onClick={handleDelete}></i></button>
                            </div>
                        )}
                        </div>
                    </div>
                    {/* item description */}
                    <div className="col-lg-8 col-xl-7 order-3 mt-4 mt-lg-5 justify-text">
                        {/* Aqui debajo va la descripcion del evento */}
                        <p>
                        {eventData.descripcion}
                        </p>
                    </div>
                    </div>
                </div>
                </section>
                {/* Comments section */}
                <div className="container mt-4">
                    <div className="row">
                        <div className="col-12 col-lg-10">
                            <div className="border p-3 comments overflow-auto">
                                <h4><i className="fa-solid fa-comment" /> Comentarios</h4>

                                {/* Form to make a comment */}
                                <form className="form-floating mb-3 mt-4" onSubmit={handleCommentSubmit}>
                                    <div className="row">
                                        <div className="col-lg-11 col-10 form-floating">
                                            <input
                                                type="text"
                                                className="form-control custom-input"
                                                id="floatingInput"
                                                placeholder="Añadir un comentario"
                                                value={newComment}
                                                onChange={handleCommentChange}
                                                required
                                            />
                                            <label htmlFor="floatingInput">
                                                <span><i className="bi bi-person-circle" /></span> Añadir un comentario
                                            </label>
                                        </div>
                                        <div className="col-lg-1 col-2 m-0 p-0 d-flex">
                                            <button
                                                type="submit"
                                                className="btn btn-outline-dark align-self-end border-2 send"
                                            >
                                                <i className="fa-regular fa-paper-plane" />
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                {/* All comments section */}
                                <div className="mt-5">
                                    {comments.length === 0 ? (
                                        <p>No hay comentarios sobre este evento.</p>
                                    ) : (
                                        comments.map((comment) => (
                                            <div className="row mb-2" key={comment.id}>
                                                <div className="col-auto">
                                                    <span className="m-0 p-0">
                                                        <i className="bi bi-person-circle" />
                                                    </span>
                                                </div>
                                                <div className="col">
                                                    <div className="row">
                                                        <div className="col-12 name-user-comment">
                                                            <p className="mt-0 mb-1">{comment.usuario.nombre} {comment.usuario.apellidos}</p>
                                                        </div>
                                                        <div className="col-12 mt-0 mb-0 pt-0 pb-0">
                                                            <p className="mt-0 mb-0 pt-0 pb-0">{comment.comentario}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Upcoming events */}
                <div className="container mt-5 upcoming-events">
                <p>
                    <span>Próximos eventos</span>
                </p>
                </div>
                <div className="container mt-3 d-flex gap-5 flex-wrap justify-content-center">
                {/* Event */}
                <div className="card preview-event" style={{ width: "18rem" }}>
                    <img src="/img/event-2.jpg" className="card-img-top" alt="..." />
                    <div className="card-body">
                    <h5 className="card-title">Carrera Cucei</h5>
                    <p className="card-text">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis,
                        eligendi quae! Reprehenderit ex suscipit deserunt.
                    </p>
                    <a href="#" className="btn btn-dark">
                        <i className="fa-solid fa-circle-info" />
                    </a>
                    </div>
                </div>
                {/* Event */}
                <div className="card preview-event" style={{ width: "18rem" }}>
                    <img src="/img/event-2.jpg" className="card-img-top" alt="..." />
                    <div className="card-body">
                    <h5 className="card-title">Carrera Cucei</h5>
                    <p className="card-text">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis,
                        eligendi quae! Reprehenderit ex suscipit deserunt.
                    </p>
                    <a href="#" className="btn btn-dark">
                        <i className="fa-solid fa-circle-info" />
                    </a>
                    </div>
                </div>
                {/* Event */}
                <div className="card preview-event" style={{ width: "18rem" }}>
                    <img src="/img/event-2.jpg" className="card-img-top" alt="..." />
                    <div className="card-body">
                    <h5 className="card-title">Carrera Cucei</h5>
                    <p className="card-text">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis,
                        eligendi quae! Reprehenderit ex suscipit deserunt.
                    </p>
                    <a href="#" className="btn btn-dark">
                        <i className="fa-solid fa-circle-info" />
                    </a>
                    </div>
                </div>
                {/* Event */}
                <div className="card preview-event" style={{ width: "18rem" }}>
                    <img src="/img/event-2.jpg" className="card-img-top" alt="..." />
                    <div className="card-body">
                    <h5 className="card-title">Carrera Cucei</h5>
                    <p className="card-text">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis,
                        eligendi quae! Reprehenderit ex suscipit deserunt.
                    </p>
                    <a href="#" className="btn btn-dark">
                        <i className="fa-solid fa-circle-info" />
                    </a>
                    </div>
                </div>
                </div>
            </div>
        </>
      
    );
  }
  
  export default ShowEvent;