if (window.location.pathname.includes("perfil.html")) {
  window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const ci = params.get("ci");
    const lang = params.get("lang");

    if (!lang) {
      document.body.innerHTML = "<h2>Lenguaje no especificado en la URL.</h2>";
      return;
    }

    if (!ci) {
      document.body.innerHTML = "<h2>CI no especificada en la URL.</h2>";
      return;
    }

    const filas = document.querySelectorAll(".table tr");
    const descripcionEl = document.querySelector(".description");

    const langScript = document.createElement("script");
    langScript.src = `conf/config${lang}.json`;
    langScript.onload = function () {
      if (descripcionEl) descripcionEl.textContent = config.descripcion;

      if (filas.length >= 5) {
        const [fila1, fila2, fila3, fila4, fila5] = filas;
        fila1.children[0].textContent = config.color;
        fila2.children[0].textContent = config.libro;
        fila3.children[0].textContent = config.musica;
        fila4.children[0].textContent = config.video_juego;
        fila5.children[0].textContent = config.lenguajes;
      }
    };
    document.body.appendChild(langScript);

    const script = document.createElement("script");
    script.src = `${ci}/perfil.json`;
    script.onload = function () {
      document.title = perfil.nombre;

      const img = document.querySelector(".perfil-img");
      if (img) {
        img.src = `${ci}/${ci}.jpg`;
        img.onerror = function () {
          this.onerror = null;
          this.src = `${ci}/${ci}.png`;
        };
      }

      document.querySelector(".nombre").textContent = perfil.nombre;
      if (descripcionEl) descripcionEl.textContent = perfil.descripcion;

      if (filas.length >= 5) {
        const [fila1, fila2, fila3, fila4, fila5] = filas;
        fila1.children[1].textContent = perfil.color;
        fila2.children[1].textContent = perfil.libro;
        fila3.children[1].textContent = perfil.musica;
        fila4.children[1].textContent = perfil.video_juego;
        fila5.children[1].innerHTML = perfil.lenguajes
          .map(l => `<strong>${l}</strong>`)
          .join(", ");
      }

      const email = document.querySelector(".email-container");
      if (email) {
        email.innerHTML = config.email.replace(
          "[email]",
          `<a class="mail" href="mailto:${perfil.email}">${perfil.email}</a>`
        );
      }
    };

    script.onerror = function () {
      document.body.innerHTML = `<h2>No se encontró el perfil para la cédula: ${ci}</h2>`;
    };

    document.body.appendChild(script);
  };
}
