// ===== EFECTOS ADICIONALES PARA EL LIBRO 3D =====

// Efecto de sonido al pasar páginas (opcional)
function playPageFlipSound() {
    // Crear un sonido sutil de papel
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 200;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Añadir efecto de sombra dinámica al voltear
function addDynamicShadow() {
    const flipbook = document.getElementById('flipbook');
    if (!flipbook) return;
    
    flipbook.addEventListener('turning', function(e) {
        const shadow = document.querySelector('.book-shadow');
        if (shadow) {
            shadow.style.transition = 'all 0.5s ease';
            shadow.style.transform = 'scale(1.1)';
            shadow.style.opacity = '0.5';
        }
    });
    
    flipbook.addEventListener('turned', function(e) {
        const shadow = document.querySelector('.book-shadow');
        if (shadow) {
            shadow.style.transform = 'scale(1)';
            shadow.style.opacity = '0.3';
        }
    });
}

// Efecto de partículas al pasar páginas
function createPageParticles(x, y) {
    const colors = ['#e91e63', '#f06292', '#ff4081', '#ff80ab'];
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${x}px;
            top: ${y}px;
        `;
        
        document.body.appendChild(particle);
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 3;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let posX = x;
        let posY = y;
        let opacity = 1;
        
        const animate = () => {
            posX += vx;
            posY += vy;
            opacity -= 0.02;
            
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        animate();
    }
}

// Efecto de brillo al pasar el mouse sobre las esquinas
function addCornerHighlight() {
    document.addEventListener('DOMContentLoaded', function() {
        const pages = document.querySelectorAll('.flipbook .page');
        
        pages.forEach(page => {
            page.addEventListener('mousemove', function(e) {
                const rect = page.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Detectar si está en las esquinas
                const cornerSize = 100;
                const isTopRight = x > rect.width - cornerSize && y < cornerSize;
                const isBottomRight = x > rect.width - cornerSize && y > rect.height - cornerSize;
                const isTopLeft = x < cornerSize && y < cornerSize;
                const isBottomLeft = x < cornerSize && y > rect.height - cornerSize;
                
                if (isTopRight || isBottomRight || isTopLeft || isBottomLeft) {
                    page.style.cursor = 'pointer';
                    page.style.boxShadow = '0 0 30px rgba(233, 30, 99, 0.3)';
                } else {
                    page.style.cursor = 'default';
                    page.style.boxShadow = '';
                }
            });
            
            page.addEventListener('mouseleave', function() {
                page.style.boxShadow = '';
            });
        });
    });
}

// Efecto de ondulación al hacer click
function addRippleEffect() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.flipbook .page')) {
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(233, 30, 99, 0.3);
                width: 20px;
                height: 20px;
                left: ${e.clientX - 10}px;
                top: ${e.clientY - 10}px;
                pointer-events: none;
                animation: ripple 0.6s ease-out;
                z-index: 9999;
            `;
            
            document.body.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        }
    });
}

// Añadir animación de ripple al CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            width: 100px;
            height: 100px;
            opacity: 0;
            transform: translate(-40px, -40px);
        }
    }
    
    @keyframes pageGlow {
        0%, 100% {
            box-shadow: 0 0 20px rgba(233, 30, 99, 0.1);
        }
        50% {
            box-shadow: 0 0 40px rgba(233, 30, 99, 0.3);
        }
    }
    
    .flipbook .page.active {
        animation: pageGlow 2s ease-in-out infinite;
    }
`;
document.head.appendChild(style);

// Inicializar todos los efectos
function initializeBookEffects() {
    addDynamicShadow();
    addCornerHighlight();
    addRippleEffect();
    
    // Añadir sonido al pasar páginas (opcional, comentado por defecto)
    // $('#flipbook').bind('turning', function(event, page, view) {
    //     playPageFlipSound();
    // });
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBookEffects);
} else {
    initializeBookEffects();
}

// Efecto de cursor personalizado para el libro
function addCustomCursor() {
    const flipbook = document.getElementById('flipbook');
    if (!flipbook) return;
    
    flipbook.addEventListener('mouseenter', function() {
        document.body.style.cursor = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'><text y=\'24\' font-size=\'24\'>👆</text></svg>"), auto';
    });
    
    flipbook.addEventListener('mouseleave', function() {
        document.body.style.cursor = 'default';
    });
}

// Añadir efecto de página doblada en las esquinas
function addPageCurlEffect() {
    const style = document.createElement('style');
    style.textContent = `
        .flipbook .page::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 0 30px 30px 0;
            border-color: transparent rgba(0, 0, 0, 0.1) transparent transparent;
            transition: all 0.3s ease;
            opacity: 0;
        }
        
        .flipbook .page:hover::before {
            opacity: 1;
            border-width: 0 40px 40px 0;
        }
    `;
    document.head.appendChild(style);
}

// Inicializar efectos adicionales
setTimeout(() => {
    addCustomCursor();
    addPageCurlEffect();
}, 500);
