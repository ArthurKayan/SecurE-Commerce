const incidents=[
{id:"#1042",name:"Possível comprometimento de conta",source:"E-commerce",severity:"critical",risk:87,status:"investigating",time:"2 min"},
{id:"#1041",name:"Múltiplas tentativas de login",source:"API",severity:"high",risk:71,status:"open",time:"8 min"},
{id:"#1040",name:"IP com comportamento suspeito",source:"PDV-03",severity:"high",risk:64,status:"investigating",time:"21 min"},
{id:"#1039",name:"Acesso fora do horário",source:"Admin Portal",severity:"medium",risk:42,status:"resolved",time:"38 min"},
{id:"#1038",name:"Falhas consecutivas de autenticação",source:"PDV-12",severity:"medium",risk:38,status:"resolved",time:"1 h"},
{id:"#1037",name:"Novo dispositivo detectado",source:"E-commerce",severity:"low",risk:19,status:"resolved",time:"2 h"}];

const events=[
["19:31:42","LOGIN_FAILED","E-commerce","admin","185.23.91.14","high",71],
["19:30:08","LOGIN_SUCCESS","Admin Portal","admin","185.23.91.14","medium",42],
["19:28:17","API_ACCESS","E-commerce","service-api","10.0.0.14","low",8],
["19:26:51","LOGIN_FAILED","PDV-03","operator","192.168.1.42","medium",38],
["19:24:10","PASSWORD_CHANGED","E-commerce","cliente123","177.42.11.8","high",64],
["19:22:33","ORDER_CREATED","E-commerce","cliente123","177.42.11.8","low",5],
["19:20:02","LOGIN_FAILED","PDV-12","operator","192.168.1.51","medium",31],
["19:18:45","API_ACCESS","E-commerce","service-api","10.0.0.14","low",4]];

const devices=[
["PDV-01","Windows 11","online","Há 12 segundos","192.168.1.21"],
["PDV-02","Windows 11","online","Há 18 segundos","192.168.1.22"],
["PDV-03","Windows 11","offline","Há 2 horas","192.168.1.42"],
["PDV-04","Windows 11","online","Há 7 segundos","192.168.1.24"],
["SERVIDOR-01","Ubuntu Server","online","Há 4 segundos","10.0.0.10"],
["PDV-12","Windows 10","online","Há 29 segundos","192.168.1.51"]];

const sev={critical:"Crítico",high:"Alto",medium:"Médio",low:"Baixo"};
const status={open:"Aberto",investigating:"Investigando",resolved:"Resolvido"};

function toast(msg,type="success"){const c=document.getElementById("toastContainer"),t=document.createElement("div");t.className=`toast ${type}`;t.textContent=msg;c.appendChild(t);setTimeout(()=>t.remove(),3200)}

function incidentRow(i,compact=false){return `<tr ${compact?'data-open-incident="'+i.id+'"':''}>
${compact?"":`<td class="mono">${i.id}</td>`}<td class="incident-name">${i.name}</td><td>${i.source}</td>
${compact?`<td><span class="badge ${i.severity}">${sev[i.severity]}</span></td>`:`<td><span class="badge ${i.severity}">${sev[i.severity]}</span></td>`}
<td class="mono">${i.risk}/100</td><td><span class="badge ${i.status}">${status[i.status]}</span></td><td>${i.time}</td></tr>`}

