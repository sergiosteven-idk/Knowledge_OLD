// Detectar si el logo existe y mostrar/ocultar placeholder
document.addEventListener('DOMContentLoaded', function() {
    const logo = document.getElementById('logo');
    const placeholder = document.getElementById('logo-placeholder');
    
    // Función mejorada para verificar el logo
    function checkLogo() {
        if (!logo || !placeholder) return;
        
        // Crear una nueva imagen para testear si existe
        const testImage = new Image();
        
        testImage.onload = function() {
            // La imagen se cargó exitosamente
            logo.style.display = 'block';
            placeholder.style.display = 'none';
            console.log('Logo cargado exitosamente desde:', logo.src);
        };
        
        testImage.onerror = function() {
            // La imagen no se pudo cargar
            logo.style.display = 'none';
            placeholder.style.display = 'flex';
            console.log('Logo no encontrado en:', logo.src, '- Mostrando placeholder');
        };
        
        // Intentar cargar la imagen con la ruta especificada
        testImage.src = logo.src;
    }
    
    // Ejecutar la verificación del logo
    checkLogo();
    
    // Event listeners adicionales para el logo
    logo.addEventListener('load', function() {
        this.style.display = 'block';
        placeholder.style.display = 'none';
        console.log('Logo cargado via event listener');
    });
    
    logo.addEventListener('error', function() {
        this.style.display = 'none';
        placeholder.style.display = 'flex';
        console.log('Error cargando logo via event listener');
    });
    
    // Funcionalidad básica para los botones de navegación
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Navegando a:', item.textContent);
            
            // Aquí puedes agregar la lógica de navegación real
            const section = item.classList[1]; // inicio, discapacidad, etc.
            
            switch(section) {
                case 'inicio':
                    // Scroll to top o cargar contenido de inicio
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    break;
                case 'discapacidad':
                    // Navegar a sección de discapacidad
                    console.log('Cargando información sobre discapacidad');
                    break;
                case 'informacion':
                    // Navegar a sección de información
                    console.log('Cargando información general');
                    break;
                case 'contacto':
                    // Navegar a sección de contacto
                    console.log('Cargando información de contacto');
                    break;
            }
        });
    });

    // Funcionalidad del buscador
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
        searchBox.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) {
                    console.log('Buscando:', query);
                    // Aquí puedes agregar la lógica de búsqueda real
                    performSearch(query);
                }
            }
        });

        // También puedes agregar un botón de búsqueda
        const searchIcon = document.querySelector('.search-icon');
        if (searchIcon) {
            searchIcon.addEventListener('click', () => {
                const query = searchBox.value.trim();
                if (query) {
                    console.log('Buscando via click:', query);
                    performSearch(query);
                }
            });
        }
    }

    // Función para realizar búsqueda (placeholder)
    function performSearch(query) {
        // Aquí implementarías tu lógica de búsqueda real
        alert(`Función de búsqueda: "${query}"`);
        
    }

    // Funcionalidad adicional: resaltar elemento activo en navegación
    function setActiveNavItem(activeItem) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        activeItem.classList.add('active');
    }

    // Smooth scrolling para navegación interna (si tienes secciones en la misma página)
    function smoothScrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Debug: mostrar información de rutas para desarrollo
    console.log('Rutas configuradas:');
    console.log('- Logo:', logo ? logo.src : 'No encontrado');
    console.log('- Login:', './ASSETS/HTML/login.html');
    console.log('- Signup:', './ASSETS/HTML/signup.html');
    console.log('- CSS:', './ASSETS/CSS/styles.css');
    console.log('- JS:', './ASSETS/JS/script.js');
});