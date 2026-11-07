const CLAVE_PEDIDOS = "floridulce_pedidos";

let pedidos = JSON.parse(localStorage.getItem(CLAVE_PEDIDOS)) || [];

function guardarPedidos() {
    localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(pedidos));
}

function obtenerTotal(precio, descuento) {
    return Math.max(0, Number(precio) - Number(descuento));
}

function generarNumero() {
    const numeros = pedidos.map(pedido => {
        return Number(String(pedido.numero).replace("FL-", "")) || 0;
    });

    const siguiente = Math.max(0, ...numeros) + 1;

    return "FL-" + String(siguiente).padStart(4, "0");
}

function escapar(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, caracter => {
        const equivalencias = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return equivalencias[caracter];
    });
}

// PÁGINA DE INICIO

function cargarInicio() {
    const total = pedidos.length;
    const pendientes = pedidos.filter(p => p.estado === "Pendiente").length;
    const preparacion = pedidos.filter(p => p.estado === "En preparación").length;
    const entregados = pedidos.filter(p => p.estado === "Entregado").length;

    document.getElementById("totalPedidos").textContent = total;
    document.getElementById("pedidosPendientes").textContent = pendientes;
    document.getElementById("pedidosPreparacion").textContent = preparacion;
    document.getElementById("pedidosEntregados").textContent = entregados;
}

// PÁGINA DE REGISTRO

function configurarFormulario() {
    const formulario = document.getElementById("formularioPedido");

    if (!formulario) return;

    const campos = [
        "cliente",
        "telefono",
        "direccion",
        "descripcion",
        "fecha",
        "hora",
        "precio",
        "descuento",
        "empleado",
        "estado",
        "metodoPago",
        "estadoPago"
    ];

    const parametros = new URLSearchParams(window.location.search);
    const idEditar = parametros.get("editar");

    let pedidoEditar = pedidos.find(p => p.id === idEditar);

    const titulo = document.getElementById("tituloFormulario");
    const botonGuardar = document.getElementById("botonGuardar");

    if (pedidoEditar) {
        titulo.textContent = "Editar pedido " + pedidoEditar.numero;
        botonGuardar.textContent = "Actualizar pedido";

        campos.forEach(campo => {
            const elemento = document.getElementById(campo);

            if (elemento && pedidoEditar[campo] !== undefined) {
                elemento.value = pedidoEditar[campo];
            }
        });

    }

    function actualizarTotal() {
        const precio = Number(document.getElementById("precio").value) || 0;
        const descuento = Number(document.getElementById("descuento").value) || 0;

        const total = obtenerTotal(precio, descuento);

        document.getElementById("totalCalculado").textContent =
            "RD$ " + total.toFixed(2);
    }

    document.getElementById("precio").addEventListener("input", actualizarTotal);
    document.getElementById("descuento").addEventListener("input", actualizarTotal);

    actualizarTotal();

    formulario.addEventListener("submit", function(evento) {
        evento.preventDefault();

        const datos = {};

        campos.forEach(campo => {
            datos[campo] = document.getElementById(campo).value.trim();
        });

        const precio = Number(datos.precio);
        const descuento = Number(datos.descuento);

        if (precio <= 0 || !Number.isFinite(precio)) {
            alert("El precio debe ser mayor que cero.");
            return;
        }

        if (descuento < 0 || !Number.isFinite(descuento) || descuento > precio) {
            alert("El descuento no puede ser negativo ni superar el precio.");
            return;
        }

        if (!/^[0-9+\-\s()]{7,20}$/.test(datos.telefono)) {
            alert("Introduce un número de teléfono válido.");
            return;
        }

        if (new Date(datos.fecha + "T00:00:00") < new Date(new Date().toDateString())) {
            if (!pedidoEditar || datos.fecha !== pedidoEditar.fecha) {
                alert("La fecha de entrega no puede ser anterior a hoy.");
                return;
            }
        }

        if (pedidoEditar) {
            pedidoEditar = {
                ...pedidoEditar,
                ...datos,
                total: obtenerTotal(precio, descuento)
            };

            alert("El pedido se actualizó correctamente.");

        } else {
            const nuevoPedido = {
                id: Date.now().toString(),
                numero: generarNumero(),
                ...datos,
                total: obtenerTotal(precio, descuento),
                fechaRegistro: new Date().toISOString()
            };

            pedidos.push(nuevoPedido);

            alert("El pedido se registró correctamente.");
        }

        guardarPedidos();

        window.location.href = "pedidos.html";
    });

    document.getElementById("botonLimpiar").addEventListener("click", function() {
        if (pedidoEditar) {
            const confirmar = confirm("¿Deseas dejar de editar este pedido?");

            if (confirmar) {
                window.location.href = "registrar.html";
            }
        } else {
            formulario.reset();
            document.getElementById("descuento").value = 0;
            actualizarTotal();
        }
    });
}

