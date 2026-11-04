
import { initializeApp } from
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import {
  getAuth,
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
  !Object.values(firebaseConfig).some(value =>
    typeof value !== "string" || value.includes("PEGA_AQUI")
  );

let auth = null;
let db = null;
let currentUser = null;
let progress = { completed: [] };
let selectedLevel = "B1";
let selectedUnit = 0;

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

  const userAtStart = currentUser;

  try {
    const reference = doc(
      db,
      "users",
      userAtStart.uid,
      "private",
      "progress"
    );

    const snapshot = await getDoc(reference);

    // Evita aplicar datos de una sesión anterior si cambia el usuario.
    if (!currentUser || currentUser.uid !== userAtStart.uid) {
      return;
    }

    progress = snapshot.exists()
      ? snapshot.data()
      : { completed: [] };

    if (!Array.isArray(progress.completed)) {
      progress.completed = [];
    }
  } catch (error) {
    console.error("Error cargando el progreso:", error);
    alert("No se pudo cargar el progreso desde Firebase.");
  }

  updateProgress();
}

async function saveProgress(id) {
  if (!currentUser || !db) {
    alert("Inicia sesión para guardar tu progreso.");
    return;
  }

  const userAtStart = currentUser;

  const previousCompleted = [...progress.completed];

  if (!progress.completed.includes(id)) {
    progress.completed.push(id);
  }

  try {
    await setDoc(
      doc(db, "users", userAtStart.uid, "private", "progress"),
      {
        completed: progress.completed,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    if (!currentUser || currentUser.uid !== userAtStart.uid) {
      return;
    }

    updateProgress();
    alert("Lección completada y guardada.");
  } catch (error) {
    console.error("Error guardando el progreso:", error);

    progress.completed = previousCompleted;
    updateProgress();

    alert("No se pudo guardar el progreso en Firebase.");
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

          <button data-lesson="${index}">
            Comenzar →
          </button>
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
      <div class="vocab">
        <b>${item[0]}</b> — ${item[1]}
      </div>
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

  detail.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

// Navegación principal

$("start-button").addEventListener("click", () => {
  showView("academy-view");
});

$("back-home").addEventListener("click", () => {
  showView("welcome-view");
});

$("back-levels").addEventListener("click", () => {
  showView("academy-view");
});

document.querySelectorAll("[data-level]").forEach(button => {
  button.addEventListener("click", () => {
    openLevel(button.dataset.level);
  });
});

// Acceso y cierre de sesión

$("auth-button").addEventListener("click", async () => {
  if (currentUser) {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("No se pudo cerrar la sesión:", error);
      alert("No se pudo cerrar la sesión.");
    }
  } else {
    $("auth-message").textContent = "";
    $("auth-dialog").showModal();
  }
});

$("close-auth").addEventListener("click", () => {
  $("auth-dialog").close();
});

// Desactivar el registro público en la interfaz.
// Se conserva el elemento HTML para no tener que modificar index.html.

$("auth-title").textContent = "Accede a tu academia";
$("auth-submit").textContent = "Iniciar sesión";

$("auth-toggle").classList.add("hidden");
$("auth-toggle").setAttribute("hidden", "");

// Inicio de sesión exclusivamente con email y contraseña.

$("auth-form").addEventListener("submit", async event => {
  event.preventDefault();

  if (!auth || !configured) {
    $("auth-message").textContent =
      "Firebase todavía no está configurado.";
    return;
  }

  const email = $("auth-email").value.trim();
  const password = $("auth-password").value;

  $("auth-submit").disabled = true;
  $("auth-message").textContent = "Comprobando acceso...";

  try {
    await signInWithEmailAndPassword(auth, email, password);

    $("auth-message").textContent = "";
    $("auth-dialog").close();

    $("auth-form").reset();
  } catch (error) {
    console.error("Error de acceso:", error);

    $("auth-message").textContent =
      "No se pudo acceder. Comprueba el correo y la contraseña.";
  } finally {
    $("auth-submit").disabled = false;
  }
});

// Inicialización de Firebase

if (configured) {
  try {
    const app = initializeApp(firebaseConfig);

    auth = getAuth(app);
    db = getFirestore(app);

    onAuthStateChanged(auth, async user => {
      currentUser = user;

      $("auth-button").textContent = user
        ? "Salir"
        : "Acceder";

      await loadProgress();

      if (!$("course-view").classList.contains("hidden")) {
        renderLessons();
      }
    });
  } catch (error) {
    console.error("Error inicializando Firebase:", error);

    $("auth-message").textContent =
      "No se pudo conectar con Firebase.";
  }
} else {
  console.info("Firebase pendiente de configuración.");
}

updateProgress();
