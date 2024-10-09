
import { addUser, getAndDisplayItems } from './firestore.js';

const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nickName = document.getElementById("nickAlbion").value;
    const item = document.getElementById("valorSeleccionado").value;
    console.log(nickName);
    addUser(nickName, item);
});

getAndDisplayItems();
