const form = document.querySelector(".form");
const tbody = document.querySelector("tbody");
const cancelar = document.querySelector(".cancelar");

const inicio = document.querySelector("#inicio");
const administracion = document.querySelector("#administracion");
const enfermeria = document.querySelector("#enfermeria");

let pacienteEditando = null;


// CAMBIAR DE ÁREA

btnAdministracion.onclick = () => {
    inicio.classList.add("oculto");
    administracion.classList.remove("oculto");
};

btnEnfermeria.onclick = () => {
    inicio.classList.add("oculto");
    enfermeria.classList.remove("oculto");
};

volverAdministracion.onclick = () => {
    administracion.classList.add("oculto");
    inicio.classList.remove("oculto");
};

volverEnfermeria.onclick = () => {
    enfermeria.classList.add("oculto");
    inicio.classList.remove("oculto");
};


// GUARDAR PACIENTE

form.addEventListener("submit", function(e) {

    e.preventDefault();

    const horarios = [...form.querySelectorAll(
        'input[name="horario"]:checked'
    )].map(x => x.value);

    const paciente = {
        nombre: form.nombre.value,
        edad: form.edad.value,
        habitacion: form.habitacion.value,
        sexo: form.sexo.value,
        medicamento: form.medicamento.value,
        horario: horarios.join(", "),
        enfermera: form.enfermera.value,
        turno: form.turno.value,
        observacion: form.observacion.value
    };

    const fila = `
        <td>${paciente.nombre}</td>
        <td>${paciente.edad}</td>
        <td>${paciente.habitacion}</td>
        <td>${paciente.sexo}</td>
        <td>${paciente.medicamento}</td>
        <td>${paciente.horario}</td>
        <td>${paciente.enfermera}</td>
        <td>${paciente.turno}</td>
        <td>${paciente.observacion}</td>

        <td>
            <button class="editar">Editar</button>
            <button class="eliminar">Eliminar</button>
        </td>
    `;

    if (pacienteEditando) {

        pacienteEditando.innerHTML = fila;
        pacienteEditando = null;

        cancelar.style.display = "none";

    } else {

        tbody.innerHTML += `<tr>${fila}</tr>`;

    }

    form.reset();

});


// EDITAR Y ELIMINAR

tbody.addEventListener("click", function(e) {

    const fila = e.target.closest("tr");

    if (e.target.classList.contains("eliminar")) {
        fila.remove();
    }

    if (e.target.classList.contains("editar")) {

        pacienteEditando = fila;

        form.nombre.value = fila.children[0].textContent;
        form.edad.value = fila.children[1].textContent;
        form.habitacion.value = fila.children[2].textContent;
        form.medicamento.value = fila.children[4].textContent;
        form.enfermera.value = fila.children[6].textContent;
        form.turno.value = fila.children[7].textContent;
        form.observacion.value = fila.children[8].textContent;

        form.querySelectorAll('input[name="sexo"]').forEach(x => {
            x.checked = x.value === fila.children[3].textContent;
        });

        const horarios = fila.children[5].textContent.split(", ");

        form.querySelectorAll('input[name="horario"]').forEach(x => {
            x.checked = horarios.includes(x.value);
        });

        cancelar.style.display = "block";

        form.querySelector("button[type='submit']").textContent =
            "Actualizar paciente";

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

});


// CANCELAR ACTUALIZACIÓN

cancelar.onclick = () => {

    pacienteEditando = null;

    form.reset();

    cancelar.style.display = "none";

    form.querySelector("button[type='submit']").textContent =
        "Guardar paciente";
};


// BUSCAR PACIENTE

btnBuscar.onclick = () => {

    const texto = buscarPaciente.value.toLowerCase();

    tbody.querySelectorAll("tr").forEach(fila => {

        fila.style.display =
            fila.children[0].textContent.toLowerCase().includes(texto)
                ? ""
                : "none";

    });

};

btnMostrarTodos.onclick = () => {

    tbody.querySelectorAll("tr").forEach(fila => {
        fila.style.display = "";
    });

    buscarPaciente.value = "";
};


// PACIENTES DE LA ENFERMERA

btnMisPacientes.onclick = () => {

    const nombre = nombreEnfermera.value.toLowerCase().trim();
    const turno = turnoEnfermera.value;

    tbody.querySelectorAll("tr").forEach(fila => {

        const enfermera = fila.children[5]
            .textContent.toLowerCase().trim();

        const turnoPaciente = fila.children[6].textContent;

        fila.style.display =
            enfermera === nombre && turnoPaciente === turno
                ? ""
                : "none";
    });

};