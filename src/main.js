const form = document.querySelector(".form");
const table = document.querySelector(".table");
const tbody = table.querySelector("tbody");

function handleSubmit(e) {
  e.preventDefault();

  const fname = form.fname;
  const lname = form.lname;
  const age = form.age;
  const gender = form.gender;
  const nationality = form.nationality;
  const hobbies = form.hobbies;

  // Nuevo
  const comments = form.comments;

  let myHobbies = [];

  for (let i = 0; i < hobbies.length; i++) {
    if (hobbies[i].checked) {
      myHobbies.push(hobbies[i].value);
    }
  }

  // La consigna que pidio
  const nombreObjeto = {
    campo_text1: fname.value,
    campo_text2: lname.value,
    campo_radio: gender.value,
    campo_checkbox: myHobbies,
    campo_select: nationality.value,
    campo_textarea: comments.value,
  };

  console.log(nombreObjeto);

  tbody.innerHTML += `
    <tr>
      <td>${fname.value}</td>
      <td>${lname.value}</td>
      <td>${age.value}</td>
      <td>${gender.value}</td>
      <td>${myHobbies.join(", ")}</td>
      <td>${nationality.value}</td>
    </tr>
  `;

  fname.value = "";
  lname.value = "";
  age.value = "";
  gender.value = "";
  nationality.value = "Dominicana";
  comments.value = "";

  for (let i = 0; i < hobbies.length; i++) {
    hobbies[i].checked = false;
  }

  hobbies[0].checked = false;
}

form.addEventListener("submit", handleSubmit);
