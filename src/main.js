const form = document.querySelector(".form");
const table = document.querySelector(".table");
const tbody = table.querySelector("tbody");
const cancelar = document.querySelector(".cancelar");

const buscarPaciente = document.querySelector("#buscarPaciente");
const btnBuscar = document.querySelector("#btnBuscar");
const btnMostrarTodos = document.querySelector("#btnMostrarTodos");

const nombreEnfermera = document.querySelector("#nombreEnfermera");
const turnoEnfermera = document.querySelector("#turnoEnfermera");
const btnMisPacientes = document.querySelector("#btnMisPacientes");

let pacienteEditando = null;

function handleSubmit(e){

    e.preventDefault();

    const horarios = [...form.querySelectorAll(
        'input[name="horario"]:checked'
    )].map(input => input.value);

    const paciente = {
        nombre: form.nombre.value,
        edad: form.edad.value,
        sexo: form.sexo.value,
        medicamento: form.medicamento.value,
        horario: horarios,
        enfermera: form.enfermera.value,
        turno: form.turno.value,
        observacion: form.observacion.value
    };

    const fila = `
        <td>${paciente.nombre}</td>
        <td>${paciente.edad}</td>
        <td>${paciente.sexo}</td>
        <td>${paciente.medicamento}</td>
        <td>${paciente.horario.join(", ")}</td>
        <td>${paciente.enfermera}</td>
        <td>${paciente.turno}</td>
        <td>${paciente.observacion}</td>

        <td>
            <button type="button" class="editar">Editar</button>
            <button type="button" class="eliminar">Eliminar</button>
        </td>
    `;

    if(pacienteEditando){
        pacienteEditando.innerHTML = fila;
        pacienteEditando = null;
        cancelar.style.display = "none";
    }else{
        tbody.innerHTML += `<tr>${fila}</tr>`;
    }

    form.reset();

    form.querySelector("button[type='submit']").textContent =
        "Guardar paciente";
}

form.addEventListener("submit", handleSubmit);

tbody.addEventListener("click", function(e){

    const fila = e.target.closest("tr");

    if(e.target.classList.contains("eliminar")){
        fila.remove();
    }

    if(e.target.classList.contains("editar")){

        pacienteEditando = fila;

        form.nombre.value = fila.children[0].textContent;
        form.edad.value = fila.children[1].textContent;
        form.medicamento.value = fila.children[3].textContent;
        form.enfermera.value = fila.children[5].textContent;
        form.turno.value = fila.children[6].textContent;
        form.observacion.value = fila.children[7].textContent;

        form.querySelectorAll('input[name="sexo"]').forEach(input => {
            input.checked = input.value === fila.children[2].textContent;
        });

        const horarios = fila.children[4].textContent.split(", ");

        form.querySelectorAll('input[name="horario"]').forEach(input => {
            input.checked = horarios.includes(input.value);
        });

        cancelar.style.display = "block";

        form.querySelector("button[type='submit']").textContent =
            "Actualizar paciente";
    }
});

cancelar.addEventListener("click", function(){

    pacienteEditando = null;
    form.reset();
    cancelar.style.display = "none";

    form.querySelector("button[type='submit']").textContent =
        "Guardar paciente";
});

function buscarPacientes(){

    const nombre = buscarPaciente.value.toLowerCase().trim();

    tbody.querySelectorAll("tr").forEach(fila => {

        const paciente = fila.children[0].textContent.toLowerCase();

        fila.style.display = paciente.includes(nombre) ? "" : "none";
    });
}

btnBuscar.addEventListener("click", buscarPacientes);
buscarPaciente.addEventListener("input", buscarPacientes);

btnMostrarTodos.addEventListener("click", function(){

    buscarPaciente.value = "";

    tbody.querySelectorAll("tr").forEach(fila => {
        fila.style.display = "";
    });
});

btnMisPacientes.addEventListener("click", function(){

    const enfermera = nombreEnfermera.value.toLowerCase().trim();
    const turno = turnoEnfermera.value;

    tbody.querySelectorAll("tr").forEach(fila => {

        const nombre = fila.children[5].textContent
            .toLowerCase()
            .trim();

        const turnoPaciente = fila.children[6].textContent;

        fila.style.display =
            nombre === enfermera && turnoPaciente === turno
            ? ""
            : "none";
    });
});