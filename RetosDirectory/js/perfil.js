if( window.location.pathname.includes("perfil.html")) {
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
  const langScript = document.createElement("script");
    langScript.src = `conf/config${lang}.json`;

    langScript.onload = function () {
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
    }
    document.body.appendChild(langScript);

    const script = document.createElement('script');
    script.src = `${ci}/perfil.json`;
    script.onload = function () {
  
      document.title = perfil.nombre;
      const img = document.querySelector(".perfil-img");
      img.src = `${ci}/${ci}.jpg`;
      img.onerror = function () {
        this.onerror = null;
        this.src = `${ci}/${ci}.png`;
      };
      
      document.querySelector(".nombre").textContent = perfil.nombre;
      document.querySelector(".description").textContent = perfil.descripcion;
      
      const filas = document.querySelectorAll(".table tr");
        if (filas.length >= 5) {
        filas[0].children[1].textContent  = perfil.color;
        filas[1].children[1].textContent = perfil.libro;
        filas[2].children[1].textContent = perfil.musica;
        filas[3].children[1].textContent = perfil.video_juego;
        filas[4].children[1].innerHTML = perfil.lenguajes.map(l => `<strong>${l}</strong>`).join(', ');
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
  }
  };