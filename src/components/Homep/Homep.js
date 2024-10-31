import './Homep.css';
import { useEffect, useRef } from 'react';
import PublicNavbar from '../PublicNavbar/PublicNavbar';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

function Homep() {
    const carouselRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = 'auto';
        return () => {
            document.body.style.overflow = ''; // Limpia el estilo cuando el componente se desmonta
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
        if (carouselRef.current) {
            const carousel = carouselRef.current;
            const nextButton = carousel.querySelector('.carousel-control-next');
            nextButton.click();
        }
        }, 7000);

        return () => clearTimeout(timer);
        }, []);

    const goPublicEvents = () =>{
        navigate('/verEventosPublicos');
    }

    const handleLogInClick = () => {
        navigate('/signUp');
    };

    return (
        <>
            <main>
                <Helmet>
                    <title>Leo Link</title>
                </Helmet>
                <PublicNavbar/>
                {/* Start carousel */}
                <div id="carouselExampleRide" className="carousel slide" data-bs-ride="carousel" ref={carouselRef}>
                    <div className="carousel-inner">
                        <div className="carousel-item carousel-image active" style={{ backgroundImage: 'url(/img/carousel-1.jpg)' }}>
                            <div className="carousel-overlay">
                                <div className="carousel-title">
                                    <p>
                                    Tus posibilidades al <span className="red-letter">M</span>áximo
                                    </p>
                                </div>
                                <div className="carousel-text">
                                    <p>
                                    En nuestra nueva plataforma encuentra diversas oportunidades por
                                    parte de nuestra comunidad universitaria.
                                    </p>
                                </div>
                                <div className="carousel-text">
                                    <button type="button" className="btn custom-btn" onClick={goPublicEvents}>
                                        Ver Eventos Públicos
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="carousel-item carousel-image" style={{ backgroundImage: 'url(/img/carousel-2.jpg)' }}>
                            <div className="carousel-overlay">
                            <div className="carousel-title">
                                <p>
                                Explora tus <span className="red-letter">R</span>ecursos
                                </p>
                            </div>
                            <div className="carousel-text">
                                <p>
                                Nuestra plataforma te conecta con recursos valiosos para maximizar tu experiencia universitaria y alcanzar tus metas.
                                </p>
                            </div>
                            <div className="carousel-text">
                                <button type="button" className="btn custom-btn" onClick={handleLogInClick}>
                                Crea tu cuenta
                                </button>
                            </div>
                            </div>
                        </div>
                        <div className="carousel-item carousel-image" style={{ backgroundImage: 'url(/img/carousel-3.jpg)' }}>
                            <div className="carousel-overlay">
                            <div className="carousel-title">
                                <p>
                                Disfruta tu <span className="red-letter">C</span>arrera
                                </p>
                            </div>
                            <div className="carousel-text">
                                <p>
                                Descubre cómo nuestra red puede enriquecer tu trayectoria profesional y aprovecha al máximo cada etapa de tu carrera.
                                </p>
                            </div>
                            <div className="carousel-text">
                                <button type="button" className="btn custom-btn" onClick={handleLogInClick}>
                                Iniciar Sesión
                                </button>
                            </div>
                            </div>
                        </div>
                    </div>
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#carouselExampleRide"
                        data-bs-slide="prev"
                    >
                        <span className="carousel-control-prev-icon" aria-hidden="true" />
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#carouselExampleRide"
                        data-bs-slide="next"
                    >
                        <span className="carousel-control-next-icon" aria-hidden="true" />
                        <span className="visually-hidden">Next</span>
                    </button>
                    </div>
                {/* End carousel */}

                {/* Start About section */}
                <div className="about">
                    {/* Start first message about*/}
                    <div className="container">
                    <div className="row pt-5 first-about text-left">
                        <div className="col-lg-7 col-md-12 order-lg-1 order-1">
                        <p id="title-about">
                            La plataforma donde tus intereses se transforman en oportunidades
                        </p>
                        <p id="text-about">
                            Da un paso adelante en el desarrollo de tu carrera descubriendo las
                            oportunidades a las que puedes acceder por ser parte de la
                            universidad
                        </p>
                        <button type="button" className="btn btn-danger button-about" onClick={handleLogInClick}>
                            Unirse a Leo Link
                        </button>
                        </div>
                        <div className="col-lg-5 col-md-12 order-lg-2 order-2">
                        <img src="./img/couple-riding.png" className="img-fluid img-about" />
                        </div>
                    </div>
                    </div>
                    {/* End first message about*/}
                    {/*Start second message about*/}
                    <div className="container mt-5">
                    <div className="row pt-5">
                        <div className="col">
                        <p id="second-title-about">¿Cómo funciona Leo Link?</p>
                        </div>
                    </div>
                    <div className="row pt-5">
                        <div className="col-md-7 col-12 info-father d-flex">
                        <div className="content-info">
                            <p className="title-info">
                            <span className="icon-inline">
                                <i className="fa-solid fa-magnifying-glass" />
                            </span>{" "}
                            Descubre nuevos eventos y oportunidades escolares
                            </p>
                            <p className="info-info">
                            Busca y recibe notificaciones personalizadas acerca de eventos de
                            tu interés, beneficios escolares como becas, descuentos, etc., y
                            la posibilidad de hacer prácticas profesionales con empresas
                            vinculadas a la universidad.
                            </p>
                        </div>
                        </div>
                        <div className="col-md-5 col-12 info-father d-flex">
                        <div className="content-info container-fluid">
                            <p className="title-info">
                            <span className="icon-inline">
                                <i className="fa-solid fa-circle-question" />
                            </span>{" "}
                            Obtén información acerca de los servicios escolares
                            </p>
                            <p className="info-info">
                            Recibe información por parte de nuestra aplicación acerca de los
                            trámites escolares e información en general acerca del centro
                            universitario.
                            </p>
                        </div>
                        </div>
                    </div>
                    </div>
                    {/*End second message about*/}
                    {/* Start third message about*/}
                    <div className="container mt-5">
                    <div className="row pt-5">
                        <div className="col text-white">
                        <p className="titles">Explora nuestras categorias</p>
                        </div>
                    </div>
                    <div className="cat d-flex">
                        <div className="cir d-flex">
                        <div className="logo-cat">
                            <i className="fa-solid fa-heart" />
                        </div>
                        <p>Salud</p>
                        </div>
                        <div className="cir d-flex">
                        <div className="logo-cat">
                            <i class="fa-solid fa-umbrella-beach"></i>
                        </div>
                        <p>Ocio</p>
                        </div>
                        <div className="cir d-flex">
                        <div className="logo-cat">
                            <i class="fa-solid fa-person-biking"></i>
                        </div>
                        <p>Deportivo</p>
                        </div>
                        <div className="cir d-flex">
                        <div className="logo-cat">
                            <i className="fa-brands fa-android" />
                        </div>
                        <p>Tech</p>
                        </div>
                        <div className="cir d-flex">
                        <div className="logo-cat">
                            <i className="fa-solid fa-gamepad" />
                        </div>
                        <p>Recreativo</p>
                        </div>
                        <div className="cir d-flex">
                        <div className="logo-cat">
                            <i className="fa-solid fa-code" />
                        </div>
                        <p>Informática</p>
                        </div>
                    </div>
                    </div>
                    {/* End third message about*/}
                </div>
                {/* END About section */}
            </main>
        </>

    );
  }
  
  export default Homep;