import React, {useEffect ,useState } from 'react';
import axios from 'axios';
import UserNavbar from '../UserNavbar/UserNavbar';
import './CreatePractica.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const CreatePractica = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [imagen, setImagen] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [categoriaPrincipal, setCategoriaPrincipal] = useState('');
    const [categoriasAsociadas, setCategoriasAsociadas] = useState([]);

    // Campos Caracteristicos (agrgados de practica) nuevos
    const [horasPractica, setHorasPractica] = useState('');
    const [direccionPractica, setDireccionPractica] = useState('');
    const [telefonoPractica, setTelefonoPractica] = useState('');
    const [ayudaEconomicaPractica, setAyudaEconomicaPractica] = useState('No');
    const [fechaFinPractica, setFechaFinPractica] = useState('');


    //Info del usuario para saber si tiene acceso a la funcion
    const [currentUserData, setCurrentUserData] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch categories when the component mounts
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/categories/');
                const categoriasEvento = response.data.filter(categoria => categoria.tipo_e === 'practica');
                setCategorias(categoriasEvento);

            } catch (error) {
                setError('Error fetching categories');
            }
        };

        //Cargar info del usuario
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
                setCurrentUserData(response.data);
                
                const permisosPermitidos = ['admin', 'empresa'];

                if (!permisosPermitidos.includes(response.data.permiso_u)) {
                    Swal.fire({
                        title: 'Acceso Denegado',
                        text: 'No tienes permiso para crear practicas.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });

                    // Redirigir al menú principal
                    navigate('/home');
                }
    
            } catch (error) {
                setError('Error al obtener el perfil del usuario');
                console.error(error);
            }
        };
        
        fetchCategories();
        fetchUserProfile();
    }, [navigate]);
    


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

        if (!horasPractica || !direccionPractica || !telefonoPractica) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Los Campos en rojo son obligatorios',
            });
            return;
        }

        if (!nombre) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El nombre es obligatorio',
            });
            return;
        }
    
        if (!descripcion) {
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
        formData.append('tipo_e', 'practica');
        formData.append('horas_practica', horasPractica);
        formData.append('direccion_practica', direccionPractica);
        formData.append('telefono_practica', telefonoPractica);
        formData.append('ayuda_economica_p', ayudaEconomicaPractica);

        if (fechaFinPractica) {
            formData.append('fecha_fin_practica', fechaFinPractica);
        }
        
        try {
            await axios.post('http://localhost:8000/api/events/', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });
            Swal.fire({
                icon: 'success',
                title: 'Práctica Agregada',
                text: 'Se ha acreado la Práctica con éxito',
            });
            setNombre('');
            setDescripcion('');
            setImagen(null);
            setCategoriaPrincipal('');
            setCategoriasAsociadas([]);
            //campos caracteristicos
            setFechaFinPractica('');
            setHorasPractica('');
            setDireccionPractica('');
            setTelefonoPractica('');
            setAyudaEconomicaPractica('No');

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error creando la Práctica',
            });
        }
    };

    const getNombreCarrera = (abreviacion) => {
        const carreras = {
            'INCO': 'Ingeniería en Computación',
            'INDU': 'Ingeniería Industrial',
            'INCI': 'Ingeniería Civil',
            'INAB': 'Ingeniería en Alimentos y Biotecnología',
            'INTG': 'Ingeniería en Topografía Geomática',
            'INME': 'Ingeniería Mecánica Eléctrica',
            'INQU': 'Ingeniería Química',
            'INLT': 'Ingeniería en Logística y Transporte',
            'ININ': 'Ingeniería Informática',
            'INBM': 'Ingeniería Biomédica',
            'INCE': 'Ingeniería en Comunicaciones y Electrónica',
            'INFO': 'Ingeniería Fotónica',
            'INRO': 'Ingeniería Robótica',
        };
        return carreras[abreviacion] || abreviacion;
    };

    return (
        <div>
            {/* <UserNavbar/> */}
            <div className="bg-light">
                <div className="container-fluid single-section bg-light d-flex">
                    <div className="container align-self-center justify-content-center d-flex">
                    <div className="row">
                        <div className="justify-content-center text-center text-light">
                        <h1 className="main-register-title mt-5">Crear una nueva Práctica</h1>
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
                                    <label htmlFor="categoriaPrincipal" className="form-label">Categoría Principal <span className='text-danger'>*</span></label>
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
                                                {getNombreCarrera(categoria.nombre)}
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
                                                {getNombreCarrera(categoria.nombre)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                {/* Campos caracteristicos Nuevos campos practica en el formulario*/}

                                <div className="mb-3">
                                    <label htmlFor="horasPractica" className="form-label">Horas de Práctica <span className='text-danger'>*</span></label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="horasPractica"
                                        value={horasPractica}
                                        onChange={(e) => setHorasPractica(e.target.value)}
                                        required
                                        maxLength={6} // Asegúrate de manejar la longitud en el frontend
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="direccionPractica" className="form-label">Dirección de la Práctica <span className='text-danger'>*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="direccionPractica"
                                        value={direccionPractica}
                                        onChange={(e) => setDireccionPractica(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="telefonoPractica" className="form-label">Teléfono de la Práctica <span className='text-danger'>*</span></label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="telefonoPractica"
                                        value={telefonoPractica}
                                        onChange={(e) => setTelefonoPractica(e.target.value)}
                                        required
                                        maxLength={15}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="ayudaEconomicaPractica" className="form-label">¿Ayuda Económica? <span className='text-danger'>*</span></label>
                                    <select
                                        className="form-select"
                                        id="ayudaEconomicaPractica"
                                        value={ayudaEconomicaPractica || 'No'}
                                        onChange={(e) => setAyudaEconomicaPractica(e.target.value)}
                                        required
                                    >
                                        <option value="No">No</option>
                                        <option value="Sí">Sí</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="fechaFinPractica" className="form-label">Fecha Fin de la Práctica (Opcional)</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="fechaFinPractica"
                                        value={fechaFinPractica} // Cambia este estado para manejar fecha fin de práctica
                                        onChange={(e) => setFechaFinPractica(e.target.value)}
                                    />
                                </div>
                                
                                <button type="submit" className="btn btn-primary mt-3">Crear Practica</button>

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

export default CreatePractica;