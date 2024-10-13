import { app } from './firebaseconfig.js';
import { getFirestore, addDoc, collection, onSnapshot, query, orderBy, limit, where } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const db = getFirestore(app);

// Referencia al formulario
const form = document.getElementById("form");

// Escuchar el evento de envío del formulario
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Obtener valores de los campos
  const nickName = document.getElementById("nickAlbion").value.trim();
  const item = document.getElementById("valorSeleccionado").value;

  // Validar que ambos campos estén completos
  if (nickName === "" || item === "") {
    alert("Debes completar todos los campos correctamente.");
    return; // No continuar si los campos no son válidos
  }

  // Si todo está bien, proceder a agregar el usuario
  addUser(nickName, item);
});

// Colección en Firestore
const itemsCollectionRef = collection(db, "sorteos");

// Función para agregar el usuario
async function addUser(nickName, item) {
  try {
    const docRef = await addDoc(itemsCollectionRef, {
      nickAlbion: nickName,
      item: item,
      estado: "pendiente",
      fecha: new Date(),
    });
    console.log("Documento escrito con ID: ", docRef.id);
    alert("Ganador agregado con éxito");

    // Limpiar el formulario después de agregar el documento
    form.reset();  // Restablece todos los campos del formulario
    document.getElementById("valorSeleccionado").value = ""; // Asegúrate de limpiar el campo oculto también
  } catch (e) {
    console.error("Error al agregar el documento: ", e);
  }
}

// Función para obtener y mostrar los ítems en la tabla
async function getAndDisplayItems() {
  const q = query(itemsCollectionRef, where("estado", "==", "pendiente"), orderBy("fecha", "desc"), limit(10));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const tableBody = document
      .getElementById("itemsTable")
      .getElementsByTagName("tbody")[0];
    tableBody.innerHTML = ""; // Limpiar tabla antes de llenarla nuevamente

    querySnapshot.forEach((doc) => {
      const itemData = doc.data();
      const timestampData = itemData.fecha;
      const seconds = timestampData.seconds;
      const nanoseconds = timestampData.nanoseconds;
      const date = new Date(seconds * 1000 + nanoseconds / 1000000);
      const formattedDate = moment(date).format('DD/MM/YYYY HH:mm');

      // Crear fila en la tabla
      const row = tableBody.insertRow();
      row.classList.add("added");

      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      const cell4 = row.insertCell(3);

      cell1.textContent = itemData.nickAlbion;
      cell2.textContent = itemData.item;
      cell3.textContent = itemData.estado;
      cell4.textContent = formattedDate;

      cell1.classList.add("col1");
      cell2.classList.add("col2");
      cell3.classList.add("col3");
      cell4.classList.add("col4");
    });
  });
}

// Ejecutar la función para mostrar los ítems
getAndDisplayItems();
