const params = new URLSearchParams(window.location.search);
const langParam = params.get("lang");

function getCookie(name) {
  const cookies = document.cookie.split(";").map(c => c.trim());
  for (let cookie of cookies) {
    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

const lang = langParam || getCookie("lang") || "ES";

function cargarPerfil(id) {
   history.pushState({ id }, null, `?ci=${id}`);
  fetch(`/perfil?id=${id}`)
    .then(res => res.text())
    .then(html => {
      document.querySelector(".listado").style.display = "none";
      const cont = document.querySelector(".perfil-container");
      cont.innerHTML = html;
      cont.style.display = "flex";
    });
}

window.addEventListener("popstate", (event) => {
  const params = new URLSearchParams(window.location.search);
  const ci = params.get("ci");

  if (ci) {
    cargarPerfil(ci);
  } else {
    document.querySelector(".perfil-container").style.display = "none";
    document.querySelector(".listado").style.display = "block";
  }
});


document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const ci = params.get("ci");

  if (ci) {
    cargarPerfil(ci);
  }
  const contenedor = document.querySelector(".dummies-container");

  if (typeof perfiles !== "undefined" && contenedor) {
    perfiles.forEach(student => {
      const card = document.createElement("li");
      card.className = "dummie";
      card.setAttribute("data-id", student.ci);

      const img = document.createElement("img");
      img.src = student.imagen;

      const h2 = document.createElement("h2");
      h2.textContent = student.nombre;

      card.appendChild(img);
      card.appendChild(h2);

      card.addEventListener("click", () => {
        cargarPerfil(student.ci);
      });

      contenedor.appendChild(card);
    });

  }

});


window.onload = function () {

  
  const langscript = document.createElement('script');
  langscript.src = `conf/config${lang}.json`;
  
  fetch(`conf/config${lang}.json`)
  .then(res => res.json())
  .then(config => {
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
      searchInput.placeholder = config.nombre + "..."; 
    }

    const searchButton = document.querySelector('button[type="submit"]');
    if (searchButton) {
      searchButton.textContent = config.buscar;
    }

    const footer = document.querySelector("footer");
    if (footer) footer.textContent = config.copyRight;

    const form = document.querySelector(".search");
    const mensaje = document.getElementById("mensaje-no-encontrado");
    const input = form.querySelector('input[name="query"]');

    function normalizar(texto) {
      return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    function aplicarFiltro(query) {
      const estudiantes = document.querySelectorAll(".dummies-container .dummie");
      const textoBuscado = normalizar(query);
      let encontrados = 0;

      estudiantes.forEach(est => {
        const nombre = est.querySelector("h2").textContent;
        const nombreNormalizado = normalizar(nombre);

        if (nombreNormalizado.includes(textoBuscado)) {
          est.style.display = "flex";
          encontrados++;
        } else {
          est.style.display = "none";
        }
      });

      if (encontrados === 0 && query !== "") {
        mensaje.textContent = config.noStudentsFound.replace("[query]", query);
        mensaje.style.display = "block";
      } else {
        mensaje.style.display = "none";
      }
    }

    input.addEventListener("input", function () {
      const valor = input.value.trim().toLowerCase();
      aplicarFiltro(valor);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const query = input.value.trim().toLowerCase();
      aplicarFiltro(query);
    });



  })
  .catch(error => {
    console.error("Error cargando el archivo de idioma:", error);
  });
};
