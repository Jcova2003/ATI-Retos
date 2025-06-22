# index.py
import os, json
from urllib.parse import parse_qs
from http import cookies
import mimetypes
import sys

BASE = os.path.dirname(os.path.abspath(__file__))

def application(environ, start_response):
    path = environ.get("PATH_INFO", "/")

    static_exts = (".js", ".css", ".png", ".jpg",".PNG", ".JPG", ".jpeg", ".svg",".json")
    if path.endswith(static_exts):
        file_path = os.path.join(BASE, path.lstrip("/"))
        try:
            with open(file_path, "rb") as f:
                content = f.read()
            content_type = mimetypes.guess_type(file_path)[0] or "application/octet-stream"
            start_response("200 OK", [("Content-Type", content_type)])
            return [content]
        except FileNotFoundError:
            start_response("404 Not Found", [("Content-Type", "text/plain")])
            return [b"Archivo no encontrado"]

    c = cookies.SimpleCookie(environ.get("HTTP_COOKIE", ""))
    params = parse_qs(environ.get("QUERY_STRING", ""))
    lang_url = params.get("lang", [None])[0]
    lang_cookie = c.get("lang")
    
    lang = lang_url or (lang_cookie.value if lang_cookie else "es")


    headers = [("Content-Type", "text/html; charset=utf-8")]
    if lang_url:
        new_cookie = cookies.SimpleCookie()
        new_cookie["lang"] = lang
        new_cookie["lang"]["path"] = "/"
        headers.append(("Set-Cookie", new_cookie.output(header="", sep="")))

    config_file = os.path.join(BASE, f"conf/config{lang.upper()}.json")

    try:
        with open(config_file, "r", encoding="utf-8") as f:
            config = json.load(f)
    except Exception as e:
        config = {"titulo": "Perfil", "contacto": "Contacto"}

    if path == "/" or path == "/index.html":
        with open(os.path.join(BASE, "index.html"), "r", encoding="utf-8") as f:
            html = f.read()
        headers = [("Content-Type", "text/html; charset=utf-8"),
                   ("Set-Cookie", f"lang={lang}; Path=/")]
        start_response("200 OK", headers)
        return [html.encode("utf-8")]

    if path == "/perfil":
        params = parse_qs(environ.get("QUERY_STRING", ""))
        id_estudiante = params.get("id", [None])[0]
        if not id_estudiante:
            start_response("400 Bad Request", [("Content-Type", "text/plain")])
            return [b"Falta el parametro id"]

        perfil_path = os.path.join(BASE, f"{id_estudiante}/perfil.json")
        try:
            with open(perfil_path, "r", encoding="utf-8") as f:
                datos = json.load(f)
        except FileNotFoundError:
            start_response("404 Not Found", [("Content-Type", "text/plain")])
            return [b"Perfil no encontrado"]

        foto_path = os.path.join(BASE, id_estudiante, f"{id_estudiante}.jpg")
        if not os.path.isfile(foto_path):
            foto_path = os.path.join(BASE, id_estudiante, f"{id_estudiante}.png")
            if not os.path.isfile(foto_path):
                # Si no existe ninguna imagen, usa una por defecto
                imagen = "default.jpg"
            else:
                imagen = f"{id_estudiante}.png"
        else:
            imagen = f"{id_estudiante}.jpg"
        
        email_html = config['email'].replace(
            "[email]",
            f'<a href="mailto:{datos["email"]}" class="mail" target="_blank">{datos["email"]}</a>'
        )

        html = f"""
         <div class="img-container">
          <img class="perfil-img"
                src="/{id_estudiante}/{imagen}" 
                alt="{datos['nombre']}" 
                width="200">
        </div>
        <div class="perfil-info">
          <h1 class="nombre">{datos['nombre']}</h1>
          <p class="description">{datos['descripcion']}</p>

          <table class="table">
            <tr>
              <td>{config['color']}</td>
              <td>{datos['color']}</td>
            </tr>

            <tr>
              <td>{config['libro']}</td>
              <td>{", ".join(datos['libro'])}</td>
            </tr>
            <tr>
              <td>{config['musica']}</td>
              <td>{", ".join(datos['musica'])}</td>
            </tr>
            <tr>
              <td>{config['video_juego']}</td>
              <td>{", ".join(datos['video_juego'])}</td>
            </tr>
            <tr>
            <td><strong>{config['lenguajes']}</strong></td>
            <td><strong>{", ".join(datos['lenguajes'])}</strong></td>
            </tr>
          </table>
          

          <p class="email-container">{email_html}</p>
        </div>
        """
        start_response("200 OK", [("Content-Type", "text/html; charset=utf-8")])
        return [html.encode("utf-8")]


    start_response("404 Not Found", [("Content-Type", "text/plain")])
    return [b"Pagina no encontrada"]