// PÁGINA DE CONSULTAS

function cargarPedidos() {
    const tabla = document.getElementById("tablaPedidos");

    if (!tabla) return;

    const buscador = document.getElementById("buscador");
    const mensajeVacio = document.getElementById("mensajeVacio");

    function mostrarPedidos() {
        const busqueda = buscador.value.toLowerCase().trim();

        const filtrados = pedidos.filter(pedido =>
            pedido.cliente.toLowerCase().includes(busqueda) ||
            pedido.numero.toLowerCase().includes(busqueda)
        );

        tabla.innerHTML = "";

        if (filtrados.length === 0) {
            mensajeVacio.hidden = false;

            mensajeVacio.textContent = pedidos.length === 0
                ? "No hay pedidos registrados."
                : "No se encontraron pedidos con esa búsqueda.";

            return;
        }

        mensajeVacio.hidden = true;

        filtrados.forEach(pedido => {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${escapar(pedido.numero)}</td>
                <td>${escapar(pedido.cliente)}</td>
                <td>${escapar(pedido.fecha)}</td>
                <td>RD$ ${Number(pedido.total).toFixed(2)}</td>
                <td><span class="estado-etiqueta">${escapar(pedido.estado)}</span></td>
                <td>
                    <div class="acciones">
                        <button class="boton-pequeno ver" data-accion="ver" data-id="${escapar(pedido.id)}">
                            Ver
                        </button>

                        <button class="boton-pequeno editar" data-accion="editar" data-id="${escapar(pedido.id)}">
                            Editar
                        </button>

                        <button class="boton-pequeno cancelar" data-accion="cancelar" data-id="${escapar(pedido.id)}">
                            Cancelar
                        </button>
                    </div>
                </td>
            `;

            tabla.appendChild(fila);
        });
    }

    buscador.addEventListener("input", mostrarPedidos);

    tabla.addEventListener("click", function(evento) {
        const boton = evento.target.closest("button[data-accion]");

        if (!boton) return;

        const id = boton.dataset.id;
        const accion = boton.dataset.accion;

        const pedido = pedidos.find(p => p.id === id);

        if (!pedido) return;

        if (accion === "ver") {
            mostrarDetalles(pedido);
        }

        if (accion === "editar") {
            if (pedido.estado === "Cancelado") {
                alert("No se puede editar un pedido cancelado.");
                return;
            }

            window.location.href = "registrar.html?editar=" + encodeURIComponent(id);
        }

        if (accion === "cancelar") {
            if (pedido.estado === "Cancelado") {
                alert("Este pedido ya está cancelado.");
                return;
            }

            const confirmar = confirm(
                "¿Estás segura de que deseas cancelar el pedido " +
                pedido.numero + "?"
            );

            if (confirmar) {
                pedido.estado = "Cancelado";
                guardarPedidos();
                mostrarPedidos();
                alert("El pedido fue cancelado.");
            }
        }
    });

    mostrarPedidos();
}

// DETALLES DEL PEDIDO

function mostrarDetalles(pedido) {
    const dialogo = document.getElementById("dialogoDetalles");
    const contenido = document.getElementById("contenidoDetalles");

    const detalles = [
        ["Número de pedido", pedido.numero],
        ["Cliente", pedido.cliente],
        ["Teléfono", pedido.telefono],
        ["Dirección", pedido.direccion],
        ["Descripción", pedido.descripcion],
        ["Fecha de entrega", pedido.fecha],
        ["Hora de entrega", pedido.hora],
        ["Precio", "RD$ " + Number(pedido.precio).toFixed(2)],
        ["Descuento", "RD$ " + Number(pedido.descuento).toFixed(2)],
        ["Total", "RD$ " + Number(pedido.total).toFixed(2)],
        ["Empleado responsable", pedido.empleado],
        ["Estado del pedido", pedido.estado],
        ["Método de pago", pedido.metodoPago],
        ["Estado del pago", pedido.estadoPago]
    ];

    contenido.innerHTML = detalles.map(([titulo, valor]) => `
        <div class="detalle-linea">
            <strong>${escapar(titulo)}:</strong>
            ${escapar(valor)}
        </div>
    `).join("");

    dialogo.showModal();
}

// INICIAR FUNCIONES SEGÚN LA PÁGINA

document.addEventListener("DOMContentLoaded", function() {
    const pagina = document.body.dataset.page;

    if (pagina === "inicio") {
        cargarInicio();
    }

    if (pagina === "registrar") {
        configurarFormulario();
    }

    if (pagina === "pedidos") {
        cargarPedidos();

        document.getElementById("cerrarDetalles").addEventListener("click", function() {
            document.getElementById("dialogoDetalles").close();
        });
    }
});