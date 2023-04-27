import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { auth, db } from "./app/firebase.js";
import {
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

import "./app/authentication.js";
import "./app/postLists.js";
import "./app/firestore.js";
