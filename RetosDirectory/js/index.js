
document.addEventListener("DOMContentLoaded", () => {

  // document.querySelector(".nombre").textContent = config.nombre;
  const descripcion = document.querySelector(".description");
  if (descripcion) descripcion.textContent = config.descripcion;  

  const filas = document.querySelectorAll(".table tr");
  
  if (filas.length >= 5) {
  filas[0].children[0].textContent = config.color;
  filas[1].children[0].textContent = config.libro;
  filas[2].children[0].textContent = config.musica;
  filas[3].children[0].textContent = config.video_juego;
  filas[4].children[0].textContent = config.lenguajes;
  }

  const emailLink = document.querySelector(".email-container");
  if (emailLink) {
    emailLink.textContent = config.email;
    emailLink.href = `mailto:${config.email}`;
  }

  // Para index.html
  const pageName = document.querySelector(".page-name");
  if (pageName) {
    pageName.innerHTML = `${config.sitio[0]}<span>${config.sitio[1]}</span> ${config.sitio[2]}`;
  }

  const saludo = document.querySelector(".student-name");
    if (saludo) {
      saludo.textContent = `${config.saludo}, Jesús Cova`;
    }

  const searchInput = document.querySelector('input[name="query"]');
    if (searchInput) {
      searchInput.placeholder = config.nombre + "..."; // o config.buscar
    }

  const searchButton = document.querySelector('button[type="submit"]');
    if (searchButton) {
      searchButton.textContent = config.buscar;
    }

  const footer = document.querySelector("footer");
  if (footer) footer.textContent = config.copyRight;

  //dummies
  const contenedor = document.querySelector(".dummies-container");

  if (typeof perfiles !== "undefined" && contenedor) {
    perfiles.forEach(student => {
      const li = document.createElement("li");
      li.className = "dummie";

      const link = document.createElement("a");
      link.href = `perfil.html?ci=${student.ci}`;

      const img = document.createElement("img");
      img.src = `/RetosDirectory/${student.imagen}`;

      const h2 = document.createElement("h2");
      h2.textContent = student.nombre;

      li.appendChild(img);
      li.appendChild(h2);
      link.appendChild(li);
      contenedor.appendChild(link);
    });
  }

});
