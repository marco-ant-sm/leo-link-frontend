import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { format, isSameDay } from 'date-fns';

const ConfirmEvent = () => {
    const [events, setEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]); // Para almacenar todos los eventos
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/events/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }
            });

            const tiposEvento = response.data.filter(evento => evento.tipo_e === 'evento' && !evento.disponible);
            const todosLosEventos = response.data.filter(evento => evento.tipo_e === 'evento'); // Obtener todos los eventos
            setEvents(tiposEvento);
            setAllEvents(todosLosEventos); // Guardar todos los eventos
        } catch (error) {
            setError('Error fetching events');
            console.error(error.response.data);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const filteredEvents = events.filter(evento =>
        evento.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCompare = (evento) => {
        setSelectedEvent(evento);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedEvent(null);
    };

    const hasEventEnded = (fechaFin, horaFin) => {
        const fechaEvento = new Date(fechaFin + 'T00:00:00'); // Asegurarse de que se interprete como medianoche en la zona horaria local
        const horaEvento = new Date(`${fechaFin}T${horaFin}`);
        const now = new Date();
    
        // Si la fecha del evento es mayor que ahora, es válido
        if (fechaEvento > now) {
            return false; // Evento válido
        }
    
        // Si la fecha del evento es igual a ahora, comprobamos la hora
        if (isSameDay(fechaEvento, now)) {
            return horaEvento < now; // Solo válido si la hora de fin es mayor que ahora
        }
    
        // Si la fecha del evento es menor que ahora, no es válido
        return true; // Evento no válido
    };

    const getSimilarEvents = () => {
        if (!selectedEvent) return [];
        const { fecha_evento, fecha_fin_evento } = selectedEvent;

        return allEvents.filter(evento => 
            evento.disponible && (
                evento.fecha_evento === fecha_evento || evento.fecha_fin_evento === fecha_fin_evento ||
                ((new Date(evento.fecha_evento) <= new Date(fecha_evento) && new Date(evento.fecha_fin_evento) >= new Date(fecha_fin_evento)) && !hasEventEnded(evento.fecha_fin_evento, evento.hora_fin_evento))
                //||(new Date(evento.fecha_fin_evento) >= new Date(fecha_evento) && new Date(evento.fecha_fin_evento) <= new Date(fecha_fin_evento))
                )
            )
    };

    const similarEvents = getSimilarEvents();

    const handleAccept = async (evento) => {
        const result = await Swal.fire({
            title: 'Confirmar',
            text: `¿Estás seguro de que deseas aceptar el evento "${evento.nombre}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, aceptar',
            cancelButtonText: 'No, cancelar'
        });
    
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Confirmando Evento',
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
                await axios.patch(`http://localhost:8000/api/aceptar-evento/${evento.id}/`, { disponible: true }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access')}`
                    }
                });
    
                // Enviar correo y notificaciones en Django se manejan en la vista
    
                Swal.fire('Éxito', 'Evento confirmado', 'success');
                // Actualiza la tabla de eventos
                fetchEvents();
            } catch (error) {
                Swal.fire('Error', 'Hubo un problema al confirmar el evento', 'error');
                console.error(error);
            }
        }
    };


    // Rechazar el evento
    const handleReject = async (evento) => {
        const token = localStorage.getItem('access');

        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Se eliminará el evento y no podrás recuperarlo.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, rechazar',
            cancelButtonText: 'No, cancelar'
        });
    
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Rechazando Evento',
                html: '<style>.swal2-html { max-height: 150px; overflow-y: hidden; }</style>' +
                      '<div class="d-flex justify-content-center">' +
                      '<div class="spinner-border text-danger" role="status">' +
                      '<span class="visually-hidden">Cargando...</span>' +
                      '</div></div>',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading();
                }
            });
            try {
                await axios.delete(`http://localhost:8000/api/rechazar-evento/${evento.id}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`  // Añade el token aquí
                    }
                });
                Swal.fire('Evento rechazado', 'El evento ha sido eliminado.', 'success');
                fetchEvents();
            }  catch (error) {
                Swal.fire('Error', 'No se pudo eliminar el evento.', 'error');
                console.error(error.response.data);
            }
        }
    };


    return (
        <div>
            <section className="container my-5">
                <h1 className="mb-4">Eventos por Confirmar</h1>
                <div className="d-flex justify-content-between mb-4">
                    <div className="input-group w-50">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por nombre"
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
                            background-color: #f9f9f9;
                            border-radius: 8px;
                            overflow: hidden;
                        }
                        .table-custom th {
                            background-color: #4b8cff;
                            color: white;
                            font-weight: bold;
                        }
                        .table-custom tbody tr:nth-child(even) {
                            background-color: #e0f4ff;
                        }
                        .table-custom tbody tr:hover {
                            background-color: #d0e7ff;
                        }
                    `}
                </style>

                <div className="table-responsive">
                    {filteredEvents.length === 0 ? (
                        <p className='mb-5'>Sin eventos por confirmar.</p>
                    ) : (
                        <table className="table table-custom table-striped">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Fecha inicio</th>
                                    <th>Fecha fin</th>
                                    <th>Hora inicio</th>
                                    <th>Hora fin</th>
                                    <th>Usuario</th>
                                    <th>Lugar</th>
                                    <th>Aceptar</th>
                                    <th>Rechazar</th>
                                    <th>Comparar</th>
                                    <th>Pre-Visualizar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEvents.map((evento) => (
                                    <tr key={evento.id}>
                                        <td>{evento.nombre}</td>
                                        <td>{evento.fecha_evento}</td>
                                        <td>{evento.fecha_fin_evento}</td>
                                        <td>{evento.hora_evento}</td>
                                        <td>{evento.hora_fin_evento}</td>
                                        <td>{evento.usuario.nombre} {evento.usuario.apellidos}</td>
                                        <td>{evento.lugar_evento}</td>
                                        <td>
                                            <button className="btn btn-success btn-sm" onClick={ () => handleAccept(evento)}>Aceptar</button>
                                        </td>
                                        <td>
                                            <button className="btn btn-danger btn-sm" onClick={ () => handleReject(evento)}>Rechazar</button>
                                        </td>
                                        <td>
                                            <button className="btn btn-info btn-sm" onClick={() => handleCompare(evento)}>Comparar</button>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => window.open(`/event/${evento.id}`, '_blank')}
                                            >
                                                Pre-Visualizar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>

            {/* Modal para eventos similares */}
            {showModal && (
                <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content rounded-3 shadow">
                            <div className="modal-header border-bottom-0">
                                <h5 className="modal-title">Eventos Similares</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="table-responsive">
                                    {similarEvents.length === 0 ? (
                                        <p className="text-center">No hay eventos similares.</p>
                                    ) : (
                                        <table className="table table-hover">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Nombre</th>
                                                    <th>Fecha inicio</th>
                                                    <th>Fecha fin</th>
                                                    <th>Hora inicio</th>
                                                    <th>Hora fin</th>
                                                    <th>Usuario</th>
                                                    <th>Lugar</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {similarEvents.map((evento) => (
                                                    <tr key={evento.id}>
                                                        <td>{evento.nombre}</td>
                                                        <td>{evento.fecha_evento}</td>
                                                        <td>{evento.fecha_fin_evento}</td>
                                                        <td>{evento.hora_evento}</td>
                                                        <td>{evento.hora_fin_evento}</td>
                                                        <td>{evento.usuario.nombre} {evento.usuario.apellidos}</td>
                                                        <td>{evento.lugar_evento}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer border-top-0">
                                <button type="button" className="btn btn-danger" onClick={() => setShowModal(false)}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ConfirmEvent;