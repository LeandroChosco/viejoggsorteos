function mostrarMensaje() {
  alert("Ganador agregado con éxito");
}

let btn = document.querySelector(".buttonAdd");
btn.addEventListener("mousemove", (event) => {
  let rect = btn.getBoundingClientRect();
  let x = event.clientX - rect.left;
  btn.style.setProperty("--x", x + "deg");
});

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const buscador = document.getElementById("buscador");
const sugerencias = document.getElementById("sugerencias");
const valorSeleccionado = document.getElementById("valorSeleccionado");

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');  // Muestra/oculta el menú
  hamburger.classList.toggle('toggle'); // Cambia el icono de hamburguesa
});

function cargarDatos(url) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error al cargar los datos');
      }
      return response.json();
    })
    .then((data) => {
      datosItems = data; // Guardar los datos recibidos
      inicializarAutocompletado(datosItems); // Usar los datos recibidos
    })
    .catch((error) => {
      console.error('Hubo un problema con la petición fetch:', error);
    });
}

function inicializarAutocompletado(datosItems) {
  buscador.addEventListener("input", (event) => {
    const valorBuscado = event.target.value.toLowerCase();
    sugerencias.innerHTML = "";
    valorSeleccionado.value = ""; // Limpiar valor oculto cuando el usuario escribe

    const resultados = datosItems.filter((item) =>
      item.texto.toLowerCase().includes(valorBuscado)
    );

    resultados.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item.texto;
      li.addEventListener("click", () => {
        buscador.value = item.texto;
        valorSeleccionado.value = item.valor; // Asignar el valor seleccionado
        sugerencias.innerHTML = "";
        sugerencias.style.display = "none";
        document.removeEventListener("click", handleClickOutside);
      });
      sugerencias.appendChild(li);
    });

    sugerencias.style.display = "block";

    document.addEventListener("click", handleClickOutside);
  });

  function handleClickOutside(event) {
    if (!event.target.closest("#sugerencias")) {
      sugerencias.style.display = "none";
      document.removeEventListener("click", handleClickOutside);
    }
  }

  // Validación en el submit del formulario
  const form = document.getElementById("form");
  form.addEventListener("submit", (event) => {
    const buscadorValor = buscador.value.trim(); // Eliminar espacios en blanco

  });
}

// Llama a la función para cargar los datos del JSON
cargarDatos("https://backendsorteos.vercel.app/api/users/items");
