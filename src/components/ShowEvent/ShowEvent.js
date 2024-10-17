import './ShowEvent.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';
import {toast} from 'react-hot-toast';
import { format, isSameDay } from 'date-fns';
import es from 'date-fns/locale/es';
import { Helmet } from 'react-helmet';

function ShowEvent() {
    const { id } = useParams();  // Captura el ID del evento desde la URL
    const [eventData, setEventData] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [currentUserData, setCurrentUserData] = useState(null);
    const [asistido, setAsistido] = useState(false);
    const [totalAsistentes, setTotalAsistentes] = useState(0);
    const defaultImage = '/img/default-logo.jpg';
    //categorias
    const [categoriaPrincipal, setCategoriaPrincipal] = useState('');
    const [categoriasAsociadas, setCategoriasAsociadas] = useState([]);

    //currentShowProfile
    const [profileName, setProfileName] = useState('');
    const [profileImagen, setProfileImagen] = useState('');
    const [profileDescription, setProfileDescription] = useState('');
    const [profileCorreo, setProfileCorreo] = useState('');
    const [profileTelefono, setProfileTelefono] = useState('');

    //Recommended Events
    const [recommendedEvents, setRecommendedEvents] = useState([]);


    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/events/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access')}`
                    }
                });
                setEventData(response.data);
                setAsistido(response.data.asistido_por_usuario);
                setTotalAsistentes(response.data.numero_asistentes || 0);
                setCategoriaPrincipal(response.data.categoria_p || '');
                setCategoriasAsociadas(response.data.categorias || []);
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

    //Funcion para ir a editar el evento
    const handleEdit = () => {
        navigate(`/updateEvent/${eventData.id}`);
    }

    //Funcion para eliminar el evento
    const deleteEvent = async () => {
        const token = localStorage.getItem('access');
        if (!token) {
          Swal.fire({
            title: 'Error',
            icon: 'error',
            text: 'No token found',
            confirmButtonText: 'OK'
          });
          return;
        }
    
        try {
          await axios.delete(`http://localhost:8000/api/events/${id}/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          return true;  // Indica que la eliminación fue exitosa
        } catch (error) {
          Swal.fire({
            title: 'Error',
            icon: 'error',
            text: 'Error deleting event',
            confirmButtonText: 'OK'
          });
          return false;  // Indica que hubo un error
        }
      };

    
    const [initialUrl, setInitialUrl] = useState(window.location.href);
    
    // Funcion para mostrar el mensaje de confirmacion y dirigir el flujo de eliminacion de eventos
    const handleDelete = async () => {
        // Guardar la URL actual
        setInitialUrl(window.location.href);
    
        // Mostrar el cuadro de diálogo de confirmación
        const result = await Swal.fire({
          title: '¿Estás seguro que deseas eliminar este evento?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí',
          cancelButtonText: 'No',
          reverseButtons: true
        });
    
        // Verificar la URL después de la confirmación
        if (result.isConfirmed) {
          if (initialUrl === window.location.href) {
            // La URL no ha cambiado, proceder con la eliminación
            const success = await deleteEvent();
            if (success) {
              await Swal.fire({
                title: 'Eliminado',
                icon: 'success',
                text: 'El evento ha sido eliminado.',
                timer: 1700,
                showConfirmButton: false
              });
              navigate('/showAllEvents');  // Redirige después de eliminar
            }
          } else {
            // La URL ha cambiado, no realizar la acción
            console.log('La URL ha cambiado, acción no realizada');
            await Swal.fire({
                title: 'Cancelado',
                icon: 'info',
                text: 'La URL ha cambiado, la acción no se realizó.',
            });
          }
        } else {
          // Acción si el usuario cancela
          return
        }
      }

    const handleDeleteCommentWithConfirmation = async (commentId) => {
        // Guardar la URL actual
        setInitialUrl(window.location.href);
        
        // Mostrar el cuadro de diálogo de confirmación
        const result = await Swal.fire({
            title: '¿Estás seguro que deseas eliminar este comentario?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        });

        // Verificar la URL después de la confirmación
        if (result.isConfirmed) {
            if (initialUrl === window.location.href) {
                try {
                    // Envía una solicitud DELETE para eliminar el comentario
                    await axios.delete(`http://localhost:8000/api/eventos/${id}/comentarios/${commentId}/`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('access')}`
                        }
                    });

                    // Actualiza el estado eliminando el comentario eliminado
                    setComments(comments.filter(comment => comment.id !== commentId));

                    // Muestra mensaje de éxito
                    await Swal.fire({
                        title: 'Eliminado',
                        icon: 'success',
                        text: 'El comentario ha sido eliminado.',
                        timer: 1700,
                        showConfirmButton: false
                    });
                } catch (error) {
                    console.error('Error deleting comment', error);
                    await Swal.fire({
                        title: 'Error',
                        icon: 'error',
                        text: 'Hubo un problema al eliminar el comentario.',
                    });
                }
            } else {
                // La URL ha cambiado, no realizar la acción
                console.log('La URL ha cambiado, acción no realizada');
                await Swal.fire({
                    title: 'Cancelado',
                    icon: 'info',
                    text: 'La URL ha cambiado, la acción no se realizó.',
                });
            }
        } else {
            // Acción si el usuario cancela
            return
        }
    }

    // Confirmar asistencia
    const handleAsistir = async () => {
        try {
            await axios.post(`http://localhost:8000/api/events/${id}/asistencia/`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                    'Content-Type': 'application/json'
                }
            });
    
            setAsistido(true);
            setTotalAsistentes(prev => prev + 1);
            toast.success('Asistencia confirmada', { position: 'bottom-right', style: { background: "#101010", color: "#fff", borderRadius: "5px" } });
    
            // Mostrar SweetAlert2
            const { isConfirmed } = await Swal.fire({
                title: '¿Agregar a Google Calendar?',
                text: "¿Quieres agregar este evento a tu calendario de Google?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: 'No'
            });
    
            // Si el usuario confirma, redirigir a Google Calendar
            if (isConfirmed) {
                // Crear objetos Date
                const startDateTime = new Date(`${eventData.fecha_evento}T${eventData.hora_evento}`);
                const endDateTime = new Date(`${eventData.fecha_fin_evento}T${eventData.hora_fin_evento}`);
    
                // Formatear las fechas en el formato correcto para Google Calendar
                const start = format(startDateTime, "yyyyMMdd'T'HHmmss");
                const end = format(endDateTime, "yyyyMMdd'T'HHmmss");
    
                // Incluir el lugar del evento
                const location = encodeURIComponent(eventData.lugar_evento || '');  // Asegúrate de que el campo exista
    
                const eventUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventData.nombre)}&details=${encodeURIComponent(eventData.descripcion)}&dates=${start}/${end}&location=${location}&sf=true&output=xml`;
    
                window.open(eventUrl, '_blank');  // Abre el enlace en una nueva ventana
            }
    
        } catch (error) {
            setError('Error confirming attendance');
            console.error(error.response.data);
        }
    };
    
    // const handleAsistir = async () => {
    //     try {
    //       await axios.post(`http://localhost:8000/api/events/${id}/asistencia/`, {}, {
    //         headers: {
    //           'Authorization': `Bearer ${localStorage.getItem('access')}`,
    //           'Content-Type': 'application/json'
    //         }
    //       });
    //       setAsistido(true);
    //       setTotalAsistentes(prev => prev + 1);
    //       toast.success('Asistencia confirmada', { position: 'bottom-right',style: {
    //         background:"#101010",
    //         color:"#fff",
    //         bordeRadius:"5px"
    //     }
    //     });

    //     } catch (error) {
    //       setError('Error confirming attendance');
    //       console.error(error.response.data);
    //     }
    //   }
    
    
    // Quitar asistencia
    const handleNoAsistir = async () => {
    try {
        await axios.delete(`http://localhost:8000/api/events/${id}/asistencia/`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Content-Type': 'application/json'
        }
        });
        setAsistido(false);
        setTotalAsistentes(prev => Math.max(0, prev - 1));
        toast.success('Asistencia Eliminada', { position: 'bottom-right',style: {
            background:"#101010",
            color:"#fff",
            bordeRadius:"5px"
        }
        });
    } catch (error) {
        setError('Error removing attendance');
        console.error(error.response.data);
    }
    }

    // Función para capitalizar la primera letra de dias de la semana y meses
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    
    const capitalizeAllText = (str) => {
        // Asegúrate de que valor sea una cadena
        if (typeof str !== 'string') {
          str = String(str); // Convierte a cadena si no lo es
        }
        return str.toUpperCase(); // Convierte a mayúsculas
      };

    //Hacer fecha más agradable
    function formatEventDate(startDate, startTime, endDate, endTime) {
        // Convertir las cadenas de fecha y hora a un formato de fecha válido
        const startDateTime = new Date(`${startDate}T${startTime}`);
        const endDateTime = new Date(`${endDate}T${endTime}`);

        // Comprobar si las fechas son válidas
        if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
            return 'Fecha o hora inválida';
        }

        // Obtener los valores formateados
        const dayOfWeekStart = capitalize(format(startDateTime, 'eeee', { locale: es }));
        const dayOfWeekEnd = capitalize(format(endDateTime, 'eeee', { locale: es }));
        const dayStart = format(startDateTime, 'd');
        const monthStart = capitalize(format(startDateTime, 'MMMM', { locale: es }));
        const yearStart = format(startDateTime, 'yyyy');
        const timeStart = format(startDateTime, 'h:mm a');
        const timeEnd = format(endDateTime, 'h:mm a');

        if (startDate === endDate) {
            return `${dayOfWeekStart} ${dayStart} de ${monthStart} de ${yearStart} ${timeStart} a ${timeEnd}`;
        } else {
            const dayEnd = format(endDateTime, 'd');
            const monthEnd = capitalize(format(endDateTime, 'MMMM', { locale: es }));
            const yearEnd = format(endDateTime, 'yyyy');
            return `Desde ${dayOfWeekStart} ${dayStart} de ${monthStart} de ${yearStart} ${timeStart} a ${dayOfWeekEnd} ${dayEnd} de ${monthEnd} de ${yearEnd} ${timeEnd}`;
        }
    }

    //Fill show profile info
    function fillProfileInfo(name, description, image, email, phone){
        setProfileName(name);
        setProfileDescription(description);
        setProfileImagen(image);
        setProfileCorreo(email);
        setProfileTelefono(phone);
    }


    const closeModal = () => {
        // Quitar la sombra del CSS
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.parentNode.removeChild(backdrop));
    
        // Restablecer el padding-right del body a 0
        document.body.style.paddingRight = '0';
    };
    
    const handleUrlChange = () => {
        closeModal();
    };
    
    useEffect(() => {
        const modalElement = document.getElementById('showProfileModal');
    
        const handleModalShow = () => {
            // Asegurarse de que no haya sombras previas
            closeModal();
            window.addEventListener('popstate', handleUrlChange);
            window.addEventListener('hashchange', handleUrlChange);
        };
    
        const handleModalHide = () => {
            window.removeEventListener('popstate', handleUrlChange);
            window.removeEventListener('hashchange', handleUrlChange);
        };
    
        if (modalElement) {
            modalElement.addEventListener('show.bs.modal', handleModalShow);
            modalElement.addEventListener('hidden.bs.modal', handleModalHide);
        }
    
        // Limpiar los listeners al desmontar el componente
        return () => {
            if (modalElement) {
                modalElement.removeEventListener('show.bs.modal', handleModalShow);
                modalElement.removeEventListener('hidden.bs.modal', handleModalHide);
            }
        };
    }, []);

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
        const fetchRecommendedEvents = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/events/', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access')}`
                    }
                });
    
                const now = new Date();  // Fecha y hora actual
                const eventos = [];
                const excludedId = id;
    
                response.data.forEach(evento => {
                    if (evento.tipo_e === 'evento' && evento.id !== parseInt(excludedId) && evento.disponible) {
                        const fechaEvento = new Date(evento.fecha_fin_evento);
                        const horaEvento = new Date(`${evento.fecha_fin_evento}T${evento.hora_fin_evento}`);
    
                        // Verifica si el evento ha terminado utilizando la función hasEventEnded
                        if (hasEventEnded(evento.fecha_fin_evento, evento.hora_fin_evento)) {
                            return; // El evento ha terminado, lo descartamos
                        }
                        eventos.push(evento);
                    }
                });
    
                // Limitar el número de eventos a 4
                // Mezclar los eventos aleatoriamente
                const shuffledEvents = eventos.sort(() => 0.5 - Math.random());
                setRecommendedEvents(shuffledEvents.slice(0, 4));
            } catch (error) {
                setError('Error fetching events');
                console.error(error.response.data);
            }
        };
        
        fetchRecommendedEvents();
    }, [id]);

    //Entrar a evento recomendado
    const handleIntoRecommendedEvent = (eventId) => {
        window.scrollTo(0, 0);
        navigate(`/event/${eventId}`);
    };

    
    // const hasEventEnded = (fechaFin, horaFin) => {
    //     const fechaEvento = new Date(fechaFin);
    //     const horaEvento = new Date(`${fechaFin}T${horaFin}`);
    //     const now = new Date();
    
    //     return fechaEvento < now || (isSameDay(fechaEvento, now) && horaEvento < now);
    // };

    const truncateDescription = (descripcion, maxLength) => {
        if (descripcion.length > maxLength) {
            return descripcion.substring(0, maxLength) + '...';
        }
        return descripcion;
    };

    //Validar que el evento sea un evento en espera
    useEffect(() => {
        // Verificar que ambas variables tengan información
        if (eventData.usuario && currentUserData) {
          if (!eventData.disponible && currentUserData.permiso_u !== 'admin' && currentUserData.id !== eventData.usuario.id) {
            Swal.fire({
              title: 'Error',
              icon: 'error',
              text: `No tienes permiso para ver este evento`,
              confirmButtonText: 'OK'
            });
            navigate('/showAllEvents');
          }
        }
      }, [eventData, currentUserData, navigate]);


    return (
        <>  
            <Helmet>
                <title>{eventData.nombre}</title>
            </Helmet>

            
            {/* <UserNavbar/> */}
            <div className="general-color mb-5">
                {/* Item */}
                <section className='mt-5'>
                {/* Main info and image */}
                <div className="container">
                    <div className="row">
                    {/* Title */}
                    {/* Aqui en Nombre del evento va el nombre del evento*/}
                    <div className="col-12 pb-3 pb-lg-5">
                        <h1 className="main-title-event">{eventData.nombre} {hasEventEnded(eventData.fecha_fin_evento, eventData.hora_fin_evento) && <span className='text-danger'>(Finalizado)</span>} {!eventData.disponible && <span className='text-primary'>(No Visible)</span>}</h1>
                    </div>
                    {/* Item image */}
                    <div className="col-lg-8 col-xl-7 order-2 order-lg-1">
                        <img
                        src={eventData.imagen ? eventData.imagen : defaultImage}
                        alt="imagen del item"
                        className="img-item w-100 h-100 object-fit-cover"
                        />
                    </div>
                    {/* Item main info */}
                    <div className="col-lg-4 col-xl-3 ps-lg-5 order-1 order-lg-2 mb-4 mb-lg-0">
                        <div className="main-info p-lg-3 p-3 p-lg-0 overflow-y-auto overflow-x-hidden">
                        <p className="main-info-title">Fecha</p>
                        <p>
                            {" "}
                            <span>
                            <i className="fas fa-calendar-alt" />
                            </span>{" "}
                            {formatEventDate(eventData.fecha_evento, eventData.hora_evento, eventData.fecha_fin_evento, eventData.hora_fin_evento)}
                        </p>
                        <p className="main-info-title">Lugar</p>
                        <p>
                            {" "}
                            <span>
                            <i className="fas fa-map-marker-alt" />
                            </span>{" "}
                            {eventData.lugar_evento}
                        </p>
                        <p className="main-info-title">Categorias</p>
                        <p>
                        <span className="badge bg-primary text-light me-1">{categoriaPrincipal}</span>

                        {categoriasAsociadas.filter(categoria => categoria.nombre !== categoriaPrincipal).length > 0 && (
                        <div className='d-inline'>
                            {categoriasAsociadas
                                .filter(categoria => categoria.nombre !== categoriaPrincipal)
                                .map(categoria => (
                                <span key={categoria.id} className="badge bg-info text-dark me-1">
                                    {categoria.nombre}
                                </span>
                                ))}
                        </div>
                        )}

                        </p>

                        <p className="main-info-title">Autor</p>
                        {/* Aqui en Nombre autor va el nombre del usuario que creo el evento */}
                        <p>
                            {" "}
                            <span>
                                {eventData.usuario && eventData.usuario.imagen ? (
                                    <img
                                        src={eventData.usuario.imagen}
                                        alt="User"
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            cursor: 'pointer',
                                        }}
                                        data-bs-toggle="modal" 
                                        data-bs-target="#showProfileModal"
                                        onClick={() => fillProfileInfo(eventData.usuario.nombre + ' ' + eventData.usuario.apellidos, eventData.usuario.descripcion, eventData.usuario.imagen, eventData.usuario.email, eventData.usuario.telefono)}
                                    />
                                ) : (
                                    <span data-bs-toggle="modal" data-bs-target="#showProfileModal">
                                        <i className="bi bi-person-circle" style={{cursor: 'pointer',}} onClick={() => fillProfileInfo(eventData.usuario.nombre + ' ' + eventData.usuario.apellidos, eventData.usuario.descripcion, eventData.usuario.imagen, eventData.usuario.email, eventData.usuario.telefono)}/>
                                    </span>
                                )}

                            </span>{" "}
                            {eventData.usuario && `${eventData.usuario.nombre} ${eventData.usuario.apellidos}`}
                        </p>

                        {/* Botones de asistencia y no asistencia */}
                        {!hasEventEnded(eventData.fecha_fin_evento, eventData.hora_fin_evento) && (
                            <>
                                {asistido ? (
                                    <button className="btn btn-danger btn-sm me-3" onClick={handleNoAsistir}><i class="fa-solid fa-user-minus"></i> No Asistiré</button>
                                ) : (
                                    <button className="btn btn-success btn-sm me-3" onClick={handleAsistir}><i class="fa-solid fa-user-plus"></i> Asistiré</button>
                                )}
                            </>
                        )}

                        {/* Botones para editar y borrar */}
                        {currentUserData && eventData.usuario && (
                            <div className='d-inline'>
                                {currentUserData.id === eventData.usuario.id ? (
                                    <>
                                        <button className="btn btn-warning btn-sm me-1" onClick={handleEdit}>
                                            <i className="fa-regular fa-pen-to-square"></i>
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={handleDelete}>
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </>
                                ) : currentUserData.permiso_u === 'admin' && eventData.disponible ? (
                                    <button className="btn btn-danger btn-sm" onClick={handleDelete}>
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                ) : null}
                            </div>
                        )}
                        {/* {currentUserData && eventData.usuario && currentUserData.id === eventData.usuario.id && (
                            <div className='d-inline'>
                                <button className="btn btn-warning btn-sm me-1"><i className="fa-regular fa-pen-to-square" onClick={handleEdit}></i></button>
                                <button className="btn btn-danger btn-sm"><i className="fa-solid fa-trash" onClick={handleDelete}></i></button>
                            </div>
                        )} */}
                        
                        <p className="main-info-title mt-3">Host - <span className='text-primary'>{capitalizeAllText(eventData.host_evento)}</span></p>
                        <p className="main-info-title mt-3">Acceso - {eventData.acceso_e === 'publico' ? 'Público' : 'Red Universitaria'}</p>
                        <p className="main-info-title mt-3">Asistencia - {totalAsistentes} persona(s)</p>
                        </div>
                    </div>
                    {/* item description */}
                    <div className="col-lg-8 col-xl-7 order-3 mt-4 mt-lg-5 justify-text">
                        {/* Aqui debajo va la descripcion del evento */}
                        <p>
                        {eventData.descripcion}
                        </p>
                        {/* <p>Asistencia:{totalAsistentes}</p> */}
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
                                                {currentUserData && currentUserData.imagen ? (
                                                    <img
                                                        src={currentUserData.imagen}
                                                        alt="User"
                                                        className='me-1'
                                                        style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            borderRadius: '50%',
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                ) : (
                                                    <span>
                                                        <i className="bi bi-person-circle" />
                                                    </span>
                                                )} Añadir un comentario
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
                                                    {comment.usuario && comment.usuario.imagen ? (
                                                        <img
                                                            src={comment.usuario.imagen}
                                                            alt="User"
                                                            className='me-1'
                                                            style={{
                                                                width: '20px',
                                                                height: '20px',
                                                                borderRadius: '50%',
                                                                objectFit: 'cover',
                                                                cursor: 'pointer',
                                                            }}
                                                            data-bs-toggle="modal" 
                                                            data-bs-target="#showProfileModal"
                                                            onClick={() => fillProfileInfo(comment.usuario.nombre + ' ' + comment.usuario.apellidos, comment.usuario.descripcion, comment.usuario.imagen, comment.usuario.email, comment.usuario.telefono)}
                                                        />
                                                    ) : (
                                                        <span className="m-0 p-0">
                                                            <i className="bi bi-person-circle" data-bs-toggle="modal" data-bs-target="#showProfileModal" style={{cursor: 'pointer',}} onClick={() => fillProfileInfo(comment.usuario.nombre + ' ' + comment.usuario.apellidos, comment.usuario.descripcion, comment.usuario.imagen, comment.usuario.email, comment.usuario.telefono)}/>
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="col">
                                                    <div className="row">
                                                        <div className="col-12 name-user-comment">
                                                            <p className="mt-0 mb-1">{comment.usuario.nombre} {comment.usuario.apellidos}
                                                            {currentUserData && comment.usuario && (
                                                                (currentUserData.id === comment.usuario.id || currentUserData.permiso_u === 'admin') && (
                                                                    <button className="btn btn-danger btn-sm d-inline mx-2 delete-comment" onClick={() => handleDeleteCommentWithConfirmation(comment.id)}></button>
                                                                )
                                                            )}
                                                            {/* {currentUserData && comment.usuario && currentUserData.id === comment.usuario.id && (
                                                                <button className="btn btn-danger btn-sm d-inline mx-2 delete-comment" onClick={() => handleDeleteCommentWithConfirmation(comment.id)}></button>
                                                            )} */}
                                                            </p>
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
                    <span>Próximos Eventos</span>
                </p>
                </div>
                <div className="container mt-3 d-flex gap-5 flex-wrap justify-content-center">
                    {/* Event */}
                    {recommendedEvents.length > 0 ? (
                        recommendedEvents.map((event) => (
                            <div key={event.id} style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => handleIntoRecommendedEvent(event.id)}>
                                <div className="card preview-event" style={{ width: "18rem", maxHeight: "385px", minHeight: "385px"}}>
                                    <img src={event.imagen ? event.imagen : defaultImage} className="card-img-top w-100 h-100 object-fit-cover" alt={event.nombre} style={{ maxHeight: "180px", minHeight: "180px" }}/>
                                    <div className="card-body">
                                        <h5 className="card-title">{event.nombre}</h5>
                                        <p className="card-text">{truncateDescription(event.descripcion, 100)}</p>
                                        <a href="#" className="btn btn-dark">
                                            <i className="fa-solid fa-circle-info" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Por el momento no hay recomendaciones.</p>
                    )}
                
                </div>
            </div>

            {/* Modal show profile */}
            <div className="modal fade custom-modal" id="showProfileModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header d-flex align-items-center">
                            {/* Espacio para la foto del usuario */}
                            {profileImagen ? (
                                     <img src={profileImagen} alt="Foto de Usuario" className="rounded-circle me-3" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                ):(
                                    <span>
                                        <i className="bi bi-person-circle me-1" style={{fontSize:'1.5rem' }}/>
                                    </span>
                                )}
                            {/* Nickname del usuario */}
                            <h1 className="modal-title fs-5" id="exampleModalLabel">{profileName && (<>{profileName}</>)}</h1>
                            <button type="button" className="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/* Descripción del usuario */}
                            <div className="user-description">
                                <p className="main-info-title">Descripción</p>
                                 {profileDescription ? (
                                    <p>{profileDescription}</p>
                                ):(<p>Sin descripcion</p>)}
                            </div>
                            {/* Información de contacto del usuario */}
                            <div className="user-contact mt-3">
                                <p className="main-info-title">Contacto</p>
                                <p>Correo: {profileCorreo}</p>
                                {profileTelefono && currentUserData && ['admin', 'docente', 'empresa'].includes(currentUserData.permiso_u) &&(
                                    <p>Teléfono: {profileTelefono}</p>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
      
    );
  }
  
  export default ShowEvent;