function renderIncidents(list=incidents){
 const a=document.getElementById("incidentTable"),b=document.getElementById("incidentsFullTable");
 if(a)a.innerHTML=incidents.slice(0,4).map(i=>incidentRow(i,true)).join("");
 if(b)b.innerHTML=list.map(i=>incidentRow(i,false)).join("");
 document.querySelectorAll("[data-open-incident]").forEach(x=>x.addEventListener("click",()=>openIncident(x.dataset.openIncident)));
}
function renderEvents(list=events){const t=document.getElementById("eventsTable");if(!t)return;t.innerHTML=list.map(e=>`<tr><td class="mono">${e[0]}</td><td class="incident-name">${e[1]}</td><td>${e[2]}</td><td>${e[3]}</td><td class="mono">${e[4]}</td><td><span class="badge ${e[5]}">${sev[e[5]]}</span></td><td class="mono">${e[6]}</td></tr>`).join("")}
function renderDevices(){const g=document.getElementById("deviceGrid");if(!g)return;g.innerHTML=devices.map(d=>`<article class="device-card"><div class="device-head"><div class="device-icon">▣</div><span class="${d[2]==="online"?"online":"offline"}">● ${d[2]==="online"?"Online":"Offline"}</span></div><h3>${d[0]}</h3><p>${d[1]}</p><div class="device-meta"><span>${d[4]}</span><span>${d[3]}</span></div></article>`).join("")}
function renderActivity(){const f=document.getElementById("activityFeed");if(!f)return;const items=[["⚠","Incidente crítico detectado","Possível comprometimento de conta","2 min"],["◉","1.284 eventos processados","Event Engine","5 min"],["▣","PDV-03 ficou offline","Sentinel Agent","21 min"],["✓","Incidente #1039 resolvido","Admin Portal","38 min"],["⌁","Integração API sincronizada","REST API","1 h"]];f.innerHTML=items.map(x=>`<div class="activity-item"><div class="activity-icon">${x[0]}</div><div><strong>${x[1]}</strong><p>${x[2]}</p></div><span class="activity-time">${x[3]}</span></div>`).join("")}

function navigate(page){
 document.querySelectorAll(".page").forEach(p=>p.classList.remove("active-page"));document.getElementById(page)?.classList.add("active-page");
 document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.page===page));
 const active=document.querySelector(`[data-page="${page}"]`);document.getElementById("pageTitle").textContent=active?active.textContent.trim().replace(/\s+\d+$/,""):page;
 document.getElementById("sidebar").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"});
}

let eventsChart,riskChart;
function setupCharts(){
 const c=document.getElementById("eventsChart");if(c&&window.Chart){
  const ctx=c.getContext("2d"),g=ctx.createLinearGradient(0,0,0,240);g.addColorStop(0,"rgba(53,212,154,.22)");g.addColorStop(1,"rgba(53,212,154,0)");
  eventsChart=new Chart(ctx,{type:"line",data:{labels:["00h","02h","04h","06h","08h","10h","12h","14h","16h","18h","20h","22h"],datasets:[{data:[310,240,180,270,420,610,540,720,890,760,1020,840],borderColor:"#35d49a",backgroundColor:g,fill:true,tension:.4,pointRadius:0,pointHoverRadius:4,borderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{color:"#596679",font:{size:9}}},y:{grid:{color:"rgba(40,50,65,.45)"},ticks:{color:"#596679",font:{size:9}}}}}});
 }
 const r=document.getElementById("riskChart");if(r&&window.Chart)riskChart=new Chart(r,{type:"line",data:{labels:["-6d","-5d","-4d","-3d","-2d","-1d","Hoje"],datasets:[{data:[64,66,65,69,67,70,72],borderColor:"#35d49a",borderWidth:2,tension:.4,pointRadius:0,fill:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{display:false},y:{display:false}}}});
}

function openIncident(id){document.getElementById("incidentModal").classList.add("open");document.body.style.overflow="hidden"}
function closeModal(){document.getElementById("incidentModal").classList.remove("open");document.body.style.overflow=""}

function showAuth(type){document.getElementById("loginForm").classList.toggle("hidden",type!=="login");document.getElementById("registerForm").classList.toggle("hidden",type!=="register")}

document.querySelectorAll("[data-auth]").forEach(b=>b.addEventListener("click",()=>showAuth(b.dataset.auth)));
document.getElementById("togglePassword")?.addEventListener("click",()=>{const i=document.getElementById("loginPassword");i.type=i.type==="password"?"text":"password"});
document.getElementById("loginButton")?.addEventListener("click",()=>{const b=document.getElementById("loginButton");b.textContent="Autenticando...";setTimeout(()=>{document.getElementById("authScreen").classList.add("hidden");document.getElementById("appShell").classList.remove("hidden");b.innerHTML='Entrar no SentinelRetail <span>→</span>';toast("Login realizado com sucesso.")},700)});
document.getElementById("registerButton")?.addEventListener("click",()=>{const name=document.getElementById("companyName").value.trim();if(!name){toast("Informe o nome da empresa.","warning");return}showAuth("login");document.getElementById("loginEmail").value="admin@"+name.toLowerCase().replace(/\s+/g,"")+".com";toast("Ambiente criado. Faça login para continuar.")});
document.getElementById("logoutButton")?.addEventListener("click",()=>{document.getElementById("appShell").classList.add("hidden");document.getElementById("authScreen").classList.remove("hidden");showAuth("login");toast("Sessão encerrada.","warning")});

document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.page)));
document.querySelectorAll("[data-page-link]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.pageLink)));
document.getElementById("mobileMenu")?.addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));
document.querySelectorAll("[data-close-modal]").forEach(b=>b.addEventListener("click",closeModal));
document.getElementById("incidentModal")?.addEventListener("click",e=>{if(e.target.id==="incidentModal")closeModal()});

