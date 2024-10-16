import { ManageAccount } from '../../firebase/firebaseconnect.js';

const lettersLeft = document.querySelectorAll(".lettersLeft");
const lettersBottom = document.querySelectorAll(".lettersBottom");
const letterRight = document.querySelectorAll(".lettersRight");

lettersLeft.forEach((letter, index) => {
  letter.style.animationDelay = `${index * 0.5}s`;
});

lettersBottom.forEach((letter, index) => {
  letter.style.animationDelay = `${index * 0.5}s`;
});

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