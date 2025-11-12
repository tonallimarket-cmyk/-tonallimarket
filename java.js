// script.js - Carrito funcional para Tonalli Market
document.addEventListener('DOMContentLoaded', function() {
    const carrito = {};
    const cantidadCarrito = document.getElementById('cantidad-carrito');
    const carritoDesplegable = document.getElementById('carrito-desplegable');
    const panelCarrito = document.getElementById('panel-carrito');
    const totalSpan = document.getElementById('total');
    const vaciarBtn = document.getElementById('vaciar-carrito');
    const irPagarBtn = document.getElementById('ir-pagar');
    const carritoIcon = document.getElementById('carrito');
    
    // Elementos del modal de pago
    const modalPago = document.getElementById('modal-pago');
    const cerrarModal = document.getElementById('cerrar-modal');
    const cancelarPago = document.getElementById('cancelar-pago');
    const formPago = document.getElementById('form-pago');

    function actualizarCarrito() {
        let totalItems = 0; //cantidad de carrito
        let totalPrecio = 0; //acomulador
        panelCarrito.innerHTML = '';//limpador del carrito

        for (const [id, item] of Object.entries(carrito)) {
            totalItems += item.cantidad;
            totalPrecio += item.precio * item.cantidad;
            
            const itemEl = document.createElement('div');
            itemEl.className = 'producto-carrito';
            itemEl.innerHTML = `
                <span>${item.nombre} x${item.cantidad}</span>
                <span>$${item.precio * item.cantidad}</span>
                <button class="btn-eliminar" data-id="${id}">Eliminar</button> 
            `; //identifica que elemento eliminar
            panelCarrito.appendChild(itemEl);
        }

        cantidadCarrito.textContent = totalItems;
        totalSpan.textContent = `$${totalPrecio}`;
        
        if (totalItems === 0) {
            panelCarrito.innerHTML = '<p class="vacio">El carrito está vacío</p>';
        }
    }

    // Agregar productos al carrito
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-agregar')) {
            const id = e.target.dataset.id;
            const nombre = e.target.dataset.nombre;
            const precio = parseFloat(e.target.dataset.precio);
            
            if (carrito[id]) {
                carrito[id].cantidad++;
            } else {
                carrito[id] = { nombre, precio, cantidad: 1 };
            }
            
            actualizarCarrito();
            alert(`${nombre} agregado al carrito!`);
        }
    });

    // Eliminar productos del carrito
    panelCarrito.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-eliminar')) {
            const id = e.target.dataset.id;
            delete carrito[id];
            actualizarCarrito();
        }
    });

    // Mostrar/ocultar carrito
    carritoIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        const isHidden = carritoDesplegable.style.display === 'none' || carritoDesplegable.style.display === '';
        carritoDesplegable.style.display = isHidden ? 'block' : 'none';
    });

    // Cerrar carrito al hacer clic fuera
    document.addEventListener('click', function() {
        carritoDesplegable.style.display = 'none';
    });

    // Vaciar carrito
    vaciarBtn.addEventListener('click', function() {
        for (const id in carrito) delete carrito[id];
        actualizarCarrito();
    });

    // Pagar - abrir modal
    irPagarBtn.addEventListener('click', function() {
        if (Object.keys(carrito).length === 0) {
            alert('El carrito está vacío');
            return;
        }
        modalPago.style.display = 'flex';
    });

    // Cerrar modal de pago
    cerrarModal.addEventListener('click', function() {
        modalPago.style.display = 'none';
    });
    
    cancelarPago.addEventListener('click', function() {
        modalPago.style.display = 'none';
    });

    // Enviar formulario de pago
    formPago.addEventListener('submit', function(e) {
        e.preventDefault();
        const total = calcularTotal();
        alert(`¡Gracias por tu compra en Tonalli Market!\n\nTotal: $${total}\n\nTu pedido será procesado.`);
        
        // Limpiar carrito
        for (const id in carrito) delete carrito[id];
        actualizarCarrito();
        modalPago.style.display = 'none';
        carritoDesplegable.style.display = 'none';
    });

    function calcularTotal() {
        return Object.values(carrito).reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }

    // Botones "Ver más"
    document.querySelectorAll('.btn-ver-mas').forEach(btn => {
        btn.addEventListener('click', function() {
            const productosAdicionales = this.nextElementSibling;
            if (productosAdicionales.style.display === 'none') {
                productosAdicionales.style.display = 'block';
                this.textContent = 'Ver menos';
            } else {
                productosAdicionales.style.display = 'none';
                this.textContent = 'Ver más';
            }
        });
    });

    // Función para mostrar ofertas
    window.mostrarOferta = function() {
        document.getElementById('ofertas').scrollIntoView({ behavior: 'smooth' });
    };

    // Inicializar carrito
    actualizarCarrito();
});