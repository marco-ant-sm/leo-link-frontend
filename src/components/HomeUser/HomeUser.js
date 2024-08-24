import React from 'react';
import './HomeUser.css';
import UserNavbar from '../UserNavbar/UserNavbar';
import { Helmet } from 'react-helmet';
import { useEffect} from 'react';

function HomeUser() {
    useEffect(() => {
        document.body.style.overflow = 'auto'; // Asegúrate de que el overflow esté habilitado
        return () => {
            document.body.style.overflow = ''; // Limpia el estilo cuando el componente se desmonta
        };
    }, []);

  return (
    <div>
        <Helmet>
            <title>Home</title>
        </Helmet>
        <UserNavbar/>
        {/* iNICIO */}
        <section className="container my-5">
            <div className="d-flex align-items-center mb-4">
                <span>
                    <i className="fa-solid fa-house house-main" />
                </span>
        
                <div className="d-flex align-items-center w-100 mx-2">
                    <h2>Inicio</h2>
                </div>
            </div>

            <div className="d-flex align-items-center mb-4">
                <div className="d-flex align-items-center w-100 mx-2">
                    <h2>Recomendados</h2>
                    <div className="flex-grow-1 ms-2">
                    <hr />
                    </div>
                </div>
            </div>
            
        
            <div className="row">

            {/* Card */}
            <div className="col-md-4 mb-4">
                <div className="card preview-event-home">
                <div className="ratio ratio-16x9">
                    <img src="./img/event-1.jpg" alt="Event" className="card-img-top" />
                </div>
                <div className="card-body">
                    <h5 className="card-title">Evento Ejemplo</h5>
                    <p className="card-text">Texto evento ejemplo.</p>
                </div>
                </div>
            </div>

            <div className="col-md-4 mb-4">
                <div className="card preview-event-home">
                <div className="ratio ratio-16x9">
                    <img src="./img/event-1.jpg" alt="Event" className="card-img-top" />
                </div>
                <div className="card-body">
                    <h5 className="card-title">Evento Ejemplo</h5>
                    <p className="card-text">Texto evento ejemplo.</p>
                </div>
                </div>
            </div>
            <div className="col-md-4 mb-4">
                <div className="card preview-event-home">
                <div className="ratio ratio-16x9">
                    <img src="./img/event-1.jpg" alt="Event" className="card-img-top" />
                </div>
                <div className="card-body">
                    <h5 className="card-title">Evento Ejemplo</h5>
                    <p className="card-text">Texto evento ejemplo.</p>
                </div>
                </div>
            </div>
            </div>
        </section>
        {/* EVENTOS */}

        <section className="container my-5">
            <div className="d-flex align-items-center w-100 mb-4">
            <h2>Próximos eventos</h2>
            <div className="flex-grow-1 ms-2">
                <hr />
            </div>
            </div>
            <div className="row">
            <div className="col-md-4 mb-4">
                <div className="card preview-event-home">
                <div className="ratio ratio-16x9">
                    <img src="./img/event-1.jpg" alt="Event" className="card-img-top" />
                </div>
                <div className="card-body">
                    <h5 className="card-title">Evento Ejemplo</h5>
                    <p className="card-text">Texto evento ejemplo.</p>
                </div>
                </div>
            </div>
            <div className="col-md-4 mb-4">
                <div className="card preview-event-home">
                <div className="ratio ratio-16x9">
                    <img src="./img/event-1.jpg" alt="Event" className="card-img-top" />
                </div>
                <div className="card-body">
                    <h5 className="card-title">Evento Ejemplo</h5>
                    <p className="card-text">Texto evento ejemplo.</p>
                </div>
                </div>
            </div>
            <div className="col-md-4 mb-4">
                <div className="card preview-event-home">
                <div className="ratio ratio-16x9">
                    <img src="./img/event-1.jpg" alt="Event" className="card-img-top" />
                </div>
                <div className="card-body">
                    <h5 className="card-title">Evento Ejemplo</h5>
                    <p className="card-text">Texto evento ejemplo.</p>
                </div>
                </div>
            </div>
            </div>
        </section>
        {/* PROFESIONALES */}
        <section className="container my-5">
            <div className="d-flex align-items-center w-100 mb-4">
            <h2>Prácticas profesionales</h2>
            <div className="flex-grow-1 ms-2">
                <hr />
            </div>
            </div>
            <div className="row">
            <div className="col-md-4 mb-4">
                <div className="card preview-event-home">
                <div className="ratio ratio-16x9">
                    <img src="./img/event-1.jpg" alt="Event" className="card-img-top" />
                </div>
                <div className="card-body">
                    <h5 className="card-title">Práctica Ejemplo</h5>
                    <p className="card-text">Texto evento ejemplo.</p>
                </div>
                </div>
            </div>
            <div className="col-md-4 mb-4">
                <div className="card preview-event-home">
                <div className="ratio ratio-16x9">
                    <img src="./img/event-1.jpg" alt="Event" className="card-img-top" />
                </div>
                <div className="card-body">
                    <h5 className="card-title">Práctica Ejemplo</h5>
                    <p className="card-text">Texto evento ejemplo.</p>
                </div>
                </div>
            </div>
            <div className="col-md-4 mb-4">
                <div className="card preview-event-home">
                <div className="ratio ratio-16x9">
                    <img src="./img/event-1.jpg" alt="Event" className="card-img-top" />
                </div>
                <div className="card-body">
                    <h5 className="card-title">Práctica Ejemplo</h5>
                    <p className="card-text">Texto evento ejemplo.</p>
                </div>
                </div>
            </div>
            </div>
        </section>
    </div>

  );
}

export default HomeUser;