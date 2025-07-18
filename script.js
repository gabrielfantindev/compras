// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Configuração do seu app Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBGsIVXtwy1DuoWEwHnzD0Q8WMkoDCM5Mk",
  authDomain: "fantin-cb7c9.firebaseapp.com",
  projectId: "fantin-cb7c9",
  storageBucket: "fantin-cb7c9.firebasestorage.app",
  messagingSenderId: "769051157245",
  appId: "1:769051157245:web:a9293fce1c6b47d7b3d494"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const listaRef = collection(db, "compras");

// Elementos do DOM
const input = document.getElementById("novoItem");
const btn = document.getElementById("addBtn");
const list = document.querySelector(".list");
const done = document.getElementById("done");

// Adicionar item
btn.addEventListener("click", async () => {
  const valor = input.value.trim();
  if (valor !== "") {
    const docRef = await addDoc(listaRef, { nome: valor });
    renderItem(docRef.id, valor);
    input.value = "";
    input.focus();
  }
});

// Mostrar item na tela
function renderItem(id, nome) {
  const li = document.createElement("li");
  li.classList.add("item");
  li.innerHTML = `
    <input type="checkbox">
    <span>${nome}</span>
    <button class="delete" data-id="${id}">&#128465;</button>
  `;
  list.appendChild(li);
}

// Carregar itens ao abrir
async function carregarItens() {
  const snapshot = await getDocs(listaRef);
  snapshot.forEach(doc => {
    renderItem(doc.id, doc.data().nome);
  });
}
carregarItens();

// Deletar item individual
list.addEventListener("click", async (event) => {
  if (event.target.classList.contains("delete")) {
    const id = event.target.getAttribute("data-id");
    await deleteDoc(doc(db, "compras", id));
    event.target.closest("li").remove();
  }
});

// Limpar toda a lista
done.addEventListener("click", async () => {
  // Seleciona todos os li com checkbox marcado
  const checkedItems = list.querySelectorAll("li.item input[type='checkbox']:checked");
  for (const checkbox of checkedItems) {
    const li = checkbox.closest("li");
    const btnDelete = li.querySelector(".delete");
    const id = btnDelete.getAttribute("data-id");
    await deleteDoc(doc(db, "compras", id));
    li.remove();
  }
});
