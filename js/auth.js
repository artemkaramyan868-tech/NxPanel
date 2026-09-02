const userKey="nxpanel_user";
const loggedKey="nxpanel_logged";

document.getElementById("registerForm")?.addEventListener("submit",e=>{
  e.preventDefault();
  const user={
    username:document.getElementById("registerUsername").value.trim(),
    email:document.getElementById("registerEmail").value.trim(),
    password:document.getElementById("registerPassword").value
  };
  localStorage.setItem(userKey,JSON.stringify(user));
  localStorage.setItem(loggedKey,"true");
  location.href="index.html";
});

document.getElementById("loginForm")?.addEventListener("submit",e=>{
  e.preventDefault();
  const saved=JSON.parse(localStorage.getItem(userKey)||"null");
  const username=document.getElementById("loginUsername").value.trim();
  const password=document.getElementById("loginPassword").value;
  if(saved && saved.username===username && saved.password===password){
    localStorage.setItem(loggedKey,"true");
    location.href="index.html";
  }else{
    alert("Սխալ username կամ password։ Նախ գրանցվիր demo հաշիվ ստեղծելու համար։");
  }
});