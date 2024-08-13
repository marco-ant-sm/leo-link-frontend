import React, { useState } from 'react';
import './UserRegister.css';
import UserNavbar from '../UserNavbar/UserNavbar';
import Footer from '../Footer/Footer';

function UserRegister(){
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Usuario registrado:', data);
                alert("Usuario registrado");
            } else {
                console.error('Error al registrar usuario');
                console.error(formData);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return(
        <div>
            <UserNavbar/>
            <div className="bg-light">
                <div className="container-fluid single-section bg-light d-flex">
                    <div className="container align-self-center justify-content-center d-flex">
                    <div className="row">
                        <div className="justify-content-center text-center text-light">
                        <h1 className="main-register-title">Registrar nuevo usuario</h1>
                        </div>
                        <div className="col-12 bg-light p-5 form-register bg-light">
                        <form className="m-auto p-5" onSubmit={handleSubmit}>
                            <div className="mb-3">
                            <label htmlFor="nombre" className="form-label">
                                Nombre
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                            />
                            </div>
                            <div className="mb-3">
                            <label htmlFor="apellidos" className="form-label">
                                Apellidos (Opcional)
                            </label>
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
                            <label htmlFor="email" className="form-label">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            </div>
                            <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
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
            <Footer/>
        </div>
    );
}

export default UserRegister;