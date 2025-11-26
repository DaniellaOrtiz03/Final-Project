// ===== SISTEMA DE MARCOS ESTILO CANVA =====

let selectedElement = null;
let isDragging = false;
let isResizing = false;
let dragStartX = 0;
let dragStartY = 0;
let elementStartX = 0;
let elementStartY = 0;
let resizeHandle = null;
let currentPage = null;

// Almacenar elementos por página
let pageElements = {};

// Inicializar sistema
function initFrameSystem() {
    console.log('📚 Sistema de marcos Canva inicializado');
    
    // Esperar a que las páginas estén listas
    setTimeout(() => {
        // Añadir toolbars a cada página
        const pages = document.querySelectorAll('.page-layout');
        console.log('Páginas encontradas:', pages.length);
        
        pages.forEach((page, index) => {
            // Asignar ID único a cada página si no tiene
            if (!page.id) {
                page.id = 'page-layout-' + index;
            }
            
            if (!page.querySelector('.add-element-toolbar')) {
                const toolbar = createToolbar();
                page.appendChild(toolbar);
                console.log('Toolbar añadido a página:', page.id);
            }
        });
    }, 500);
    
    // Click fuera para deseleccionar
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.draggable-element') && !e.target.closest('.modal')) {
            deselectAll();
        }
    });
}

// Crear toolbar
function createToolbar() {
    const toolbar = document.createElement('div');
    toolbar.className = 'add-element-toolbar';
    toolbar.innerHTML = `
        <button class="add-element-btn" onclick="addImageFrame(event)">
            <i class="fas fa-image"></i>
            Añadir Imagen
        </button>
        <button class="add-element-btn" onclick="addTextFrame(event)">
            <i class="fas fa-font"></i>
            Añadir Texto
        </button>
    `;
    return toolbar;
}

// Añadir marco de imagen
function addImageFrame(event) {
    // Encontrar la página más cercana al botón clickeado
    const button = event ? event.target.closest('.add-element-btn') : null;
    const page = button ? button.closest('.page-layout') : document.querySelector('.page-layout');
    
    if (!page) {
        console.error('No se encontró la página');
        return;
    }
    
    currentPage = page;
    openShapeModal('image');
}

// Añadir marco de texto
function addTextFrame(event) {
    // Encontrar la página más cercana al botón clickeado
    const button = event ? event.target.closest('.add-element-btn') : null;
    const page = button ? button.closest('.page-layout') : document.querySelector('.page-layout');
    
    if (!page) {
        console.error('No se encontró la página');
        return;
    }
    
    currentPage = page;
    openShapeModal('text');
}

// Abrir modal de formas
function openShapeModal(type) {
    const modal = document.getElementById('frameShapeModal');
    if (modal) {
        modal.style.display = 'block';
        modal.setAttribute('data-frame-type', type);
    }
}

// Seleccionar forma
function selectFrameShape(shape) {
    const modal = document.getElementById('frameShapeModal');
    const frameType = modal.getAttribute('data-frame-type');
    
    closeModal('frameShapeModal');
    
    if (frameType === 'image') {
        createImageFrame(shape);
    } else if (frameType === 'text') {
        createTextFrame(shape);
    }
}

// Crear marco de imagen
function createImageFrame(shape) {
    if (!currentPage) return;
    
    const frame = document.createElement('div');
    frame.className = `draggable-element image-frame shape-${shape}`;
    frame.style.width = '200px';
    frame.style.height = '200px';
    frame.style.left = '50px';
    frame.style.top = '50px';
    
    // Guardar referencia a la página padre
    frame.setAttribute('data-parent-page', currentPage.id || 'page-' + Date.now());
    
    frame.innerHTML = `
        <div class="image-frame-placeholder">
            <i class="fas fa-image"></i>
            <span>Click para subir</span>
        </div>
        <div class="element-controls">
            <button class="element-control-btn shape-btn" onclick="changeElementShape(this, event)">
                <i class="fas fa-shapes"></i>
            </button>
            <button class="element-control-btn delete-btn" onclick="deleteElement(this, event)">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div class="resize-handles">
            <div class="resize-handle nw"></div>
            <div class="resize-handle n"></div>
            <div class="resize-handle ne"></div>
            <div class="resize-handle w"></div>
            <div class="resize-handle e"></div>
            <div class="resize-handle sw"></div>
            <div class="resize-handle s"></div>
            <div class="resize-handle se"></div>
        </div>
        <div class="size-indicator"></div>
    `;
    
    currentPage.appendChild(frame);
    makeDraggable(frame);
    makeResizable(frame);
    
    // Click para subir imagen - SIEMPRE permitir cambiar imagen
    frame.addEventListener('click', function(e) {
        if (e.target.closest('.element-controls')) return;
        if (e.target.closest('.resize-handle')) return;
        
        // Permitir subir/cambiar imagen en cualquier momento
        uploadImage(this);
    });
    
    selectElement(frame);
}

