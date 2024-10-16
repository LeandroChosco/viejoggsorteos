import { app } from '../../firebase/firebaseconfig.js';
import { getFirestore, collection, onSnapshot, query, orderBy, limit, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const db = getFirestore(app);
const itemsCollectionRef = collection(db, "sorteos");

async function getAndDisplayItems() {
  const q = query(itemsCollectionRef, orderBy("fecha", "desc"), limit(10));
  const unsubscribe = onSnapshot(q, itemsCollectionRef, (querySnapshot) => {
    const tableBody = document.getElementById("itemsTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";
    const pendientes = [];
    const depositados = [];

    querySnapshot.forEach((doc) => {
      const itemData = doc.data();
      const timestampData = itemData.fecha;
      const seconds = timestampData.seconds;
      const nanoseconds = timestampData.nanoseconds;
      const date = new Date(seconds * 1000 + nanoseconds / 1000000);
      const formattedDate = moment(date).format('DD/MM/YYYY HH:mm');

      const itemRow = {
        nickAlbion: itemData.nickAlbion,
        item: itemData.item,
        estado: itemData.estado,
        fecha: formattedDate,
        docRef: doc.ref
      };

      if (itemData.estado === 'pendiente') {
        pendientes.push(itemRow);
      } else if (itemData.estado === 'Depositado') {
        depositados.push(itemRow);
      }
    });

    pendientes.forEach(item => {
      insertarFilaEnTabla(item, tableBody);
    });

    depositados.forEach(item => {
      insertarFilaEnTabla(item, tableBody);
    });
  });
}

function insertarFilaEnTabla(itemData, tableBody) {
  const row = tableBody.insertRow();
  row.classList.add("added");

  const cell1 = row.insertCell(0);
  cell1.textContent = itemData.nickAlbion;
  const cell2 = row.insertCell(1);
  cell2.textContent = itemData.item;
  const cell3 = row.insertCell(2);
  const cell4 = row.insertCell(3);
  cell4.textContent = itemData.fecha;

  cell1.classList.add("col1");
  cell2.classList.add("col2");
  cell3.classList.add("col3");
  cell4.classList.add("col4");

  const selectEstado = document.createElement('select');
  const opcionPendiente = document.createElement('option');
  const opcionDepositado = document.createElement('option');

  opcionPendiente.value = 'pendiente';
  opcionPendiente.textContent = 'Pendiente';
  opcionDepositado.value = 'Depositado';
  opcionDepositado.textContent = 'Depositado';

  selectEstado.appendChild(opcionPendiente);
  selectEstado.appendChild(opcionDepositado);

  selectEstado.value = itemData.estado;

  cell3.appendChild(selectEstado);

  if (itemData.estado === 'Depositado') {
    row.style.backgroundColor = '#3e8844';
  }

  selectEstado.addEventListener('change', (event) => {
    const nuevoEstado = event.target.value;

    updateDoc(itemData.docRef, { estado: nuevoEstado })
      .then(() => {
        if (nuevoEstado === 'Depositado') {
          row.style.backgroundColor = '#3e8844';
        } else {
          row.style.backgroundColor = '';
        }

        if (nuevoEstado === 'Depositado') {
          const fechaFormateada = moment().format('DD/MM/YYYY HH:mm');

          enviarDatosAMongo({
            userAlbion: itemData.nickAlbion,
            items: itemData.item,
            estado: nuevoEstado,
            cliente: "ViejoGG",
            fecha: fechaFormateada,
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
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('toggle');
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
  } catch (error) {
    console.error('Error:', error);
  }
}

getAndDisplayItems();
