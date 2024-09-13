import React, {useEffect ,useState } from 'react';
import axios from 'axios';
import UserNavbar from '../UserNavbar/UserNavbar';
import './CreateEventF.css';
import Swal from 'sweetalert2';

const CreateEventF = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [imagen, setImagen] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [categoriaPrincipal, setCategoriaPrincipal] = useState('');
    const [categoriasAsociadas, setCategoriasAsociadas] = useState([]);


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


    const handleSubmit = async (event) => {
        event.preventDefault();

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
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error creando el evento',
            });
        }
    };

    return (
        <div>
            <UserNavbar/>
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
                                    <label htmlFor="nombre" className="form-label">Nombre</label>
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
                                    <label htmlFor="descripcion" className="form-label">Descripción</label>
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
                                    <label htmlFor="categoriaPrincipal" className="form-label">Categoría Principal</label>
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
                                    <label htmlFor="categoriasAsociadas" className="form-label">Categorías Asociadas</label>
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
                                
                                <button type="submit" className="btn btn-primary mt-3">Crear Evento</button>

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