// Crear marco de texto
function createTextFrame(shape) {
    if (!currentPage) return;
    
    const frame = document.createElement('div');
    frame.className = `draggable-element text-frame shape-${shape}`;
    frame.style.width = '250px';
    frame.style.height = '150px';
    frame.style.left = '50px';
    frame.style.top = '50px';
    
    // Guardar referencia a la página padre
    frame.setAttribute('data-parent-page', currentPage.id || 'page-' + Date.now());
    
    frame.innerHTML = `
        <textarea placeholder="Escribe aquí..."></textarea>
        <div class="element-controls">
            <button class="element-control-btn shape-btn" onclick="changeElementShape(this, event)">
                <i class="fas fa-shapes"></i>
            </button>
            <button class="element-control-btn delete-btn" onclick="deleteElement(this, event)">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div class="resize-handles">
            <div class="resize-handle nw"></div>
            <div class="resize-handle n"></div>
            <div class="resize-handle ne"></div>
            <div class="resize-handle w"></div>
            <div class="resize-handle e"></div>
            <div class="resize-handle sw"></div>
            <div class="resize-handle s"></div>
            <div class="resize-handle se"></div>
        </div>
        <div class="size-indicator"></div>
    `;
    
    currentPage.appendChild(frame);
    makeDraggable(frame);
    makeResizable(frame);
    
    // Focus en textarea
    const textarea = frame.querySelector('textarea');
    if (textarea) {
        textarea.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        textarea.focus();
    }
    
    selectElement(frame);
}

// Subir imagen
function uploadImage(frame) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                // Remover placeholder si existe
                const placeholder = frame.querySelector('.image-frame-placeholder');
                if (placeholder) {
                    placeholder.remove();
                }
                
                // Remover imagen anterior si existe
                const oldImg = frame.querySelector('img');
                if (oldImg) {
                    oldImg.remove();
                }
                
                // Crear nueva imagen
                const img = document.createElement('img');
                img.src = event.target.result;
                img.alt = 'Imagen';
                
                // Insertar antes de los controles
                const controls = frame.querySelector('.element-controls');
                if (controls) {
                    frame.insertBefore(img, controls);
                } else {
                    frame.appendChild(img);
                }
                
                frame.classList.add('has-image');
                
                // Asegurar que el frame siga siendo redimensionable
                selectElement(frame);
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

// Hacer elemento arrastrable
function makeDraggable(element) {
    element.addEventListener('mousedown', function(e) {
        if (e.target.closest('.resize-handle')) return;
        if (e.target.closest('.element-controls')) return;
        if (e.target.tagName === 'TEXTAREA') return;
        
        e.preventDefault();
        selectElement(element);
        
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        elementStartX = element.offsetLeft;
        elementStartY = element.offsetTop;
        
        element.classList.add('dragging');
        
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
    });
}

function onDragMove(e) {
    if (!isDragging || !selectedElement) return;
    
    const deltaX = e.clientX - dragStartX;
    const deltaY = e.clientY - dragStartY;
    
    let newX = elementStartX + deltaX;
    let newY = elementStartY + deltaY;
    
    // Límites suaves - permitir que el elemento salga un poco pero no completamente
    const parent = selectedElement.parentElement;
    const minVisible = 30; // Píxeles mínimos que deben quedar visibles
    
    const maxX = parent.offsetWidth - minVisible;
    const maxY = parent.offsetHeight - minVisible;
    const minX = -(selectedElement.offsetWidth - minVisible);
    const minY = -(selectedElement.offsetHeight - minVisible);
    
    newX = Math.max(minX, Math.min(newX, maxX));
    newY = Math.max(minY, Math.min(newY, maxY));
    
    selectedElement.style.left = newX + 'px';
    selectedElement.style.top = newY + 'px';
}

