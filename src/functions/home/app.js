
import { addUser, getAndDisplayItems } from '../../firebase/firestore.js';

const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nickName = document.getElementById("nickAlbion").value;
    const item = document.getElementById("valorSeleccionado").value;
    addUser(nickName, item);
});

getAndDisplayItems();