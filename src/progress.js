import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { courseData } from "./content.js";
const firebaseConfig={apiKey:"AIzaSyB5Kj2vXc9wQm7rP4nL8tY6uF3aD1eG0hI",authDomain:"ingles-2905b.firebaseapp.com",projectId:"ingles-2905b",storageBucket:"ingles-2905b.firebasestorage.app",messagingSenderId:"121961633395",appId:"1:121961633395:web:88a89e3e3c6bd185d0fc06",measurementId:"G-G992ZDLH12"};
const $=id=>document.getElementById(id),safe=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);
const pct=(a,b)=>b?Math.round(a/b*100):0,date=x=>x?.toDate?x.toDate().toLocaleDateString("es-ES"):"Fecha no disponible";
function bar(label,value,detail=""){return '<div class="evolution-bar-row"><div class="evolution-bar-label"><span>'+safe(label)+'</span><strong>'+value+'% · '+safe(detail)+'</strong></div><div class="evolution-bar"><span style="width:'+Math.min(100,Math.max(0,value))+'%"></span></div></div>';}
function render(progress,exams){
 const completed=Array.isArray(progress.completed)?progress.completed:[];
 const units=["B1","B2"].flatMap(level=>courseData[level].units.map(u=>({level,title:u.title,total:u.lessons.length,done:u.lessons.filter(l=>completed.includes(l.id)).length})));
 const count=units.reduce((a,x)=>a+x.total,0),done=units.reduce((a,x)=>a+x.done,0);
 const average=exams.length?Math.round(exams.reduce((a,x)=>a+(Number(x.percentage)||0),0)/exams.length):null;
 const best=exams.length?Math.max(...exams.map(x=>Number(x.percentage)||0)):null;
 $("evolution-kpis").innerHTML=[["Lecciones completadas",done+"/"+count,pct(done,count)+"% del curso"],["Exámenes realizados",exams.length,"Últimos 10 intentos"],["Media de exámenes",average===null?"—":average+"%","Puntuación objetiva"],["Mejor resultado",best===null?"—":best+"%","Entre los intentos disponibles"]].map(x=>'<article class="evolution-kpi"><span>'+safe(x[0])+'</span><strong>'+safe(x[1])+'</strong><small>'+safe(x[2])+'</small></article>').join("");
 const b1=units.filter(x=>x.level==="B1"),b2=units.filter(x=>x.level==="B2");
 $("course-progress").innerHTML=bar("Curso completo",pct(done,count),done+"/"+count+" lecciones")+bar("B1 · Intermediate",pct(b1.reduce((a,x)=>a+x.done,0),b1.reduce((a,x)=>a+x.total,0)),b1.reduce((a,x)=>a+x.done,0)+"/"+b1.reduce((a,x)=>a+x.total,0))+bar("B2 · Upper-intermediate",pct(b2.reduce((a,x)=>a+x.done,0),b2.reduce((a,x)=>a+x.total,0)),b2.reduce((a,x)=>a+x.done,0)+"/"+b2.reduce((a,x)=>a+x.total,0));
 const skills={};exams.forEach(e=>(e.skillResults||[]).forEach(s=>{skills[s.skill]??={correct:0,total:0};skills[s.skill].correct+=Number(s.correct)||0;skills[s.skill].total+=Number(s.total)||0;}));
 const rows=Object.entries(skills).map(([name,x])=>({name,...x,pct:pct(x.correct,x.total)})).sort((a,b)=>a.pct-b.pct);
 $("skill-progress").innerHTML=rows.length?rows.map(x=>bar(x.name,x.pct,x.correct+"/"+x.total+" respuestas")).join(""):'<p class="exam-note">Realiza un examen para empezar a reunir resultados por destreza.</p>';
 const tips=[];if(!exams.length)tips.push("Realiza tu primer examen para obtener una referencia inicial.");
 rows.filter(x=>x.pct<70).forEach(x=>tips.push("Refuerza "+x.name+": tu media en los últimos exámenes disponibles es del "+x.pct+"%. Revisa las explicaciones de tus errores."));
 units.filter(x=>x.done<x.total).sort((a,b)=>a.done/a.total-b.done/b.total).slice(0,4).forEach(x=>tips.push("Continúa "+x.level+" · "+x.title+": llevas "+x.done+" de "+x.total+" lecciones."));
 if(exams.length&&rows.length&&rows.every(x=>x.pct>=70))tips.push("Tus medias por destreza son iguales o superiores al 70%. Mantén la práctica para consolidarlas.");
 $("study-recommendations").innerHTML='<ul>'+tips.map(x=>'<li>'+safe(x)+'</li>').join("")+'</ul>';
 $("exam-trend").innerHTML=exams.length?'<div class="exam-trend-list">'+[...exams].reverse().map(x=>'<div class="exam-trend-item"><span>'+safe(x.level)+' · '+safe(date(x.completedAt))+'</span><strong>'+safe(x.percentage??0)+'%</strong></div>').join("")+'</div>':'<p class="exam-note">La evolución aparecerá cuando completes exámenes.</p>';
 $("exam-list").innerHTML=exams.length?exams.map(x=>'<article class="history-row"><div><strong>'+safe(x.level)+' · '+safe(date(x.completedAt))+'</strong><span>'+safe(x.correct??0)+'/'+safe(x.total??0)+' correctas · '+Math.round((Number(x.durationSeconds)||0)/60)+' min</span></div><strong>'+safe(x.percentage??0)+'%</strong></article>').join(""):'<p class="exam-note">Todavía no hay exámenes guardados.</p>';
}
onAuthStateChanged(auth,async user=>{
 if(!user){$("evolution-status").innerHTML='Inicia sesión en la academia para consultar tu evolución. <a href="./index.html">Volver al inicio</a>';return;}
 $("evolution-status").textContent="Cargando tus datos de Firebase…";
 try{
  const [p,e]=await Promise.all([getDoc(doc(db,"users",user.uid,"private","progress")),getDocs(query(collection(db,"users",user.uid,"examResults"),orderBy("completedAt","desc"),limit(10)))]);
  if(auth.currentUser?.uid!==user.uid)return;
  render(p.exists()?p.data():{},e.docs.map(d=>d.data()));
  $("evolution-status").textContent="Datos consultados desde Firebase · Últimos 10 exámenes.";
  $("evolution-content").classList.remove("hidden");
 }catch(err){console.error(err);$("evolution-status").textContent="No se han podido cargar los datos. Comprueba la conexión y los permisos de Firestore.";}
});
