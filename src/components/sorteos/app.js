
import { cargarDatos } from './autocomplete.js';
import { agregarEventos } from './events.js';

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');


    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');  // Muestra/oculta el menú
        hamburger.classList.toggle('toggle'); // Cambia el icono de hamburguesa
    });

agregarEventos();

// Llama a la función para cargar los datos del JSON
cargarDatos("./monturas.json");
