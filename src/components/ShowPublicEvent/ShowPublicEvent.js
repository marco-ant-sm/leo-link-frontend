import './ShowPublicEvent.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';
import {toast} from 'react-hot-toast';
import { format, isSameDay } from 'date-fns';
import es from 'date-fns/locale/es';
import PublicNavbar from '../PublicNavbar/PublicNavbar';

function ShowPublicEvent() {
    const { id } = useParams();  // Captura el ID del evento desde la URL
    const [eventData, setEventData] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
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

    //Recommended Events
    const [recommendedEvents, setRecommendedEvents] = useState([]);


    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/public-events/${id}`);
                setEventData(response.data);
                setAsistido(response.data.asistido_por_usuario);
                setTotalAsistentes(response.data.numero_asistentes || 0);
                setCategoriaPrincipal(response.data.categoria_p || '');
                setCategoriasAsociadas(response.data.categorias || []);
                if (response.data.acceso_e === 'red-universitaria')
                {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Este evento es privado, Inicia Sesión para verlo.',
                      });
                      
                    navigate('/verEventosPublicos');
                }
            } catch (error) {
                setError('Error fetching event');
                console.error(error.response.data);
                navigate('/showAllEvents');
            }
        };

        fetchEvent();
    }, [id, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
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
          toast.success('Asistencia confirmada', { position: 'bottom-right',style: {
            background:"#101010",
            color:"#fff",
            bordeRadius:"5px"
        }
        });

        } catch (error) {
          setError('Error confirming attendance');
          console.error(error.response.data);
        }
      }
    
    
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
    function fillProfileInfo(name, description, image, email){
        setProfileName(name);
        setProfileDescription(description);
        setProfileImagen(image);
        setProfileCorreo(email);
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
                    if (evento.tipo_e === 'evento' && evento.id !== parseInt(excludedId)) {
                        const fechaEvento = new Date(evento.fecha_fin_evento);
                        const horaEvento = new Date(`${evento.fecha_fin_evento}T${evento.hora_fin_evento}`);
    
                        // Verifica si el evento ha terminado
                        if (fechaEvento < now || (isSameDay(fechaEvento, now) && horaEvento < now)) {
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
        <>
            <PublicNavbar/>
            <div className="general-color mb-5">
                {/* Item */}
                <section className='mt-5'>
                {/* Main info and image */}
                <div className="container">
                    <div className="row">
                    {/* Title */}
                    {/* Aqui en Nombre del evento va el nombre del evento*/}
                    <div className="col-12 pb-3 pb-lg-5">
                        <h1 className="main-title-event">{eventData.nombre} {hasEventEnded(eventData.fecha_fin_evento, eventData.hora_fin_evento) && <span className='text-danger'>(Finalizado)</span>}</h1>
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
                                        }}
                                    />
                                ) : (
                                    <span>
                                        <i className="bi bi-person-circle"/>
                                    </span>
                                )}

                            </span>{" "}
                            {eventData.usuario && `${eventData.usuario.nombre} ${eventData.usuario.apellidos}`}
                        </p>
                        
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
            </div>
        </>
      
    );
  }
  
  export default ShowPublicEvent;