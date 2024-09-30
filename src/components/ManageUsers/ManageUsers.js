import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ManageUsers = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [currentUserData, setCurrentUserData] = useState({});
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const token = localStorage.getItem('access');
                const response = await axios.get('http://localhost:8000/api/users/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsuarios(response.data);
            } catch (error) {
                setError('Error fetching users');
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
                setCurrentUserData(response.data);
            } catch (error) {
                setError('Error al obtener el perfil del usuario');
                console.error(error);
            }
        };

        fetchUserProfile();
        fetchUsuarios();
    }, []);

    const filteredUsuarios = usuarios.filter(usuario =>
        usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    //Eliminar Usuarios
    const handleDeleteUser = async (userId) => {
        const token = localStorage.getItem('access');
        const currentUserId = currentUserData.id; // Obtener el id del usuario autenticado
    
        // Mostrar SweetAlert de confirmación
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás recuperar este usuario después de eliminarlo.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo',
            cancelButtonText: 'No, cancelar'
        });
    
        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:8000/api/user/delete/${userId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // Elimina el usuario de la lista localmente
                setUsuarios(usuarios.filter(usuario => usuario.id !== userId));
                // Mostrar mensaje de éxito
                Swal.fire(
                    'Eliminado!',
                    'El usuario ha sido eliminado exitosamente.',
                    'success'
                );
    
                // Verificar si el usuario eliminado es el mismo que el autenticado
                if (userId === currentUserId) {
                    // Cerrar sesión y redirigir
                    localStorage.removeItem('access');
                    localStorage.removeItem('refresh');
                    localStorage.removeItem('user');
                    navigate('/'); // Redirigir a la landing page
                }
            } catch (error) {
                // Mostrar mensaje de error
                Swal.fire(
                    'Error!',
                    'Hubo un error al eliminar el usuario.',
                    'error'
                );
                console.error(error);
            }
        }
    };

    const handleBanUser = async (userId, isBanned) => {
        const token = localStorage.getItem('access');
        const action = isBanned ? 'quitar-baneo' : 'banear'; // Determina la acción según el estado
        const newBaneoState = !isBanned; // Cambia el estado
    
        // Mostrar SweetAlert de confirmación
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas ${action} a este usuario?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Sí, ${action}`,
            cancelButtonText: 'No, cancelar'
        });
    
        if (result.isConfirmed) {
            try {
                await axios.patch(`http://localhost:8000/api/user/update/${userId}/`, { baneo: newBaneoState }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                // Actualiza el estado localmente
                setUsuarios(usuarios.map(usuario =>
                    usuario.id === userId ? { ...usuario, baneo: newBaneoState } : usuario
                ));
    
                // Mensaje de éxito
                Swal.fire(
                    'Éxito!',
                    `Se ha realizado la acción ${action} exitosamente.`,
                    'success'
                );
            } catch (error) {
                // Mensaje de error
                Swal.fire(
                    'Error!',
                    'Hubo un error al actualizar el estado del baneo.',
                    'error'
                );
                console.error(error);
            }
        }
    };

    return (
        <>
            <div>
                <section className="container my-5">
                    <h1 className="mb-4">Administración de Usuarios</h1>
                    <div className="d-flex justify-content-between mb-4">
                        <div className="input-group w-50">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <section className="container my-5">
                    <style>
                        {`
                            .table-custom {
                                background-color: #ffffff;
                                border-radius: 8px;
                                overflow: hidden;
                            }
                            .table-custom th {
                                background-color: #001f3f;
                                color: white;
                                font-weight: bold;
                            }
                            .table-custom tbody tr:nth-child(even) {
                                background-color: #e7f0f8;
                            }
                        `}
                    </style>

                    <div className="table-responsive"> {/* Añadir contenedor responsivo */}
                        <table className="table table-custom table-striped">
                            <thead>
                                <tr>
                                    <th>Correo electrónico</th>
                                    <th>Nombre</th>
                                    <th>Permisos</th>
                                    <th>Baneo</th>
                                    <th>Eliminación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsuarios.map((usuario) => (
                                    <tr key={usuario.id}>
                                        <td>{usuario.email}</td>
                                        <td>{usuario.nombre} {usuario.apellidos}</td>
                                        <td>{usuario.permiso_u}</td>
                                        <td>
                                        {usuario.baneo ? (
                                            <button className="btn btn-success btn-sm" onClick={() => handleBanUser(usuario.id, true)}>Quitar baneo</button>
                                        ) : (
                                            <button className="btn btn-warning btn-sm" onClick={() => handleBanUser(usuario.id, false)}>Banear</button>
                                        )}
                                        </td>
                                        <td><button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(usuario.id)}>Eliminar</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div> {/* Cerrar contenedor responsivo */}

                </section>
            </div>
        </>
    );
}

export default ManageUsers;