const formulario = document.getElementById("formularioPedido");
const listaPedidos = document.getElementById("listaPedidos");
const buscar = document.getElementById("buscar");
const mensaje = document.getElementById("mensaje");
const sinPedidos = document.getElementById("sinPedidos");

const totalPedidos = document.getElementById("totalPedidos");
const pedidosPendientes = document.getElementById("pedidosPendientes");
const pedidosEntregados = document.getElementById("pedidosEntregados");

const estados = [
    "Pendiente",
    "En preparación",
    "Listo",
    "Entregado"
];

// Recuperar los pedidos guardados en el navegador.
let pedidos = [];

try {
    const datosGuardados = localStorage.getItem("pedidosFloridulce");
    pedidos = datosGuardados ? JSON.parse(datosGuardados) : [];

    if (!Array.isArray(pedidos)) {
        pedidos = [];
    }
} catch (error) {
    pedidos = [];
}

function guardarPedidos() {
    try {
        localStorage.setItem("pedidosFloridulce", JSON.stringify(pedidos));
        return true;
    } catch (error) {
        mensaje.textContent =
            "No se pudieron guardar los datos en el navegador.";
        return false;
    }
}

function crearCelda(texto) {
    const celda = document.createElement("td");
    celda.textContent = texto;
    return celda;
}

function mostrarPedidos() {
    listaPedidos.replaceChildren();

    const textoBusqueda = buscar.value.trim().toLowerCase();

    const pedidosFiltrados = pedidos.filter(function(pedido) {
        return pedido.cliente.toLowerCase().includes(textoBusqueda);
    });

    pedidosFiltrados.forEach(function(pedido) {
        const fila = document.createElement("tr");

        fila.appendChild(crearCelda(pedido.id));
        fila.appendChild(crearCelda(pedido.cliente));
        fila.appendChild(crearCelda(pedido.descripcion));
        fila.appendChild(crearCelda(pedido.fechaEntrega));

        fila.appendChild(
            crearCelda(
                Number(pedido.precio).toLocaleString("es-DO", {
                    style: "currency",
                    currency: "DOP"
                })
            )
        );

        const celdaEstado = document.createElement("td");
        const selector = document.createElement("select");
        selector.setAttribute("aria-label", "Estado del pedido " + pedido.id);

        estados.forEach(function(estado) {
            const opcion = document.createElement("option");
            opcion.value = estado;
            opcion.textContent = estado;

            if (estado === pedido.estado) {
                opcion.selected = true;
            }

            selector.appendChild(opcion);
        });

        selector.addEventListener("change", function() {
            const estadoAnterior = pedido.estado;
            pedido.estado = selector.value;

            if (guardarPedidos()) {
                mensaje.textContent = "Estado del pedido actualizado.";
                actualizarPantalla();
            } else {
                pedido.estado = estadoAnterior;
                selector.value = estadoAnterior;
            }
        });

        celdaEstado.appendChild(selector);
        fila.appendChild(celdaEstado);

        const celdaAccion = document.createElement("td");
        const botonEliminar = document.createElement("button");

        botonEliminar.type = "button";
        botonEliminar.textContent = "Eliminar";
        botonEliminar.className = "boton";
        botonEliminar.style.marginTop = "0";
        botonEliminar.style.padding = "8px";

        botonEliminar.addEventListener("click", function() {
            const confirmar = window.confirm(
                "¿Deseas eliminar el pedido de " + pedido.cliente + "?"
            );

            if (confirmar) {
                const pedidosAnteriores = pedidos;
                pedidos = pedidos.filter(function(item) {
                    return item.id !== pedido.id;
                });

                if (guardarPedidos()) {
                    mensaje.textContent = "Pedido eliminado correctamente.";
                    actualizarPantalla();
                } else {
                    pedidos = pedidosAnteriores;
                    actualizarPantalla();
                }
            }
        });

        celdaAccion.appendChild(botonEliminar);
        fila.appendChild(celdaAccion);

        listaPedidos.appendChild(fila);
    });

    sinPedidos.hidden = pedidosFiltrados.length > 0;
}

function actualizarResumen() {
    totalPedidos.textContent = pedidos.length;

    pedidosPendientes.textContent = pedidos.filter(function(pedido) {
        return pedido.estado === "Pendiente";
    }).length;

    pedidosEntregados.textContent = pedidos.filter(function(pedido) {
        return pedido.estado === "Entregado";
    }).length;
}

function actualizarPantalla() {
    mostrarPedidos();
    actualizarResumen();
}

formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const cliente = document.getElementById("cliente").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const fechaEntrega = document.getElementById("fechaEntrega").value;
    const precio = Number(document.getElementById("precio").value);

    if (!cliente || !telefono || !direccion || !descripcion || !fechaEntrega) {
        mensaje.textContent = "Completa todos los campos.";
        return;
    }

    if (!Number.isFinite(precio) || precio <= 0) {
        mensaje.textContent = "El precio debe ser mayor que cero.";
        return;
    }

    const nuevoPedido = {
        id: Date.now().toString(),
        cliente: cliente,
        telefono: telefono,
        direccion: direccion,
        descripcion: descripcion,
        fechaEntrega: fechaEntrega,
        precio: precio,
        estado: "Pendiente"
    };

    pedidos.push(nuevoPedido);

    if (!guardarPedidos()) {
        pedidos.pop();
        return;
    }

    formulario.reset();
    mensaje.textContent = "¡Pedido registrado correctamente!";

    actualizarPantalla();
});

buscar.addEventListener("input", mostrarPedidos);

// Evitar seleccionar una fecha anterior a hoy.
const campoFecha = document.getElementById("fechaEntrega");
const hoy = new Date();
const fechaActual = [
    hoy.getFullYear(),
    String(hoy.getMonth() + 1).padStart(2, "0"),
    String(hoy.getDate()).padStart(2, "0")
].join("-");

campoFecha.min = fechaActual;

// Mostrar los pedidos guardados al abrir el sistema.
actualizarPantalla();