function onDragEnd() {
    if (selectedElement) {
        selectedElement.classList.remove('dragging');
    }
    isDragging = false;
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup', onDragEnd);
}

// Hacer elemento redimensionable
function makeResizable(element) {
    const handles = element.querySelectorAll('.resize-handle');
    
    handles.forEach(handle => {
        handle.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            isResizing = true;
            resizeHandle = handle.classList[1]; // Obtener la clase del handle (nw, ne, etc.)
            selectedElement = element;
            
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            elementStartX = element.offsetLeft;
            elementStartY = element.offsetTop;
            const startWidth = element.offsetWidth;
            const startHeight = element.offsetHeight;
            
            element.classList.add('resizing');
            selectElement(element);
            
            const onResizeMove = function(e) {
                if (!isResizing) return;
                
                const deltaX = e.clientX - dragStartX;
                const deltaY = e.clientY - dragStartY;
                
                let newWidth = startWidth;
                let newHeight = startHeight;
                let newX = elementStartX;
                let newY = elementStartY;
                
                // Calcular nuevas dimensiones según el handle - COMPLETAMENTE LIBRE
                if (resizeHandle.includes('e')) {
                    newWidth = startWidth + deltaX;
                }
                if (resizeHandle.includes('w')) {
                    newWidth = startWidth - deltaX;
                    newX = elementStartX + deltaX;
                }
                if (resizeHandle.includes('s')) {
                    newHeight = startHeight + deltaY;
                }
                if (resizeHandle.includes('n')) {
                    newHeight = startHeight - deltaY;
                    newY = elementStartY + deltaY;
                }
                
                // Tamaño mínimo muy pequeño para máxima libertad
                const minSize = 30;
                if (newWidth < minSize) {
                    newWidth = minSize;
                    if (resizeHandle.includes('w')) {
                        newX = elementStartX + startWidth - minSize;
                    }
                }
                if (newHeight < minSize) {
                    newHeight = minSize;
                    if (resizeHandle.includes('n')) {
                        newY = elementStartY + startHeight - minSize;
                    }
                }
                
                // SIN límites de página - libertad total
                // El usuario puede hacer el elemento tan grande o pequeño como quiera
                
                // Aplicar cambios
                element.style.width = newWidth + 'px';
                element.style.height = newHeight + 'px';
                element.style.left = newX + 'px';
                element.style.top = newY + 'px';
                
                // Mostrar indicador de tamaño
                const indicator = element.querySelector('.size-indicator');
                if (indicator) {
                    indicator.textContent = `${Math.round(newWidth)} × ${Math.round(newHeight)}`;
                }
            };
            
            const onResizeEnd = function() {
                isResizing = false;
                element.classList.remove('resizing');
                document.removeEventListener('mousemove', onResizeMove);
                document.removeEventListener('mouseup', onResizeEnd);
            };
            
            document.addEventListener('mousemove', onResizeMove);
            document.addEventListener('mouseup', onResizeEnd);
        });
    });
}

// Seleccionar elemento
function selectElement(element) {
    deselectAll();
    selectedElement = element;
    element.classList.add('selected');
}

// Deseleccionar todos
function deselectAll() {
    const selected = document.querySelectorAll('.draggable-element.selected');
    selected.forEach(el => el.classList.remove('selected'));
    selectedElement = null;
}

// Eliminar elemento
function deleteElement(button, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const element = button.closest('.draggable-element');
    if (element) {
        element.remove();
        selectedElement = null;
    }
}

// Cambiar forma del elemento
function changeElementShape(button, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const element = button.closest('.draggable-element');
    if (!element) return;
    
    selectedElement = element;
    
    // Determinar tipo
    const isImage = element.classList.contains('image-frame');
    const modal = document.getElementById('frameShapeModal');
    
    if (modal) {
        modal.style.display = 'block';
        modal.setAttribute('data-frame-type', isImage ? 'image-change' : 'text-change');
    }
}

