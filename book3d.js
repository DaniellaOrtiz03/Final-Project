// ===== LIBRO 3D CON CSS PURO - SIN DEPENDENCIAS =====

let bookPages = [];
let currentPageIndex = 0;
let totalPages = 10;
let isFlipping = false;

// Inicializar páginas
function initializeBook3D() {
    console.log('Inicializando libro 3D...');
    
    // Crear páginas iniciales
    for (let i = 0; i < totalPages; i++) {
        bookPages.push({
            id: i + 1,
            elements: [],
            background: 'linear-gradient(135deg, #fefefe, #f8f9fa)',
            content: ''
        });
    }
    
    // Mostrar las primeras dos páginas
    updateBookDisplay();
    updatePageIndicator();
    
    console.log('Libro 3D inicializado con', totalPages, 'páginas');
}

// Actualizar la visualización del libro
function updateBookDisplay() {
    const leftPageContent = document.getElementById('leftPageContent');
    const rightPageContent = document.getElementById('rightPageContent');
    const leftPageNum = document.getElementById('leftPageNum');
    const rightPageNum = document.getElementById('rightPageNum');
    
    if (!leftPageContent || !rightPageContent) return;
    
    // Página izquierda (página impar)
    const leftPage = bookPages[currentPageIndex];
    if (leftPage) {
        leftPageContent.style.background = leftPage.background;
        leftPageNum.textContent = leftPage.id;
        
        // Limpiar contenido anterior
        const existingContent = leftPageContent.querySelector('.custom-content');
        if (existingContent) existingContent.remove();
        
        // Añadir contenido si existe
        if (leftPage.content) {
            const contentDiv = document.createElement('div');
            contentDiv.className = 'custom-content';
            contentDiv.innerHTML = leftPage.content;
            leftPageContent.insertBefore(contentDiv, leftPageContent.firstChild);
        }
    }
    
    // Página derecha (página par)
    const rightPage = bookPages[currentPageIndex + 1];
    if (rightPage) {
        rightPageContent.style.background = rightPage.background;
        rightPageNum.textContent = rightPage.id;
        
        // Limpiar contenido anterior
        const existingContent = rightPageContent.querySelector('.custom-content');
        if (existingContent) existingContent.remove();
        
        // Añadir contenido si existe
        if (rightPage.content) {
            const contentDiv = document.createElement('div');
            contentDiv.className = 'custom-content';
            contentDiv.innerHTML = rightPage.content;
            rightPageContent.insertBefore(contentDiv, rightPageContent.firstChild);
        }
    }
}

// Actualizar indicador de página
function updatePageIndicator() {
    const currentBookPage = document.getElementById('currentBookPage');
    const currentBookPageNext = document.getElementById('currentBookPageNext');
    const totalBookPages = document.getElementById('totalBookPages');
    
    if (currentBookPage) currentBookPage.textContent = currentPageIndex + 1;
    if (currentBookPageNext) currentBookPageNext.textContent = currentPageIndex + 2;
    if (totalBookPages) totalBookPages.textContent = totalPages;
}

// Pasar a la página siguiente
window.flipToNextPage = function() {
    if (isFlipping) return;
    if (currentPageIndex + 2 >= totalPages) {
        showNotification('📖 Ya estás en la última página', 'info');
        return;
    }
    
    isFlipping = true;
    
    // Animación de voltear página
    const flippingPage = document.getElementById('flippingPage');
    const rightPage = document.getElementById('rightPage');
    
    if (flippingPage && rightPage) {
        // Copiar contenido de la página derecha a la página que se voltea
        const flippingPageFront = document.getElementById('flippingPageFront');
        const rightPageContent = document.getElementById('rightPageContent');
        
        if (flippingPageFront && rightPageContent) {
            flippingPageFront.innerHTML = rightPageContent.innerHTML;
            flippingPageFront.style.background = rightPageContent.style.background;
        }
        
        // Preparar el contenido de la siguiente página en el reverso
        const flippingPageBack = document.getElementById('flippingPageBack');
        const nextPage = bookPages[currentPageIndex + 2];
        
        if (flippingPageBack && nextPage) {
            flippingPageBack.style.background = nextPage.background;
            flippingPageBack.innerHTML = `
                <div class="page-number">Página ${nextPage.id}</div>
                ${nextPage.content || ''}
            `;
        }
        
        // Iniciar animación
        flippingPage.classList.add('flipping');
        
        // Después de la animación, actualizar las páginas
        setTimeout(() => {
            currentPageIndex += 2;
            updateBookDisplay();
            updatePageIndicator();
            
            flippingPage.classList.remove('flipping');
            isFlipping = false;
            
            showNotification('📄 Página volteada', 'success');
        }, 1000);
    }
};

