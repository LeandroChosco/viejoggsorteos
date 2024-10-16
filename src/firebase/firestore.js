
import { getFirestore, addDoc, collection, onSnapshot, query, orderBy, limit, where } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { app } from './firebaseconfig.js';

const db = getFirestore(app);
const itemsCollectionRef = collection(db, "sorteos");

async function addUser(nickName, item) {
    try {
        const docRef = await addDoc(itemsCollectionRef, {
            nickAlbion: nickName,
            item: item,
            estado: "pendiente",
            fecha: new Date(),
        });
    } catch (e) {
        console.error("Error adding document: ", e);
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

export { addUser, getAndDisplayItems };
