import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UpdateEvent() {
    const { id } = useParams();
    const [eventData, setEventData] = useState({});
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagen, setImagen] = useState(null);
    const [eliminarImagen, setEliminarImagen] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
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
            } catch (error) {
                setError('Error fetching event');
                console.error(error);
                navigate('/showAllEvents');
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/categories/');
                setCategorias(response.data);
            } catch (error) {
                setError('Error fetching categories');
            }
        };

        fetchEvent();
        fetchCategories();
    }, [id, navigate]);



    // const handleSubmit = async (event) => {
    //     event.preventDefault();

    //     const token = localStorage.getItem('access');
    //     if (!token) {
    //         setError('No token found');
    //         return;
    //     }

    //     const formData = new FormData();
    //     formData.append('nombre', nombre);
    //     formData.append('descripcion', descripcion);

    //     if (eliminarImagen && !imagen) {
    //         formData.append('eliminar_imagen', true); // Mandar una señal al backend de que se debe eliminar la imagen
    //     } else if (imagen) {
    //         formData.append('imagen', imagen); // Subir nueva imagen si está presente
    //     }

    //     try {
    //         await axios.put(`http://localhost:8000/api/events/${id}/`, formData, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'multipart/form-data'
    //             },
    //         });
    //         setSuccess('Event updated successfully');
    //         navigate('/showAllEvents');
    //     } catch (error) {
    //         setError('Error updating event');
    //     }
    // };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!categoriaPrincipal) {
            setError('La categoría principal es obligatoria');
            return;
        }

        const token = localStorage.getItem('access');
        if (!token) {
            setError('No token found');
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

        try {
            await axios.put(`http://localhost:8000/api/events/${id}/`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });
            setSuccess('Event updated successfully');
            navigate('/showAllEvents');
        } catch (error) {
            setError('Error updating event');
        }
    };

    return (
        <div>
            <h1>Update Event</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Descripción:</label>
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Imagen:</label>
                    <input
                        type="file"
                        onChange={(e) => setImagen(e.target.files[0])}
                    />
                </div>
                {eventData.imagen && (
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={eliminarImagen}
                                onChange={(e) => setEliminarImagen(e.target.checked)}
                            />
                            Eliminar imagen actual
                        </label>
                    </div>
                )}

                <div>
                    <label>Categoría Principal:</label>
                    <select
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
                <div>
                    <label>Categorías Asociadas:</label>
                    <select
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
                <button type="submit">Actualizar Evento</button>
                {error && <div>{error}</div>}
                {success && <div>{success}</div>}
            </form>
        </div>
    );
}

export default UpdateEvent;