// Volver a la página anterior
window.flipToPreviousPage = function() {
    if (isFlipping) return;
    if (currentPageIndex <= 0) {
        showNotification('📖 Ya estás en la primera página', 'info');
        return;
    }
    
    isFlipping = true;
    
    // Animación de voltear página hacia atrás
    const flippingPage = document.getElementById('flippingPage');
    
    if (flippingPage) {
        // Preparar contenido
        const flippingPageFront = document.getElementById('flippingPageFront');
        const flippingPageBack = document.getElementById('flippingPageBack');
        
        const prevPage = bookPages[currentPageIndex - 1];
        const currentPage = bookPages[currentPageIndex];
        
        if (flippingPageFront && prevPage) {
            flippingPageFront.style.background = prevPage.background;
            flippingPageFront.innerHTML = `
                <div class="page-number">Página ${prevPage.id}</div>
                ${prevPage.content || ''}
            `;
        }
        
        if (flippingPageBack && currentPage) {
            flippingPageBack.innerHTML = document.getElementById('leftPageContent').innerHTML;
            flippingPageBack.style.background = document.getElementById('leftPageContent').style.background;
        }
        
        // Iniciar animación
        flippingPage.classList.add('flipping-back');
        
        // Después de la animación
        setTimeout(() => {
            currentPageIndex -= 2;
            updateBookDisplay();
            updatePageIndicator();
            
            flippingPage.classList.remove('flipping-back');
            isFlipping = false;
            
            showNotification('📄 Página volteada', 'success');
        }, 1000);
    }
};

// Añadir nueva página
window.addNewBookPage = function() {
    const newPage = {
        id: totalPages + 1,
        elements: [],
        background: 'linear-gradient(135deg, #fefefe, #f8f9fa)',
        content: ''
    };
    
    bookPages.push(newPage);
    totalPages++;
    
    updatePageIndicator();
    showNotification(`📄 Nueva página añadida (Total: ${totalPages})`, 'success');
};

// Aplicar plantilla al libro
function applyTemplateToBook(templateType) {
    const backgrounds = {
        'blank': 'linear-gradient(135deg, #fefefe, #f8f9fa)',
        'travel': 'linear-gradient(135deg, #74b9ff, #0984e3)',
        'birthday': 'linear-gradient(135deg, #fd79a8, #e84393)',
        'wedding': 'linear-gradient(135deg, #fdcb6e, #e17055)',
        'baby': 'linear-gradient(135deg, #a29bfe, #6c5ce7)',
        'family': 'linear-gradient(135deg, #00b894, #00a085)'
    };
    
    const contents = {
        'travel': '<div style="text-align: center; color: white; margin-top: 40%;"><h2 style="font-size: 2rem; margin-bottom: 1rem;">✈️ Mis Aventuras</h2><p>Documenta tus viajes más increíbles</p></div>',
        'birthday': '<div style="text-align: center; color: white; margin-top: 40%;"><h2 style="font-size: 2rem; margin-bottom: 1rem;">🎂 ¡Feliz Cumpleaños!</h2><p>Celebra este día especial</p></div>',
        'wedding': '<div style="text-align: center; color: white; margin-top: 40%;"><h2 style="font-size: 2rem; margin-bottom: 1rem;">💍 Día de Bodas</h2><p>Un día lleno de amor y felicidad</p></div>',
        'baby': '<div style="text-align: center; color: white; margin-top: 40%;"><h2 style="font-size: 2rem; margin-bottom: 1rem;">👶 Primeros Pasos</h2><p>Los momentos más tiernos</p></div>',
        'family': '<div style="text-align: center; color: white; margin-top: 40%;"><h2 style="font-size: 2rem; margin-bottom: 1rem;">👨‍👩‍👧‍👦 Momentos Familiares</h2><p>Recuerdos que duran para siempre</p></div>'
    };
    
    const background = backgrounds[templateType] || backgrounds['blank'];
    const content = contents[templateType] || '';
    
    // Aplicar a todas las páginas
    bookPages.forEach((page, index) => {
        page.background = background;
        if (index === 0) {
            page.content = content;
        }
    });
    
    updateBookDisplay();
}

// Hacer páginas editables
function makeBookPagesEditable() {
    const leftPage = document.getElementById('leftPageContent');
    const rightPage = document.getElementById('rightPageContent');
    
    if (leftPage) {
        leftPage.addEventListener('click', function(e) {
            if (e.target === this || e.target.classList.contains('page-number')) {
                showNotification('✏️ Editando página ' + (currentPageIndex + 1), 'info');
                // Aquí puedes añadir lógica para editar la página
            }
        });
    }
    
    if (rightPage) {
        rightPage.addEventListener('click', function(e) {
            if (e.target === this || e.target.classList.contains('page-number')) {
                showNotification('✏️ Editando página ' + (currentPageIndex + 2), 'info');
                // Aquí puedes añadir lógica para editar la página
            }
        });
    }
}

// Exportar funciones
window.initializeBook3D = initializeBook3D;
window.applyTemplateToBook = applyTemplateToBook;
window.makeBookPagesEditable = makeBookPagesEditable;

console.log('📖 Libro 3D cargado correctamente');
