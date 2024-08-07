import './ShowEvent.css';
import UserNavbar from '../UserNavbar/UserNavbar';
import Footer from '../Footer/Footer';

function ShowEvent() {
    return (
        <>
            <UserNavbar/>
            <div className="general-color mb-5">
                {/* Item */}
                <section className='mt-5'>
                {/* Main info and image */}
                <div className="container">
                    <div className="row">
                    {/* Title */}
                    <div className="col-12 pb-3 pb-lg-5">
                        <h1 className="main-title-event">Nombre del evento</h1>
                    </div>
                    {/* Item image */}
                    <div className="col-lg-8 col-xl-7 order-2 order-lg-1">
                        <img
                        src="./img/event-1.jpg"
                        alt="imagen del item"
                        className="img-item"
                        />
                    </div>
                    {/* Item main info */}
                    <div className="col-lg-4 col-xl-3 ps-lg-5 order-1 order-lg-2 mb-4 mb-lg-0">
                        <div className="main-info p-lg-3 p-3 p-lg-0">
                        <p className="main-info-title">Fecha</p>
                        <p>
                            {" "}
                            <span>
                            <i className="fas fa-calendar-alt" />
                            </span>{" "}
                            Jueves, 11 de julio de 2024 1:30 PM a 3:00 PM
                        </p>
                        <p className="main-info-title">Lugar</p>
                        <p>
                            {" "}
                            <span>
                            <i className="fas fa-map-marker-alt" />
                            </span>{" "}
                            Auditorio Dr. Nikolai V. Mitskievich (Módulo Y)
                        </p>
                        <p className="main-info-title">Categorias</p>
                        <p>
                            <span className="badge bg-info text-dark">Emprendimiento</span>{" "}
                            <span className="badge bg-info text-dark">Comida</span>{" "}
                            <span className="badge bg-info text-dark">Público</span>{" "}
                            <span className="badge bg-info text-dark">Quimica</span>
                        </p>
                        <p className="main-info-title">Autor</p>
                        <p>
                            {" "}
                            <span>
                            <i className="bi bi-person-circle" />
                            </span>{" "}
                            Nombre del autor
                        </p>
                        </div>
                    </div>
                    {/* item description */}
                    <div className="col-lg-8 col-xl-7 order-3 mt-4 mt-lg-5 justify-text">
                        <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam quae
                        temporibus aut consequuntur, eum recusandae, ex optio deleniti ipsum
                        eius excepturi distinctio consectetur consequatur cupiditate quis
                        ipsam! Officiis tempore minima architecto aliquid hic voluptates,
                        dolorem tempora iusto minus aperiam. Obcaecati explicabo quos ipsam,
                        quidem, temporibus sint magni voluptas nam rem dolor blanditiis
                        laudantium ad. Veniam modi, laboriosam doloremque eaque assumenda ea
                        nemo, nam, illo fuga voluptatem cum itaque? Fugiat est officiis hic
                        nisi aliquid, doloremque, nostrum accusamus assumenda voluptate
                        veniam nesciunt optio corrupti amet facere possimus ad iste
                        aspernatur quasi quod quo, dolores libero odio molestiae esse!
                        Aperiam, minima mollitia.
                        </p>
                    </div>
                    </div>
                </div>
                </section>
                {/* Comments section */}
                <div className="container mt-4">
                <div className="row">
                    <div className="col-12 col-lg-10">
                    <div className="border p-3 comments overflow-auto">
                        <h4>
                        {" "}
                        <i className="fa-solid fa-comment" /> Comentarios
                        </h4>
                        {/* Form to make a comment */}
                        <form className="form-floating mb-3 mt-4">
                        <div className="row">
                            <div className="col-lg-11 col-10 form-floating">
                            <input
                                type="text"
                                className="form-control custom-input"
                                id="floatingInput"
                                placeholder="name@example.com"
                            />
                            <label htmlFor="floatingInput">
                                {" "}
                                <span>
                                <i className="bi bi-person-circle" />
                                </span>{" "}
                                Añadir un comentario
                            </label>
                            </div>
                            <div className="col-lg-1 col-2 m-0 p-0 d-flex">
                            <button
                                type="submit"
                                className="btn btn-outline-dark align-self-end border-2 send"
                            >
                                <i className="fa-regular fa-paper-plane" />
                            </button>
                            </div>
                        </div>
                        </form>
                        {/* All comments section */}
                        {/* One comment block */}
                        <div className="mt-5">
                        <div className="row">
                            <div className="col-auto">
                            <span className="m-0 p-0">
                                <i className="bi bi-person-circle" />
                            </span>
                            </div>
                            <div className="col">
                            <div className="row">
                                <div className="col-12 name-user-comment">
                                <p className=" mt-0 mb-1">David Alejandro Villa González</p>
                                </div>
                                <div className="col-12 mt-0 mb-0 pt-0 pb-0">
                                <p className="mt-0 mb-0 pt-0 pb-0">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                    Alias, dolores.
                                </p>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                        {/* One comment block */}
                        <div className="mt-4">
                        <div className="row">
                            <div className="col-auto">
                            <span className="m-0 p-0">
                                <i className="bi bi-person-circle" />
                            </span>
                            </div>
                            <div className="col">
                            <div className="row">
                                <div className="col-12 name-user-comment">
                                <p className=" mt-0 mb-1">Javier Sántillan Hernández</p>
                                </div>
                                <div className="col-12 mt-0 mb-0 pt-0 pb-0">
                                <p className="mt-0 mb-0 pt-0 pb-0">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                    Alias, dolores.
                                </p>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                        {/* One comment block */}
                        <div className="mt-4">
                        <div className="row">
                            <div className="col-auto">
                            <span className="m-0 p-0">
                                <i className="bi bi-person-circle" />
                            </span>
                            </div>
                            <div className="col">
                            <div className="row">
                                <div className="col-12 name-user-comment">
                                <p className=" mt-0 mb-1">Rebecca Cuevas Armas</p>
                                </div>
                                <div className="col-12 mt-0 mb-0 pt-0 pb-0">
                                <p className="mt-0 mb-0 pt-0 pb-0">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                    Alias, dolores.
                                </p>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                        {/* One comment block */}
                        <div className="mt-4">
                        <div className="row">
                            <div className="col-auto">
                            <span className="m-0 p-0">
                                <i className="bi bi-person-circle" />
                            </span>
                            </div>
                            <div className="col">
                            <div className="row">
                                <div className="col-12 name-user-comment">
                                <p className=" mt-0 mb-1">Kenya Sánchez Mercado</p>
                                </div>
                                <div className="col-12 mt-0 mb-0 pt-0 pb-0">
                                <p className="mt-0 mb-0 pt-0 pb-0">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                    Alias, dolores.
                                </p>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
                {/* Upcoming events */}
                <div className="container mt-5 upcoming-events">
                <p>
                    <span>Próximos eventos</span>
                </p>
                </div>
                <div className="container mt-3 d-flex gap-5 flex-wrap justify-content-center">
                {/* Event */}
                <div className="card preview-event" style={{ width: "18rem" }}>
                    <img src="./img/event-2.jpg" className="card-img-top" alt="..." />
                    <div className="card-body">
                    <h5 className="card-title">Carrera Cucei</h5>
                    <p className="card-text">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis,
                        eligendi quae! Reprehenderit ex suscipit deserunt.
                    </p>
                    <a href="#" className="btn btn-dark">
                        <i className="fa-solid fa-circle-info" />
                    </a>
                    </div>
                </div>
                {/* Event */}
                <div className="card preview-event" style={{ width: "18rem" }}>
                    <img src="./img/event-2.jpg" className="card-img-top" alt="..." />
                    <div className="card-body">
                    <h5 className="card-title">Carrera Cucei</h5>
                    <p className="card-text">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis,
                        eligendi quae! Reprehenderit ex suscipit deserunt.
                    </p>
                    <a href="#" className="btn btn-dark">
                        <i className="fa-solid fa-circle-info" />
                    </a>
                    </div>
                </div>
                {/* Event */}
                <div className="card preview-event" style={{ width: "18rem" }}>
                    <img src="./img/event-2.jpg" className="card-img-top" alt="..." />
                    <div className="card-body">
                    <h5 className="card-title">Carrera Cucei</h5>
                    <p className="card-text">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis,
                        eligendi quae! Reprehenderit ex suscipit deserunt.
                    </p>
                    <a href="#" className="btn btn-dark">
                        <i className="fa-solid fa-circle-info" />
                    </a>
                    </div>
                </div>
                {/* Event */}
                <div className="card preview-event" style={{ width: "18rem" }}>
                    <img src="./img/event-2.jpg" className="card-img-top" alt="..." />
                    <div className="card-body">
                    <h5 className="card-title">Carrera Cucei</h5>
                    <p className="card-text">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis,
                        eligendi quae! Reprehenderit ex suscipit deserunt.
                    </p>
                    <a href="#" className="btn btn-dark">
                        <i className="fa-solid fa-circle-info" />
                    </a>
                    </div>
                </div>
                </div>
            </div>
            <Footer/>
        </>
      
    );
  }
  
  export default ShowEvent;