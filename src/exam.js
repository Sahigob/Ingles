import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp, collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { courseData } from "./content.js";

const firebaseConfig = {
  apiKey: "AIzaSyCOlt2USTexZl1IJSYZreZ61npgdGEOpNk",
  authDomain: "ingles-2905b.firebaseapp.com",
  projectId: "ingles-2905b",
  storageBucket: "ingles-2905b.firebasestorage.app",
  messagingSenderId: "121961633395",
  appId: "1:121961633395:web:88a89e3e3c6bd185d0fc06",
  measurementId: "G-G992ZDLH12"
};

let auth=null,db=null,currentUser=null,resolveAuthReady;
const authReady=new Promise(resolve=>{resolveAuthReady=resolve;});
let authResolved=false,isFinishing=false,level="B1",parts=[],currentPart=0,answers={},writtenWork={},selfAssessment={},startedAt=0,remainingSeconds=45*60,timerInterval=null;
const $=id=>document.getElementById(id);
const escapeHtml=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function pick(items,n){return shuffle(items).slice(0,n);}
function collectPools(selectedLevel){
 const units=courseData[selectedLevel].units;
 const reading=[],listening=[],grammar=[],vocabulary=[],writing=[],speaking=[];
 units.forEach((unit,unitIndex)=>unit.lessons.forEach(lesson=>{
  if(lesson.skill==="Grammar")grammar.push(...(lesson.questions||[]).map(q=>({...q,source:unit.title})));
  if(lesson.skill==="Vocabulary")vocabulary.push(...(lesson.questions||[]).map(q=>({...q,source:unit.title})));
  (lesson.texts||[]).forEach(t=>reading.push({title:t.title,passage:t.passage,questions:(t.questions||[]).map(q=>({...q,source:t.title}))}));
  (lesson.tracks||[]).forEach(t=>listening.push({title:t.title,transcript:t.transcript,questions:(t.questions||[]).map(q=>({...q,source:t.title}))}));
  (lesson.tasks||[]).forEach(t=>writing.push({...t,source:unit.title}));
  (lesson.situations||[]).forEach(s=>speaking.push({...s,source:unit.title}));
  if(lesson.type==="writing"&&lesson.prompt)writing.push({title:lesson.title,prompt:lesson.prompt,source:unit.title,wordCount:"Según la consigna",tips:[]});
  if(lesson.type==="speaking"&&lesson.prompt)speaking.push({title:lesson.title,prompt:lesson.prompt,source:unit.title,usefulPhrases:[]});
 }));
 return {reading:reading.filter(x=>x.questions.length),listening:listening.filter(x=>x.questions.length),grammar,vocabulary,writing,speaking};
}
function buildExam(selectedLevel){
 const p=collectPools(selectedLevel);
 const readTexts=pick(p.reading,2),listenTracks=pick(p.listening,2);
 const readingQs=readTexts.flatMap(t=>t.questions),listeningQs=listenTracks.flatMap(t=>t.questions);
 const grammarQs=pick(p.grammar,10),vocabQs=pick(p.vocabulary,10);
 const writing=pick(p.writing,1)[0],speaking=pick(p.speaking,1)[0];
 if(readingQs.length<10||listeningQs.length<10||grammarQs.length<10||vocabQs.length<10||!writing||!speaking)throw new Error("No hay suficientes actividades en el banco para generar el examen.");
 return [
  {title:"Reading",skill:"Reading",type:"reading",texts:readTexts,questions:readingQs.slice(0,10)},
  {title:"Listening",skill:"Listening",type:"listening",tracks:listenTracks,questions:listeningQs.slice(0,10)},
  {title:"Grammar and Vocabulary",skill:"Use of English",type:"objective",groups:[{name:"Grammar",questions:grammarQs},{name:"Vocabulary",questions:vocabQs}],questions:[...grammarQs,...vocabQs]},
  {title:"Writing",skill:"Writing",type:"writing",task:writing},
  {title:"Speaking",skill:"Speaking",type:"speaking",task:speaking}
 ];
}
function configureFirebase(){
 try{
  const app=initializeApp(firebaseConfig);auth=getAuth(app);db=getFirestore(app);
  onAuthStateChanged(auth,user=>{
   currentUser=user;
   if(!authResolved){authResolved=true;resolveAuthReady(user);}
   if(user)loadHistory();else if(!isFinishing){clearInterval(timerInterval);timerInterval=null;window.location.replace("./index.html");}
  },error=>{console.error(error);if(!authResolved){authResolved=true;resolveAuthReady(null);}});
 }catch(error){console.error(error);if(!authResolved){authResolved=true;resolveAuthReady(null);}}
}
async function requireSignedIn(){await authReady;if(currentUser&&db)return true;alert("Inicia sesión en la academia antes de realizar un examen.");window.location.href="./index.html";return false;}
async function loadHistory(){
 if(!currentUser||!db)return;
 const host=$("exam-history-list");if(!host)return;
 host.innerHTML='<p class="exam-note">Cargando historial…</p>';
 try{
  const q=query(collection(db,"users",currentUser.uid,"examResults"),orderBy("completedAt","desc"),limit(10));
  const snap=await getDocs(q);
  if(!currentUser)return;
  if(snap.empty){host.innerHTML='<p class="exam-note">Todavía no hay exámenes guardados.</p>';return;}
  host.innerHTML=snap.docs.map(d=>{
   const x=d.data(),date=x.completedAt?.toDate?x.completedAt.toDate().toLocaleString("es-ES"):"Fecha no disponible";
   const skills=(x.skillResults||[]).map(s=>'<div class="result-row"><span>'+escapeHtml(s.skill)+'</span><strong>'+s.correct+'/'+s.total+' · '+s.percentage+'%</strong></div>').join("");
   const review=(x.answerReview||[]).map((a,i)=>'<article class="review-item"><p><strong>'+escapeHtml(a.skill||"")+' · '+(i+1)+'. '+escapeHtml(a.question||"")+'</strong></p><p class="'+(a.isCorrect?"review-correct":"review-wrong")+'">'+(a.isCorrect?"Correcta":"Incorrecta / sin contestar")+'</p><p>Respuesta correcta: '+escapeHtml(a.options?.[a.correctAnswer]??"No disponible")+'</p><p>'+escapeHtml(a.explanation||"")+'</p></article>').join("");
   const written=Object.entries(x.writtenWork||{}).map(([skill,w])=>'<p><strong>'+escapeHtml(skill)+'</strong> · Autoevaluación: '+escapeHtml(String(w.selfAssessment??"—"))+'/5</p><p>'+escapeHtml(w.response||"")+'</p>').join("");
   return '<article class="history-entry"><div class="history-row"><div><strong>'+escapeHtml(x.level||"")+' · '+escapeHtml(date)+'</strong><span>'+escapeHtml(String(x.correct??0))+' / '+escapeHtml(String(x.total??0))+' preguntas correctas · '+Math.round((x.durationSeconds||0)/60)+' min</span></div><strong>'+escapeHtml(String(x.percentage??0))+'%</strong></div><details><summary>Ver resultados y respuestas</summary><h4>Por destreza</h4>'+skills+'<h4>Writing y Speaking</h4>'+written+'<h4>Revisión de preguntas</h4>'+review+'</details></article>';
  }).join("");
 }catch(e){console.error("Historial de exámenes",e);host.innerHTML='<p class="exam-note">No se pudo cargar el historial. Comprueba los permisos de lectura de examResults.</p>';}
}
function speak(text){
 if(!("speechSynthesis"in window)){alert("Este navegador no dispone de síntesis de voz.");return;}
 speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(text));u.lang="en-GB";u.rate=.86;speechSynthesis.speak(u);
}
function startTimer(){
 clearInterval(timerInterval);
 timerInterval=setInterval(()=>{
  remainingSeconds--;const mm=Math.floor(remainingSeconds/60),ss=remainingSeconds%60;
  $("exam-timer").textContent=String(mm).padStart(2,"0")+":"+String(ss).padStart(2,"0");
  if(remainingSeconds<=0)finishExam();
 },1000);
}
async function startExam(){
 if(!(await requireSignedIn()))return;
 level=$("exam-level").value;
 try{parts=buildExam(level);}catch(e){alert(e.message);return;}
 currentPart=0;answers={};writtenWork={};selfAssessment={};remainingSeconds=45*60;startedAt=Date.now();isFinishing=false;
 $("exam-start").classList.add("hidden");$("exam-results").classList.add("hidden");$("exam-work").classList.remove("hidden");
 $("exam-level-label").textContent=level+" · EXAM";renderPart();startTimer();
}
function renderQuestion(q,index,partIndex){
 const key=partIndex+"-"+index,selected=answers[key];
 return '<div class="exam-question"><h4>'+(index+1)+'. '+escapeHtml(q.q)+'</h4>'+q.options.map((o,j)=>'<label><input type="radio" name="q-'+key+'" value="'+j+'" '+(selected===j?"checked":"")+'> '+escapeHtml(o)+'</label>').join("")+'</div>';
}
function renderPart(){
 const part=parts[currentPart];$("exam-section-title").textContent=part.title;
 $("question-counter").textContent="Parte "+(currentPart+1)+" de "+parts.length;
 $("exam-progress-bar").style.width=((currentPart+1)/parts.length*100)+"%";
 const host=$("exam-content");let content='<p class="eyebrow">'+escapeHtml(part.skill.toUpperCase())+'</p><h3>'+escapeHtml(part.title)+'</h3>';
 if(part.type==="reading"){
  part.texts.forEach((t,i)=>{content+='<div class="reading-text"><h4>Text '+(i+1)+': '+escapeHtml(t.title)+'</h4><p>'+escapeHtml(t.passage)+'</p></div>';});
  content+='<h4>Comprehension questions</h4>'+part.questions.map((q,i)=>renderQuestion(q,i,currentPart)).join("");
 }else if(part.type==="listening"){
  part.tracks.forEach((t,i)=>{content+='<div class="listening-box"><h4>Listening '+(i+1)+': '+escapeHtml(t.title)+'</h4><p>Listen carefully and answer the questions. You may replay the audio.</p><button type="button" class="button outline" data-play-track="'+i+'">▶ Listen</button></div>';});
  content+='<h4>Listening questions</h4>'+part.questions.map((q,i)=>renderQuestion(q,i,currentPart)).join("");
 }else if(part.type==="objective"){
  part.groups.forEach((g,groupIndex)=>{content+='<h4>'+g.name+'</h4>'+g.questions.map((q,i)=>renderQuestion(q,groupIndex*10+i,currentPart)).join("");});
 }else{
  const t=part.task;const taskText=t.prompt||t.title||"Complete the task.";
  content+='<div class="writing-task"><h4>'+escapeHtml(t.title||part.title)+'</h4><p>'+escapeHtml(taskText)+'</p>';
  if(t.wordCount)content+='<p><strong>Suggested length:</strong> '+escapeHtml(t.wordCount)+'</p>';
  if(t.tips?.length)content+='<ul>'+t.tips.map(x=>'<li>'+escapeHtml(x)+'</li>').join("")+'</ul>';
  if(t.usefulPhrases?.length)content+='<h4>Useful phrases</h4><ul>'+t.usefulPhrases.map(x=>'<li>'+escapeHtml(x)+'</li>').join("")+'</ul>';
  content+='<label for="exam-response">Your response / preparation notes</label><textarea id="exam-response" rows="10" placeholder="Write your response or speaking notes…">'+escapeHtml(writtenWork[currentPart]||"")+'</textarea>';
  if(part.type==="speaking")content+='<p class="exam-note">Graba tu respuesta con un dispositivo si deseas conservar audio; esta academia guarda aquí tus notas, no una grabación.</p>';
  content+='<label for="self-rating">Autoevaluación (1 = necesito practicar, 5 = lo domino)</label><select id="self-rating"><option value="">Selecciona…</option>'+[1,2,3,4,5].map(n=>'<option value="'+n+'" '+(selfAssessment[currentPart]===n?"selected":"")+'>'+n+'</option>').join("")+'</select></div>';
 }
 host.innerHTML=content;
 host.querySelectorAll('input[type="radio"]').forEach(input=>input.addEventListener("change",e=>{answers[e.target.name.slice(2)]=Number(e.target.value);}));
 $("exam-response")?.addEventListener("input",e=>writtenWork[currentPart]=e.target.value);
 $("self-rating")?.addEventListener("change",e=>selfAssessment[currentPart]=e.target.value?Number(e.target.value):null);
 host.querySelectorAll("[data-play-track]").forEach(b=>b.addEventListener("click",()=>speak(part.tracks[Number(b.dataset.playTrack)].transcript)));
 $("previous-question").disabled=currentPart===0;
 $("next-question").textContent=currentPart===parts.length-1?"Ver resultados →":"Siguiente →";
}
function calculateResults(){
 const details=[],bySkill={},breakdown=[];let total=0,correct=0;
 parts.forEach((part,partIndex)=>{
  if(!part.questions)return;
  let partCorrect=0;
  part.questions.forEach((q,i)=>{
   const selected=answers[partIndex+"-"+i],ok=selected===q.answer;
   total++;if(ok){correct++;partCorrect++;}
   const skill=part.type==="objective"?(i<10?"Grammar":"Vocabulary"):part.skill;
   bySkill[skill]??={correct:0,total:0};bySkill[skill].total++;if(ok)bySkill[skill].correct++;
   details.push({part:part.title,skill,question:q.q,options:q.options,selected:selected??null,correctAnswer:q.answer,isCorrect:ok,explanation:q.explanation||"",source:q.source||""});
  });
  breakdown.push({title:part.title,correct:partCorrect,total:part.questions.length});
 });
 const skillResults=Object.entries(bySkill).map(([skill,x])=>({skill,...x,percentage:Math.round(x.correct/x.total*100)}));
 return {total,correct,percentage:total?Math.round(correct/total*100):0,breakdown,skillResults,details};
}
async function finishExam(){
 if(isFinishing)return;isFinishing=true;clearInterval(timerInterval);timerInterval=null;window.speechSynthesis?.cancel();
 await authReady;
 if(!currentUser||!db){isFinishing=false;alert("Tu sesión ha terminado. Vuelve a iniciar sesión.");window.location.href="./index.html";return;}
 const user=currentUser,result=calculateResults(),durationSeconds=Math.max(0,Math.round((Date.now()-startedAt)/1000));
 $("exam-work").classList.add("hidden");$("exam-results").classList.remove("hidden");
 $("result-score").textContent=result.percentage+"%";
 $("result-message").textContent=result.percentage>=80?"Muy buen resultado en las preguntas objetivas.":result.percentage>=60?"Buen trabajo. Revisa los errores por destreza.":"Conviene repasar las destrezas con menor puntuación y repetir el examen.";
 $("result-skills").innerHTML=result.skillResults.map(x=>'<div class="result-row"><span>'+escapeHtml(x.skill)+'</span><strong>'+x.correct+'/'+x.total+' · '+x.percentage+'%</strong></div>').join("");
 $("result-breakdown").innerHTML=result.breakdown.map(x=>'<div class="result-row"><span>'+escapeHtml(x.title)+'</span><strong>'+x.correct+' / '+x.total+'</strong></div>').join("");
 $("result-review").innerHTML=result.details.map((x,i)=>'<article class="review-item"><p><strong>'+escapeHtml(x.skill)+' · '+(i+1)+'. '+escapeHtml(x.question)+'</strong></p><p class="'+(x.isCorrect?"review-correct":"review-wrong")+'">'+(x.isCorrect?"Correct":"Incorrect / unanswered")+' · Correct answer: '+escapeHtml(x.options[x.correctAnswer])+(x.selected===null?" · No contestada":"")+'</p><p>'+escapeHtml(x.explanation)+'</p></article>').join("");
 const writingParts=parts.filter(x=>x.type==="writing"||x.type==="speaking");
 $("result-writing").innerHTML=writingParts.map(x=>{const idx=parts.indexOf(x),v=writtenWork[idx]||"";return '<div class="result-row"><span>'+escapeHtml(x.skill)+' · '+escapeHtml(x.task.title||x.title)+'</span><strong>'+v.trim().length+' caracteres · Autoevaluación '+(selfAssessment[idx]||"—")+'/5</strong></div><details><summary>Ver respuesta / notas</summary><p>'+escapeHtml(v)+'</p></details>';}).join("");
 const record={level,percentage:result.percentage,correct:result.correct,total:result.total,breakdown:result.breakdown,skillResults:result.skillResults,answerReview:result.details,writtenWork:Object.fromEntries(writingParts.map(x=>{const i=parts.indexOf(x);return [x.skill,{title:x.task.title||x.title,response:writtenWork[i]||"",selfAssessment:selfAssessment[i]||null}];})),durationSeconds,completedAt:serverTimestamp(),schemaVersion:2};
 try{
  const examId=level+"-"+Date.now();
  await setDoc(doc(db,"users",user.uid,"examResults",examId),record);
  $("result-message").textContent+=" Resultado detallado guardado en tu cuenta.";
  await loadHistory();
 }catch(error){console.error("No se pudo guardar el examen:",error);$("result-message").textContent+=" No se pudo guardar el resultado en Firebase.";}
}
$("begin-exam").addEventListener("click",startExam);
$("previous-question").addEventListener("click",()=>{if(currentPart>0){currentPart--;renderPart();}});
$("next-question").addEventListener("click",()=>{if(currentPart<parts.length-1){currentPart++;renderPart();}else finishExam();});
$("finish-exam").addEventListener("click",()=>{if(confirm("¿Quieres finalizar el examen y ver tus resultados? Las preguntas sin contestar contarán como incorrectas."))finishExam();});
$("retry-exam").addEventListener("click",()=>{$("exam-results").classList.add("hidden");$("exam-start").classList.remove("hidden");loadHistory();});
configureFirebase();
