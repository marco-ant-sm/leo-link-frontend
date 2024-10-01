import React, { useState } from 'react';
import './UserRegister.css';
import Swal from 'sweetalert2';

function UserRegister() {
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        confirmPassword: '',
        permiso_u: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar campos requeridos
        const { nombre, permiso_u, password, confirmPassword } = formData;
        if (!nombre || !permiso_u || !password || !confirmPassword) {
            Swal.fire('Error', 'Por favor, complete todos los campos requeridos en rojo', 'error');
            return;
        }

        // Validar que las contraseñas coinciden y tienen al menos 8 caracteres
        if (password !== confirmPassword) {
            Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
            return;
        }
        if (password.length < 8) {
            Swal.fire('Error', 'La contraseña debe tener al menos 8 caracteres', 'error');
            return;
        }

        Swal.fire({
            title: 'Registrando usuario',
            html: '<style>.swal2-html { max-height: 150px; overflow-y: hidden; }</style>' +
                  '<div class="d-flex justify-content-center">' +
                  '<div class="spinner-border text-primary" role="status">' +
                  '<span class="visually-hidden">Cargando...</span>' +
                  '</div></div>',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const token = localStorage.getItem('access');
            const response = await fetch('http://localhost:8000/api/register/', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Usuario registrado:', data);
                Swal.fire('Éxito', 'Usuario registrado correctamente', 'success');
                
                // Resetear campos
                setFormData({
                    nombre: '',
                    apellidos: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    permiso_u: ''
                });
            } else {
                const errorData = await response.json();
                
                // Verifica si hay un error en el correo
                const emailError = errorData.errors.email 
                    ? errorData.errors.email[0] 
                    : 'No se pudo registrar el usuario';

                // Traduce el error específico
                const errorMessage = emailError === "custom user with this email already exists."
                    ? 'Ese correo ya ha sido registrado.'
                    : emailError === "Enter a valid email address."
                    ? 'Ingrese una dirección de correo valida'
                    : emailError;

                Swal.fire('Error', errorMessage, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Error de servidor: ' + error.message, 'error');
        }
    };

    return (
        <div>
            <div className="bg-light">
                <div className="container-fluid single-section bg-light d-flex">
                    <div className="container align-self-center justify-content-center d-flex">
                        <div className="row">
                            <div className="justify-content-center text-center text-light">
                                <h1 className="main-register-title mt-5">Crear nueva cuenta</h1>
                            </div>
                            <div className="col-12 bg-light p-5 form-register bg-light">
                                <form className="m-auto p-5" onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="nombre" className="form-label">Nombre <span className='text-danger'>*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nombre"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="apellidos" className="form-label">Apellidos (Opcional)</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="apellidos"
                                            name="apellidos"
                                            value={formData.apellidos}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Correo Electrónico <span className='text-danger'>*</span></label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="permiso_u" className="form-label">Seleccione el rol de usuario <span className='text-danger'>*</span></label>
                                        <select
                                            id="permiso_u"
                                            name="permiso_u"
                                            className="form-select"
                                            value={formData.permiso_u}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccione un rol</option>
                                            <option value="admin">Admin</option>
                                            <option value="estudiante">Estudiante</option>
                                            <option value="docente">Docente</option>
                                            <option value="empresa">Empresa</option>
                                            <option value="grupo_personal">Grupo/Personal</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Contraseña <span className='text-danger'>*</span></label>
                                        <div className="position-relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                className="form-control pe-5"
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-light position-absolute top-50 end-0 translate-middle-y border-0"
                                                style={{ right: '10px', transform: 'translateY(-50%)' }}
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <i className="bi bi-eye-slash"></i>
                                                ) : (
                                                    <i className="bi bi-eye"></i>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña <span className='text-danger'>*</span></label>
                                        <div className="position-relative">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                className="form-control pe-5"
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-light position-absolute top-50 end-0 translate-middle-y border-0"
                                                style={{ right: '10px', transform: 'translateY(-50%)' }}
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showPassword ? (
                                                    <i className="bi bi-eye-slash"></i>
                                                ) : (
                                                    <i className="bi bi-eye"></i>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn log-in me-2 mt-3">
                                        Registrar Usuario
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserRegister;
