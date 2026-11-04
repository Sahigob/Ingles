
import { initializeApp } from
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Utiliza aquí la MISMA configuración de Firebase que en src/main.js.
const firebaseConfig = {
  apiKey: "PEGA_AQUI_TU_API_KEY",
  authDomain: "PEGA_AQUI_TU_PROYECTO.firebaseapp.com",
  projectId: "PEGA_AQUI_TU_PROYECTO",
  storageBucket: "PEGA_AQUI_TU_PROYECTO.appspot.com",
  messagingSenderId: "PEGA_AQUI_TU_SENDER_ID",
  appId: "PEGA_AQUI_TU_APP_ID"
};

let auth = null;
let db = null;
let currentUser = null;
let authReady = Promise.resolve(null);
let isFinishing = false;

const $ = id => document.getElementById(id);

const exams = {
  B1: [
    {
      title: "Reading",
      skill: "Reading",
      type: "reading",
      passage: "Last summer, Daniel decided to spend two weeks volunteering in Ireland. At first, he found it difficult to understand the local accent. However, after a few days, he became more confident. He helped at a community garden and met people from several countries. He says the experience improved both his English and his independence.",
      questions: [
        {
          q: "Why did Daniel initially find communication difficult?",
          options: ["He didn't know anyone.", "He found the local accent difficult.", "He didn't speak any English."],
          answer: 1,
          explanation: "El texto indica que al principio le costaba entender el acento local."
        },
        {
          q: "What did Daniel do during his stay?",
          options: ["Worked in a hotel.", "Helped in a community garden.", "Studied at university."],
          answer: 1,
          explanation: "Ayudó en un huerto comunitario."
        },
        {
          q: "What did the experience improve?",
          options: ["His English and independence.", "His driving skills.", "His cooking skills."],
          answer: 0,
          explanation: "El texto menciona su inglés y su independencia."
        }
      ]
    },
    {
      title: "Listening",
      skill: "Listening",
      type: "listening",
      audio: "Hello, this is a message for Mr Brown. Your appointment has been changed from Tuesday morning to Wednesday at half past three in the afternoon. Please arrive ten minutes early and bring your identification.",
      questions: [
        {
          q: "When is the new appointment?",
          options: ["Tuesday morning.", "Wednesday at 3:30 pm.", "Wednesday at 10 am."],
          answer: 1,
          explanation: "La cita se ha cambiado al miércoles a las tres y media."
        },
        {
          q: "What should Mr Brown bring?",
          options: ["His passport photograph.", "His identification.", "A medical report."],
          answer: 1,
          explanation: "El mensaje le pide que lleve su identificación."
        }
      ]
    },
    {
      title: "Grammar and vocabulary",
      skill: "Use of English",
      type: "grammar",
      questions: [
        {
          q: "She ____ in Madrid since 2021.",
          options: ["lives", "has lived", "lived"],
          answer: 1,
          explanation: "Since 2021 indica una situación que continúa: present perfect."
        },
        {
          q: "If I have time, I ____ you tomorrow.",
          options: ["will call", "called", "would called"],
          answer: 0,
          explanation: "First conditional: If + present simple, will + infinitive."
        },
        {
          q: "I'm interested ____ learning English.",
          options: ["on", "at", "in"],
          answer: 2,
          explanation: "La expresión correcta es interested in."
        }
      ]
    },
    {
      title: "Writing",
      skill: "Writing",
      type: "writing",
      prompt: "Write an email to an English-speaking friend. Tell them about a trip you took recently, explain what you enjoyed and invite them to visit you. Write approximately 100–120 words."
    },
    {
      title: "Speaking",
      skill: "Speaking",
      type: "speaking",
      prompt: "Talk about a memorable experience. Explain what happened, where you were, who was with you and why it was important. Try to speak for 1–2 minutes."
    }
  ],

  B2: [
    {
      title: "Reading",
      skill: "Reading",
      type: "reading",
      passage: "Many companies have adopted flexible working arrangements. Supporters argue that employees are often more productive when they can organise their own schedules. Nevertheless, critics point out that remote work may reduce informal communication and make it harder for new employees to integrate into a team. The most successful organisations tend to combine flexibility with clear communication policies.",
      questions: [
        {
          q: "What is one advantage of flexible working?",
          options: ["It removes all meetings.", "It allows employees to organise their schedules.", "It guarantees promotion."],
          answer: 1,
          explanation: "El texto señala que pueden organizar sus propios horarios."
        },
        {
          q: "What concern do critics express?",
          options: ["Less informal communication.", "Higher office rent.", "More commuting."],
          answer: 0,
          explanation: "Los críticos mencionan la posible reducción de comunicación informal."
        },
        {
          q: "What approach is described as successful?",
          options: ["Remote work without rules.", "A return to traditional offices only.", "Flexibility combined with clear communication."],
          answer: 2,
          explanation: "El texto destaca la flexibilidad junto a políticas claras de comunicación."
        }
      ]
    },
    {
      title: "Listening",
      skill: "Listening",
      type: "listening",
      audio: "Although the new transport scheme was initially welcomed by residents, the results have been mixed. Journey times have improved in the city centre, but people living in the surrounding areas have complained about reduced services. The council has promised to review the timetable before the end of the year.",
      questions: [
        {
          q: "What has improved?",
          options: ["Services in every area.", "Journey times in the city centre.", "Parking facilities."],
          answer: 1,
          explanation: "Han mejorado los tiempos de viaje en el centro."
        },
        {
          q: "What has the council promised?",
          options: ["To review the timetable.", "To cancel the scheme.", "To build a new airport."],
          answer: 0,
          explanation: "El ayuntamiento ha prometido revisar los horarios."
        }
      ]
    },
    {
      title: "Grammar and vocabulary",
      skill: "Use of English",
      type: "grammar",
      questions: [
        {
          q: "Had I known about the delay, I ____ earlier.",
          options: ["would leave", "would have left", "will leave"],
          answer: 1,
          explanation: "La estructura condicional irreal del pasado utiliza would have + participio."
        },
        {
          q: "The proposal was rejected, ____ several people supported it.",
          options: ["despite", "although", "because"],
          answer: 1,
          explanation: "Although introduce una oración con sujeto y verbo."
        },
        {
          q: "The new policy is likely ____ significant changes.",
          options: ["to cause", "causing", "cause"],
          answer: 0,
          explanation: "La estructura correcta es be likely to + infinitivo."
        }
      ]
    },
    {
      title: "Writing",
      skill: "Writing",
      type: "writing",
      prompt: "Write an essay discussing whether working from home is better than working in an office. Present arguments on both sides and give your own opinion. Write approximately 180–220 words."
    },
    {
      title: "Speaking",
      skill: "Speaking",
      type: "speaking",
      prompt: "Discuss the advantages and disadvantages of technology in education. Give examples, compare different points of view and reach a conclusion. Try to speak for 2 minutes."
    }
  ]
};

