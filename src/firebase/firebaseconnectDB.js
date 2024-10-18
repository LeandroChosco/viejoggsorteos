import { app } from './firebaseconfig.js';
import { getFirestore, addDoc, collection, onSnapshot, query, orderBy, limit, where, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const db = getFirestore(app);

const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nickName = document.getElementById("nickAlbion").value.trim();
  const item = document.getElementById("valorSeleccionado").value;

  if (nickName === "" || item === "") {
    alert("Debes completar todos los campos correctamente.");
    return;
  }

  addUser(nickName, item);
});

const itemsCollectionRef = collection(db, "sorteos");

async function addUser(nickName, item) {
  try {
    const docRef = await addDoc(itemsCollectionRef, {
      nickAlbion: nickName,
      item: item,
      estado: "pendiente",
      fecha: new Date(),
    });
    alert("Ganador agregado con éxito");

    form.reset();
    document.getElementById("valorSeleccionado").value = "";
  } catch (e) {
    console.error("Error al agregar el documento: ", e);
  }
}


function getAndDisplayItems() {
  const q = query(itemsCollectionRef, where("estado", "==", "pendiente"), orderBy("fecha", "desc"), limit(10));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tableBody = document.getElementById("itemsTable").getElementsByTagName("tbody")[0];
      tableBody.innerHTML = "";
      querySnapshot.forEach((doc) => {
          const itemData = doc.data();
          const timestampData = itemData.fecha;
          const seconds = timestampData.seconds;
          const nanoseconds = timestampData.nanoseconds;
          const date = new Date(seconds * 1000 + nanoseconds / 1000000);
          const formattedDate = moment(date).format('DD/MM/YYYY HH:mm');
          const row = tableBody.insertRow();
          row.classList.add("added");
          
          const cell1 = row.insertCell(0);
          const cell2 = row.insertCell(1);
          const cell3 = row.insertCell(2);
          const cell4 = row.insertCell(3);
          const cell5 = row.insertCell(4); 

          cell1.textContent = itemData.nickAlbion;
          cell2.textContent = itemData.item;
          cell3.textContent = itemData.estado;
          cell4.textContent = formattedDate;
          
          
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Eliminar";
          deleteButton.classList.add("delete-button");
          cell5.appendChild(deleteButton);

        
          deleteButton.addEventListener("click", () => {
              showDeleteModal(doc.id); 
          });
      });
  });
}


function showDeleteModal(docId) {
  const modal = document.getElementById('confirmDeleteModal');
  modal.style.display = 'flex'; // 

 
  document.getElementById('cancelDeleteButton').onclick = () => {
      modal.style.display = 'none'; 
  };

  
  document.getElementById('confirmDeleteButton').onclick = () => {
      deleteItem(docId); 
      modal.style.display = 'none'; 
  };
}


function deleteItem(docId) {
  const itemDocRef = doc(itemsCollectionRef, docId);
  deleteDoc(itemDocRef).then(() => {
      console.log("Documento eliminado con éxito");
  }).catch((error) => {
      console.error("Error al eliminar el documento: ", error);
  });
}



getAndDisplayItems();
