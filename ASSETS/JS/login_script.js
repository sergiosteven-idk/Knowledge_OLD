document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const logo = document.getElementById('logo');
    const placeholder = document.getElementById('logo-placeholder');
    const loginForm = document.getElementById('loginForm');
    const usuarioInput = document.getElementById('usuario');
    const contrasenaInput = document.getElementById('contrasena');
    const togglePassword = document.getElementById('togglePassword');
    const loginBtn = document.getElementById('loginBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Manejo del logo - Versión mejorada
    function checkLogo() {
        console.log('Verificando logo en:', logo.src);
        
        // Crear una imagen de prueba
        const testImage = new Image();
        
        testImage.onload = function() {
            console.log('✅ Logo cargado exitosamente');
            logo.style.display = 'block';
            placeholder.style.display = 'none';
        };
        
        testImage.onerror = function() {
            console.log('❌ Error cargando logo, usando placeholder');
            console.log('Ruta intentada:', logo.src);
            logo.style.display = 'none';
            placeholder.style.display = 'flex';
        };
        
        // Probar diferentes rutas posibles basadas en tu estructura
        const possiblePaths = [
            '../ASSETS/IMG/logo.png',        // ASSETS/IMG/logo.png (relativa correcta)
            '../ASSETS/IMG/logo.jpg', 
            '../ASSETS/IMG/logo.jpeg',
            '../ASSETS/IMG/logo.svg',
            '../ASSETS/IMG/Logo.png',        // Con mayúscula
            '../ASSETS/IMG/LOGO.png'         // Todo mayúsculas
        ];
        
        let currentPathIndex = 0;
        
        function tryNextPath() {
            if (currentPathIndex < possiblePaths.length) {
                const path = possiblePaths[currentPathIndex];
                console.log(`Intentando ruta ${currentPathIndex + 1}/${possiblePaths.length}: ${path}`);
                
                testImage.onload = function() {
                    console.log('✅ Logo encontrado en:', path);
                    logo.src = path;
                    logo.style.display = 'block';
                    placeholder.style.display = 'none';
                };
                
                testImage.onerror = function() {
                    console.log('❌ No encontrado en:', path);
                    currentPathIndex++;
                    tryNextPath();
                };
                
                testImage.src = path;
            } else {
                console.log('⚠️ Logo no encontrado en ninguna ruta, usando placeholder');
                logo.style.display = 'none';
                placeholder.style.display = 'flex';
            }
        }
        
        tryNextPath();
    }
    
    // Ejecutar verificación del logo
    checkLogo();

    // Toggle password visibility
    if (togglePassword && contrasenaInput) {
        togglePassword.addEventListener('click', function() {
            const type = contrasenaInput.getAttribute('type') === 'password' ? 'text' : 'password';
            contrasenaInput.setAttribute('type', type);
            
            const eyeIcon = this.querySelector('.eye-icon');
            if (eyeIcon) {
                eyeIcon.textContent = type === 'password' ? '👁️' : '🙈';
            }
        });
    }

    // Validación en tiempo real
    function validateField(field, errorElement, validationFn, errorMessage) {
        if (!field || !errorElement) return false;
        
        const value = field.value.trim();
        
        if (value === '') {
            errorElement.textContent = '';
            field.style.borderColor = '';
            return false;
        }
        
        if (validationFn(value)) {
            errorElement.textContent = '';
            field.style.borderColor = '#10b981';
            return true;
        } else {
            errorElement.textContent = errorMessage;
            field.style.borderColor = '#ef4444';
            return false;
        }
    }

    // Validaciones específicas
    function validateUsuario(value) {
        const regex = /^[a-zA-Z0-9._-]{3,50}$/;
        return regex.test(value);
    }

    function validateContrasena(value) {
        return value.length >= 6 && /[a-zA-Z]/.test(value) && /[0-9]/.test(value);
    }

    // Event listeners para validación en tiempo real
    if (usuarioInput) {
        usuarioInput.addEventListener('input', function() {
            validateField(
                this, 
                document.getElementById('usuarioError'), 
                validateUsuario,
                'Usuario debe tener 3-50 caracteres (letras, números, ., _, -)'
            );
        });
    }

    if (contrasenaInput) {
        contrasenaInput.addEventListener('input', function() {
            validateField(
                this, 
                document.getElementById('contrasenaError'), 
                validateContrasena,
                'Contraseña debe tener al menos 6 caracteres con letras y números'
            );
        });
    }

    // Prevenir ataques de fuerza bruta
    let loginAttempts = parseInt(localStorage.getItem('loginAttempts') || '0');
    const maxAttempts = 5;
    let blockUntil = localStorage.getItem('blockUntil') ? new Date(localStorage.getItem('blockUntil')) : null;

    function isBlocked() {
        if (blockUntil && new Date() < blockUntil) {
            const remainingTime = Math.ceil((blockUntil - new Date()) / 1000);
            showError('Demasiados intentos. Intenta de nuevo en ' + remainingTime + ' segundos.');
            return true;
        }
        return false;
    }

    function showError(message) {
        let errorDiv = document.querySelector('.general-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'general-error';
            errorDiv.style.cssText = `
                background: rgba(239, 68, 68, 0.1);
                color: #fecaca;
                padding: 10px 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                font-size: 14px;
                text-align: center;
                border: 1px solid rgba(239, 68, 68, 0.3);
            `;
            if (loginForm) {
                loginForm.insertBefore(errorDiv, loginForm.firstChild);
            }
        }
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        setTimeout(() => {
            if (errorDiv) errorDiv.style.display = 'none';
        }, 5000);
    }

    function showSuccess(message) {
        let successDiv = document.querySelector('.general-success');
        if (!successDiv) {
            successDiv = document.createElement('div');
            successDiv.className = 'general-success';
            successDiv.style.cssText = `
                background: rgba(16, 185, 129, 0.1);
                color: #10b981;
                padding: 10px 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                font-size: 14px;
                text-align: center;
                border: 1px solid rgba(16, 185, 129, 0.3);
            `;
            if (loginForm) {
                loginForm.insertBefore(successDiv, loginForm.firstChild);
            }
        }
        successDiv.textContent = message;
        successDiv.style.display = 'block';
    }

    // Sanitización de entrada
    function sanitizeInput(str) {
        return str.trim().replace(/[<>\"'&]/g, function(match) {
            const escape = {
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '&': '&amp;'
            };
            return escape[match];
        });
    }

    // Manejo del formulario
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (isBlocked()) return;

            if (!usuarioInput || !contrasenaInput) {
                showError('Error: Campos de formulario no encontrados');
                return;
            }

            const usuario = sanitizeInput(usuarioInput.value);
            const contrasena = contrasenaInput.value;
            
            // Validación final
            const usuarioValid = validateField(
                usuarioInput, 
                document.getElementById('usuarioError'), 
                validateUsuario,
                'Usuario debe tener 3-50 caracteres (letras, números, ., _, -)'
            );
            
            const contrasenaValid = validateField(
                contrasenaInput, 
                document.getElementById('contrasenaError'), 
                validateContrasena,
                'Contraseña debe tener al menos 6 caracteres con letras y números'
            );

            if (!usuarioValid || !contrasenaValid) {
                showError('Por favor corrige los errores antes de continuar.');
                return;
            }

            // Mostrar loading
            if (loadingOverlay) loadingOverlay.classList.add('active');
            if (loginBtn) loginBtn.disabled = true;

            try {
                // Simular llamada a API
                const response = await simulateLogin(usuario, contrasena);
                
                if (response.success) {
                    showSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
                    
                    // Limpiar intentos fallidos
                    loginAttempts = 0;
                    localStorage.removeItem('loginAttempts');
                    localStorage.removeItem('blockUntil');
                    
                    // Redirigir después de 1.5 segundos - usando window.location.replace
                    setTimeout(() => {
                        window.location.replace('../index.html');
                    }, 1500);
                    
                } else {
                    throw new Error(response.message || 'Credenciales incorrectas');
                }
                
            } catch (error) {
                loginAttempts++;
                localStorage.setItem('loginAttempts', loginAttempts);
                
                if (loginAttempts >= maxAttempts) {
                    blockUntil = new Date(Date.now() + 5 * 60 * 1000);
                    localStorage.setItem('blockUntil', blockUntil.toISOString());
                    showError('Demasiados intentos fallidos. Intenta de nuevo en 5 minutos.');
                } else {
                    const remainingAttempts = maxAttempts - loginAttempts;
                    showError(`Credenciales incorrectas. Intentos restantes: ${remainingAttempts}`);
                }
                
            } finally {
                if (loadingOverlay) loadingOverlay.classList.remove('active');
                if (loginBtn) loginBtn.disabled = false;
            }
        });
    }

    // Simulación de API de login
    async function simulateLogin(usuario, contrasena) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (usuario === 'admin' && contrasena === '123456') {
                    resolve({ success: true, token: 'fake-jwt-token' });
                } else if (usuario === 'test' && contrasena === 'test123') {
                    resolve({ success: true, token: 'fake-jwt-token' });
                } else {
                    resolve({ success: false, message: 'Usuario o contraseña incorrectos' });
                }
            }, 1500);
        });
    }

    // Limpiar errores al hacer focus en los campos
    [usuarioInput, contrasenaInput].forEach(input => {
        if (input) {
            input.addEventListener('focus', function() {
                const errorDiv = document.querySelector('.general-error');
                if (errorDiv) errorDiv.style.display = 'none';
            });
        }
    });

    // Manejar el enlace "volver al inicio" específicamente
    const backHomeLink = document.querySelector('.back-home-link');
    if (backHomeLink) {
        backHomeLink.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('🏠 Navegando al inicio...');
            window.location.href = '../index.html';
        });
    }

    // Debug: Mostrar información de rutas - CORREGIDO
    console.log('🔍 DEBUG - Rutas del login:');
    console.log('- Logo actual:', logo ? logo.src : 'No encontrado');
    console.log('- CSS:', '../CSS/login_styles.css');
    console.log('- JS:', '../JS/login_script.js');
    console.log('- Volver:', '../index.html'); // CORREGIDO: solo un nivel arriba
});