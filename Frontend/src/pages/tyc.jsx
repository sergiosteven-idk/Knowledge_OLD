// src/pages/terminos.jsx
import "../assets/CSS/terminos.css";
import A11yBar from "../components/A11yBar";

export default function Terminos() {
  return (
    <main className="terms-container" lang="es">
      <a href="#main-content" className="skip-link">Saltar al contenido</a>
      <A11yBar />

      {/* Encabezado */}
      <section id="main-content" className="hero" tabIndex={-1} aria-labelledby="terms-title">
        <h1 id="terms-title">Términos y Condiciones de Uso</h1>
        <p>
          Bienvenido a <strong>Knowledge</strong>. Estos términos regulan el acceso y uso de nuestra
          plataforma. Al registrarte o utilizar nuestros servicios, aceptas expresamente los presentes
          términos, así como nuestra política de privacidad.
        </p>
      </section>

      {/* Uso de la plataforma */}
      <section className="section" aria-labelledby="uso-title">
        <h2 id="uso-title">1. Uso de la plataforma</h2>
        <ul>
          <li>Knowledge es una plataforma educativa y de gestión de contenidos.</li>
          <li>No se permite el uso para actividades ilícitas, ofensivas o que afecten derechos de terceros.</li>
          <li>El usuario es responsable de la veracidad de la información que proporcione.</li>
        </ul>
      </section>

      {/* Registro y cuentas */}
      <section className="section alt" aria-labelledby="registro-title">
        <h2 id="registro-title">2. Registro y cuentas</h2>
        <p>
          Para acceder a determinadas funciones, debes registrarte con datos verídicos. El usuario es
          responsable de mantener la confidencialidad de su contraseña y de toda actividad realizada
          bajo su cuenta.
        </p>
      </section>

      {/* Propiedad intelectual */}
      <section className="section" aria-labelledby="propiedad-title">
        <h2 id="propiedad-title">3. Propiedad intelectual</h2>
        <p>
          Todos los contenidos, marcas, logotipos y elementos de diseño en Knowledge son propiedad
          de sus respectivos autores y se encuentran protegidos por la legislación de derechos de
          autor y propiedad industrial. El uso no autorizado está prohibido.
        </p>
      </section>

      {/* Protección de datos */}
      <section className="section alt" aria-labelledby="datos-title">
        <h2 id="datos-title">4. Protección de datos personales</h2>
        <p>
          Knowledge cumple con la <strong>Ley 1581 de 2012</strong> y normas concordantes de
          protección de datos personales en Colombia, así como con los principios del
          <strong> Reglamento General de Protección de Datos (GDPR)</strong> de la Unión Europea.
        </p>
        <ul>
          <li>Los datos recolectados serán utilizados únicamente para las finalidades autorizadas.</li>
          <li>El usuario tiene derecho a conocer, actualizar y rectificar su información personal.</li>
          <li>El usuario puede solicitar la eliminación de sus datos mediante el correo: 
              <a href="mailto:soporte@knowledge.org"> soporte@knowledge.org</a>.
          </li>
        </ul>
      </section>

      {/* Limitación de responsabilidad */}
      <section className="section" aria-labelledby="responsabilidad-title">
        <h2 id="responsabilidad-title">5. Limitación de responsabilidad</h2>
        <p>
          Knowledge no será responsable por daños derivados del uso indebido de la plataforma,
          interrupciones del servicio por causas externas o por el contenido publicado por terceros.
        </p>
      </section>

      {/* Modificaciones */}
      <section className="section alt" aria-labelledby="modificaciones-title">
        <h2 id="modificaciones-title">6. Modificaciones</h2>
        <p>
          Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios se
          publicarán en esta página y entrarán en vigencia desde su publicación.
        </p>
      </section>

      {/* Contacto */}
      <section className="section" aria-labelledby="contact-title">
        <h2 id="contact-title">7. Contacto</h2>
        <p>
          Si tienes preguntas sobre estos términos, puedes comunicarte con nosotros a través de:
        </p>
        <ul>
          <li>📧 Correo: <a href="mailto:soporte@knowledge.org">soporte@knowledge.org</a></li>
          <li>📱 WhatsApp: <a href="https://wa.me/573001112233" target="_blank" rel="noreferrer">+57 300 111 2233</a></li>
        </ul>
      </section>

      <footer className="terms-footer">
        <p>© {new Date().getFullYear()} Knowledge. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}
