import {
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { auth } from "./firebase.js";
import { showMessage } from "./showMessage.js";

//DOM Elements
const signupForm = document.querySelector("#signup-form");
const signupModal = document.querySelector("#signupModal");
const loginModal = document.querySelector("#signinModal");
const logout = document.querySelector("#logout");
const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");
const signInForm = document.querySelector("#login-form");
const googleButton = document.querySelector("#googleLogin");
const facebookButton = document.querySelector("#facebookLogin");
const profilePicture = document.querySelector("#profile-pic");
const userLoggedInName = document.querySelector("#user-loggedin");
const itemContainer = document.querySelector("#item-container");

let credentials = "";

//Register form (CreateUserWithEmailAndPassword)
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;

  try {
    credentials = await createUserWithEmailAndPassword(auth, email, password);
    signupForm["signup-email"].value = "";
    signupForm["signup-password"].value = "";

    const modal = bootstrap.Modal.getInstance(signupModal);
    modal.hide();
    userLoggedInName.textContent = credentials.user.email;
    profilePicture.src =
      "https://www.pngitem.com/pimgs/m/524-5246388_anonymous-user-hd-png-download.png";

    showMessage("Account created successfully", "green");
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      showMessage("Email already in use", "red");
    } else if (error.code === "auth/invalid-email") {
      showMessage("Invalid email", "red");
    } else {
      showMessage("Something went wrong", "red");
    }
  }
});

//Logout  (signOut)
logout.addEventListener("click", async (user) => {
  if (user) {
    await signOut(auth);
    console.log("user signed out");
    showMessage("User signed out correctly", "green");

    profilePicture.src = "";
    userLoggedInName.textContent = "";
    itemContainer.innerHTML = "";
    // location.reload();
  } else {
  }
});

// Login form (signInWithEmailAndPassword)
signInForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = signInForm["login-email"].value;
  const password = signInForm["login-password"].value;

  try {
    credentials = await signInWithEmailAndPassword(auth, email, password);
    console.log(credentials);
    signInForm["login-email"].value = "";
    signInForm["login-password"].value = "";
    const modal = bootstrap.Modal.getInstance(loginModal);
    modal.hide();
    showMessage(`Welcome ${credentials.user.email}`, "green");
    userLoggedInName.textContent = credentials.user.email;
    profilePicture.src =
      "https://www.pngitem.com/pimgs/m/524-5246388_anonymous-user-hd-png-download.png";
  } catch (error) {
    showMessage("Sign in failed, please check credentials", "red");

    signInForm["login-password"].value = "";
  }
});

// Login with Google ()
googleButton.addEventListener("click", async function () {
  console.log("clicked google button");
  const provider = new GoogleAuthProvider();

  try {
    credentials = await signInWithPopup(auth, provider);

    showMessage(`Welcome ${credentials.user.displayName}`, "green");
    const modal = bootstrap.Modal.getInstance(loginModal);
    modal.hide();

    profilePicture.src =
      (await credentials.user.photoURL) ||
      "https://www.pngitem.com/pimgs/m/524-5246388_anonymous-user-hd-png-download.png";
    userLoggedInName.textContent = credentials.user.displayName;
  } catch (error) {
    showMessage("Something went wrong, try again", "red");
    console.log(error.code, error.message);
  }
});

// Login with Facebook ()
facebookButton.addEventListener("click", async function () {
  console.log("clicked facebook button");
  const provider = new FacebookAuthProvider();

  try {
    credentials = await signInWithPopup(auth, provider);
    console.log(credentials);
    showMessage(`Welcome ${credentials.user.displayName}`, "green");
    const modal = bootstrap.Modal.getInstance(loginModal);
    modal.hide();
    profilePicture.src =
      credentials.user.photoURL ||
      "https://www.pngitem.com/pimgs/m/524-5246388_anonymous-user-hd-png-download.png";
    userLoggedInName.textContent = credentials.user.displayName;
  } catch (error) {
    showMessage("Something went wrong, try again", "red");
  }
});

//Login Check
export const loginCheck = (user) => {
  if (user) {
    loggedOutLinks.forEach((link) => {
      link.style.display = "none";
    });
    loggedInLinks.forEach((link) => {
      link.style.display = "block";
    });
  } else {
    loggedOutLinks.forEach((link) => {
      link.style.display = "block";
    });
    loggedInLinks.forEach((link) => {
      link.style.display = "none";
    });
  }
};
