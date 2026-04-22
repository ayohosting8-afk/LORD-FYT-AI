const messagesEl = document.getElementById("messages");
const form = document.getElementById("composer");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");
const clearBtn = document.getElementById("clear");
const statusText = document.getElementById("status-text");

let history = [];
let firstMessage = true;

function autoGrow() {
  input.style.height = "auto";
  input.style.height = Math.min(input.scrollHeight, 200) + "px";
}
input.addEventListener("input", autoGrow);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    form.requestSubmit();
  }
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    input.value = chip.dataset.prompt;
    autoGrow();
    input.focus();
    form.requestSubmit();
  });
});

clearBtn.addEventListener("click", () => {
  history = [];
  messagesEl.innerHTML = "";
  firstMessage = true;
  renderWelcome();
});

function renderWelcome() {
  messagesEl.innerHTML = `
    <div class="welcome">
      <div class="welcome-glow"></div>
      <h2>Hello, I'm <span class="grad-text">LORD-FYT AI</span></h2>
      <p>Ask me anything — ideas, code, writing, learning. I'm here to help.</p>
      <div class="suggestions">
        <button class="chip" data-prompt="Explain quantum computing in simple terms">Explain quantum computing</button>
        <button class="chip" data-prompt="Write a short poem about the ocean at midnight">Write a midnight poem</button>
        <button class="chip" data-prompt="Give me 5 startup ideas in renewable energy">5 startup ideas</button>
        <button class="chip" data-prompt="Help me plan a productive day">Plan my day</button>
      </div>
    </div>`;
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      input.value = chip.dataset.prompt;
      autoGrow();
      input.focus();
      form.requestSubmit();
    });
  });
}

function addMessage(role, text) {
  const msg = document.createElement("div");
  msg.className = `msg ${role}`;
  const initial = role === "user" ? "YOU" : "LF";
  msg.innerHTML = `
    <div class="avatar">${initial}</div>
    <div class="bubble"></div>
  `;
  msg.querySelector(".bubble").textContent = text;
  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return msg.querySelector(".bubble");
}

function addTyping() {
  const msg = document.createElement("div");
  msg.className = "msg ai";
  msg.id = "typing-msg";
  msg.innerHTML = `
    <div class="avatar">LF</div>
    <div class="bubble"><div class="typing"><span></span><span></span><span></span></div></div>
  `;
  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById("typing-msg");
  if (t) t.remove();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  if (firstMessage) {
    messagesEl.innerHTML = "";
    firstMessage = false;
  }

  addMessage("user", text);
  history.push({ role: "user", content: text });
  input.value = "";
  autoGrow();
  sendBtn.disabled = true;
  statusText.textContent = "Thinking…";
  addTyping();

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });
    const data = await res.json();
    removeTyping();

    if (!res.ok) {
      addMessage("ai", data?.error || "Something went wrong.");
    } else {
      addMessage("ai", data.reply);
      history.push({ role: "assistant", content: data.reply });
    }
  } catch (err) {
    removeTyping();
    addMessage("ai", "Network error. Please check your connection and try again.");
  } finally {
    sendBtn.disabled = false;
    statusText.textContent = "Online";
    input.focus();
  }
});

autoGrow();


  // --- Background audio ---
  const audio = document.getElementById("bg-audio");
  const audioBtn = document.getElementById("audio-toggle");
  const icMute = document.getElementById("ic-mute");
  const icSound = document.getElementById("ic-sound");
  let audioOn = false;

  if (audio) {
    audio.volume = 0.35;
    function setIcons() {
      icMute.style.display = audioOn ? "none" : "block";
      icSound.style.display = audioOn ? "block" : "none";
    }
    async function tryStart() {
      try { await audio.play(); audioOn = true; setIcons(); }
      catch { audioOn = false; setIcons(); }
    }
    tryStart();
    const startOnce = () => { tryStart(); window.removeEventListener("pointerdown", startOnce); window.removeEventListener("keydown", startOnce); };
    window.addEventListener("pointerdown", startOnce, { once: true });
    window.addEventListener("keydown", startOnce, { once: true });
    audioBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (audio.paused) { audio.play(); audioOn = true; }
      else { audio.pause(); audioOn = false; }
      setIcons();
    });
  }
  