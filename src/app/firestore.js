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
import { db, storage } from "./firebase.js";
import { showMessage } from "./showMessage.js";
import { loginCheck } from "./authentication.js";

//DOM Elements
const userLoggedInName = document.querySelector("#user-loggedin");
const addForm = document.getElementById("addForm");
const fileImg = document.getElementById("uploadFile");
const itemContainer = document.getElementById("item-container");
const profilePicture = document.querySelector("#profile-pic");
const uploadFileBtn = document.querySelector("#uploadFile");
const loadingSpinner = document.querySelector("#loader");

let uidNo;
let urlSrc;
let storageRef;
let fullPath;

// Upload File
// const uploadFile = async (file) => {
//   const dateNow = new Date().toISOString();
//   const storageRef = ref(storage, `images/${dateNow}${file.name}`);
//   const result = await uploadBytes(storageRef, file);
//   console.log(`${file.name} was uploaded successfully`);
//   console.log(result);
//   const url = getDownloadURL(storageRef);
//   console.log(url);
//   return url;
// };

async function uploadFile(file) {
  const dateNow = new Date().toISOString();
  storageRef = ref(storage, `images/${dateNow}${file.name}`);
  const result = await uploadBytes(storageRef, file);
  fullPath = result.metadata.fullPath;
  const url = await getDownloadURL(storageRef);
  return url;
}

loadingSpinner.style.display = "none";
//Create a new item in Firestore
addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const itemToAdd = addForm["itemToAdd"].value;
  const imageToAdd = addForm["uploadFile"].files[0];

  loadingSpinner.style.display = "block";
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
    // console.log("urlSrc: " + urlSrc);
  }

  // console.log(urlSrc);

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
      user: auth.currentUser.displayName,
      img: urlSrc,
    });

    // await setDoc(doc(db, `items`, "abc", uidNo, itemToAdd), {
    //   item: itemToAdd.toString(),
    //   date: Timestamp.fromDate(new Date()),
    //   user: auth.currentUser.displayName,
    //   userId: uidNo,
    // });

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
  });
  deleteDoc(doc(db, "grocery", "items", uidNo, id));
};

// Delete object from storage
const deleteImage = async (id) => {
  const objRef = ref(storage, "images/chocolate.jpg");
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

// window.addEventListener("DOMContentLoaded", async () => {
//   onGetTasks((querySnapshot) => {
//     itemContainer.innerHTML = "";
//     querySnapshot.forEach((doc) => {
//       const item = doc.data();

//       itemContainer.innerHTML += `

//         <article>
//           <div class="article-wrapper">
//             <figure>
//               <img src="./../media/images/lake.jpg" alt="" />
//             </figure>
//             <div class="article-body">
//               <h1>${item.item}</h2>
//               <p>
//               Added by ${item.user}
//               </p>
//               <p>
//                ${item.date}
//               </p>
//               <button  class="btn btn-danger btn-delete" data-id="${doc.id}">Delete</button>
//             </div>
//           </div>
//         </article>

//         `;
//     });
//     const btnsDelete = itemContainer.querySelectorAll(".btn-delete");
//     // console.log(btnsDelete);

//     btnsDelete.forEach((btn) => {
//       btn.addEventListener("click", async ({ target: { dataset } }) => {
//         try {
//           deleteItem(dataset.id);
//           console.log("deleted item: " + dataset.id);

//           showMessage("Item deleted successfully", "green");

//           onAuthStateChanged(auth, (user) => {
//             if (user) {
//               uidNo = user.uid;
//             }
//           });

//           await onGetTasks(collection, "grocery", "items", uidNo), () => {};
//         } catch (error) {
//           showMessage("Deletion went wrong, try again", "red");
//           console.log(error.code, error.message);
//         }
//       });
//     });
//   });
// });
onGetTasks((querySnapshot) => {
  itemContainer.innerHTML = "";
  // console.log(auth.currentUser);
  querySnapshot.forEach((doc) => {
    const item = doc.data();

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

      <article>
        <div class="article-wrapper">
          <figure>
            <img src="${item.img} " alt="" />
          </figure>
          <div class="article-body">
            <h3>${item.item}</h3>
            <p>
            <strong>Added by:</strong> ${item.user || auth.currentUser.email}
            </p>
    
            <p>
             <strong>Date:</strong> ${item.date
               .toDate()
               .toLocaleString("en-US", options)}
            </p>
     
            <button  class="btn btn-danger btn-delete" data-id="${
              doc.id
            }">Delete</button>
          </div>
        </div>
      </article>


      `;
    addForm["itemToAdd"].value = "";
    addForm["uploadFile"].value = "";
  });

  const btnsDelete = itemContainer.querySelectorAll(".btn-delete");
  // console.log(btnsDelete);

  btnsDelete.forEach((btn) => {
    btn.addEventListener("click", async ({ target: { dataset } }) => {
      try {
        console.log("deleted item: " + dataset.id);
        deleteItem(dataset.id);

        showMessage("Item deleted successfully", "green");

        onAuthStateChanged(auth, (user) => {
          if (user) {
            uidNo = user.uid;
          }
        });

        await onGetTasks(collection, "grocery", "items", uidNo), () => {};
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

// export const setupItems = (data) => {
//   if (data.length) {
//     let html = "";
//     data.forEach((doc) => {
//       const item = doc.data();
//       const li = `
//       <section class="articles">
//       <article>
//         <div class="article-wrapper">
//           <figure>
//             <img src="" alt="" />
//           </figure>
//           <div class="article-body">
//             <h1>${item.item}</h2>

//             <p>
//             Added by ${item.user}
//             </p>
//             <p>
//              ${item.date.toDate()}
//             </p>
//             <button type="button" class="btn btn-danger btn-delete" data-id="${
//               doc.id
//             }">Delete</button>

//           </div>
//         </div>
//       </article>

//     </section>
//       `;

//       html += li;
//     });
//     itemContainer.innerHTML = html;

//     const btnsDelete = itemContainer.querySelectorAll(".btn-delete");

//     btnsDelete.forEach((btn) => {
//       btn.addEventListener("click", async ({ target: { dataset } }) => {
//         try {
//           console.log("deleted item: " + dataset.id);
//           deleteItem(dataset.id);
//           // location.reload();
//           showMessage("Item deleted successfully", "green");
//           // window.location.reload();
//           // return false;
//           await onGetTasks(collection, "items"), () => {};
//         } catch (error) {
//           showMessage("Deletion went wrong, try again", "red");
//           console.log(error.code, error.message);
//         }
//       });
//     });
//   } else {
//     itemContainer.innerHTML = "<h1>Add your first item</h1>";
//   }
// };