document.getElementById("scanButton")?.addEventListener("click",e=>{const b=e.currentTarget;b.disabled=true;b.textContent="⟳ Analisando...";setTimeout(()=>{b.disabled=false;b.textContent="↻ Executar análise";toast("Análise concluída. Nenhuma nova ameaça crítica.")},1500)});
document.getElementById("notificationButton")?.addEventListener("click",()=>toast("Você possui 4 incidentes ativos.","warning"));
document.getElementById("simulateEvent")?.addEventListener("click",()=>{const t=new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit",second:"2-digit"});events.unshift([t,"LOGIN_FAILED","E-commerce","demo-user","203.0.113.42","high",76]);renderEvents();navigate("events");toast("Evento simulado recebido pelo Event Engine.")});
document.getElementById("generateReport")?.addEventListener("click",()=>toast("Relatório de demonstração gerado."));
document.getElementById("addDevice")?.addEventListener("click",()=>toast("Fluxo de instalação do Sentinel Agent iniciado."));
document.getElementById("newIncident")?.addEventListener("click",()=>toast("O backend abrirá aqui o fluxo de criação de incidente.","warning"));
document.getElementById("createKey")?.addEventListener("click",()=>toast("Nova API Key criada para demonstração."));
document.getElementById("saveWebhook")?.addEventListener("click",()=>toast("Webhook salvo com sucesso."));
document.getElementById("copyCode")?.addEventListener("click",()=>navigator.clipboard?.writeText(document.querySelector(".code-panel code").innerText).then(()=>toast("Exemplo copiado.")));
document.querySelectorAll(".copy-key").forEach(b=>b.addEventListener("click",()=>navigator.clipboard?.writeText(b.dataset.copy).then(()=>toast("API Key copiada."))));
document.getElementById("copyDocsUrl")?.addEventListener("click",()=>navigator.clipboard?.writeText("https://api.sentinelretail.local/docs").then(()=>toast("URL da documentação copiada.")));
document.getElementById("blockIp")?.addEventListener("click",()=>{toast("IP 185.23.91.14 marcado para bloqueio.","warning");closeModal()});
document.getElementById("forceReset")?.addEventListener("click",()=>toast("Solicitação de reset enviada ao Identity Engine."));
document.getElementById("assignIncident")?.addEventListener("click",()=>toast("Incidente atribuído ao usuário atual."));
document.getElementById("resolveIncident")?.addEventListener("click",()=>{incidents[0].status="resolved";renderIncidents();toast("Incidente #1042 marcado como resolvido.");closeModal()});

document.getElementById("incidentSearch")?.addEventListener("input",e=>{const q=e.target.value.toLowerCase();renderIncidents(incidents.filter(i=>`${i.id} ${i.name} ${i.source}`.toLowerCase().includes(q)))});
document.getElementById("severityFilter")?.addEventListener("change",e=>renderIncidents(e.target.value==="all"?incidents:incidents.filter(i=>i.severity===e.target.value)));
document.getElementById("eventSearch")?.addEventListener("input",e=>{const q=e.target.value.toLowerCase();renderEvents(events.filter(x=>x.join(" ").toLowerCase().includes(q)))});
document.querySelectorAll(".switch input").forEach(i=>i.addEventListener("change",()=>toast(i.checked?"Configuração ativada.":"Configuração desativada.",i.checked?"success":"warning")));

document.getElementById("themeButton")?.addEventListener("click",()=>{document.body.classList.toggle("light-theme");document.getElementById("themeButton").textContent=document.body.classList.contains("light-theme")?"☀":"☾";toast("Tema alterado.")});

renderIncidents();renderEvents();renderDevices();renderActivity();setupCharts();
