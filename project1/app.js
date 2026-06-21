//////////////////////
// PAGE SYSTEM
//////////////////////
function show(page){
  document.querySelectorAll(".page").forEach(p=>{
    p.classList.remove("active");
  });

  const el = document.getElementById(page);
  if(el) el.classList.add("active");
}


// ======================
// FIREBASE CONFIG
// ======================
const firebaseConfig = {
  apiKey: "AIzaSyCwj3Zsrl5DUGi2reqNjujEgSVjHX7rQX0",
  authDomain: "codercs-6c856.firebaseapp.com",
  projectId: "codercs-6c856",
  storageBucket: "codercs-6c856.firebasestorage.app",
  messagingSenderId: "791237431838",
  appId: "1:791237431838:web:de18731778c00bc9bdd40f",
  measurementId: "G-B34E2CFE0G"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


// ======================
// KIRIM PESAN USER
// ======================
function sendMessage(){
  const name = document.getElementById("name");
  const msg = document.getElementById("message");

  if(!msg.value) return;

  db.collection("chats").add({
    name: name.value || "Anonim",
    msg: msg.value,
    reply: "",
    time: Date.now()
  });

  msg.value = "";
  name.value = "";
}


// ======================
// REALTIME CHAT USER
// ======================
db.collection("chats")
.orderBy("time")
.onSnapshot(snapshot=>{
  const box = document.getElementById("chat-box");
  if(!box) return;

  box.innerHTML = "";

  snapshot.forEach(doc=>{
    const d = doc.data();

    const div = document.createElement("div");

    div.innerHTML = `
      <b>${d.name}:</b> ${d.msg}
      ${d.reply ? `<br><span style="color:lime">OWNER: ${d.reply}</span>` : ""}
      <hr>
    `;

    box.appendChild(div);
  });
});


// ======================
// LOGIN OWNER
// ======================
function loginOwner(){
  const u = document.getElementById("user");
  const p = document.getElementById("pass");

  if(u.value === "rexx" && p.value === "adminanj12"){
    show("owner");
    loadInbox();
  } else {
    alert("Login salah");
  }
}


// ======================
// OWNER INBOX
// ======================
function loadInbox(){
  const inbox = document.getElementById("inbox");
  if(!inbox) return;

  inbox.innerHTML = "";

  db.collection("chats")
  .orderBy("time")
  .get()
  .then(snapshot=>{
    snapshot.forEach(doc=>{
      const d = doc.data();

      const div = document.createElement("div");

      div.innerHTML = `
        <b>${d.name}</b><br>
        ${d.msg}
        <br><br>
        <input id="r_${doc.id}" placeholder="balas...">
        <button onclick="replyTo('${doc.id}')">Reply</button>
        <hr>
      `;

      inbox.appendChild(div);
    });
  });
}


// ======================
// OWNER REPLY
// ======================
function replyTo(id){
  const input = document.getElementById("r_" + id);
  if(!input || !input.value) return;

  db.collection("chats").doc(id).update({
    reply: input.value
  });

  input.value = "";
}


// ======================
// CLOCK + QUOTE + MUSIC (ADDED)
// ======================

// CLOCK
function updateClock(){
  const el = document.getElementById("clock");
  if(!el) return;

  el.innerText = "🕒 " + new Date().toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();


// QUOTE
const quotes = [
  "iam menyusun logika bergerak eror semua",
  "jangan jadi buaya kalo tidak ada biaya",
  "semua orang punya suara tapi uang sebagai volumenya",
  "perbanyak uang mu maka su buta akan melihat si bisu akan menyapa",
  "UDAH SEDIAM INI MASIH AJA GAK SELAMAT DARI CERITA ORANG",
  "",
  ""
];

function randomQuote(){
  const el = document.getElementById("quote");
  if(!el) return;

  el.innerText = "💬 " + quotes[Math.floor(Math.random()*quotes.length)];
}
setInterval(randomQuote, 4000);
randomQuote();


// MUSIC
let music = null;

function initMusic(){
  music = document.getElementById("bgm");
}

function toggleMusic(){
  if(!music) initMusic();
  if(!music) return;

  if(music.paused){
    music.play();
  } else {
    music.pause();
  }
}

window.addEventListener("load", initMusic);
window.addEventListener("load", () => {
  const music = document.getElementById("bgm");
  if (!music) return;

  music.volume = 0.5; // optional biar gak terlalu keras

  const playPromise = music.play();

  if (playPromise !== undefined) {
    playPromise.catch(() => {
      console.log("Autoplay diblok browser, nunggu klik user");
      
      // fallback: aktifkan setelah user klik sekali
      document.body.addEventListener("click", () => {
        music.play();
      }, { once: true });
    });
  }
})