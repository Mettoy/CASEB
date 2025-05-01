async function responder() {
  const input = document.getElementById("userInput");
  const chatLog = document.getElementById("chatLog");
  const pregunta = input.value.trim();
  if (!pregunta) return;

  const userMsg = document.createElement("div");
  userMsg.className = "bubble user";
  userMsg.innerText = pregunta;
  chatLog.appendChild(userMsg);

  const res = await fetch("/preguntar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pregunta })
  });
  const data = await res.json();

  const botMsg = document.createElement("div");
  botMsg.className = "bubble bot";
  botMsg.innerText = data.respuesta;
  chatLog.appendChild(botMsg);

  input.value = "";
  chatLog.scrollTop = chatLog.scrollHeight;
}

function toggleMode() {
  document.body.classList.toggle("dark");
}
