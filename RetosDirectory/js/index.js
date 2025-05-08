const params = new URLSearchParams(window.location.search);
const lang = params.get("lang");

document.addEventListener("DOMContentLoaded", function () {
  const contenedor = document.querySelector(".dummies-container");

  if (typeof perfiles !== "undefined" && contenedor) {
    perfiles.forEach(student => {
      const li = document.createElement("li");
      li.className = "dummie";

      const link = document.createElement("a");
      link.href = `perfil.html?ci=${student.ci}&lang=${lang}`;

      const img = document.createElement("img");
      img.src = `${student.imagen}`;

      const h2 = document.createElement("h2");
      h2.textContent = student.nombre;

      li.appendChild(img);
      li.appendChild(h2);
      link.appendChild(li);
      contenedor.appendChild(link);
    });
  }

});


window.onload = function () {
  if (!lang) {
      document.body.innerHTML = "<h2>Lenguaje no especificada en la URL.</h2>";
      return;
  }

  const langscript = document.createElement('script');
  langscript.src = `conf/config${lang}.json`;
  
  langscript.onload = function () {
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
          est.parentElement.style.display = "block";
          encontrados++;
        } else {
          est.parentElement.style.display = "none";
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

    if (queryParam) {
      input.value = queryParam;
      aplicarFiltro(queryParam.toLowerCase());
    }
  };    

 document.body.appendChild(langscript);
};