let level = "B1";
let currentPart = 0;
let answers = {};
let writtenWork = {};
let remainingSeconds = 20 * 60;
let timerInterval = null;

function configureFirebase() {
  const configIsIncomplete = Object.values(firebaseConfig).some(value =>
    typeof value !== "string" || value.includes("PEGA_AQUI")
  );

  if (configIsIncomplete) {
    console.warn("Configura Firebase en src/exam.js antes de guardar resultados.");
    return;
  }

  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    // Espera a que Firebase determine si existe una sesión iniciada.
    authReady = new Promise(resolve => {
      onAuthStateChanged(
        auth,
        user => {
          currentUser = user;
          resolve(user);
        },
        error => {
          console.error("No se pudo comprobar la sesión de Firebase:", error);
          currentUser = null;
          resolve(null);
        }
      );
    });
  } catch (error) {
    console.error("Firebase:", error);
    authReady = Promise.resolve(null);
  }
}

function startExam() {
  level = $("exam-level").value;
  currentPart = 0;
  answers = {};
  writtenWork = {};
  remainingSeconds = 20 * 60;
  isFinishing = false;

  $("exam-start").classList.add("hidden");
  $("exam-results").classList.add("hidden");
  $("exam-work").classList.remove("hidden");

  $("exam-level-label").textContent = `${level} EXAM`;
  renderPart();
  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    remainingSeconds--;

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    $("exam-timer").textContent =
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    if (remainingSeconds <= 0) {
      finishExam();
    }
  }, 1000);
}

