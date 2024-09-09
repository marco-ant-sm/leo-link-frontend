import React, {useEffect ,useState } from 'react';
import axios from 'axios';

const CreateEvent = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [imagen, setImagen] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [categoriaPrincipal, setCategoriaPrincipal] = useState('');
    const [categoriasAsociadas, setCategoriasAsociadas] = useState([]);

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
    //     if (imagen) {
    //         formData.append('imagen', imagen);
    //     }
    
    //     try {
    //         await axios.post('http://localhost:8000/api/events/', formData, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'multipart/form-data'
    //             },
    //         });
    //         setSuccess('Event created successfully');
    //         setNombre('');
    //         setDescripcion('');
    //         setImagen(null); // Clear image input
    //     } catch (error) {
    //         setError('Error creating event');
    //     }
    // }

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
        if (imagen) {
            formData.append('imagen', imagen);
        }
        formData.append('categoria_p', categoriaPrincipal);
        formData.append('categorias_ids', categoriasAsociadas.filter(id => id !== categoriaPrincipal).join(',')); // Excluye la categoría principal si está en categorías asociadas
    
        try {
            await axios.post('http://localhost:8000/api/events/', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });
            setSuccess('Event created successfully');
            setNombre('');
            setDescripcion('');
            setImagen(null);
            setCategoriaPrincipal('');
            setCategoriasAsociadas([]);
        } catch (error) {
            setError('Error creating event');
        }
    };

    useEffect(() => {
        // Fetch categories when the component mounts
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/categories/');
                setCategorias(response.data);
            } catch (error) {
                setError('Error fetching categories');
            }
        };

        fetchCategories();
    }, []);

    return (
        <div>
            <h1>Create Event</h1>
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
                    <label>Imagen (opcional):</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImagen(e.target.files[0])}
                    />
                </div>
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
                        {categorias.map(categoria => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Create Event</button>
                {error && <div>{error}</div>}
                {success && <div>{success}</div>}
            </form>
        </div>
    );
};

export default CreateEvent;