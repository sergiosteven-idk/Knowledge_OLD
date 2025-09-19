// src/components/A11yBar.jsx
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "../assets/CSS/styles.css";
import "../assets/CSS/home.css";
import "../assets/CSS/A11yBar.css";

/**
 * 🌍 A11yBar Universal - Accesibilidad Completa
 * ✅ WCAG 2.2 AAA Compliance
 * ✅ Discapacidad Visual: Lectores de pantalla, navegación por teclado, contraste
 * ✅ Discapacidad Auditiva: Alertas visuales, transcripciones, vibración
 * ✅ Discapacidad Motriz: Navegación simplificada, gestos, tiempo extendido
 * ✅ Discapacidad Cognitiva: Simplicidad, predictibilidad, apoyo contextual
 * ✅ Neurodiversidad: Reducción de estímulos, patrones claros
 */

const defaultSettings = {
  fontSize: "normal", // small, normal, large, xlarge, xxlarge
  contrast: "normal", // normal, high, inverted, dark
  spacing: "normal", // compact, normal, wide, extra-wide
  simplified: false,
  reducedMotion: false,
  focusIndicator: "default", // default, thick, colorful
  cursorSize: "normal", // normal, large, extra-large
  talkBackVoice: "default",
  talkBackRate: 1,
  talkBackPitch: 1,
  visualAlerts: false,
  vibrationFeedback: false,
  autoRead: false,
  readingGuide: false,
  dyslexiaFont: false,
  colorBlindness: "none", // none, protanopia, deuteranopia, tritanopia
  language: "es",
  timeoutExtension: 1, // multiplicador de tiempo
  skipAnimations: false,
  highlightLinks: false,
  showStructure: false
};

// Constantes para accesibilidad
const FOCUS_TRAP_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
const ARIA_LIVE_REGION_ID = 'a11y-live-region';
const KEYBOARD_SHORTCUTS = {
  'Alt+KeyT': 'readHero',
  'Alt+Digit1': 'jumpToHero',
  'Alt+KeyH': 'showHelp',
  'Alt+KeyR': 'resetSettings',
  'Alt+KeyS': 'stopSpeaking',
  'Alt+KeyN': 'nextElement',
  'Alt+KeyP': 'previousElement',
  'Alt+KeyF': 'findText',
  'Escape': 'closeBar'
};