function renderPart() {
  const part = exams[level][currentPart];

  $("exam-section-title").textContent = part.title;
  $("question-counter").textContent =
    `Parte ${currentPart + 1} de ${exams[level].length}`;

  $("exam-progress-bar").style.width =
    `${((currentPart + 1) / exams[level].length) * 100}%`;

  const content = $("exam-content");

  if (part.type === "writing" || part.type === "speaking") {
    content.innerHTML = `
      <p class="eyebrow">${part.skill.toUpperCase()}</p>
      <h3>${part.title}</h3>
      <p>${part.prompt}</p>
      <label for="written-answer">
        ${part.type === "writing" ? "Tu texto" : "Notas para preparar tu intervención"}
      </label>
      <textarea id="written-answer" rows="9"
        placeholder="Escribe aquí tu respuesta..."></textarea>
      ${part.type === "speaking" ? `
        <button id="speak-prompt" class="button outline">
          🔊 Escuchar la consigna
        </button>
      ` : ""}
      <p class="exam-note">
        Esta actividad se revisará por separado. No recibe una nota automática.
      </p>
    `;

    $("written-answer").value = writtenWork[currentPart] || "";

    $("written-answer").addEventListener("input", event => {
      writtenWork[currentPart] = event.target.value;
    });

    const speakButton = $("speak-prompt");
    if (speakButton) {
      speakButton.addEventListener("click", () => speak(part.prompt));
    }
  } else {
    content.innerHTML = `
      <p class="eyebrow">${part.skill.toUpperCase()}</p>
      <h3>${part.title}</h3>
      ${part.passage ? `<div class="reading-text">${part.passage}</div>` : ""}
      ${part.audio ? `
        <div class="listening-box">
          <p>Escucha el mensaje antes de responder.</p>
          <button id="play-audio" class="button outline">▶ Escuchar audio</button>
          <p class="exam-note">Puedes escucharlo de nuevo si lo necesitas.</p>
        </div>
      ` : ""}
      ${part.questions.map((question, index) => `
        <div class="exam-question">
          <h4>${index + 1}. ${question.q}</h4>
          ${question.options.map((option, optionIndex) => `
            <label>
              <input type="radio"
                name="q-${currentPart}-${index}"
                value="${optionIndex}"
                ${answers[`${currentPart}-${index}`] === optionIndex ? "checked" : ""}>
              ${option}
            </label>
          `).join("")}
        </div>
      `).join("")}
    `;

    part.questions.forEach((question, index) => {
      document.querySelectorAll(`input[name="q-${currentPart}-${index}"]`)
        .forEach(input => {
          input.addEventListener("change", event => {
            answers[`${currentPart}-${index}`] = Number(event.target.value);
          });
        });
    });

    const audioButton = $("play-audio");
    if (audioButton) {
      audioButton.addEventListener("click", () => speak(part.audio));
    }
  }

  $("previous-question").disabled = currentPart === 0;
  $("next-question").textContent =
    currentPart === exams[level].length - 1 ? "Ver resultados →" : "Siguiente →";
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    alert("Este navegador no dispone de síntesis de voz.");
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-GB";
  utterance.rate = 0.85;

  window.speechSynthesis.speak(utterance);
}

function calculateResults() {
  let total = 0;
  let correct = 0;
  const breakdown = [];

  exams[level].forEach((part, partIndex) => {
    if (!part.questions) return;

    let partCorrect = 0;

    part.questions.forEach((question, questionIndex) => {
      total++;

      if (answers[`${partIndex}-${questionIndex}`] === question.answer) {
        correct++;
        partCorrect++;
      }
    });

    breakdown.push({
      title: part.title,
      correct: partCorrect,
      total: part.questions.length
    });
  });

  return {
    total,
    correct,
    percentage: total ? Math.round(correct / total * 100) : 0,
    breakdown
  };
}

async function finishExam() {
  // Evita que el botón y el temporizador finalicen o guarden el examen dos veces.
  if (isFinishing) return;
  isFinishing = true;

  clearInterval(timerInterval);
  timerInterval = null;
  window.speechSynthesis?.cancel();

  // No consultar currentUser hasta que Firebase haya comprobado la sesión.
  await authReady;

  const result = calculateResults();

  $("exam-work").classList.add("hidden");
  $("exam-results").classList.remove("hidden");

  $("result-score").textContent = `${result.percentage}%`;

  $("result-message").textContent =
    result.percentage >= 80
      ? "Muy buen resultado en las preguntas tipo test."
      : result.percentage >= 60
        ? "Buen comienzo. Repasa los errores y sigue practicando."
        : "Conviene repasar los contenidos y repetir el examen.";

  $("result-breakdown").innerHTML = result.breakdown.map(item => `
    <div class="result-row">
      <span>${item.title}</span>
      <strong>${item.correct} / ${item.total}</strong>
    </div>
  `).join("");

  $("result-writing").innerHTML = [3, 4].map(index => `
    <div class="result-row">
      <span>${exams[level][index].title}</span>
      <strong>${(writtenWork[index] || "").trim().length} caracteres</strong>
    </div>
  `).join("");

  if (currentUser && db) {
    try {
      const examId = `${level}-${Date.now()}`;

      await setDoc(
        doc(db, "users", currentUser.uid, "examResults", examId),
        {
          level,
          percentage: result.percentage,
          correct: result.correct,
          total: result.total,
          breakdown: result.breakdown,
          completedAt: serverTimestamp()
        }
      );

      $("result-message").textContent += " Resultado guardado en tu cuenta.";
    } catch (error) {
      console.error("No se pudo guardar el examen:", error);
      $("result-message").textContent +=
        " No se pudo guardar el resultado en Firebase.";
    }
  } else {
    $("result-message").textContent +=
      " Inicia sesión y configura Firebase para guardar tus resultados.";
  }
}

$("begin-exam").addEventListener("click", startExam);

$("previous-question").addEventListener("click", () => {
  if (currentPart > 0) {
    currentPart--;
    renderPart();
  }
});

$("next-question").addEventListener("click", () => {
  if (currentPart < exams[level].length - 1) {
    currentPart++;
    renderPart();
  } else {
    finishExam();
  }
});

$("finish-exam").addEventListener("click", () => {
  if (confirm("¿Quieres finalizar el examen y ver tus resultados?")) {
    finishExam();
  }
});

$("retry-exam").addEventListener("click", () => {
  $("exam-results").classList.add("hidden");
  $("exam-start").classList.remove("hidden");
});

configureFirebase();
