import { ManageAccount } from '../../firebase/firebaseconnect.js';

const letters = document.querySelectorAll(".lettersLeft");

letters.forEach((letter, index) => {
  letter.style.animationDelay = `${index * 0.5}s`;
});
const lettersbottom = document.querySelectorAll(".lettersBottom");
lettersbottom.forEach((letter, index) => {
  letter.style.animationDelay = `${index * 0.5}s`;
});

const letterRight = document.querySelectorAll(".lettersRight");
letterRight.forEach((letter, index) => {
  letter.style.animationDelay = `${index * 0.5}s`;
});
document.getElementById("login").addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const account = new ManageAccount();
  account.authenticate(email, password);
  
});