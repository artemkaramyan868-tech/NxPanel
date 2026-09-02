const logged=localStorage.getItem("nxpanel_logged");
if(!logged){ location.href="login.html"; }

const user=JSON.parse(localStorage.getItem("nxpanel_user")||'{"username":"Nyrox"}');
let projects=JSON.parse(localStorage.getItem("nxpanel_projects")||"null") || [
  {name:"NXLauncher",desc:"Minecraft launcher project",tag:"JavaScript"},
  {name:"NyPay UI",desc:"Modern payment dashboard concept",tag:"HTML/CSS"},
  {name:"Minecraft Store",desc:"Store interface concept",tag:"Frontend"}
];

const content=document.getElementById("pageContent");
const searchInput=document.getElementById("searchInput");

function save(){localStorage.setItem("nxpanel_projects",JSON.stringify(projects));}

function render(page="dashboard"){
  document.querySelectorAll(".nav-item[data-page]").forEach(a=>a.classList.toggle("active",a.dataset.page===page));
  const filtered=projects.filter(p=>(p.name+" "+p.desc).toLowerCase().includes((searchInput.value||"").toLowerCase()));
  if(page==="dashboard") content.innerHTML=`
    <div class="hero"><div><div class="eyebrow">NX DASHBOARD</div><h1>Բարի գալուստ, ${escapeHTML(user.username)} 👋</h1><p>Կառավարիր քո նախագծերը մեկ գեղեցիկ dashboard-ից։</p></div><button class="primary" onclick="openModal()">＋ Create New</button></div>
    <div class="stats">
      <div class="card"><div class="stat-label">Total Projects</div><div class="stat-value">${projects.length}</div></div>
      <div class="card"><div class="stat-label">Active Projects</div><div class="stat-value">${projects.length}</div></div>
      <div class="card"><div class="stat-label">Status</div><div class="stat-value">Online</div></div>
    </div>
    <div class="grid">
      <div class="card"><div class="section-title"><h2>Recent Projects</h2><span class="muted">${projects.length} total</span></div>${projectList(filtered.slice(0,4))}</div>
      <div class="card"><div class="section-title"><h2>Quick Actions</h2></div><div class="activity"><div><strong>＋ Create New</strong><p>Ստեղծիր նոր նախագիծ</p></div><div><strong>⚙ Settings</strong><p>Փոխիր dashboard-ի կարգավորումները</p></div><div><strong>◷ Activity</strong><p>Տես վերջին գործողությունները</p></div></div></div>
    </div>`;
  if(page==="projects") content.innerHTML=`<div class="hero"><div><div class="eyebrow">WORKSPACE</div><h1>Projects</h1><p>Քո բոլոր նախագծերը մեկ տեղում։</p></div><button class="primary" onclick="openModal()">＋ Create New</button></div><div class="card">${projectList(filtered)}</div>`;
  if(page==="create") content.innerHTML=`<div class="hero"><div><div class="eyebrow">NEW PROJECT</div><h1>Create New</h1><p>Ավելացրու նոր նախագիծ քո workspace-ում։</p></div></div><div class="card form-card"><label>Project name<input id="inlineName" class="field" placeholder="My awesome project"></label><label>Description<input id="inlineDesc" class="field" placeholder="What are you building?"></label><button class="primary full" onclick="createInline()">Create Project</button></div>`;
  if(page==="activity") content.innerHTML=`<div class="hero"><div><div class="eyebrow">TIMELINE</div><h1>Activity</h1><p>Վերջին գործողությունները։</p></div></div><div class="card"><div class="activity"><div><strong>Dashboard opened</strong><p>Just now</p></div><div><strong>Projects loaded</strong><p>${projects.length} projects found</p></div><div><strong>Account active</strong><p>${escapeHTML(user.username)}</p></div></div></div>`;
  if(page==="settings") content.innerHTML=`<div class="hero"><div><div class="eyebrow">PREFERENCES</div><h1>Settings</h1><p>Կառավարիր քո dashboard-ը։</p></div></div><div class="card form-card"><div class="settings-row"><span>Dark mode</span><button class="icon-btn" onclick="toggleTheme()">☼</button></div><div class="settings-row"><span>Username</span><strong>${escapeHTML(user.username)}</strong></div><div class="settings-row"><span>Projects</span><strong>${projects.length}</strong></div></div>`;
}

function projectList(list){
  if(!list.length) return '<p class="muted">Նախագիծ չի գտնվել։</p>';
  return `<div class="project-list">${list.map(p=>`<div class="project"><div class="project-info"><div class="project-icon">▣</div><div><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.desc)}</p></div></div><span class="tag">${escapeHTML(p.tag||"Frontend")}</span></div>`).join("")}</div>`;
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function openModal(){document.getElementById("projectModal").classList.remove("hidden");}
function closeModal(){document.getElementById("projectModal").classList.add("hidden");}
function createProject(name,desc){
  if(!name.trim()) return alert("Գրիր project-ի անունը։");
  projects.unshift({name:name.trim(),desc:desc.trim()||"New project",tag:"Frontend"});
  save(); closeModal(); location.hash="#projects"; render("projects");
}
function createInline(){createProject(document.getElementById("inlineName").value,document.getElementById("inlineDesc").value);}
function toggleTheme(){document.body.classList.toggle("light");localStorage.setItem("nxpanel_theme",document.body.classList.contains("light")?"light":"dark");}
function route(){render((location.hash||"#dashboard").slice(1)||"dashboard");}
window.openModal=openModal; window.toggleTheme=toggleTheme; window.createInline=createInline;

if(localStorage.getItem("nxpanel_theme")==="light") document.body.classList.add("light");
document.querySelectorAll(".nav-item[data-page]").forEach(a=>a.addEventListener("click",()=>document.getElementById("sidebar").classList.remove("open")));
document.getElementById("menuBtn").onclick=()=>document.getElementById("sidebar").classList.toggle("open");
document.getElementById("themeBtn").onclick=toggleTheme;
document.getElementById("profileBtn").onclick=()=>location.hash="#settings";
document.getElementById("logoutBtn").onclick=()=>{localStorage.removeItem(loggedKey);location.href="login.html";};
document.getElementById("closeModal").onclick=closeModal;
document.getElementById("saveProject").onclick=()=>createProject(document.getElementById("projectName").value,document.getElementById("projectDesc").value);
document.getElementById("projectModal").addEventListener("click",e=>{if(e.target.id==="projectModal")closeModal();});
searchInput.addEventListener("input",()=>render((location.hash||"#dashboard").slice(1)));
window.addEventListener("hashchange",route);
route();