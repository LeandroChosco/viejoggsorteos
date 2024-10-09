
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDCM-ollge12Rr-Z5DIq1XpKh_ftqKdgFs",
    authDomain: "gestorsorteoviejo.firebaseapp.com",
    projectId: "gestorsorteoviejo",
    storageBucket: "gestorsorteoviejo.appspot.com",
    messagingSenderId: "998069683631",
    appId: "1:998069683631:web:0efe519585b3ded4e35b5a",
    measurementId: "G-29D104F6W8",
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, analytics, auth, storage };
