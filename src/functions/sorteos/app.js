
import { cargarDatos } from './autocomplete.js';
import { agregarEventos } from './events.js';

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');


    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('toggle');
    });

agregarEventos();

cargarDatos("https://backendsorteos.vercel.app/api/users/items");
