import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UpdateEventF.css';
import UserNavbar from '../UserNavbar/UserNavbar';
import Swal from 'sweetalert2';
import { format, parseISO} from 'date-fns';
import es from 'date-fns/locale/es';

function UpdateEventF() {
    const { id } = useParams();
    const [eventData, setEventData] = useState({});
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagen, setImagen] = useState(null);
    const [eliminarImagen, setEliminarImagen] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [currentUserData, setCurrentUserData] = useState(null);
    const navigate = useNavigate();

    // Campos distintivos de Evento
    const [fechaEvento, setFechaEvento] = useState('');
    const [horaEvento, setHoraEvento] = useState('');
    const [hostEvento, setHostEvento] = useState('');
    const [fechaFinEvento, setFechaFinEvento] = useState('');
    const [horaFinEvento, setHoraFinEvento] = useState('');
    const [lugarEvento, setLugarEvento] = useState('');
    const [accesoEvento, setAccesoEvento] = useState('');
    
    //categorias
    const [categorias, setCategorias] = useState([]);
    const [categoriaPrincipal, setCategoriaPrincipal] = useState('');
    const [categoriasAsociadas, setCategoriasAsociadas] = useState([]);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/events/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access')}`
                    }
                });
                setEventData(response.data);
                setNombre(response.data.nombre || '');
                setDescripcion(response.data.descripcion || '');
                setCategoriaPrincipal(response.data.categoria_p || '');
                setCategoriasAsociadas(response.data.categorias_ids || []);
                // Campos distintivos evento
                setFechaEvento(response.data.fecha_evento || '');
                setHoraEvento(response.data.hora_evento || '');
                setHostEvento(response.data.host_evento || '');
                setFechaFinEvento(response.data.fecha_fin_evento || '');
                setHoraFinEvento(response.data.hora_fin_evento || '');
                setLugarEvento(response.data.lugar_evento || '');
                setAccesoEvento(response.data.acceso_e || '');

            } catch (error) {
                setError('Error fetching event');
                console.error(error);
                navigate('/showAllEvents');
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/categories/');

                const categoriasEvento = response.data.filter(categoria => categoria.tipo_e === 'evento');
                setCategorias(categoriasEvento);

            } catch (error) {
                setError('Error fetching categories');
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

        fetchEvent();
        fetchCategories();
        fetchUserProfile();
    }, [id, navigate]);

    //Validamos que el usuario sea el dueño del evento
    useEffect(() => {
        if (eventData.usuario && currentUserData) {
            if (currentUserData.id !== eventData.usuario.id) {
                navigate('/showAllEvents');
            } else {
                return;
            }
        }
    }, [eventData, currentUserData, navigate]);

    //Verificar si la imagen es apropiada
    const verificarImagen = async (imagen) => {
        const img = new Image();
        const reader = new FileReader();
    
        return new Promise((resolve, reject) => {
            reader.onload = (e) => {
                img.src = e.target.result;
            };
    
            img.onload = async () => {
                const canvas = document.createElement('canvas');
                canvas.width = 224;
                canvas.height = 224;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, 224, 224);
                const imgData = ctx.getImageData(0, 0, 224, 224).data;
                const imgArray = Array.from(imgData).map(pixel => pixel / 255.0);
    
                try {
                    const response = await axios.post('http://localhost:5000/api', { imageArray: imgArray });
                    resolve(response.data.result);
                } catch {
                    reject('Error verificando la imagen');
                }
            };
    
            reader.readAsDataURL(imagen);
        });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        //validar imagen
        if (imagen) {
            Swal.fire({
                title: 'Validando contenido de la imagen...',
                html: '<style>.swal2-html { max-height: 150px; overflow: hidden; }</style>' +
                      '<div class="d-flex justify-content-center">' +
                      '<div class="spinner-border text-success" role="status">' +
                      '<span class="visually-hidden">Cargando...</span>' +
                      '</div></div>',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                const resultadoVerificacion = await verificarImagen(imagen);
                if (resultadoVerificacion === 'Desnudos.') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'La imagen es inapropiada. Por favor, selecciona otra.',
                    });
                    return;
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error,
                });
                return;
            }
        }

        // Validación de campos distintivoa
        if (!fechaEvento || !horaEvento || !hostEvento || !fechaFinEvento || !horaFinEvento || !lugarEvento || !accesoEvento) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Todos los campos en rojo son obligatorios',
            });
            return;
        }
    
        // Validación de nombre y descripción
        if (!nombre || !descripcion) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Nombre y descripción son obligatorios',
            });
            return;
        }
    
        if (!categoriaPrincipal) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La categoría principal es obligatoria',
            });
            return;
        }
        
        // Validación de fechas
        const hoy = new Date();
        const fechaEventoDate = new Date(fechaEvento);
        const fechaFinEventoDate = new Date(fechaFinEvento);

        if (fechaEventoDate <= hoy || fechaFinEventoDate <= hoy) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las fechas deben ser mayores a la fecha actual.',
            });
            return;
        }

        if (fechaEventoDate > fechaFinEventoDate) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La fecha de fin del evento debe ser mayor o igual que la fecha de inicio.',
            });
            return;
        }

        if (fechaEventoDate.getTime() === fechaFinEventoDate.getTime() && horaEvento >= horaFinEvento) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La hora de fin del evento debe ser mayor que la hora de inicio cuando las fechas son iguales.',
            });
            return;
        }

    
        const token = localStorage.getItem('access');
        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se encontró token de autenticación',
            });
            return;
        }
    
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
    
        if (eliminarImagen && !imagen) {
            formData.append('eliminar_imagen', true); // Mandar una señal al backend de que se debe eliminar la imagen
        } else if (imagen) {
            formData.append('imagen', imagen); // Subir nueva imagen si está presente
        }
    
        formData.append('categoria_p', categoriaPrincipal);
        formData.append('categorias_ids', categoriasAsociadas.filter(id => id !== categoriaPrincipal).join(',')); // Excluye la categoría principal si está en categorías asociadas
        formData.append('fecha_evento', fechaEvento);
        // Campos distintivos
        formData.append('hora_evento', horaEvento);
        formData.append('host_evento', hostEvento);
        formData.append('fecha_fin_evento', fechaFinEvento);
        formData.append('hora_fin_evento', horaFinEvento);
        formData.append('lugar_evento', lugarEvento);
        formData.append('acceso_e', accesoEvento);

        try {
            await axios.put(`http://localhost:8000/api/events/${id}/`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });
    
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Evento actualizado correctamente',
            }).then(() => {
                navigate('/showAllEvents');
            });
    
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al actualizar el evento',
            });
        }
    };


    const handleCategoriaPrincipalChange = (e) => {
        const nuevaCategoria = e.target.value;
        
        // Encontrar la categoría anterior si existe
        const categoriaAnterior = categorias.find(categoria => categoria.nombre === categoriaPrincipal);
        
        // Encontrar la nueva categoría
        const categoriaSeleccionada = categorias.find(categoria => categoria.nombre === nuevaCategoria);
        
        // Si el valor es vacío, eliminar la categoría anterior de categoriasAsociadas
        if (nuevaCategoria === "") {
          if (categoriaAnterior) {
            setCategoriasAsociadas(prevCategoriasAsociadas =>
              prevCategoriasAsociadas.filter(id => id !== categoriaAnterior.id)
            );
          }
        } else {
          // Si hay una categoría anterior, eliminamos su ID de categoriasAsociadas
          if (categoriaAnterior) {
            setCategoriasAsociadas(prevCategoriasAsociadas =>
              prevCategoriasAsociadas.filter(id => id !== categoriaAnterior.id)
            );
          }
          
          // Actualizamos la categoría principal
          setCategoriaPrincipal(nuevaCategoria);
          
          // Si hay una categoría seleccionada, añadimos su ID a categoriasAsociadas
          if (categoriaSeleccionada) {
            setCategoriasAsociadas(prevCategoriasAsociadas =>
              [...prevCategoriasAsociadas, categoriaSeleccionada.id]
            );
          }
        }
      };


    
    //Hacer predicción de asistencia
    const handleAttendancePrediction = async () => {
        // Validar campos requeridos
        if (!categoriaPrincipal || !fechaEvento || !hostEvento || !horaEvento) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Los campos en verde son obligatorios para realizar la predicción.',
            });
            return;
        }
    
        // Obtener los parámetros
        const categoriaMap = {
            'Deportivo': 'deportivo',
            'Salud': 'salud',
            'Recreativo': 'recreativo',
            'Académico': 'academico',
            'Laboral': 'laboral',
            'Informática': 'informatica',
            'Ocio': 'ocio',
            'Comercio': 'comercio',
            'Química': 'quimica',
            'Industrial': 'industrial',
            'Mecánica Eléctrica': 'meca-elec',
            'Electrónica': 'electronica',
            'Temático': 'tematico'
        };
    
        const quienMap = {
            'Cucei': 'cucei',
            'Empresa': 'empresa',
            'Consejo estudiantil': 'consejo estudiantil',
            'Docente': 'docente'
        };
    
        const categoria = categoriaMap[categoriaPrincipal];
        const quienLoRealiza = quienMap[hostEvento];
        const date = parseISO(fechaEvento);
        const mes = format(date, 'MMMM', { locale: es }).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const dia = format(date, 'EEEE', { locale: es }).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const hora = horaEvento.split(':')[0];
    
        const data = { categoria, mes, dia, quienLoRealiza, hora };
        
        Swal.fire({
            title: 'Realizando predicción...',
            html: '<style>.swal2-html { max-height: 150px; overflow-y: hidden; }</style>' +
                  '<div class="d-flex justify-content-center">' +
                  '<div class="spinner-border text-success" role="status">' +
                  '<span class="visually-hidden">Cargando...</span>' +
                  '</div></div>',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading();
            }
        });
        
        // Realizar la petición
        try {
            const res = await fetch('http://localhost:5000/predecir', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (!res.ok) {
                throw new Error('Error en la petición');
            }
    
            const result = await res.json();
    
            // Mostrar el resultado con Swal.fire
            Swal.fire({
                icon: 'success',
                title: 'Predicción realizada',
                text: `Predicción: ${result.prediccion} personas`,
                confirmButtonText: 'OK',
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al hacer la predicción.',
            });
            console.error('Error:', error);
        }
    };

    return (
        <div>
            {/* <UserNavbar/> */}
            <div className="bg-light">
                <div className="container-fluid single-section bg-light d-flex">
                    <div className="container align-self-center justify-content-center d-flex">
                    <div className="row">
                        <div className="justify-content-center text-center text-light">
                        <h1 className="main-register-title mt-5">Modificar Evento</h1>
                        </div>
                        <div className="col-12 bg-light p-5 form-register bg-light">
                            {/* Formulario */}
                            <form className="m-auto p-5" onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="nombre" className="form-label">Nombre <span className='text-danger'>*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nombre"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="descripcion" className="form-label">Descripción <span className='text-danger'>*</span></label>
                                    <textarea
                                        className="form-control"
                                        id="descripcion"
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="imagen" className="form-label">Imagen (Opcional)</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="imagen"
                                        accept="image/*"
                                        onChange={(e) => setImagen(e.target.files[0])}
                                    />
                                </div>

                                {eventData.imagen && (
                                    <div className="mb-3">
                                        <label className="form-check-label">
                                            <input
                                                type="checkbox"
                                                className="form-check-input me-1"
                                                checked={eliminarImagen}
                                                onChange={(e) => setEliminarImagen(e.target.checked)}
                                            />
                                            Eliminar imagen actual
                                        </label>
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label htmlFor="categoriaPrincipal" className="form-label">Categoría Principal <span className='text-danger'>*</span> <span className='text-success'>*</span></label>
                                    <select
                                        className="form-select"
                                        id="categoriaPrincipal"
                                        value={categoriaPrincipal}
                                        onChange={handleCategoriaPrincipalChange}
                                        required
                                    >
                                        <option value="">Selecciona una categoría</option>
                                        {categorias.map(categoria => (
                                            <option key={categoria.id} value={categoria.nombre}>
                                                {categoria.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="categoriasAsociadas" className="form-label">Categorías Asociadas</label>
                                    <select
                                        className="form-select"
                                        id="categoriasAsociadas"
                                        multiple
                                        value={categoriasAsociadas}
                                        onChange={(e) => setCategoriasAsociadas([...e.target.selectedOptions].map(option => option.value))}
                                    >
                                        {categorias
                                            .filter(categoria => categoria.nombre !== categoriaPrincipal) // Filtra la categoría principal
                                            .map(categoria => (
                                                <option key={categoria.id} value={categoria.id}>
                                                    {categoria.nombre}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                {/* Campos distintivos */}

                                <div className="mb-3">
                                    <label htmlFor="fechaEvento" className="form-label">Fecha del Evento <span className='text-danger'>*</span> <span className='text-success'>*</span></label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="fechaEvento"
                                        value={fechaEvento}
                                        onChange={(e) => {
                                            setFechaEvento(e.target.value);
                                            setFechaFinEvento(e.target.value);
                                        }}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="horaEvento" className="form-label">Hora del Evento <span className='text-danger'>*</span> <span className='text-success'>*</span></label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        id="horaEvento"
                                        value={horaEvento}
                                        onChange={(e) => setHoraEvento(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="hostEvento" className="form-label">Host del Evento <span className='text-danger'>*</span> <span className='text-success'>*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="hostEvento"
                                        value={hostEvento}
                                        onChange={(e) => setHostEvento(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="fechaFinEvento" className="form-label">Fecha de Fin del Evento <span className='text-danger'>*</span></label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="fechaFinEvento"
                                        value={fechaFinEvento}
                                        onChange={(e) => setFechaFinEvento(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="horaFinEvento" className="form-label">Hora de Fin del Evento <span className='text-danger'>*</span></label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        id="horaFinEvento"
                                        value={horaFinEvento}
                                        onChange={(e) => setHoraFinEvento(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="lugarEvento" className="form-label">Lugar del Evento <span className='text-danger'>*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="lugarEvento"
                                        value={lugarEvento}
                                        onChange={(e) => setLugarEvento(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="accesoEvento" className="form-label">Acceso al evento: <span className='text-danger'>*</span></label>
                                    <select
                                        className="form-select"
                                        id="accesoEvento"
                                        value={accesoEvento}
                                        onChange={(e) => setAccesoEvento(e.target.value)}
                                        required
                                    >
                                        <option value="red-universitaria">Red Universitaria</option>
                                        <option value="publico">Público</option>
                                    </select>
                                </div>

                                <button type="submit" className="btn btn-primary mt-3 me-2">Actualizar Evento</button>
                                <div className="btn btn-success mt-3" onClick={handleAttendancePrediction}>Predicción de Asistencia</div>

                                {error && <div className="mt-3 text-danger">{error}</div>}
                                {success && <div className="mt-3 text-success">{success}</div>}
                            </form>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateEventF;