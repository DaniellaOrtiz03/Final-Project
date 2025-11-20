// LIBRO 3D SIMPLE Y FUNCIONAL
console.log('📖 Cargando libro 3D...');

// Variables globales
var bookPages = [];
var currentPageIndex = 0;
var totalPages = 10;
var isFlipping = false;

// Inicializar libro
function initializeBook3D() {
    console.log('Inicializando libro...');
    
    // Crear páginas
    bookPages = [];
    for (var i = 0; i < totalPages; i++) {
        bookPages.push({
            id: i + 1,
            background: 'linear-gradient(135deg, #fefefe, #f8f9fa)'
        });
    }
    
    updateBookDisplay();
    updatePageIndicator();
    console.log('Libro inicializado con', totalPages, 'páginas');
}

// Actualizar visualización
function updateBookDisplay() {
    var leftContent = document.getElementById('leftPageContent');
    var rightContent = document.getElementById('rightPageContent');
    var leftNum = document.getElementById('leftPageNum');
    var rightNum = document.getElementById('rightPageNum');
    
    if (leftContent && bookPages[currentPageIndex]) {
        leftContent.style.background = bookPages[currentPageIndex].background;
        if (leftNum) leftNum.textContent = bookPages[currentPageIndex].id;
    }
    
    if (rightContent && bookPages[currentPageIndex + 1]) {
        rightContent.style.background = bookPages[currentPageIndex + 1].background;
        if (rightNum) rightNum.textContent = bookPages[currentPageIndex + 1].id;
    }
}

// Actualizar indicador
function updatePageIndicator() {
    var current = document.getElementById('currentBookPage');
    var next = document.getElementById('currentBookPageNext');
    var total = document.getElementById('totalBookPages');
    
    if (current) current.textContent = currentPageIndex + 1;
    if (next) next.textContent = currentPageIndex + 2;
    if (total) total.textContent = totalPages;
}

// Página siguiente
function flipToNextPage() {
    if (isFlipping) return;
    if (currentPageIndex + 2 >= totalPages) {
        alert('Ya estás en la última página');
        return;
    }
    
    isFlipping = true;
    var flipping = document.getElementById('flippingPage');
    
    if (flipping) {
        flipping.classList.add('flipping');
        
        setTimeout(function() {
            currentPageIndex += 2;
            updateBookDisplay();
            updatePageIndicator();
            flipping.classList.remove('flipping');
            isFlipping = false;
        }, 1000);
    }
}

// Página anterior
function flipToPreviousPage() {
    if (isFlipping) return;
    if (currentPageIndex <= 0) {
        alert('Ya estás en la primera página');
        return;
    }
    
    isFlipping = true;
    var flipping = document.getElementById('flippingPage');
    
    if (flipping) {
        flipping.classList.add('flipping-back');
        
        setTimeout(function() {
            currentPageIndex -= 2;
            updateBookDisplay();
            updatePageIndicator();
            flipping.classList.remove('flipping-back');
            isFlipping = false;
        }, 1000);
    }
}

// Añadir página
function addNewBookPage() {
    bookPages.push({
        id: totalPages + 1,
        background: 'linear-gradient(135deg, #fefefe, #f8f9fa)'
    });
    totalPages++;
    updatePageIndicator();
    alert('Nueva página añadida. Total: ' + totalPages);
}

// Aplicar plantilla
function applyTemplateToBook(templateType) {
    var backgrounds = {
        'blank': 'linear-gradient(135deg, #fefefe, #f8f9fa)',
        'travel': 'linear-gradient(135deg, #74b9ff, #0984e3)',
        'birthday': 'linear-gradient(135deg, #fd79a8, #e84393)',
        'wedding': 'linear-gradient(135deg, #fdcb6e, #e17055)',
        'baby': 'linear-gradient(135deg, #a29bfe, #6c5ce7)',
        'family': 'linear-gradient(135deg, #00b894, #00a085)'
    };
    
    var bg = backgrounds[templateType] || backgrounds['blank'];
    
    for (var i = 0; i < bookPages.length; i++) {
        bookPages[i].background = bg;
    }
    
    updateBookDisplay();
}

// Seleccionar plantilla
function selectTemplate(templateType) {
    console.log('Plantilla seleccionada:', templateType);
    
    try {
        document.getElementById('templateSelection').style.display = 'none';
        document.getElementById('scrapbookEditor').style.display = 'block';
        
        setTimeout(function() {
            initializeBook3D();
            applyTemplateToBook(templateType);
            alert('Libro creado! Usa los botones para pasar páginas');
        }, 200);
    } catch (error) {
        console.error('Error:', error);
        alert('Error al crear el libro');
    }
}

// Volver a plantillas
function backToTemplates() {
    document.getElementById('scrapbookEditor').style.display = 'none';
    document.getElementById('templateSelection').style.display = 'block';
}

console.log('✅ Libro 3D listo');
