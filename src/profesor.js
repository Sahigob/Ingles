import { CreateMLCEngine } from "https://esm.run/@mlc-ai/web-llm@0.2.87";

const MODEL_ID = "Qwen2.5-1.5B-Instruct-q4f16_1-MLC";
const $ = id => document.getElementById(id);
let engine = null;
let busy = false;
let recognition = null;
let messages = [];
let selectedTopic = "free";

const topicNames = {
  free: "a natural, open conversation",
  travel: "travel, holidays, airports and hotels",
  work: "work, careers and job interviews",
  daily: "everyday life and daily routines",
  food: "food, cooking and restaurants",
  study: "education, learning and languages",
  health: "health, sport and wellbeing",
  technology: "technology and digital life"
};

function setStatus(text, ready = false) {
  $("teacher-status").textContent = text;
  $("teacher-dot").classList.toggle("ready", ready);
}
function addMessage(role, text) {
  const empty = document.querySelector(".chat-empty");
  empty?.remove();
  const item = document.createElement("div");
  item.className = `chat-message ${role}`;
  const label = document.createElement("small");
  label.textContent = role === "teacher" ? "YOUR ENGLISH TEACHER" : "YOU";
  const content = document.createElement("div");
  content.textContent = text;
  item.append(label, content);
  if (role === "teacher") {
    const play = document.createElement("button");
    play.type = "button";
    play.textContent = "🔊 Escuchar de nuevo";
    play.addEventListener("click", () => speak(text));
    item.append(play);
  }
  $("chat-messages").append(item);
  $("chat-messages").scrollTop = $("chat-messages").scrollHeight;
}
function speak(text) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-GB";
  utterance.rate = 0.92;
  const voices = speechSynthesis.getVoices();
  const voice = voices.find(v => /^en-GB/i.test(v.lang)) || voices.find(v => /^en/i.test(v.lang));
  if (voice) utterance.voice = voice;
  speechSynthesis.speak(utterance);
}
function systemPrompt() {
  const level = $("teacher-level").value;
  return `You are a patient, skilled English conversation teacher for a Spanish-speaking learner at CEFR ${level}. Topic: ${topicNames[selectedTopic] || topicNames.free}.
Speak primarily in natural British English, at a pace and vocabulary suitable for ${level}. Have a real, coherent conversation: respond directly to the learner's actual meaning, remember details from earlier turns, ask relevant follow-up questions, and never behave like a fixed questionnaire. Ask only one main question at a time. Do not invent facts about the learner.
After the natural conversational response, if there is a meaningful English error, add a short section in Spanish beginning "Corrección:" with the corrected expression and a brief explanation. Do not correct every minor mistake. If the learner's English is good, encourage them and do not invent errors. Keep each response concise (normally 2-5 sentences), warm and encouraging. Do not translate everything. If the learner writes in Spanish, help them express the idea in English and invite them to try again.
Start by greeting the learner and asking which level they prefer only if level is not already selected; otherwise begin the selected topic with one natural question. `;
}
async function teacherReply(userText) {
  if (!engine || busy) return;
  busy = true;
  $("send-button").disabled = true;
  $("mic-button").disabled = true;
  setStatus("El profesor está pensando…", true);
  messages.push({ role: "user", content: userText });
  try {
    const result = await engine.chat.completions.create({
      messages: [{ role: "system", content: systemPrompt() }, ...messages.slice(-12)],
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 220
    });
    const answer = result.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't prepare an answer. Could you say that again?";
    messages.push({ role: "assistant", content: answer });
    addMessage("teacher", answer);
    speak(answer);
    setStatus("Conversación en marcha", true);
  } catch (error) {
    console.error(error);
    addMessage("teacher", "I'm sorry, something went wrong while preparing my answer. Please try again.");
    setStatus("Error al generar la respuesta");
  } finally {
    busy = false;
    $("send-button").disabled = false;
    $("mic-button").disabled = false;
  }
}
function sendTyped() {
  const text = $("student-input").value.trim();
  if (!text || busy) return;
  $("student-input").value = "";
  addMessage("student", text);
  teacherReply(text);
}
async function startTeacher() {
  $("start-teacher").disabled = true;
  $("start-teacher").textContent = "Comprobando compatibilidad…";
  setStatus("Comprobando el dispositivo…");
  try {
    if (!navigator.gpu) throw new Error("WebGPU no está disponible. Prueba con Chrome o Edge actualizado y comprueba que tu tarjeta gráfica y sus controladores admiten WebGPU.");
    $("model-progress-text").textContent = "Conectando con el modelo local. La primera descarga puede tardar varios minutos.";
    engine = await CreateMLCEngine(MODEL_ID, {
      initProgressCallback: report => {
        const pct = Math.round((report.progress || 0) * 100);
        $("model-progress-bar").style.width = pct + "%";
        $("model-progress-text").textContent = report.text || `Preparando el modelo: ${pct}%`;
      }
    });
    $("model-load").classList.add("hidden");
    $("teacher-chat").classList.remove("hidden");
    setStatus("Profesor preparado", true);
    messages = [];
    const opening = `Hello! I'm your English teacher. Today we'll practise ${topicNames[selectedTopic]}. Let's get started: ${$("teacher-level").value === "B1" ? "Can you tell me a little about yourself?" : "What would you like to become more confident discussing in English?"}`;
    messages.push({ role: "assistant", content: opening });
    addMessage("teacher", opening);
    speak(opening);
    setupRecognition();
  } catch (error) {
    console.error(error);
    $("model-progress-text").textContent = error.message || "No se pudo cargar el modelo. Comprueba WebGPU, memoria disponible y conexión a internet.";
    $("start-teacher").disabled = false;
    $("start-teacher").textContent = "Volver a intentar";
    setStatus("No se pudo iniciar");
  }
}
function setupRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    $("mic-button").disabled = true;
    $("mic-status").textContent = "Este navegador no ofrece reconocimiento de voz. Puedes escribir tus respuestas; la voz del profesor seguirá funcionando.";
    return;
  }
  recognition = new SpeechRecognition();
  recognition.lang = "en-GB";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.onstart = () => { $("mic-status").textContent = "Te estoy escuchando… habla en inglés."; $("mic-button").textContent = "🎙️ Escuchando…"; };
  recognition.onresult = event => {
    const transcript = event.results?.[0]?.[0]?.transcript?.trim();
    if (transcript) {
      $("student-input").value = transcript;
      addMessage("student", transcript);
      teacherReply(transcript);
    }
  };
  recognition.onerror = event => { $("mic-status").textContent = `No se pudo reconocer la voz (${event.error}). Puedes escribir tu respuesta.`; };
  recognition.onend = () => { $("mic-button").textContent = "🎙️ Hablar"; };
}
$("start-teacher").addEventListener("click", startTeacher);
$("send-button").addEventListener("click", sendTyped);
$("student-input").addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendTyped(); }
});
$("mic-button").addEventListener("click", () => {
  if (!recognition || busy) return;
  try { speechSynthesis.cancel(); recognition.start(); }
  catch (error) { $("mic-status").textContent = "El micrófono ya está activo. Espera un momento y vuelve a intentarlo."; }
});
$("stop-speech").addEventListener("click", () => speechSynthesis.cancel());
$("teacher-topic").addEventListener("change", event => {
  selectedTopic = event.target.value;
});
const params = new URLSearchParams(location.search);
if (params.has("topic") && topicNames[params.get("topic")]) {
  selectedTopic = params.get("topic");
  $("teacher-topic").value = selectedTopic;
}
