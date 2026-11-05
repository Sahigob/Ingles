import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { courseData } from "./content.js";

const $ = id => document.getElementById(id);

const firebaseConfig = {
  apiKey: "AIzaSyCOlt2USTexZl1IJSYZreZ61npgdGEOpNk",
  authDomain: "ingles-2905b.firebaseapp.com",
  projectId: "ingles-2905b",
  storageBucket: "ingles-2905b.firebasestorage.app",
  messagingSenderId: "121961633395",
  appId: "1:121961633395:web:88a89e3e3c6bd185d0fc06",
  measurementId: "G-G992ZDLH12"
};

let auth, db, currentUser = null;
let progress = { completed: [], writing: {} };
let selectedLevel = "B1", selectedUnit = 0, activeLesson = null;
let activityAnswers = {};

function showView(id) {
  ["welcome-view", "academy-view", "course-view"].forEach(v => $(v)?.classList.toggle("hidden", v !== id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateProgress() {
  if ($("progress-count")) $("progress-count").textContent = progress.completed.length;
  if ($("progress-summary")) $("progress-summary").textContent = `Has completado ${progress.completed.length} actividades.`;
}

function showLoginDialog(message = "") {
  const d = $("auth-dialog"); if (!d) return;
  $("auth-message").textContent = message;
  if (!d.open) d.showModal();
}

function requireLogin() {
  if (currentUser) return true;
  showLoginDialog("Inicia sesión para acceder a la academia."); return false;
}

async function loadProgress() {
  if (!currentUser || !db) return;
  const user = currentUser;
  try {
    const snap = await getDoc(doc(db, "users", user.uid, "private", "progress"));
    if (!currentUser || currentUser.uid !== user.uid) return;
    const data = snap.exists() ? snap.data() : {};
    progress = { ...data, completed: Array.isArray(data.completed) ? data.completed : [], writing: data.writing || {} };
    updateProgress();
    if (!$("course-view").classList.contains("hidden")) renderLessons();
  } catch (e) { console.error(e); alert("No se pudo cargar tu progreso de Firebase. Comprueba las reglas de Firestore."); }
}

async function persistProgress() {
  if (!requireLogin()) return false;
  const user = currentUser;
  try {
    await setDoc(doc(db, "users", user.uid, "private", "progress"), {
      completed: progress.completed,
      writing: progress.writing,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return currentUser?.uid === user.uid;
  } catch (e) { console.error("Error guardando progreso", e); alert("No se pudo guardar en Firebase. Tu actividad no se ha marcado como completada."); return false; }
}

async function completeLesson(id) {
  if (!progress.completed.includes(id)) progress.completed.push(id);
  if (!(await persistProgress())) { progress.completed = progress.completed.filter(x => x !== id); return; }
  updateProgress(); renderLessons();
  alert("Actividad completada y guardada en tu cuenta.");
}

function openLevel(level) {
  if (!requireLogin()) return;
  selectedLevel = level; selectedUnit = 0;
  const data = courseData[level];
  $("course-title").textContent = `${level} · ${data.subtitle}`;
  $("course-description").textContent = data.description;
  $("course-eyebrow").textContent = level;
  renderUnits(); renderLessons(); showView("course-view");
}

function renderUnits() {
  const units = courseData[selectedLevel].units;
  $("unit-list").innerHTML = units.map((u,i)=>`<button class="unit-button ${i===selectedUnit?'active':''}" data-unit="${i}">${String(i+1).padStart(2,'0')} · ${u.title}</button>`).join("");
  document.querySelectorAll("[data-unit]").forEach(b=>b.addEventListener("click",()=>{selectedUnit=Number(b.dataset.unit);renderUnits();renderLessons();$("lesson-detail").classList.add("hidden");}));
}

function renderLessons() {
  const unit = courseData[selectedLevel].units[selectedUnit];
  $("lesson-list").innerHTML = `<h3>${unit.title}</h3><p>${unit.goal}</p>${unit.lessons.map((l,i)=>{const done=progress.completed.includes(l.id);return `<article class="lesson-item"><div><h4>${done?'✓ ':''}${l.title}</h4><p>${l.skill} · ${l.duration} minutos</p></div><button data-lesson="${i}">${done?'Repasar':'Comenzar'} →</button></article>`;}).join("")}`;
  document.querySelectorAll("[data-lesson]").forEach(b=>b.addEventListener("click",()=>renderLesson(unit.lessons[Number(b.dataset.lesson)])));
}

function speak(text) {
  if (!('speechSynthesis' in window)) { alert("Tu navegador no admite reproducción de voz."); return; }
  speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text);u.lang="en-GB";u.rate=0.88;speechSynthesis.speak(u);
}

// Lee un guion. Si tiene líneas con formato "Nombre: texto", usa un tono distinto para cada interlocutor.
// Es la voz sintética del navegador, no una grabación humana.
function speakScript(text) {
  if (!('speechSynthesis' in window)) { alert("Tu navegador no admite reproducción de voz."); return; }
  speechSynthesis.cancel();
  const speakers = [];
  String(text).split("\n").map(s => s.trim()).filter(Boolean).forEach(line => {
    const m = line.match(/^([A-Z][A-Za-z ]{0,20}):\s*(.+)$/);
    let idx = 0;
    if (m) { idx = speakers.indexOf(m[1]); if (idx < 0) { speakers.push(m[1]); idx = speakers.length - 1; } }
    const u = new SpeechSynthesisUtterance(m ? m[2] : line);
    u.lang = "en-GB"; u.rate = 0.88; u.pitch = [1, 1.25, 0.8][idx % 3];
    speechSynthesis.speak(u);
  });
}

function formatText(s) {
  return String(s).split(/\n\s*\n/).map(p => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("");
}

// Clave con la que se guarda cada texto del alumno en progress.writing.
// La primera tarea conserva el id de la lección (compatibilidad con datos anteriores).
function itemKey(lesson, k, prefix) {
  return k === 0 ? lesson.id : `${lesson.id}-${prefix}${k + 1}`;
}

function renderQuestionGroup(qs, g) {
  return `<section class="activity-questions"><h4>Practice</h4>${qs.map((q,i)=>`<div class="exam-question"><p><strong>${i+1}. ${q.q}</strong></p>${q.options.map((o,j)=>`<label><input type="radio" name="g${g}-q${i}" value="${j}"> ${o}</label>`).join('')}<p id="feedback-${g}-${i}" class="feedback"></p></div>`).join('')}<button class="button primary" data-check="${g}">Comprobar respuestas</button><p id="score-${g}" class="feedback"></p></section>`;
}

function renderPairs(pairs) {
  return pairs.map(x => `<div class="vocab"><b>${x[0]}</b> — ${x[1]}</div>`).join("");
}

function renderLesson(lesson) {
  activeLesson=lesson;activityAnswers={};
  const d=$("lesson-detail");d.classList.remove("hidden");
  const groups=[]; // { qs, transcriptId }
  const addGroup=(qs,hasTranscript)=>{const g=groups.length;groups.push({qs,hasTranscript});return renderQuestionGroup(qs,g);};
  let body=`<p class="eyebrow">${selectedLevel} · ${lesson.skill}</p><h3>${lesson.title}</h3><p>${lesson.intro||''}</p>`;
  if(lesson.rule) body+=`<div class="lesson-rule"><h4>Key language</h4><p>${lesson.rule}</p></div>`;
  if(lesson.examples) body+=`<h4>Examples</h4>${lesson.examples.map(x=>`<p><strong>${x[0]}:</strong> ${x[1]}</p>`).join('')}`;
  if(lesson.vocab) body+=`<h4>Useful vocabulary</h4>${renderPairs(lesson.vocab)}`;
  if(lesson.passage) body+=`<div class="reading-text"><h4>Read the text</h4><p>${lesson.passage}</p></div>`;
  if(lesson.audio) body+=`<div class="listening-box"><h4>Listening</h4><p>Listen to the recording and answer the questions.</p><p class="exam-note">Voz sintética de tu navegador (no es una grabación humana).</p><button id="play-activity-audio" class="button outline">▶ Listen</button></div>`;
  if(lesson.prompt) body+=`<div class="writing-task"><h4>Your task</h4><p>${lesson.prompt}</p>${lesson.wordCount?`<p><strong>Suggested length:</strong> ${lesson.wordCount}</p>`:''}<textarea id="activity-response" rows="8" placeholder="Write your answer here...">${escapeHtml(progress.writing[lesson.id]||'')}</textarea><button id="save-writing" class="button outline">Save my work</button></div>`;
  if(lesson.checklist) body+=`<h4>Checklist</h4><ul>${lesson.checklist.map(x=>`<li>${x}</li>`).join('')}</ul>`;

  // --- Contenido ampliado: varios textos, audios, tareas o situaciones dentro de una misma lección ---
  if(lesson.texts) lesson.texts.forEach((t,k)=>{
    body+=`<div class="reading-text"><h4>Text ${k+1}: ${t.title}</h4>${formatText(t.passage)}</div>`+addGroup(t.questions,false);
  });
  if(lesson.tracks) lesson.tracks.forEach((t,k)=>{
    const g=groups.length;
    body+=`<div class="listening-box"><h4>Audio ${k+1}: ${t.title}</h4><p class="exam-note">Voz sintética de tu navegador (no es una grabación humana). Puedes escucharlo las veces que quieras.</p><button class="button outline" data-play-track="${k}">▶ Listen</button></div>`
      +addGroup(t.questions,true)
      +`<div id="transcript-${g}" class="reading-text hidden"><h4>Transcript</h4>${formatText(t.transcript)}</div>`;
  });
  if(lesson.tasks){
    body+=`<p class="exam-note">Estas tareas no reciben nota automática. Compara tu texto con el ejemplo y la rúbrica.</p>`;
    lesson.tasks.forEach((t,k)=>{
      body+=`<div class="writing-task"><h4>Task ${k+1}: ${t.title}</h4><p>${t.prompt}</p><p><strong>Suggested length:</strong> ${t.wordCount}</p>${t.tips?`<ul>${t.tips.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}<textarea id="task-response-${k}" rows="9" placeholder="Write your answer here...">${escapeHtml(progress.writing[itemKey(lesson,k,'t')]||'')}</textarea><button class="button outline" data-save-task="${k}">Save my work</button><details><summary>Model answer</summary>${formatText(t.modelAnswer)}</details></div>`;
    });
    if(lesson.rubric) body+=`<details class="writing-task"><summary>Assessment rubric (B1)</summary>${renderPairs(lesson.rubric)}</details>`;
  }
  if(lesson.situations){
    body+=`<p class="exam-note">La aplicación no evalúa la expresión oral. Prepara tus notas, habla en voz alta (puedes grabarte con el móvil) y compara con el ejemplo y los criterios.</p>`;
    lesson.situations.forEach((s,k)=>{
      body+=`<div class="writing-task"><h4>Situation ${k+1}: ${s.title}</h4><p>${s.prompt}</p><h4>Useful phrases</h4><ul>${s.usefulPhrases.map(x=>`<li>${x}</li>`).join('')}</ul><label for="speaking-notes-${k}">Notas para preparar tu intervención</label><textarea id="speaking-notes-${k}" rows="5" placeholder="Write your notes here...">${escapeHtml(progress.writing[itemKey(lesson,k,'s')]||'')}</textarea><button class="button outline" data-save-notes="${k}">Save my notes</button><details><summary>Model answer</summary>${formatText(s.modelAnswer)}<button class="button outline" data-play-model="${k}">🔊 Listen to the model (synthetic voice)</button></details></div>`;
    });
    if(lesson.criteria) body+=`<details class="writing-task"><summary>Assessment criteria (B1)</summary>${renderPairs(lesson.criteria)}</details>`;
  }

  if(lesson.questions?.length) body+=addGroup(lesson.questions,false);
  body+=`<button id="complete-lesson" class="button primary">Mark activity as completed ✓</button><p id="activity-status" class="feedback"></p>`;
  d.innerHTML=body;

  $("play-activity-audio")?.addEventListener("click",()=>speak(lesson.audio));
  d.querySelectorAll("[data-play-track]").forEach(b=>b.addEventListener("click",()=>speakScript(lesson.tracks[Number(b.dataset.playTrack)].transcript)));
  d.querySelectorAll("[data-play-model]").forEach(b=>b.addEventListener("click",()=>speakScript(lesson.situations[Number(b.dataset.playModel)].modelAnswer)));

  d.querySelectorAll("[data-check]").forEach(b=>b.addEventListener("click",()=>{
    const g=Number(b.dataset.check),qs=groups[g].qs;let score=0;
    qs.forEach((q,i)=>{
      const selected=d.querySelector(`input[name="g${g}-q${i}"]:checked`);
      const ok=selected&&Number(selected.value)===q.answer;if(ok)score++;
      const f=$(`feedback-${g}-${i}`);
      f.textContent=ok?`Correcto. ${q.explanation}`:`Revisa: la respuesta correcta es "${q.options[q.answer]}". ${q.explanation}`;
      f.style.color=ok?'#23856d':'#b34d4d';
    });
    $(`score-${g}`).textContent=`Puntuación: ${score}/${qs.length}.`;
    if(groups[g].hasTranscript) $(`transcript-${g}`)?.classList.remove("hidden");
  }));

  $("save-writing")?.addEventListener("click",async()=>{progress.writing[lesson.id]=$("activity-response").value;if(await persistProgress())$("activity-status").textContent="Your work has been saved to your Firebase account.";});
  d.querySelectorAll("[data-save-task]").forEach(b=>b.addEventListener("click",async()=>{const k=Number(b.dataset.saveTask);progress.writing[itemKey(lesson,k,'t')]=$(`task-response-${k}`).value;if(await persistProgress())$("activity-status").textContent=`Task ${k+1} has been saved to your Firebase account.`;}));
  d.querySelectorAll("[data-save-notes]").forEach(b=>b.addEventListener("click",async()=>{const k=Number(b.dataset.saveNotes);progress.writing[itemKey(lesson,k,'s')]=$(`speaking-notes-${k}`).value;if(await persistProgress())$("activity-status").textContent=`Notes for situation ${k+1} have been saved to your Firebase account.`;}));
  $("complete-lesson").addEventListener("click",()=>completeLesson(lesson.id));
  d.scrollIntoView({behavior:"smooth",block:"start"});
}

function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

$("start-button").addEventListener("click",()=>{if(requireLogin())showView("academy-view");});
$("back-home").addEventListener("click",()=>showView("welcome-view"));
$("back-levels").addEventListener("click",()=>{if(requireLogin())showView("academy-view");});
document.querySelectorAll("[data-level]").forEach(b=>b.addEventListener("click",()=>openLevel(b.dataset.level)));
$("auth-button").addEventListener("click",async()=>{if(currentUser){try{await signOut(auth);}catch(e){console.error(e);alert("No se pudo cerrar sesión.");}}else showLoginDialog();});
$("close-auth").addEventListener("click",()=>{if(currentUser)$("auth-dialog").close();else $("auth-message").textContent="Inicia sesión para continuar.";});
$("auth-dialog").addEventListener("cancel",e=>{if(!currentUser)e.preventDefault();});
$("auth-title").textContent="Accede a tu academia";$("auth-submit").textContent="Iniciar sesión";$("auth-toggle")?.classList.add("hidden");
$("auth-form").addEventListener("submit",async e=>{e.preventDefault();if(!auth){$("auth-message").textContent="Firebase no está disponible.";return;}$("auth-submit").disabled=true;$("auth-message").textContent="Comprobando acceso...";try{await signInWithEmailAndPassword(auth,$("auth-email").value.trim(),$("auth-password").value);$("auth-dialog").close();$("auth-form").reset();}catch(err){console.error(err);$("auth-message").textContent="No se pudo acceder. Comprueba el correo y la contraseña.";}finally{$("auth-submit").disabled=false;}});
try{
  const app=initializeApp(firebaseConfig);auth=getAuth(app);db=getFirestore(app);
  $("auth-message").textContent="Comprobando tu sesión...";$("auth-dialog").showModal();
  onAuthStateChanged(auth,async user=>{const old=currentUser?.uid;currentUser=user;$("auth-button").textContent=user?"Salir":"Acceder";if(user){if($("auth-dialog").open)$("auth-dialog").close();await loadProgress();}else{progress={completed:[],writing:{}};updateProgress();showView("welcome-view");showLoginDialog(old?"Has cerrado sesión. Identifícate para continuar.":"Inicia sesión para acceder a la academia.");}});
}catch(e){console.error(e);showLoginDialog("No se pudo conectar con Firebase. Comprueba la configuración.");}
updateProgress();
