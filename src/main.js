
import { initializeApp } from
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

import { courseData } from "./course-data.js";

const $ = id => document.getElementById(id);

const firebaseConfig = {
  apiKey: "PEGA_AQUI_TU_API_KEY",
  authDomain: "PEGA_AQUI_TU_PROYECTO.firebaseapp.com",
  projectId: "PEGA_AQUI_TU_PROYECTO",
  storageBucket: "PEGA_AQUI_TU_PROYECTO.appspot.com",
  messagingSenderId: "PEGA_AQUI_TU_SENDER_ID",
  appId: "PEGA_AQUI_TU_APP_ID"
};

const configured =
  !Object.values(firebaseConfig).some(value => value.includes("PEGA_AQUI"));

let auth = null;
let db = null;
let currentUser = null;
let progress = { completed: [] };
let selectedLevel = "B1";
let selectedUnit = 0;
let authMode = "login";

function showView(id) {
  ["welcome-view", "academy-view", "course-view"].forEach(view => {
    $(view).classList.toggle("hidden", view !== id);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateProgress() {
  $("progress-count").textContent = progress.completed.length;
  $("progress-summary").textContent =
    `Has completado ${progress.completed.length} lecciones.`;
}

async function loadProgress() {
  if (!currentUser || !db) {
    progress = { completed: [] };
    updateProgress();
    return;
  }

  try {
    const reference = doc(db, "users", currentUser.uid, "private", "progress");
    const snapshot = await getDoc(reference);

    progress = snapshot.exists()
      ? snapshot.data()
      : { completed: [] };

    if (!Array.isArray(progress.completed)) {
      progress.completed = [];
    }
  } catch (error) {
    console.error(error);
    alert("No se pudo cargar el progreso desde Firebase.");
  }

  updateProgress();
}

async function saveProgress(id) {
  if (!currentUser || !db) {
    alert("Configura Firebase e inicia sesión para guardar el progreso.");
    return;
  }

  if (!progress.completed.includes(id)) {
    progress.completed.push(id);
  }

  try {
    await setDoc(
      doc(db, "users", currentUser.uid, "private", "progress"),
      {
        completed: progress.completed,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    updateProgress();
    alert("Lección completada y guardada.");
  } catch (error) {
    console.error(error);
    alert("No se pudo guardar el progreso.");
  }
}

function openLevel(level) {
  selectedLevel = level;
  selectedUnit = 0;

  const data = courseData[level];

  $("course-title").textContent = `${level} · ${data.subtitle}`;
  $("course-description").textContent = data.description;
  $("course-eyebrow").textContent = level;

  renderUnits();
  renderLessons();
  showView("course-view");
}

function renderUnits() {
  const units = courseData[selectedLevel].units;

  $("unit-list").innerHTML = units.map((unit, index) => `
    <button class="unit-button ${index === selectedUnit ? "active" : ""}"
      data-unit="${index}">
      ${String(index + 1).padStart(2, "0")} · ${unit.title}
    </button>
  `).join("");

  document.querySelectorAll("[data-unit]").forEach(button => {
    button.addEventListener("click", () => {
      selectedUnit = Number(button.dataset.unit);
      renderUnits();
      renderLessons();
      $("lesson-detail").classList.add("hidden");
    });
  });
}

function renderLessons() {
  const unit = courseData[selectedLevel].units[selectedUnit];

  $("lesson-list").innerHTML = `
    <h3>${unit.title}</h3>
    <p>${unit.goal}</p>
    ${unit.lessons.map((lesson, index) => {
      const done = progress.completed.includes(lesson.id);

      return `
        <article class="lesson-item">
          <div>
            <h4>${done ? "✓ " : ""}${lesson.title}</h4>
            <p>${lesson.skill} · ${lesson.duration} minutos</p>
          </div>
          <button data-lesson="${index}">Comenzar →</button>
        </article>
      `;
    }).join("")}
  `;

  document.querySelectorAll("[data-lesson]").forEach(button => {
    button.addEventListener("click", () => {
      const lesson = unit.lessons[Number(button.dataset.lesson)];
      renderLesson(lesson);
    });
  });
}

function renderLesson(lesson) {
  const detail = $("lesson-detail");
  detail.classList.remove("hidden");

  detail.innerHTML = `
    <p class="eyebrow">${selectedLevel} · ${lesson.skill}</p>
    <h3>${lesson.title}</h3>
    <p>${lesson.intro}</p>

    <h4>Useful language</h4>
    ${lesson.vocab.map(item => `
      <div class="vocab"><b>${item[0]}</b> — ${item[1]}</div>
    `).join("")}

    <h4>Practice</h4>
    <p>${lesson.question}</p>

    <div class="question">
      ${lesson.options.map((option, index) => `
        <label>
          <input type="radio" name="answer" value="${index}">
          ${option}
        </label>
      `).join("")}

      <button id="check-answer" class="button primary">
        Comprobar respuesta
      </button>

      <p id="answer-feedback" class="feedback"></p>
    </div>

    <button id="complete-lesson" class="button primary">
      Marcar lección como completada ✓
    </button>
  `;

  $("check-answer").addEventListener("click", () => {
    const selected = document.querySelector(
      'input[name="answer"]:checked'
    );

    const feedback = $("answer-feedback");

    if (!selected) {
      feedback.textContent = "Selecciona una respuesta.";
      return;
    }

    const correct = Number(selected.value) === lesson.answer;

    feedback.textContent = correct
      ? `¡Correcto! ${lesson.explanation}`
      : `No es correcto. ${lesson.explanation}`;

    feedback.style.color = correct ? "#23856d" : "#b34d4d";
  });

  $("complete-lesson").addEventListener("click", () => {
    saveProgress(lesson.id);
  });

  detail.scrollIntoView({ behavior: "smooth", block: "start" });
}

$("start-button").addEventListener("click", () =>
  showView("academy-view")
);

$("back-home").addEventListener("click", () =>
  showView("welcome-view")
);

$("back-levels").addEventListener("click", () =>
  showView("academy-view")
);

document.querySelectorAll("[data-level]").forEach(button => {
  button.addEventListener("click", () => openLevel(button.dataset.level));
});

$("auth-button").addEventListener("click", () => {
  if (currentUser) {
    signOut(auth);
  } else {
    $("auth-dialog").showModal();
  }
});

$("close-auth").addEventListener("click", () =>
  $("auth-dialog").close()
);

$("auth-toggle").addEventListener("click", () => {
  authMode = authMode === "login" ? "register" : "login";

  $("auth-title").textContent =
    authMode === "login" ? "Accede a tu academia" : "Crea tu cuenta";

  $("auth-submit").textContent =
    authMode === "login" ? "Iniciar sesión" : "Crear cuenta";

  $("auth-toggle").textContent =
    authMode === "login"
      ? "¿No tienes cuenta? Crear una"
      : "Ya tengo cuenta. Iniciar sesión";
});

$("auth-form").addEventListener("submit", async event => {
  event.preventDefault();

  if (!auth) {
    $("auth-message").textContent =
      "Primero configura Firebase siguiendo las instrucciones.";
    return;
  }

  const email = $("auth-email").value.trim();
  const password = $("auth-password").value;

  try {
    if (authMode === "register") {
      await createUserWithEmailAndPassword(auth, email, password);
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }

    $("auth-dialog").close();
  } catch (error) {
    $("auth-message").textContent =
      "No se pudo acceder. Comprueba el correo y la contraseña.";
    console.error(error);
  }
});

if (configured) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  onAuthStateChanged(auth, async user => {
    currentUser = user;
    $("auth-button").textContent = user ? "Salir" : "Acceder";

    await loadProgress();

    if (!$("course-view").classList.contains("hidden")) {
      renderLessons();
    }
  });
} else {
  console.info("Firebase pendiente de configuración.");
}

updateProgress();
