import React, {useEffect ,useState } from 'react';
import axios from 'axios';
import UserNavbar from '../UserNavbar/UserNavbar';
import './CreateEventF.css';
import Swal from 'sweetalert2';
import { format, parseISO} from 'date-fns';
import es from 'date-fns/locale/es';

const CreateEventF = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [imagen, setImagen] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [categoriaPrincipal, setCategoriaPrincipal] = useState('');
    const [categoriasAsociadas, setCategoriasAsociadas] = useState([]);

    // Campos Caracteristicos
    const [fechaEvento, setFechaEvento] = useState('');
    const [horaEvento, setHoraEvento] = useState('');
    const [hostEvento, setHostEvento] = useState('');
    const [fechaFinEvento, setFechaFinEvento] = useState('');
    const [horaFinEvento, setHoraFinEvento] = useState('');
    const [lugarEvento, setLugarEvento] = useState('');


    useEffect(() => {
        // Fetch categories when the component mounts
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/categories/');
                const categoriasEvento = response.data.filter(categoria => categoria.tipo_e === 'evento');
                setCategorias(categoriasEvento);

            } catch (error) {
                setError('Error fetching categories');
            }
        };
        
        fetchCategories();
    }, []);


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

        // Validación de los nuevos campos
        if (!fechaEvento || !horaEvento || !hostEvento || !fechaFinEvento || !horaFinEvento || !lugarEvento) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Todos los campos del evento marcados en rojo son obligatorios',
            });
            return;
        }

        if (!nombre.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El nombre es obligatorio',
            });
            return;
        }
    
        if (!descripcion.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La descripción es obligatoria',
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
    
        const token = localStorage.getItem('access');
        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No token found',
            });
            return;
        }
    
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        if (imagen) {
            formData.append('imagen', imagen);
        }
        formData.append('categoria_p', categoriaPrincipal);
        formData.append('categorias_ids', categoriasAsociadas.filter(id => id !== categoriaPrincipal).join(',')); // Excluye la categoría principal si está en categorías asociadas
        // Campos caracteristicos
        formData.append('fecha_evento', fechaEvento);
        formData.append('hora_evento', horaEvento);
        formData.append('host_evento', hostEvento);
        formData.append('fecha_fin_evento', fechaFinEvento);
        formData.append('hora_fin_evento', horaFinEvento);
        formData.append('lugar_evento', lugarEvento);
        try {
            await axios.post('http://localhost:8000/api/events/', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });
            Swal.fire({
                icon: 'success',
                title: 'Evento agregado',
                text: 'Se ha acreado el Evento con éxito',
            });
            setNombre('');
            setDescripcion('');
            setImagen(null);
            setCategoriaPrincipal('');
            setCategoriasAsociadas([]);
            setFechaEvento('');
            setHoraEvento('');
            setHostEvento('');
            setFechaFinEvento('');
            setHoraFinEvento('');
            setLugarEvento('');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error creando el evento',
            });
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
                        <h1 className="main-register-title mt-5">Crear un nuevo evento</h1>
                        </div>
                        <div className="col-12 bg-light p-5 form-register bg-light">
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

                                <div className="mb-3">
                                    <label htmlFor="categoriaPrincipal" className="form-label">Categoría Principal <span className='text-danger'>*</span> <span className='text-success'>*</span></label>
                                    <select
                                        className="form-select"
                                        id="categoriaPrincipal"
                                        value={categoriaPrincipal}
                                        onChange={(e) => setCategoriaPrincipal(e.target.value)}
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
                                    <label htmlFor="categoriasAsociadas" className="form-label">Categorías Asociadas (Opcionales)</label>
                                    <select
                                        className="form-select"
                                        id="categoriasAsociadas"
                                        multiple
                                        value={categoriasAsociadas}
                                        onChange={(e) => setCategoriasAsociadas([...e.target.selectedOptions].map(option => option.value))}
                                    >
                                        {categorias.map(categoria => (
                                            <option key={categoria.id} value={categoria.id}>
                                                {categoria.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                {/* Campos caracteristicos */}
                                <div className="mb-3">
                                    <label htmlFor="fechaEvento" className="form-label">Fecha del Evento <span className='text-danger'>*</span> <span className='text-success'>*</span></label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="fechaEvento"
                                        value={fechaEvento}
                                        onChange={(e) => setFechaEvento(e.target.value)}
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
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="hostEvento" className="form-label">Host del Evento <span className='text-danger'>*</span> <span className='text-success'>*</span></label>
                                    <select
                                        className="form-select"
                                        id="hostEvento"
                                        value={hostEvento}
                                        onChange={(e) => setHostEvento(e.target.value)}
                                    >
                                        <option value="">Selecciona un host</option>
                                        <option value="Cucei">Cucei</option>
                                        <option value="Empresa">Empresa</option>
                                        <option value="Consejo estudiantil">Consejo Estudiantil</option>
                                        <option value="Docente">Docente</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="fechaFinEvento" className="form-label">Fecha de Fin del Evento <span className='text-danger'>*</span></label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="fechaFinEvento"
                                        value={fechaFinEvento}
                                        onChange={(e) => setFechaFinEvento(e.target.value)}
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
                                    />
                                </div>
                                
                                <button type="submit" className="btn btn-primary mt-3 me-2">Crear Evento</button>
                                <button className="btn btn-success mt-3" onClick={handleAttendancePrediction}>Predicción de Asistencia</button>

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
};

export default CreateEventF;