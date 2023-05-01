import { auth } from "./firebase.js";
import {
  getStorage,
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-storage.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  addDoc,
  getDocs,
  collection,
  deleteDoc,
  Timestamp,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { logEvent } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-analytics.js";
import { db, storage } from "./firebase.js";
import { showMessage } from "./showMessage.js";
import { loginCheck } from "./authentication.js";
import { analytics } from "./firebase.js";

//DOM Elements
const userLoggedInName = document.querySelector("#user-loggedin");
const addForm = document.getElementById("addForm");
const fileImg = document.getElementById("uploadFile");
const itemContainer = document.getElementById("item-container");
const profilePicture = document.querySelector("#profile-pic");
const uploadFileBtn = document.querySelector("#uploadFile");
const loadingSpinner = document.querySelector("#loader");
const container1 = document.querySelector(".container1");

let uidNo;
let urlSrc;
let storageRef;
let fullPath;
let ref1;

// console.log(auth);

const canastaBasica = ["milk", "Milk", "water", "Water", "juice", "Juice"];
// Upload File

async function uploadFile(file) {
  const dateNow = new Date().toISOString();
  ref1 = dateNow + file.name;
  storageRef = ref(storage, `images/${ref1}`);
  const result = await uploadBytes(storageRef, file);
  fullPath = result.metadata.fullPath;
  const url = await getDownloadURL(storageRef);
  return url;
  // return [url, ref1];
}

loadingSpinner.style.display = "none";
//Create a new item in Firestore
addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const itemToAdd = addForm["itemToAdd"].value;
  const imageToAdd = addForm["uploadFile"].files[0];

  if (auth.currentUser == null) {
    showMessage("Please login first", "red");
    addForm.reset();

    return;
  }

  // console.log(imageToAdd);

  if (addForm["uploadFile"].files.length == 0) {
    console.log("no image added");
    urlSrc =
      "https://firebasestorage.googleapis.com/v0/b/probando0104.appspot.com/o/grocery.png?alt=media&token=666ddc06-b6ec-4c59-a14f-a2c707cbf0d0";
  } else {
    console.log("a file will be uploaded");
    const result = await uploadFile(imageToAdd);
    console.log(result);
    console.log("upload was successful");
    urlSrc = result;
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      uidNo = user.uid;

      // ...
    }
  });

  try {
    await addDoc(collection(db, "grocery", "items", uidNo), {
      item: itemToAdd,
      date: Timestamp.fromDate(new Date()),
      user: auth.currentUser.displayName || auth.currentUser.email,
      img: urlSrc,
      ref: ref1 || "default",
    });
    loadingSpinner.style.display = "block";

    if (canastaBasica.includes(itemToAdd)) {
      logEvent(analytics, "add_to_cart", itemToAdd);
      console.log("el item es liquido");
    }

    showMessage("Item added successfully", "green");
    loadingSpinner.style.display = "none";

    addForm.reset();
  } catch (error) {
    // showMessage("Something went wrong, try again", "red");
    // console.log(error.code, error.message);
    // showMessage("Error adding item", "red");
    // itemToAdd.value = "";
  }
  addForm.reset();
});

// Delete docs from FireStore
export const deleteItem = (id) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      uidNo = user.uid;
    }

    console.log(id);
  });

  deleteDoc(doc(db, "grocery", "items", uidNo, id));
};

// Delete object from storage
const deleteImage = async (refer) => {
  const objRef = ref(storage, `images/${refer}`);
  const result = await deleteObject(objRef);
  console.log(result);
};

// Listen to changes
export const onGetTasks = (callback) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      uidNo = user.uid;
      onSnapshot(collection(db, "grocery", "items", uidNo), callback);
    }
  });
};

onGetTasks((querySnapshot) => {
  itemContainer.innerHTML = "";
  // console.log(auth.currentUser);
  querySnapshot.forEach((doc) => {
    const item = doc.data();
    const itemWord = item.item;
    const firstLetterWord = itemWord.charAt(0).toUpperCase();
    const wordRest = itemWord.slice(1);
    const upperCasedWord = firstLetterWord + wordRest;
    // console.log(upperCasedWord);

    const options = {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    itemContainer.innerHTML += `
    <div class="card">
    <div class="card-image">
      <img src="${item.img} ">
    </div>
    <div class="card-text">
      
      <h2 class="card-title">${upperCasedWord}</h2>
      <p class="card-body"><b>Added by: </b> ${
        item.user || auth.currentUser.email
      }</p>
      <p class="card-body"><b> Date:</b> ${item.date
        .toDate()
        .toLocaleString("en-Us", options)}</p>
    </div>
    <div class="card-price btn-delete " data-id="${doc.id}">Delete</div>
  </div>
    `;
    addForm["itemToAdd"].value = "";
    addForm["uploadFile"].value = "";
  });

  const btnsDelete = itemContainer.querySelectorAll(".btn-delete");
  // console.log(btnsDelete);

  btnsDelete.forEach((btn) => {
    btn.addEventListener("click", async ({ target: { dataset } }) => {
      try {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            uidNo = user.uid;
          }
        });
        const docRef = doc(db, "grocery/items", uidNo, dataset.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const ref1 = docSnap.data().ref;
          deleteImage(ref1);
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }

        deleteItem(dataset.id);
        console.log("deleted item: " + dataset.id);

        showMessage("Item deleted successfully", "green");

        // await onGetTasks(collection, "grocery", "items", uidNo), () => {};
      } catch (error) {
        showMessage("Deletion went wrong, try again", "red");
        console.log(error.code, error.message);
      }
    });
  });
});

onAuthStateChanged(auth, async (user) => {
  loginCheck(user);
  if (user) {
    const userTodo = user;
    let uid = user.uid;
    const username = user.displayName;
    userLoggedInName.textContent = username;
    profilePicture.src = user.photoURL;

    // console.log(userTodo);

    // ...
  } else {
    console.log("user is not signed");
  }
});
