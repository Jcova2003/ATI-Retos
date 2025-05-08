const params = new URLSearchParams(window.location.search);
const lang = params.get("lang");

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

  

    //perfil.html

 };
 document.body.appendChild(langscript);

};
 //dummies
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


