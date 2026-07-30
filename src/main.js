const form = document.querySelector(".form");
const tbody = document.querySelector(".table tbody");
const cancelar = document.querySelector(".cancelar");

const buscar = document.querySelector("#buscarPaciente");
const btnBuscar = document.querySelector("#btnBuscar");
const btnTodos = document.querySelector("#btnMostrarTodos");

const enfermera = document.querySelector("#nombreEnfermera");
const turno = document.querySelector("#turnoEnfermera");
const btnMisPacientes = document.querySelector("#btnMisPacientes");
const btnTodosEnfermeria =
document.querySelector("#btnMostrarTodosEnfermeria");

let pacienteEditando = null;

function crearPaciente() {

const horarios = [...form.querySelectorAll(
    'input[name="horario"]:checked'
)].map(input => input.value);

return {
    nombre: form.nombre.value,
    edad: form.edad.value,
    sexo: form.sexo.value,
    medicamento: form.medicamento.value,
    horario: horarios,
    enfermera: form.enfermera.value,
    turno: form.turno.value,
    observacion: form.observacion.value
};

}

function mostrarPaciente(p) {

return `
    <td>${p.nombre}</td>
    <td>${p.edad}</td>
    <td>${p.sexo}</td>
    <td>${p.medicamento}</td>
    <td>${p.horario.join(", ")}</td>
    <td>${p.enfermera}</td>
    <td>${p.turno}</td>
    <td>${p.observacion}</td>

    <td>
        <button type="button" class="editar">Editar</button>
        <button type="button" class="eliminar">Eliminar</button>
    </td>
`;

}

form.addEventListener("submit", function(e) {

e.preventDefault();

const paciente = crearPaciente();

if (pacienteEditando) {

    pacienteEditando.innerHTML = mostrarPaciente(paciente);
    pacienteEditando = null;
    cancelar.style.display = "none";

} else {

    tbody.innerHTML += `
        <tr>${mostrarPaciente(paciente)}</tr>
    `;

}

form.reset();

});

tbody.addEventListener("click", function(e) {

const fila = e.target.closest("tr");

if (e.target.classList.contains("eliminar")) {
    fila.remove();
}

if (e.target.classList.contains("editar")) {

    pacienteEditando = fila;

    form.nombre.value = fila.children[0].textContent;
    form.edad.value = fila.children[1].textContent;
    form.medicamento.value = fila.children[3].textContent;
    form.enfermera.value = fila.children[5].textContent;
    form.turno.value = fila.children[6].textContent;
    form.observacion.value = fila.children[7].textContent;

    form.querySelectorAll('input[name="sexo"]')
        .forEach(input => {
            input.checked =
                input.value === fila.children[2].textContent;
        });

    const horarios =
        fila.children[4].textContent.split(", ");

    form.querySelectorAll('input[name="horario"]')
        .forEach(input => {
            input.checked = horarios.includes(input.value);
        });

    cancelar.style.display = "block";
    form.querySelector("button[type='submit']")
        .textContent = "Actualizar paciente";
}

});

cancelar.addEventListener("click", function() {

pacienteEditando = null;
form.reset();
cancelar.style.display = "none";

form.querySelector("button[type='submit']")
    .textContent = "Guardar paciente";

});

function buscarPacientes() {

const texto = buscar.value.toLowerCase().trim();

tbody.querySelectorAll("tr").forEach(fila => {

    const nombre =
        fila.children[0].textContent.toLowerCase();

    fila.style.display =
        nombre.includes(texto) ? "" : "none";
});

}

btnBuscar.addEventListener("click", buscarPacientes);
buscar.addEventListener("input", buscarPacientes);

btnTodos.addEventListener("click", function() {

buscar.value = "";

tbody.querySelectorAll("tr").forEach(fila => {
    fila.style.display = "";
});

});

btnMisPacientes.addEventListener("click", function() {

const nombre = enfermera.value.toLowerCase().trim();
const turnoActual = turno.value;

tbody.querySelectorAll("tr").forEach(fila => {

    const nombrePaciente =
        fila.children[5].textContent.toLowerCase().trim();

    const turnoPaciente =
        fila.children[6].textContent;

    fila.style.display =
        nombrePaciente === nombre &&
        turnoPaciente === turnoActual
            ? ""
            : "none";
});

});

btnTodosEnfermeria.addEventListener("click", function() {

tbody.querySelectorAll("tr").forEach(fila => {
    fila.style.display = "";
});

});