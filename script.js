// 1. Usuarios
const usuariosPermitidos = [
  { id: 1, nickname: "admin", password: "123", rol: "admin" },
  { id: 2, nickname: "vendedor", password: "123", rol: "vendedor" },
  { id: 3, nickname: "comprador", password: "123", rol: "comprador" }
];

// 2. Base de datos de productos 
let productos = [
  { id: 101, nombre: "Laptop Gamer", precio: 850, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS21uvhLwmhuhBMln0p0wZgCHYn7KkLkgVHHqY5BvTePQ&s=10", vendedor: "vendedor1" },
  { id: 102, nombre: "Teclado Mecánico", precio: 45, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNtOA1Z7umluKLMJ5FXZTWzOCpZZV7ZA98gVeEINE_4Q&s=10", vendedor: "vendedor1" },
  { id: 103, nombre: "Mouse Inalámbrico", precio: 25, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR42Ssyizt57EFKdyAe10_jwBaV2W3gl0epWJpJTi1NiQ&s=10", vendedor: "vendedor1" }
];

// 3. Estado del carrito de compras
let carrito = [];

// Función para mostrar el formulario de login al seleccionar el rol
function mostrarFormularioLogin() {
    const rolSeleccionado = document.getElementById("rol-select").value;
    const formLogin = document.getElementById("formulario-login");
    
    if (rolSeleccionado) {
        formLogin.style.display = "block";
    }
}

// Manejo del Login
function iniciarSesion(e) {
    e.preventDefault();

    const rolInput = document.getElementById("rol-select").value;
    const nicknameInput = document.getElementById("nickname").value.trim();
    const passwordInput = document.getElementById("password").value.trim();
    const mensajeError = document.getElementById("mensaje-error");

    const usuarioValido = usuariosPermitidos.find(u => 
        u.nickname === nicknameInput && 
        u.password === passwordInput && 
        u.rol === rolInput
    );

    if (usuarioValido) {
        mensajeError.textContent = "";
        document.getElementById("seccion-login").style.display = "none";
        document.getElementById("seccion-principal").style.display = "block";
        
        const infoUsuario = document.getElementById("info-usuario");
        infoUsuario.innerHTML = `
            <span>Usuario: <strong>${usuarioValido.nickname}</strong> (${usuarioValido.rol})</span>
        `;
        cargarVistaPorRol(usuarioValido);
    } else {
        mensajeError.textContent = "Usuario o contraseña incorrectos para el rol seleccionado.";
    }
}

function cerrarSesion() {
    document.getElementById("seccion-login").style.display = "block";
    document.getElementById("seccion-principal").style.display = "none";
    document.getElementById("info-usuario").innerHTML = "";
    document.getElementById("formulario-login").reset();
    document.getElementById("formulario-login").style.display = "none";
    document.getElementById("rol-select").selectedIndex = 0;
}

function volverPasoAnterior(rolUsuario) {
    const panelCarrito = document.getElementById("panel-carrito");
    if (panelCarrito && panelCarrito.style.display === "block") {
        panelCarrito.style.display = "none";
        return;
    }
    
    const usuarioActual = usuariosPermitidos.find(u => u.rol === rolUsuario);
    if (usuarioActual) {
        cargarVistaPorRol(usuarioActual);
    }
}

// Cargar la interfaz según el rol
function cargarVistaPorRol(usuario) {
    if (usuario.rol === "comprador") {
        renderizarComprador();
    } else if (usuario.rol === "vendedor") {
        renderizarVendedor(usuario);
    } else if (usuario.rol === "admin") {
        renderizarAdmin();
    }
}


// VISTA COMPRADOR:
// -------------------------------------------------------------
function renderizarComprador() {
    const contenidoRol = document.getElementById("contenido-rol");
    contenidoRol.innerHTML = `
        <div style="margin-bottom: 1rem; text-align: left; display: flex; gap: 10px;">
            <button onclick="volverPasoAnterior('comprador')" class="btn-secundario">← Volver</button>
            <button onclick="cerrarSesion()" class="btn-secundario">Cerrar Sesión / Cambiar Rol</button>
        </div>
        <div class="encabezado-tienda">
            <h2>Catálogo de Productos</h2>
            <button onclick="alternarCarrito()" class="btn-carrito">
                🛒 Carrito (<span id="contador-carrito">${carrito.length}</span>)
            </button>
        </div>

        <div id="panel-carrito" class="card-carrito" style="display: none;">
            <h3>Detalle de Compras</h3>
            <div id="lista-carrito"></div>
            <p id="total-carrito"><strong>Total: $0</strong></p>
            <button onclick="procesarCompra()" class="btn-accion">Procesar Compra</button>
        </div>

        <div id="grid-productos" class="grid-productos"></div>
    `;
    actualizarCatalogo();
    actualizarVistaCarrito();
}

function actualizarCatalogo() {
    const grid = document.getElementById("grid-productos");
    if (!grid) return;
    
    grid.innerHTML = productos.map(prod => `
        <div class="producto-card">
            <img src="${prod.imagen}" alt="${prod.nombre}">
            <h4>${prod.nombre}</h4>
            <p class="precio">$${prod.precio}</p>
            <button onclick="agregarAlCarrito(${prod.id})" class="btn-accion">Añadir al carrito</button>
        </div>
    `).join('');
}

function agregarAlCarrito(idProducto) {
    const prod = productos.find(p => p.id === idProducto);
    if (prod) {
        carrito.push(prod);
        document.getElementById("contador-carrito").textContent = carrito.length;
        actualizarVistaCarrito();
    }
}

function alternarCarrito() {
    const panel = document.getElementById("panel-carrito");
    panel.style.display = panel.style.display === "none" ? "block" : "none";
}

function actualizarVistaCarrito() {
    const lista = document.getElementById("lista-carrito");
    const totalEl = document.getElementById("total-carrito");
    if (!lista) return;

    if (carrito.length === 0) {
        lista.innerHTML = "<p>El carrito está vacío.</p>";
        totalEl.innerHTML = "<strong>Total: $0</strong>";
        return;
    }

    let total = 0;
    lista.innerHTML = carrito.map((item, index) => {
        total += item.precio;
        return `
            <div class="item-carrito">
                <span>${item.nombre} - $${item.precio}</span>
                <button onclick="quitarDelCarrito(${index})" class="btn-eliminar-sm">X</button>
            </div>
        `;
    }).join('');

    totalEl.innerHTML = `<strong>Total: $${total}</strong>`;
}

function quitarDelCarrito(index) {
    const producto = carrito[index];
    const seguro = confirm(`¿Estás seguro de que deseas eliminar "${producto.nombre}" del carrito?`);
    
    if (seguro) {
        carrito.splice(index, 1);
        document.getElementById("contador-carrito").textContent = carrito.length;
        actualizarVistaCarrito();
    }
}

function procesarCompra() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }
    alert("¡Compra procesada con éxito! Gracias por tu compra en BinaryShop.");
    carrito = [];
    document.getElementById("contador-carrito").textContent = 0;
    actualizarVistaCarrito();
    alternarCarrito();
}


// VISTA VENDEDOR: 
// -------------------------------------------------------------
function renderizarVendedor(usuario) {
    const contenidoRol = document.getElementById("contenido-rol");
    contenidoRol.innerHTML = `
        <div style="margin-bottom: 1rem; text-align: left; display: flex; gap: 10px;">
            <button onclick="volverPasoAnterior('vendedor')" class="btn-secundario">← Volver</button>
            <button onclick="cerrarSesion()" class="btn-secundario">Cerrar Sesión / Cambiar Rol</button>
        </div>
        <h2>Panel de Vendedor</h2>
        <div class="contenedor-card" style="max-width: 100%; margin-bottom: 2rem;">
            <h3>Publicar Nuevo Producto</h3>
            <form id="form-nuevo-producto">
                <div class="campo">
                    <label>Nombre del Producto:</label>
                    <input type="text" id="prod-nombre" required>
                </div>
                <div class="campo">
                    <label>Precio ($):</label>
                    <input type="number" id="prod-precio" required min="1">
                </div>
                <div class="campo">
                    <label>URL de Imagen:</label>
                    <input type="text" id="prod-imagen" placeholder="https://via.placeholder.com/150">
                </div>
                <button type="submit" class="btn-accion">Publicar Artículo</button>
            </form>
        </div>

        <h3>Mis Publicaciones</h3>
        <div id="mis-productos" class="grid-productos"></div>
    `;

    document.getElementById("form-nuevo-producto").addEventListener("submit", function(e) {
        e.preventDefault();
        const nombre = document.getElementById("prod-nombre").value;
        const precio = parseFloat(document.getElementById("prod-precio").value);
        const imagen = document.getElementById("prod-imagen").value || "https://via.placeholder.com/150";

        const nuevoProd = {
            id: Date.now(),
            nombre,
            precio,
            imagen,
            vendedor: usuario.nickname
        };

        productos.push(nuevoProd);
        alert("Producto publicado exitosamente.");
        this.reset();
        mostrarMisProductos(usuario.nickname);
    });

    mostrarMisProductos(usuario.nickname);
}

function mostrarMisProductos(vendedorNick) {
    const contenedor = document.getElementById("mis-productos");
    const misProds = productos.filter(p => p.vendedor === vendedorNick);
    
    if (misProds.length === 0) {
        contenedor.innerHTML = "<p>No has publicado ningún producto aún.</p>";
        return;
    }

    contenedor.innerHTML = misProds.map(p => `
        <div class="producto-card">
            <img src="${p.imagen}" alt="${p.nombre}">
            <h4>${p.nombre}</h4>
            <p class="precio">$${p.precio}</p>
        </div>
    `).join('');
}


// VISTA ADMINISTRADOR
// -------------------------------------------------------------
function renderizarAdmin() {
    const contenidoRol = document.getElementById("contenido-rol");
    contenidoRol.innerHTML = `
        <div style="margin-bottom: 1rem; text-align: left; display: flex; gap: 10px;">
            <button onclick="volverPasoAnterior('admin')" class="btn-secundario">← Volver</button>
            <button onclick="cerrarSesion()" class="btn-secundario">Cerrar Sesión / Cambiar Rol</button>
        </div>
        <h2>Panel de Administración</h2>
        
        <div class="contenedor-card" style="max-width: 100%; margin-bottom: 2rem;">
            <h3>Gestión de Cuentas de Usuario</h3>
            <div id="tabla-usuarios"></div>
        </div>

        <div class="contenedor-card" style="max-width: 100%;">
            <h3>Gestión de Publicaciones</h3>
            <div id="tabla-productos-admin"></div>
        </div>
    `;

    actualizarTablasAdmin();
}

function actualizarTablasAdmin() {
    const divUsuarios = document.getElementById("tabla-usuarios");
    const divProductos = document.getElementById("tabla-productos-admin");

    divUsuarios.innerHTML = `
        <table class="tabla-admin">
            <thead>
                <tr>
                    <th>Usuario</th>
                    <th>Rol</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                ${usuariosPermitidos.map(u => `
                    <tr>
                        <td>${u.nickname}</td>
                        <td>${u.rol}</td>
                        <td>
                            ${u.rol !== 'admin' ? `<button onclick="eliminarUsuario(${u.id})" class="btn-eliminar-sm">Eliminar</button>` : '<em>Protegido</em>'}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    divProductos.innerHTML = `
        <table class="tabla-admin">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Vendedor</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                ${productos.map(p => `
                    <tr>
                        <td>${p.nombre}</td> <td>$${p.precio}</td>
                        <td>${p.vendedor}</td>
                        <td>
                            <button onclick="eliminarProductoAdmin(${p.id})" class="btn-eliminar-sm">Remover</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function eliminarUsuario(id) {
    const idx = usuariosPermitidos.findIndex(u => u.id === id);
    if (idx !== -1) {
        usuariosPermitidos.splice(idx, 1);
        actualizarTablasAdmin();
    }
}

function eliminarProductoAdmin(id) {
    const idx = productos.findIndex(p => p.id === id);
    if (idx !== -1) {
        productos.splice(idx, 1);
        actualizarTablasAdmin();
    }
}