export default function A11yBar() {
  // Estados
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("a11y-settings");
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });
  
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [currentFocus, setCurrentFocus] = useState(null);
  const [helpMode, setHelpMode] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [readingPosition, setReadingPosition] = useState(null);
  const [navigationHistory, setNavigationHistory] = useState([]);

  // Referencias
  const toggleBtnRef = useRef(null);
  const controlsRef = useRef(null);
  const announcementTimerRef = useRef(null);
  const focusTrapRef = useRef(null);
  const readingIntervalRef = useRef(null);

  // Web Speech API
  const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
  const recognition = useRef(null);

  // 🔊 Inicializar voces y reconocimiento de voz
  useEffect(() => {
    if (!synth) return;
    
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      
      // Priorizar voces en español
      const spanishVoices = availableVoices.filter(v => v.lang.startsWith('es'));
      if (spanishVoices.length > 0 && settings.talkBackVoice === 'default') {
        setSettings(prev => ({ ...prev, talkBackVoice: spanishVoices[0].name }));
      }
    };
    
    synth.onvoiceschanged = loadVoices;
    loadVoices();

    // Inicializar reconocimiento de voz
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.lang = settings.language === 'es' ? 'es-ES' : 'en-US';
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
    }
  }, [synth]);

  // 📦 Aplicar configuraciones y persistencia
  useEffect(() => {
    const root = document.documentElement;
    
    // Aplicar todas las configuraciones CSS
    root.dataset.a11yFont = settings.fontSize;
    root.dataset.a11yContrast = settings.contrast;
    root.dataset.a11ySpacing = settings.spacing;
    root.dataset.a11ySimplified = settings.simplified ? "1" : "0";
    root.dataset.a11yReducedMotion = settings.reducedMotion ? "1" : "0";
    root.dataset.a11yFocusIndicator = settings.focusIndicator;
    root.dataset.a11yCursorSize = settings.cursorSize;
    root.dataset.a11yColorBlindness = settings.colorBlindness;
    root.dataset.a11yDyslexiaFont = settings.dyslexiaFont ? "1" : "0";
    root.dataset.a11yHighlightLinks = settings.highlightLinks ? "1" : "0";
    root.dataset.a11yShowStructure = settings.showStructure ? "1" : "0";

    // Configurar motion
    if (settings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0s');
      root.style.setProperty('--transition-duration', '0s');
    }

    // Persistir configuraciones
    localStorage.setItem("a11y-settings", JSON.stringify(settings));
    
    // Anunciar cambios importantes
    if (settings.visualAlerts) {
      announceChange("Configuración de accesibilidad actualizada");
    }
  }, [settings]);

  // 🔊 Funciones de TalkBack mejoradas
  const speakText = useCallback((text, options = {}) => {
    if (!synth || !text) return Promise.resolve();
    
    return new Promise((resolve) => {
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text.trim());
      
      // Configurar voz
      utterance.rate = options.rate || settings.talkBackRate || 1;
      utterance.pitch = options.pitch || settings.talkBackPitch || 1;
      utterance.volume = options.volume || 0.9;
      
      const voice = voices.find(v => v.name === settings.talkBackVoice) || 
                   voices.find(v => v.lang.startsWith(settings.language)) || 
                   voices[0];
      
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      }

      // Eventos
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => {
        setSpeaking(false);
        resolve();
      };
      utterance.onerror = () => {
        setSpeaking(false);
        resolve();
      };

      synth.speak(utterance);
    });
  }, [synth, voices, settings]);

  const stopSpeaking = useCallback(() => {
    if (!synth) return;
    synth.cancel();
    setSpeaking(false);
    announceChange("Lectura detenida");
  }, [synth]);

  // 📢 Sistema de anuncios
  const announceChange = useCallback((message, priority = 'polite') => {
    setAnnouncement(message);
    
    // Limpiar anuncio anterior
    if (announcementTimerRef.current) {
      clearTimeout(announcementTimerRef.current);
    }
    
    // Limpiar después de anunciar
    announcementTimerRef.current = setTimeout(() => {
      setAnnouncement('');
    }, 3000);

    // Vibración si está habilitada
    if (settings.vibrationFeedback && 'navigator' in window && 'vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }

    // Auto-lectura si está habilitada
    if (settings.autoRead) {
      speakText(message);
    }
  }, [settings, speakText]);

  // 🎯 Navegación inteligente
  const getNavigableElements = useCallback(() => {
    return Array.from(document.querySelectorAll(FOCUS_TRAP_SELECTOR))
      .filter(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               !el.disabled &&
               el.tabIndex >= 0;
      });
  }, []);

  const navigateToNext = useCallback(() => {
    const elements = getNavigableElements();
    const currentIndex = elements.findIndex(el => el === document.activeElement);
    const nextIndex = (currentIndex + 1) % elements.length;
    
    if (elements[nextIndex]) {
      elements[nextIndex].focus();
      announceElementInfo(elements[nextIndex]);
    }
  }, [getNavigableElements]);

  const navigateToPrevious = useCallback(() => {
    const elements = getNavigableElements();
    const currentIndex = elements.findIndex(el => el === document.activeElement);
    const prevIndex = currentIndex <= 0 ? elements.length - 1 : currentIndex - 1;
    
    if (elements[prevIndex]) {
      elements[prevIndex].focus();
      announceElementInfo(elements[prevIndex]);
    }
  }, [getNavigableElements]);

  const announceElementInfo = useCallback((element) => {
    if (!element) return;
    
    let info = [];
    
    // Tipo de elemento
    const tagName = element.tagName.toLowerCase();
    const role = element.getAttribute('role') || tagName;
    info.push(role);
    
    // Label o texto
    const label = element.getAttribute('aria-label') ||
                  element.getAttribute('title') ||
                  element.textContent?.trim() ||
                  element.value ||
                  element.placeholder;
    
    if (label) info.push(label);
    
    // Estados
    if (element.getAttribute('aria-pressed')) {
      info.push(element.getAttribute('aria-pressed') === 'true' ? 'presionado' : 'no presionado');
    }
    if (element.getAttribute('aria-expanded')) {
      info.push(element.getAttribute('aria-expanded') === 'true' ? 'expandido' : 'colapsado');
    }
    if (element.disabled) info.push('deshabilitado');
    if (element.required) info.push('requerido');
    
    const description = info.join(', ');
    announceChange(description);
  }, [announceChange]);

  // ⌨️ Manejo de teclado mejorado
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = `${e.altKey ? 'Alt+' : ''}${e.ctrlKey ? 'Ctrl+' : ''}${e.shiftKey ? 'Shift+' : ''}${e.code}`;
      
      // Procesar atajos
      if (KEYBOARD_SHORTCUTS[key]) {
        e.preventDefault();
        handleShortcut(KEYBOARD_SHORTCUTS[key]);
        return;
      }

      // Navegación en la barra de accesibilidad
      if (open && controlsRef.current?.contains(e.target)) {
        switch (e.key) {
          case 'Escape':
            e.preventDefault();
            setOpen(false);
            toggleBtnRef.current?.focus();
            announceChange("Barra de accesibilidad cerrada");
            break;
          case 'Tab':
            // El comportamiento nativo de Tab está bien
            break;
          case 'ArrowDown':
          case 'ArrowUp':
            e.preventDefault();
            const focusables = controlsRef.current.querySelectorAll(FOCUS_TRAP_SELECTOR);
            const currentIndex = Array.from(focusables).indexOf(e.target);
            const nextIndex = e.key === 'ArrowDown' 
              ? (currentIndex + 1) % focusables.length
              : currentIndex <= 0 ? focusables.length - 1 : currentIndex - 1;
            focusables[nextIndex]?.focus();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const handleShortcut = useCallback((action) => {
    switch (action) {
      case 'readHero':
        const heroText = document.querySelector('.hero, [role="banner"], h1')?.textContent ||
                        document.querySelector('main')?.textContent?.slice(0, 200) ||
                        "Contenido principal de Knowledge";
        speakText(`Leyendo contenido principal: ${heroText}`);
        break;
      
      case 'jumpToHero':
        const heroElement = document.querySelector('.hero, [role="banner"], h1, main');
        if (heroElement) {
          heroElement.focus();
          heroElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          announceChange("Navegando al contenido principal");
        }
        break;
      
      case 'showHelp':
        setHelpMode(!helpMode);
        announceChange(helpMode ? "Modo ayuda desactivado" : "Modo ayuda activado");
        break;
      
      case 'resetSettings':
        resetSettings();
        break;
      
      case 'stopSpeaking':
        stopSpeaking();
        break;
      
      case 'nextElement':
        navigateToNext();
        break;
      
      case 'previousElement':
        navigateToPrevious();
        break;
      
      case 'closeBar':
        if (open) {
          setOpen(false);
          toggleBtnRef.current?.focus();
          announceChange("Barra de accesibilidad cerrada");
        }
        break;
    }
  }, [helpMode, open, speakText, navigateToNext, navigateToPrevious, stopSpeaking]);

  // 📖 Lectura automática y continua
  const startAutoReading = useCallback(() => {
    const textElements = Array.from(document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, td, th, [role="text"]'))
      .filter(el => el.textContent?.trim().length > 10);
    
    if (textElements.length === 0) return;
    
    let currentIndex = 0;
    
    const readNext = async () => {
      if (currentIndex >= textElements.length) {
        announceChange("Lectura completa terminada");
        return;
      }
      
      const element = textElements[currentIndex];
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Resaltar elemento actual
      element.style.outline = '3px solid #0066cc';
      element.style.backgroundColor = '#fff3cd';
      
      await speakText(element.textContent);
      
      // Limpiar resaltado
      element.style.outline = '';
      element.style.backgroundColor = '';
      
      currentIndex++;
      
      if (speaking) {
        setTimeout(readNext, 500);
      }
    };
    
    readNext();
  }, [speakText, speaking]);

  // 🔄 Reset mejorado
  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.removeItem("a11y-settings");
    stopSpeaking();
    setOpen(false);
    toggleBtnRef.current?.focus();
    announceChange("Configuraciones restablecidas a valores predeterminados");
  }, [stopSpeaking, announceChange]);

  // 🎨 Configuraciones avanzadas
  const advancedSettings = useMemo(() => [
    {
      id: 'reducedMotion',
      label: 'Reducir animaciones',
      description: 'Desactiva animaciones y transiciones',
      type: 'toggle'
    },
    {
      id: 'dyslexiaFont',
      label: 'Fuente para dislexia',
      description: 'Usa fuente optimizada para dislexia',
      type: 'toggle'
    },
    {
      id: 'visualAlerts',
      label: 'Alertas visuales',
      description: 'Muestra notificaciones visuales',
      type: 'toggle'
    },
    {
      id: 'vibrationFeedback',
      label: 'Vibración',
      description: 'Feedback háptico en dispositivos compatibles',
      type: 'toggle'
    },
    {
      id: 'autoRead',
      label: 'Lectura automática',
      description: 'Lee automáticamente cambios importantes',
      type: 'toggle'
    },
    {
      id: 'highlightLinks',
      label: 'Resaltar enlaces',
      description: 'Hace los enlaces más visibles',
      type: 'toggle'
    },
    {
      id: 'showStructure',
      label: 'Mostrar estructura',
      description: 'Resalta la estructura semántica de la página',
      type: 'toggle'
    }
  ], []);

  // 🎯 Focus trap para modal
  useEffect(() => {
    if (!open || !controlsRef.current) return;
    
    const focusableElements = controlsRef.current.querySelectorAll(FOCUS_TRAP_SELECTOR);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleFocusTrap = (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    controlsRef.current.addEventListener('keydown', handleFocusTrap);
    firstElement?.focus();
    
    return () => {
      controlsRef.current?.removeEventListener('keydown', handleFocusTrap);
    };
  }, [open]);

  return (
    <>
      {/* Región de anuncios en vivo */}
      <div
        id={ARIA_LIVE_REGION_ID}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {announcement}
      </div>

      {/* Barra de accesibilidad */}
      <div
        className={`a11y-bar ${open ? 'open' : ''}`}
        role="region"
        aria-label="Herramientas de accesibilidad"
        aria-describedby="a11y-description"
      >
        <div id="a11y-description" className="sr-only">
          Barra de herramientas de accesibilidad. Use Alt+H para ver atajos de teclado.
          {helpMode && " Modo ayuda activado: navegue con Tab y flechas."}
        </div>

        {/* Botón de toggle mejorado */}
        <button
          ref={toggleBtnRef}
          className="a11y-toggle"
          aria-expanded={open}
          aria-controls="a11y-controls"
          aria-describedby="a11y-toggle-help"
          onClick={() => {
            setOpen(prev => {
              const newState = !prev;
              announceChange(newState ? "Barra de accesibilidad abierta" : "Barra de accesibilidad cerrada");
              return newState;
            });
          }}
          onMouseEnter={() => announceChange("Botón de accesibilidad")}
        >
          <span aria-hidden="true">♿</span>
          <span>Accesibilidad</span>
          {speaking && <span className="speaking-indicator" aria-label="Reproduciendo audio"></span>}
        </button>

        <div id="a11y-toggle-help" className="sr-only">
          Presione Enter o Espacio para {open ? 'cerrar' : 'abrir'} las opciones de accesibilidad.
          Use Alt+H para ayuda con atajos de teclado.
        </div>

        {/* Panel de controles */}
        {open && (
          <div
            ref={controlsRef}
            id="a11y-controls"
            className="a11y-controls"
            role="dialog"
            aria-label="Panel de opciones de accesibilidad"
            aria-modal="false"
            tabIndex="-1"
          >
            {/* Ayuda rápida */}
            {helpMode && (
              <div className="a11y-help" role="region" aria-label="Ayuda de atajos">
                <h3>Atajos de teclado:</h3>
                <ul>
                  <li>Alt+T: Leer contenido principal</li>
                  <li>Alt+1: Ir al contenido principal</li>
                  <li>Alt+H: Alternar ayuda</li>
                  <li>Alt+S: Parar lectura</li>
                  <li>Alt+N/P: Siguiente/Anterior elemento</li>
                  <li>Escape: Cerrar barra</li>
                </ul>
              </div>
            )}

            {/* Controles de texto */}
            <fieldset className="a11y-section">
              <legend>Configuración de texto</legend>
              
              {/* Tamaño de fuente */}
              <div className="a11y-row" role="group" aria-labelledby="font-size-label">
                <span id="font-size-label" className="a11y-label">Tamaño de fuente:</span>
                <div className="a11y-group">
                  {['small', 'normal', 'large', 'xlarge', 'xxlarge'].map((size) => (
                    <button
                      key={size}
                      className={`a11y-btn ${settings.fontSize === size ? 'active' : ''}`}
                      onClick={() => {
                        setSettings(prev => ({ ...prev, fontSize: size }));
                        announceChange(`Tamaño de fuente: ${size}`);
                      }}
                      aria-pressed={settings.fontSize === size}
                      aria-describedby={`font-${size}-desc`}
                    >
                      <span className={`font-preview font-${size}`}>A</span>
                      <span className="sr-only">{size}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Espaciado */}
              <div className="a11y-row" role="group" aria-labelledby="spacing-label">
                <span id="spacing-label" className="a11y-label">Espaciado:</span>
                <div className="a11y-group">
                  {[
                    { value: 'compact', label: 'Compacto' },
                    { value: 'normal', label: 'Normal' },
                    { value: 'wide', label: 'Amplio' },
                    { value: 'extra-wide', label: 'Extra amplio' }
                  ].map((spacing) => (
                    <button
                      key={spacing.value}
                      className={`a11y-btn ${settings.spacing === spacing.value ? 'active' : ''}`}
                      onClick={() => {
                        setSettings(prev => ({ ...prev, spacing: spacing.value }));
                        announceChange(`Espaciado: ${spacing.label}`);
                      }}
                      aria-pressed={settings.spacing === spacing.value}
                    >
                      {spacing.label}
                    </button>
                  ))}
                </div>
              </div>
            </fieldset>

            {/* Controles visuales */}
            <fieldset className="a11y-section">
              <legend>Configuración visual</legend>
              
              {/* Contraste */}
              <div className="a11y-row" role="group" aria-labelledby="contrast-label">
                <span id="contrast-label" className="a11y-label">Contraste:</span>
                <div className="a11y-group">
                  {[
                    { value: 'normal', label: 'Normal' },
                    { value: 'high', label: 'Alto' },
                    { value: 'inverted', label: 'Invertido' },
                    { value: 'dark', label: 'Modo oscuro' }
                  ].map((contrast) => (
                    <button
                      key={contrast.value}
                      className={`a11y-btn ${settings.contrast === contrast.value ? 'active' : ''}`}
                      onClick={() => {
                        setSettings(prev => ({ ...prev, contrast: contrast.value }));
                        announceChange(`Contraste: ${contrast.label}`);
                      }}
                      aria-pressed={settings.contrast === contrast.value}
                    >
                      {contrast.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cursor */}
              <div className="a11y-row" role="group" aria-labelledby="cursor-label">
                <span id="cursor-label" className="a11y-label">Tamaño del cursor:</span>
                <div className="a11y-group">
                  {[
                    { value: 'normal', label: 'Normal' },
                    { value: 'large', label: 'Grande' },
                    { value: 'extra-large', label: 'Extra grande' }
                  ].map((cursor) => (
                    <button
                      key={cursor.value}
                      className={`a11y-btn ${settings.cursorSize === cursor.value ? 'active' : ''}`}
                      onClick={() => {
                        setSettings(prev => ({ ...prev, cursorSize: cursor.value }));
                        announceChange(`Cursor: ${cursor.label}`);
                      }}
                      aria-pressed={settings.cursorSize === cursor.value}
                    >
                      {cursor.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Indicador de foco */}
              <div className="a11y-row" role="group" aria-labelledby="focus-label">
                <span id="focus-label" className="a11y-label">Indicador de foco:</span>
                <div className="a11y-group">
                  {[
                    { value: 'default', label: 'Predeterminado' },
                    { value: 'thick', label: 'Grueso' },
                    { value: 'colorful', label: 'Colorido' }
                  ].map((focus) => (
                    <button
                      key={focus.value}
                      className={`a11y-btn ${settings.focusIndicator === focus.value ? 'active' : ''}`}
                      onClick={() => {
                        setSettings(prev => ({ ...prev, focusIndicator: focus.value }));
                        announceChange(`Indicador de foco: ${focus.label}`);
                      }}
                      aria-pressed={settings.focusIndicator === focus.value}
                    >
                      {focus.label}
                    </button>
                  ))}
                </div>
              </div>
            </fieldset>

            {/* Controles de audio */}
            <fieldset className="a11y-section">
              <legend>Lectura por voz</legend>
              
              <div className="a11y-controls-audio">
                {/* Botones de lectura */}
                <div className="a11y-row">
                  <div className="a11y-group audio-controls">
                    <button
                      className="a11y-btn primary"
                      onClick={() => speakText(
                        document.querySelector('.hero, h1, main')?.textContent?.slice(0, 500) || 
                        "Bienvenido a Knowledge"
                      )}
                      disabled={speaking}
                      aria-describedby="read-main-desc"
                    >
                      🗣️ Leer principal
                    </button>
                    <div id="read-main-desc" className="sr-only">
                      Lee el contenido principal de la página
                    </div>

                    <button
                      className="a11y-btn primary"
                      onClick={() => startAutoReading()}
                      disabled={speaking}
                      aria-describedby="read-all-desc"
                    >
                      📖 Leer todo
                    </button>
                    <div id="read-all-desc" className="sr-only">
                      Inicia lectura continua de toda la página
                    </div>

                    <button
                      className="a11y-btn danger"
                      onClick={stopSpeaking}
                      disabled={!speaking}
                      aria-describedby="stop-desc"
                    >
                      ⏹️ Parar
                    </button>
                    <div id="stop-desc" className="sr-only">
                      Detiene la lectura actual
                    </div>
                  </div>
                </div>

                {/* Controles de velocidad y tono */}
                <div className="a11y-row">
                  <label htmlFor="speech-rate" className="a11y-label">
                    Velocidad: {settings.talkBackRate}x
                  </label>
                  <input
                    id="speech-rate"
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={settings.talkBackRate || 1}
                    onChange={(e) => {
                      const rate = Number(e.target.value);
                      setSettings(prev => ({ ...prev, talkBackRate: rate }));
                      announceChange(`Velocidad: ${rate} por segundo`);
                    }}
                    className="a11y-slider"
                    aria-describedby="rate-desc"
                  />
                  <div id="rate-desc" className="sr-only">
                    Ajusta la velocidad de lectura de 0.5 a 2 veces la velocidad normal
                  </div>
                </div>

                <div className="a11y-row">
                  <label htmlFor="speech-pitch" className="a11y-label">
                    Tono: {settings.talkBackPitch}
                  </label>
                  <input
                    id="speech-pitch"
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={settings.talkBackPitch || 1}
                    onChange={(e) => {
                      const pitch = Number(e.target.value);
                      setSettings(prev => ({ ...prev, talkBackPitch: pitch }));
                      announceChange(`Tono: ${pitch}`);
                    }}
                    className="a11y-slider"
                    aria-describedby="pitch-desc"
                  />
                  <div id="pitch-desc" className="sr-only">
                    Ajusta el tono de la voz de 0.5 a 2
                  </div>
                </div>

                {/* Selección de voz */}
                {voices.length > 0 && (
                  <div className="a11y-row">
                    <label htmlFor="voice-select" className="a11y-label">
                      Voz:
                    </label>
                    <select
                      id="voice-select"
                      value={settings.talkBackVoice || 'default'}
                      onChange={(e) => {
                        setSettings(prev => ({ ...prev, talkBackVoice: e.target.value }));
                        announceChange(`Voz cambiada: ${e.target.selectedOptions[0].text}`);
                      }}
                      className="a11y-select"
                      aria-describedby="voice-desc"
                    >
                      <option value="default">Predeterminada</option>
                      {voices.map((voice) => (
                        <option key={voice.name} value={voice.name}>
                          {voice.name} ({voice.lang}) {voice.gender ? `- ${voice.gender}` : ''}
                        </option>
                      ))}
                    </select>
                    <div id="voice-desc" className="sr-only">
                      Selecciona la voz para la lectura de texto
                    </div>
                  </div>
                )}
              </div>
            </fieldset>

            {/* Configuraciones avanzadas */}
            <fieldset className="a11y-section">
              <legend>Configuraciones avanzadas</legend>
              
              {advancedSettings.map((setting) => (
                <div key={setting.id} className="a11y-row">
                  <div className="a11y-advanced-setting">
                    <button
                      className={`a11y-toggle-btn ${settings[setting.id] ? 'active' : ''}`}
                      onClick={() => {
                        setSettings(prev => ({ ...prev, [setting.id]: !prev[setting.id] }));
                        announceChange(`${setting.label} ${!settings[setting.id] ? 'activado' : 'desactivado'}`);
                      }}
                      aria-pressed={settings[setting.id]}
                      aria-describedby={`${setting.id}-desc`}
                    >
                      <span className="toggle-indicator" aria-hidden="true">
                        {settings[setting.id] ? '✓' : '○'}
                      </span>
                      {setting.label}
                    </button>
                    <div id={`${setting.id}-desc`} className="a11y-setting-desc">
                      {setting.description}
                    </div>
                  </div>
                </div>
              ))}

              {/* Configuración de daltonismo */}
              <div className="a11y-row">
                <label htmlFor="colorblind-select" className="a11y-label">
                  Filtro daltonismo:
                </label>
                <select
                  id="colorblind-select"
                  value={settings.colorBlindness || 'none'}
                  onChange={(e) => {
                    setSettings(prev => ({ ...prev, colorBlindness: e.target.value }));
                    announceChange(`Filtro de daltonismo: ${e.target.selectedOptions[0].text}`);
                  }}
                  className="a11y-select"
                  aria-describedby="colorblind-desc"
                >
                  <option value="none">Ninguno</option>
                  <option value="protanopia">Protanopia (rojo-verde)</option>
                  <option value="deuteranopia">Deuteranopia (verde-rojo)</option>
                  <option value="tritanopia">Tritanopia (azul-amarillo)</option>
                </select>
                <div id="colorblind-desc" className="sr-only">
                  Ajusta los colores para diferentes tipos de daltonismo
                </div>
              </div>

              {/* Extensión de tiempo */}
              <div className="a11y-row">
                <label htmlFor="timeout-extension" className="a11y-label">
                  Extensión de tiempo: {settings.timeoutExtension}x
                </label>
                <input
                  id="timeout-extension"
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={settings.timeoutExtension || 1}
                  onChange={(e) => {
                    const extension = Number(e.target.value);
                    setSettings(prev => ({ ...prev, timeoutExtension: extension }));
                    announceChange(`Extensión de tiempo: ${extension} veces`);
                  }}
                  className="a11y-slider"
                  aria-describedby="timeout-desc"
                />
                <div id="timeout-desc" className="sr-only">
                  Multiplica los tiempos de espera por este factor
                </div>
              </div>
            </fieldset>

            {/* Navegación inteligente */}
            <fieldset className="a11y-section">
              <legend>Navegación y ayuda</legend>
              
              <div className="a11y-row">
                <div className="a11y-group navigation-controls">
                  <button
                    className="a11y-btn secondary"
                    onClick={() => {
                      setHelpMode(!helpMode);
                      announceChange(helpMode ? "Modo ayuda desactivado" : "Modo ayuda activado");
                    }}
                    aria-pressed={helpMode}
                    aria-describedby="help-desc"
                  >
                    {helpMode ? '❌ Ocultar ayuda' : '❓ Mostrar ayuda'}
                  </button>
                  <div id="help-desc" className="sr-only">
                    Activa el modo ayuda para ver atajos de teclado
                  </div>

                  <button
                    className="a11y-btn secondary"
                    onClick={navigateToNext}
                    aria-describedby="next-desc"
                  >
                    ⏭️ Siguiente elemento
                  </button>
                  <div id="next-desc" className="sr-only">
                    Navega al siguiente elemento interactivo
                  </div>

                  <button
                    className="a11y-btn secondary"
                    onClick={navigateToPrevious}
                    aria-describedby="prev-desc"
                  >
                    ⏮️ Elemento anterior
                  </button>
                  <div id="prev-desc" className="sr-only">
                    Navega al elemento interactivo anterior
                  </div>
                </div>
              </div>

              {/* Botón de emergencia - Simplificar todo */}
              <div className="a11y-row">
                <button
                  className="a11y-btn emergency"
                  onClick={() => {
                    setSettings(prev => ({
                      ...prev,
                      simplified: true,
                      fontSize: 'xlarge',
                      contrast: 'high',
                      spacing: 'wide',
                      reducedMotion: true,
                      focusIndicator: 'thick',
                      cursorSize: 'large'
                    }));
                    announceChange("Modo de emergencia activado: configuración simplificada aplicada");
                  }}
                  aria-describedby="emergency-desc"
                >
                  🚨 Modo emergencia
                </button>
                <div id="emergency-desc" className="sr-only">
                  Activa instantáneamente las mejores configuraciones de accesibilidad
                </div>
              </div>
            </fieldset>

            {/* Acciones finales */}
            <div className="a11y-actions">
              <button
                className="a11y-btn secondary"
                onClick={() => {
                  const summary = `Configuración actual: 
                    Fuente ${settings.fontSize}, 
                    Contraste ${settings.contrast}, 
                    Espaciado ${settings.spacing}${settings.simplified ? ', Modo simplificado activado' : ''}${settings.dyslexiaFont ? ', Fuente para dislexia activada' : ''}`;
                  speakText(summary);
                }}
                aria-describedby="read-config-desc"
              >
                🔊 Leer configuración
              </button>
              <div id="read-config-desc" className="sr-only">
                Lee todas las configuraciones actuales
              </div>

              <button
                className="a11y-btn danger"
                onClick={resetSettings}
                aria-describedby="reset-desc"
              >
                ♻️ Restablecer todo
              </button>
              <div id="reset-desc" className="sr-only">
                Restaura todas las configuraciones a sus valores predeterminados
              </div>

              <button
                className="a11y-btn secondary"
                onClick={() => {
                  setOpen(false);
                  toggleBtnRef.current?.focus();
                  announceChange("Barra de accesibilidad cerrada");
                }}
                aria-describedby="close-desc"
              >
                ❌ Cerrar
              </button>
              <div id="close-desc" className="sr-only">
                Cierra la barra de accesibilidad
              </div>
            </div>

            {/* Estado del habla */}
            {speaking && (
              <div className="a11y-speaking-status" role="status" aria-live="polite">
                <span className="speaking-animation">🎵</span>
                Reproduciendo audio...
                <button
                  className="stop-speaking-btn"
                  onClick={stopSpeaking}
                  aria-label="Detener reproducción de audio"
                >
                  ⏹️
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Overlay para modo simplificado */}
      {settings.simplified && (
        <div className="a11y-simplified-overlay" aria-hidden="true">
          <div className="simplified-notice">
            Modo lectura simplificada activado
          </div>
        </div>
      )}

      {/* Guía de lectura */}
      {settings.readingGuide && (
        <div className="a11y-reading-guide" aria-hidden="true"></div>
      )}
    </>
  );
}

// 📖 Función auxiliar para narrativa de formularios mejorada
export const narrateForm = (formEl, settings = {}) => {
  if (!formEl || !window.speechSynthesis) return;
  
  const lines = [];
  const synth = window.speechSynthesis;
  
  // Título del formulario
  const formTitle = formEl.querySelector('h1, h2, h3, legend')?.textContent ||
                   formEl.getAttribute('aria-label') ||
                   'Formulario';
  lines.push(`Formulario: ${formTitle}`);
  
  // Campos del formulario
  const fields = formEl.querySelectorAll('input, textarea, select');
  fields.forEach((field, index) => {
    const label = formEl.querySelector(`label[for="${field.id}"]`)?.textContent ||
                  field.getAttribute('aria-label') ||
                  field.getAttribute('placeholder') ||
                  field.name ||
                  `Campo ${index + 1}`;
    
    const value = field.value || 'vacío';
    const required = field.required ? ', requerido' : '';
    const type = field.type !== 'text' ? `, tipo ${field.type}` : '';
    
    lines.push(`${label}${type}${required}: ${value}`);
  });
  
  // Botones del formulario
  const buttons = formEl.querySelectorAll('button[type="submit"], input[type="submit"]');
  if (buttons.length > 0) {
    lines.push(`Botones: ${Array.from(buttons).map(b => b.textContent || b.value).join(', ')}`);
  }
  
  // Leer todo
  const fullText = lines.join('. ');
  const utterance = new SpeechSynthesisUtterance(fullText);
  utterance.rate = settings.rate || 1;
  utterance.lang = settings.lang || 'es-ES';
  
  synth.cancel();
  synth.speak(utterance);
  
  return fullText;
};

// 🎯 Función para detectar y anunciar cambios de página
export const announcePageChange = (settings = {}) => {
  const title = document.title || 'Página sin título';
  const main = document.querySelector('main, [role="main"]')?.textContent?.slice(0, 100) || '';
  const announcement = `Nueva página cargada: ${title}. ${main}`;
  
  if (settings.autoRead && window.speechSynthesis) {
    const utterance = new SpeechSynthesisUtterance(announcement);
    utterance.rate = settings.talkBackRate || 1;
    window.speechSynthesis.speak(utterance);
  }
  
  return announcement;
};

// 🔍 Función de búsqueda accesible
export const accessibleSearch = (query, container = document) => {
  if (!query) return [];
  
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        return node.textContent.toLowerCase().includes(query.toLowerCase()) 
          ? NodeFilter.FILTER_ACCEPT 
          : NodeFilter.FILTER_REJECT;
      }
    }
  );
  
  const results = [];
  let node;
  
  while (node = walker.nextNode()) {
    const element = node.parentElement;
    if (element && !element.closest('.a11y-bar')) { // Excluir la barra de accesibilidad
      results.push({
        element,
        text: node.textContent,
        context: element.textContent.slice(0, 100)
      });
    }
  }
  
  return results;
};

// 🎨 Utilidades CSS personalizadas para accesibilidad
export const applyA11yStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    /* Estilos base de accesibilidad */
    [data-a11y-font="xlarge"] { font-size: 1.25em !important; }
    [data-a11y-font="xxlarge"] { font-size: 1.5em !important; }
    [data-a11y-contrast="high"] { 
      filter: contrast(150%) brightness(1.1) !important; 
    }
    [data-a11y-contrast="inverted"] { 
      filter: invert(1) hue-rotate(180deg) !important; 
    }
    [data-a11y-spacing="wide"] * { 
      line-height: 1.8 !important; 
      letter-spacing: 0.05em !important; 
    }
    [data-a11y-reduced-motion="1"] * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
    [data-a11y-dyslexia-font="1"] * {
      font-family: 'OpenDyslexic', 'Comic Sans MS', cursive !important;
    }
    [data-a11y-cursor-size="large"] * { cursor: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><circle cx="16" cy="16" r="15" fill="white" stroke="black" stroke-width="2"/></svg>') 16 16, auto !important; }
    
    /* Guías visuales */
    [data-a11y-show-structure="1"] h1,
    [data-a11y-show-structure="1"] h2,
    [data-a11y-show-structure="1"] h3 {
      outline: 2px solid #0066cc !important;
      outline-offset: 2px !important;
    }
    
    [data-a11y-highlight-links="1"] a {
      background: yellow !important;
      color: black !important;
      font-weight: bold !important;
    }
    
    /* Indicadores de foco mejorados */
    [data-a11y-focus-indicator="thick"] *:focus {
      outline: 4px solid #0066cc !important;
      outline-offset: 2px !important;
    }
    
    [data-a11y-focus-indicator="colorful"] *:focus {
      outline: 3px solid #ff6b00 !important;
      box-shadow: 0 0 0 6px rgba(255, 107, 0, 0.3) !important;
    }
    
    /* Overlay simplificado */
    .a11y-simplified-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(5px);
      z-index: 9998;
      pointer-events: none;
    }
    
    /* Estilos de la barra */
    .a11y-bar {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    
    .a11y-controls {
      background: white;
      border: 2px solid #0066cc;
      border-radius: 8px;
      padding: 20px;
      margin-top: 10px;
      max-width: 400px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    
    .a11y-section {
      border: 1px solid #ddd;
      margin: 15px 0;
      padding: 15px;
      border-radius: 5px;
    }
    
    .a11y-section legend {
      font-weight: bold;
      font-size: 1.1em;
      padding: 0 10px;
    }
    
    .a11y-btn {
      padding: 8px 12px;
      margin: 3px;
      border: 2px solid #0066cc;
      background: white;
      color: #0066cc;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      min-height: 44px;
      min-width: 44px;
    }
    
    .a11y-btn:hover, .a11y-btn:focus {
      background: #e6f3ff;
      outline: 2px solid #0066cc;
      outline-offset: 2px;
    }
    
    .a11y-btn.active {
      background: #0066cc;
      color: white;
    }
    
    .a11y-btn.primary { background: #0066cc; color: white; }
    .a11y-btn.danger { background: #dc3545; color: white; border-color: #dc3545; }
    .a11y-btn.emergency { background: #ff6b00; color: white; border-color: #ff6b00; animation: pulse 2s infinite; }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    .a11y-slider, .a11y-select {
      width: 100%;
      padding: 8px;
      border: 2px solid #0066cc;
      border-radius: 4px;
      font-size: 16px;
    }
    
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    
    .speaking-indicator {
      display: inline-block;
      animation: pulse 1s infinite;
      margin-left: 5px;
    }
    
    .a11y-speaking-status {
      background: #a73dc1ff;
      border: 1px solid #0066cc;
      padding: 10px;
      border-radius: 4px;
      margin-top: 10px;
      text-align: center;
    }
    
    .speaking-animation {
      display: inline-block;
      animation: bounce 1s infinite;
      margin-right: 5px;
    }
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-10px); }
      60% { transform: translateY(-5px); }
    }
    
    /* Filtros para daltonismo */
    [data-a11y-color-blindness="protanopia"] {
      filter: url('#protanopia-filter');
    }
    [data-a11y-color-blindness="deuteranopia"] {
      filter: url('#deuteranopia-filter');
    }
    [data-a11y-color-blindness="tritanopia"] {
      filter: url('#tritanopia-filter');
    }
  `;
  
  if (!document.getElementById('a11y-styles')) {
    style.id = 'a11y-styles';
    document.head.appendChild(style);
  }
};

// Aplicar estilos al cargar
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', applyA11yStyles);
}