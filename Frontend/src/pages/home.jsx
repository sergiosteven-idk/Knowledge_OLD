// src/pages/Home.jsx
import React, { useRef } from "react";
import A11yBar from "../components/A11yBar";

export default function Home() {
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const impactRef = useRef(null);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    ref.current?.focus({ preventScroll: true });
  };

  const talkbackIntro = () => {
    const text = `Bienvenido a Knowledge. Plataforma educativa gratuita e inclusiva. 
    Usa los controles de accesibilidad para ajustar tamaño de fuente, contraste, y activar TalkBack.`;
    window.speechSynthesis?.cancel();
    window.speechSynthesis?.speak(new SpeechSynthesisUtterance(text));
  };

  return (
    <main className="home-container" lang="es">
      <a href="#main-content" className="skip-link">Saltar al contenido</a>

      <A11yBar />

      <section className="hero" id="main-content" tabIndex={-1} aria-labelledby="hero-title">
        <h1 id="hero-title">Bienvenido a <span className="highlight">Knowledge</span></h1>
        <p>
          Una plataforma educativa <strong>100% gratuita</strong> e <strong>inclusiva</strong>. Cursos, podcasts, videos con subtítulos y lenguaje de señas — diseñado para llegar a quienes más lo necesitan.
        </p>

        <div className="hero-buttons" role="navigation" aria-label="Navegación interna de la página">
          <button onClick={() => scrollTo(aboutRef)} aria-label="Saber qué es Knowledge">¿Qué es?</button>
          <button onClick={() => scrollTo(featuresRef)} aria-label="Ver características">Características</button>
          <button onClick={() => scrollTo(impactRef)} aria-label="Ver impacto">Impacto</button>
          <button className="talkback-btn" onClick={talkbackIntro} aria-pressed="false">🔊 Activar TalkBack</button>
          <button onClick={() => {
            // abre modal de LS (aquí placeholder)
            alert("Abrir video en lenguaje de señas (implementa enlace al intérprete o video).");
          }}>👐 Ver en LS</button>
        </div>
      </section>

      <section ref={aboutRef} className="section" tabIndex={-1}>
        <h2>¿Qué es Knowledge?</h2>
        <p>
          Knowledge es una plataforma (web + móvil) que prioriza la accesibilidad: soporte para lectores de pantalla, navegación por teclado, subtítulos, transcripciones y opciones de personalización visual y cognitiva.
        </p>
      </section>

      <section ref={featuresRef} className="section alt" tabIndex={-1}>
        <h2>Características principales</h2>
        <ul>
          <li><strong>Accesibilidad completa</strong>: ARIA, focus management, skip links.</li>
          <li><strong>Multimodalidad</strong>: audio, texto, video con LS y subtítulos.</li>
          <li><strong>Personalización</strong>: tamaño, contraste, espaciado, modo simplificado.</li>
          <li><strong>Sostenibilidad comunitaria</strong>: eventos, alianzas, donaciones transparentes.</li>
        </ul>
      </section>

      <section ref={impactRef} className="section" tabIndex={-1}>
        <h2>Impacto</h2>
        <p>
          Knowledge busca transformar comunidades vulnerables mediante educación accesible y cultural. Participación activa, transparencia y formación continua.
        </p>
      </section>
    </main>
  );
}
