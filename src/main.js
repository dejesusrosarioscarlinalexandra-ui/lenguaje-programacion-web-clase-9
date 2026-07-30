const form = document.querySelector(".form");
const table = document.querySelector(".table");
const tbody = table.querySelector("tbody");
const cancelar = document.querySelector(".cancelar");

let pacienteEditando = null;

function handleSubmit(e) {

e.preventDefault();

const nombre = form.nombre.value;
const edad = form.edad.value;
const sexo = form.sexo.value;
const medicamento = form.medicamento.value;
const observacion = form.observacion.value;
const enfermera = form.enfermera.value;
const turno = form.turno.value;

const horarioSeleccionado = form.querySelectorAll(
    'input[name="horario"]:checked'
);

const horarios = [];

horarioSeleccionado.forEach(function(checkbox) {
    horarios.push(checkbox.value);
});

const paciente = {
    nombre: nombre,
    edad: edad,
    sexo: sexo,
    medicamento: medicamento,
    horario: horarios,
    observacion: observacion,
    enfermera: enfermera,
    turno: turno
};

if (pacienteEditando !== null) {

    pacienteEditando.innerHTML = `

        <td>${paciente.nombre}</td>

        <td>${paciente.edad}</td>

        <td>${paciente.sexo}</td>

        <td>${paciente.medicamento}</td>

        <td>${paciente.horario.join(", ")}</td>

        <td>${paciente.enfermera}</td>

        <td>${paciente.turno}</td>

        <td>${paciente.observacion}</td>

        <td>

            <button
                type="button"
                class="editar"
            >
                Editar
            </button>

            <button
                type="button"
                class="eliminar"
            >
                Eliminar
            </button>

        </td>

    `;

    pacienteEditando = null;

    cancelar.style.display = "none";

    form.querySelector("button[type='submit']").textContent =
        "Guardar paciente";

} else {

    tbody.innerHTML += `

        <tr>

            <td>${paciente.nombre}</td>

            <td>${paciente.edad}</td>

            <td>${paciente.sexo}</td>

            <td>${paciente.medicamento}</td>

            <td>${paciente.horario.join(", ")}</td>

            <td>${paciente.enfermera}</td>

            <td>${paciente.turno}</td>

            <td>${paciente.observacion}</td>

            <td>

                <button
                    type="button"
                    class="editar"
                >
                    Editar
                </button>

                <button
                    type="button"
                    class="eliminar"
                >
                    Eliminar
                </button>

            </td>

        </tr>

    `;

}

form.reset();

}

form.addEventListener("submit", handleSubmit);

tbody.addEventListener("click", function(e) {

const fila = e.target.closest("tr");

if (e.target.classList.contains("eliminar")) {

    fila.remove();

    if (fila === pacienteEditando) {

        pacienteEditando = null;

        cancelar.style.display = "none";

        form.reset();

        form.querySelector("button[type='submit']").textContent =
            "Guardar paciente";
    }

}

if (e.target.classList.contains("editar")) {

    pacienteEditando = fila;

    form.nombre.value = fila.children[0].textContent;

    form.edad.value = fila.children[1].textContent;

    const sexo = fila.children[2].textContent;

    form.querySelectorAll('input[name="sexo"]').forEach(function(input) {

        input.checked = input.value === sexo;

    });

    form.medicamento.value = fila.children[3].textContent;

    const horarios = fila.children[4].textContent
        .split(", ")
        .filter(Boolean);

    form.querySelectorAll('input[name="horario"]').forEach(function(input) {

        input.checked = horarios.includes(input.value);

    });

    form.enfermera.value = fila.children[5].textContent;

    form.turno.value = fila.children[6].textContent;

    form.observacion.value = fila.children[7].textContent;

    cancelar.style.display = "block";

    form.querySelector("button[type='submit']").textContent =
        "Actualizar paciente";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

});

cancelar.addEventListener("click", function() {

pacienteEditando = null;

form.reset();

cancelar.style.display = "none";

form.querySelector("button[type='submit']").textContent =
    "Guardar paciente";

});