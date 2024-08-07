import './Footer.css';

function Footer() {
    return (
        <>
            {/* Start Footer */}
            <nav className="navbar bg-dark text-white">
            <div className="container-fluid">
                {/* Contenedor original para pantallas grandes */}
                <div className="footer-home original-footer">
                <div className="element">
                    <i className="fa-brands fa-facebook" />
                </div>
                <div className="element">
                    <i className="fa-brands fa-twitter" />
                </div>
                <div className="brand-footer">
                    <img
                    src="../img/Escudo_udg_footer.png"
                    alt="logo universidad de guadalajara"
                    width={310}
                    height={106}
                    />
                </div>
                <div className="element">
                    <i className="fa-brands fa-twitch" />
                </div>
                <div className="element">
                    <i className="fa-brands fa-instagram" />
                </div>
                </div>
                {/* Contenedor para pantallas pequeñas */}
                <div className="footer-home small-footer">
                <div className="brand-footer">
                    <img
                    src="../img/Escudo_udg_footer.png"
                    alt="logo universidad de guadalajara"
                    width={310}
                    height={106}
                    />
                </div>
                <div className="social-icons">
                    <div className="element">
                    <i className="fa-brands fa-facebook" />
                    </div>
                    <div className="element">
                    <i className="fa-brands fa-twitter" />
                    </div>
                    <div className="element">
                    <i className="fa-brands fa-twitch" />
                    </div>
                    <div className="element">
                    <i className="fa-brands fa-instagram" />
                    </div>
                </div>
                </div>
                <div className="message">
                <p>
                    Derechos reservados ©1997 - 2019. Universidad de Guadalajara. Sitio
                    desarrollado por - | Créditos de sitio | Política de privacidad y
                    manejo de datos
                </p>
                </div>
            </div>
            </nav>
            {/* End Footer */}
        </>
    );
  }
  
  export default Footer;