// Actualizar selectFrameShape para cambios de forma
const originalSelectFrameShape = window.selectFrameShape;
window.selectFrameShape = function(shape) {
    const modal = document.getElementById('frameShapeModal');
    const frameType = modal.getAttribute('data-frame-type');
    
    if (frameType === 'image-change' || frameType === 'text-change') {
        // Cambiar forma de elemento existente
        if (selectedElement) {
            // Remover clases de forma anteriores
            const shapeClasses = ['shape-circle', 'shape-square', 'shape-rounded', 'shape-heart', 
                                 'shape-star', 'shape-hexagon', 'shape-octagon', 'shape-cloud', 
                                 'shape-wave', 'shape-diamond', 'shape-tag', 'shape-polaroid'];
            shapeClasses.forEach(cls => selectedElement.classList.remove(cls));
            
            // Añadir nueva forma
            selectedElement.classList.add(`shape-${shape}`);
        }
        closeModal('frameShapeModal');
    } else {
        // Crear nuevo elemento
        if (originalSelectFrameShape) {
            originalSelectFrameShape(shape);
        } else {
            closeModal('frameShapeModal');
            
            if (frameType === 'image') {
                createImageFrame(shape);
            } else if (frameType === 'text') {
                createTextFrame(shape);
            }
        }
    }
};

// Cerrar modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Cerrar modales al hacer click fuera
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

// Guardar elementos de una página
function savePageElements(pageId) {
    const page = document.getElementById(pageId);
    if (!page) return;
    
    const elements = page.querySelectorAll('.draggable-element');
    pageElements[pageId] = Array.from(elements).map(el => ({
        html: el.outerHTML,
        parentPage: pageId
    }));
    
    console.log('Elementos guardados para página:', pageId, pageElements[pageId].length);
}

// Restaurar elementos de una página
function restorePageElements(pageId) {
    const page = document.getElementById(pageId);
    if (!page || !pageElements[pageId]) return;
    
    // Limpiar elementos actuales (excepto toolbar)
    const currentElements = page.querySelectorAll('.draggable-element');
    currentElements.forEach(el => el.remove());
    
    // Restaurar elementos guardados
    pageElements[pageId].forEach(data => {
        const temp = document.createElement('div');
        temp.innerHTML = data.html;
        const element = temp.firstChild;
        
        page.appendChild(element);
        
        // Re-inicializar funcionalidad
        makeDraggable(element);
        makeResizable(element);
        
        // Re-añadir event listeners
        if (element.classList.contains('image-frame') && !element.classList.contains('has-image')) {
            element.addEventListener('click', function(e) {
                if (e.target.closest('.element-controls')) return;
                uploadImage(this);
            });
        }
        
        if (element.classList.contains('text-frame')) {
            const textarea = element.querySelector('textarea');
            if (textarea) {
                textarea.addEventListener('click', function(e) {
                    e.stopPropagation();
                });
            }
        }
    });
    
    console.log('Elementos restaurados para página:', pageId);
}

// Función global para ser llamada cuando cambian las páginas
window.onPageChange = function(leftPageId, rightPageId) {
    console.log('Cambio de página detectado:', leftPageId, rightPageId);
    
    // Guardar elementos de todas las páginas visibles antes del cambio
    const allPages = document.querySelectorAll('.page-layout');
    allPages.forEach(page => {
        if (page.id) {
            savePageElements(page.id);
        }
    });
    
    // Restaurar elementos de las nuevas páginas visibles
    setTimeout(() => {
        if (leftPageId) restorePageElements(leftPageId);
        if (rightPageId) restorePageElements(rightPageId);
    }, 100);
};

// Exportar todas las funciones necesarias globalmente
window.openShapeModal = openShapeModal;
window.addImageFrame = addImageFrame;
window.addTextFrame = addTextFrame;
window.createImageFrame = createImageFrame;
window.createTextFrame = createTextFrame;
window.currentPage = currentPage;
window.deleteElement = deleteElement;
window.changeElementShape = changeElementShape;
window.closeModal = closeModal;

console.log('✅ Funciones exportadas globalmente:', {
    openShapeModal: typeof window.openShapeModal,
    addImageFrame: typeof window.addImageFrame,
    addTextFrame: typeof window.addTextFrame
});

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFrameSystem);
} else {
    initFrameSystem();
}
