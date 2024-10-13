import { app } from '../../../../firebaseconfig.js';
import { getFirestore, collection, onSnapshot, query, orderBy, limit, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const db = getFirestore(app);
const itemsCollectionRef = collection(db, "sorteos");

async function getAndDisplayItems() {
  const q = query(itemsCollectionRef, orderBy("fecha", "desc"), limit(10));
  const unsubscribe = onSnapshot(q, itemsCollectionRef, (querySnapshot) => {
    const tableBody = document.getElementById("itemsTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = ""; // Limpiar filas existentes

    const pendientes = [];
    const depositados = []; // Cambiado de 'entregados' a 'depositados'

    querySnapshot.forEach((doc) => {
      const itemData = doc.data();
      const timestampData = itemData.fecha;
      const seconds = timestampData.seconds;
      const nanoseconds = timestampData.nanoseconds;
      const date = new Date(seconds * 1000 + nanoseconds / 1000000);
      const formattedDate = moment(date).format('DD/MM/YYYY HH:mm');

      // Crear el objeto del item con los datos necesarios
      const itemRow = {
        nickAlbion: itemData.nickAlbion,
        item: itemData.item,
        estado: itemData.estado,
        fecha: formattedDate,
        docRef: doc.ref // Guardar la referencia del documento para la actualización
      };

      // Clasificar los items por estado
      if (itemData.estado === 'pendiente') {
        pendientes.push(itemRow); // Guardar los pendientes
      } else if (itemData.estado === 'Depositado') {
        depositados.push(itemRow); // Guardar los depositados
      }
    });

    // Primero agregar los pendientes al DOM
    pendientes.forEach(item => {
      insertarFilaEnTabla(item, tableBody);
    });

    // Luego agregar los depositados al DOM
    depositados.forEach(item => {
      insertarFilaEnTabla(item, tableBody);
    });
  });
}

// Función auxiliar para insertar una fila en la tabla
function insertarFilaEnTabla(itemData, tableBody) {
  const row = tableBody.insertRow();
  row.classList.add("added");

  // Crear celdas para los datos existentes
  const cell1 = row.insertCell(0);
  cell1.textContent = itemData.nickAlbion;
  const cell2 = row.insertCell(1);
  cell2.textContent = itemData.item;
  const cell3 = row.insertCell(2); // Insertar celda de "estado" antes de la fecha
  const cell4 = row.insertCell(3); // Actualizar índice de la celda de la fecha
  cell4.textContent = itemData.fecha;

  cell1.classList.add("col1");
  cell2.classList.add("col2");
  cell3.classList.add("col3");
  cell4.classList.add("col4");

  // Crear el elemento select para "estado"
  const selectEstado = document.createElement('select');
  const opcionPendiente = document.createElement('option');
  const opcionDepositado = document.createElement('option'); // Cambiado de 'entregado' a 'depositado'

  opcionPendiente.value = 'pendiente';
  opcionPendiente.textContent = 'Pendiente';
  opcionDepositado.value = 'Depositado'; // El valor sigue siendo 'entregado' para la base de datos
  opcionDepositado.textContent = 'Depositado'; // Cambiado el texto a 'Depositado'

  selectEstado.appendChild(opcionPendiente);
  selectEstado.appendChild(opcionDepositado);

  // Establecer el estado inicial del select según los datos
  selectEstado.value = itemData.estado;

  // Agregar el select a la celda de "estado"
  cell3.appendChild(selectEstado);

  // Cambiar el fondo de la fila si el estado es "depositado"
  if (itemData.estado === 'Depositado') {
    row.style.backgroundColor = '#3e8844'; // Color verde claro
  }

  // Manejar el evento de cambio de estado
  selectEstado.addEventListener('change', (event) => {
    const nuevoEstado = event.target.value;

    // Actualizar el estado en Firebase
    updateDoc(itemData.docRef, { estado: nuevoEstado })
      .then(() => {
        console.log("Estado actualizado correctamente");

        // Cambiar el fondo de la fila si el estado es "depositado"
        if (nuevoEstado === 'Depositado') {
          row.style.backgroundColor = '#3e8844'; // Color verde claro
        } else {
          row.style.backgroundColor = ''; // Resetear color si no es "depositado"
        }

        // Si el estado es "depositado", enviar los datos a MongoDB
        if (nuevoEstado === 'Depositado') {
          const fechaFormateada = moment().format('DD/MM/YYYY HH:mm'); // Usar Moment.js para formatear la fecha

          enviarDatosAMongo({
            userAlbion: itemData.nickAlbion,
            items: itemData.item,
            estado: nuevoEstado,
            cliente: "ViejoGG",
            fecha: fechaFormateada // Usar la fecha formateada
          });
        }
      })
      .catch(error => {
        console.error("Error al actualizar el estado:", error);
      });
  });
}

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');  // Muestra/oculta el menú
  hamburger.classList.toggle('toggle'); // Cambia el icono de hamburguesa
});

async function enviarDatosAMongo(data) {
  try {
    const response = await fetch('https://backendsorteos.vercel.app/api/users/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al enviar los datos a MongoDB');
    }

    console.log('Datos enviados correctamente a MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

getAndDisplayItems();
