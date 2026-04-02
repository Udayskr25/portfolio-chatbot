(function () {
  const API_URL = "https://portfolio-chatbot-1.vercel.app/api/chat";

  // Inject styles
  const style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400&family=DM+Sans:wght@300;400;500&display=swap');
    #uds-chat-widget * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'DM Sans', sans-serif; }
    #uds-chat-toggle {
      position: fixed; bottom: 28px; right: 28px; width: 52px; height: 52px;
      background: #0f0f0f; border: 1px solid rgba(255,255,255,0.12); border-radius: 50%;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      z-index: 9999; transition: transform 0.2s ease, border-color 0.2s ease;
      box-shadow: 0 4px 24px rgba(0,0,0,0.4);
    }
    #uds-chat-toggle:hover { transform: scale(1.06); border-color: rgba(255,255,255,0.3); }
    #uds-chat-toggle svg { width: 20px; height: 20px; transition: opacity 0.15s ease; }
    #uds-chat-toggle .icon-chat { opacity: 1; position: absolute; }
    #uds-chat-toggle .icon-close { opacity: 0; position: absolute; }
    #uds-chat-toggle.open .icon-chat { opacity: 0; }
    #uds-chat-toggle.open .icon-close { opacity: 1; }
    #uds-chat-panel {
      position: fixed; bottom: 92px; right: 28px; width: 340px; height: 480px;
      background: #0f0f0f; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px;
      display: flex; flex-direction: column; z-index: 9998; overflow: hidden;
      box-shadow: 0 16px 48px rgba(0,0,0,0.6);
      transform: translateY(12px) scale(0.97); opacity: 0; pointer-events: none;
      transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), opacity 0.18s ease;
    }
    #uds-chat-panel.open { transform: translateY(0) scale(1); opacity: 1; pointer-events: all; }
    #uds-chat-header { padding: 16px 18px; border-bottom: 1px solid rgba(255,255,255,0.07); display: flex; align-items: center; gap: 10px; }
    #uds-chat-avatar {
      width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg,#2a2a2a,#444);
      border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center;
      font-size: 13px; color: rgba(255,255,255,0.6); font-family: 'DM Mono', monospace; flex-shrink: 0;
    }
    #uds-chat-header-text h4 { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.9); letter-spacing: -0.01em; }
    #uds-chat-header-text p { font-size: 11px; color: rgba(255,255,255,0.35); margin-top: 1px; font-family: 'DM Mono', monospace; }
    #uds-online-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; margin-left: auto; flex-shrink: 0; box-shadow: 0 0 6px rgba(74,222,128,0.5); }
    #uds-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; scrollbar-width: none; }
    #uds-messages::-webkit-scrollbar { display: none; }
    .uds-msg { max-width: 85%; padding: 10px 13px; border-radius: 12px; font-size: 13px; line-height: 1.5; animation: uds-fadein 0.2s ease; }
    @keyframes uds-fadein { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }
    .uds-msg.bot { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.8); border-radius: 12px 12px 12px 3px; align-self: flex-start; border: 1px solid rgba(255,255,255,0.06); }
    .uds-msg.user { background: rgba(255,255,255,0.92); color: #0f0f0f; border-radius: 12px 12px 3px 12px; align-self: flex-end; }
    .uds-typing { display: flex; gap: 4px; align-items: center; padding: 12px 13px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px 12px 12px 3px; align-self: flex-start; animation: uds-fadein 0.2s ease; }
    .uds-typing span { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.35); animation: uds-bounce 1.2s ease infinite; }
    .uds-typing span:nth-child(2) { animation-delay: 0.15s; }
    .uds-typing span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes uds-bounce { 0%,60%,100% { transform:translateY(0); opacity:0.35; } 30% { transform:translateY(-4px); opacity:0.8; } }
    #uds-suggestions { padding: 0 16px 8px; display: flex; flex-wrap: wrap; gap: 6px; }
    .uds-suggestion { padding: 5px 10px; background: transparent; border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; color: rgba(255,255,255,0.5); font-size: 11px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: border-color 0.15s, color 0.15s; white-space: nowrap; }
    .uds-suggestion:hover { border-color: rgba(255,255,255,0.3); color: rgba(255,255,255,0.8); }
    #uds-input-area { padding: 12px 14px; border-top: 1px solid rgba(255,255,255,0.07); display: flex; gap: 8px; align-items: flex-end; }
    #uds-input { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 9px 12px; color: rgba(255,255,255,0.85); font-size: 13px; font-family: 'DM Sans', sans-serif; resize: none; outline: none; max-height: 80px; line-height: 1.4; transition: border-color 0.15s; }
    #uds-input::placeholder { color: rgba(255,255,255,0.2); }
    #uds-input:focus { border-color: rgba(255,255,255,0.25); }
    #uds-send { width: 34px; height: 34px; background: rgba(255,255,255,0.9); border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.15s, transform 0.1s; }
    #uds-send:hover { background: #fff; transform: scale(1.04); }
    #uds-send:active { transform: scale(0.96); }
    #uds-send svg { width: 14px; height: 14px; }
    @media (max-width: 400px) { #uds-chat-panel { width: calc(100vw - 32px); right: 16px; bottom: 82px; } #uds-chat-toggle { right: 16px; bottom: 16px; } }
  `;
  document.head.appendChild(style);

  // Inject HTML
  const widget = document.createElement("div");
  widget.id = "uds-chat-widget";
  widget.innerHTML = `
    <button id="uds-chat-toggle" aria-label="Open chat">
      <svg class="icon-chat" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <div id="uds-chat-panel" role="dialog">
      <div id="uds-chat-header">
        <div id="uds-chat-avatar">U</div>
        <div id="uds-chat-header-text"><h4>Uday's Assistant</h4><p>Ask me anything</p></div>
        <div id="uds-online-dot"></div>
      </div>
      <div id="uds-messages">
        <div class="uds-msg bot">Hey! I'm Uday's portfolio assistant. Ask me about his work, skills, or availability. 👋</div>
      </div>
      <div id="uds-suggestions">
        <button class="uds-suggestion">What projects has he done?</button>
        <button class="uds-suggestion">Is he open to work?</button>
        <button class="uds-suggestion">What are his skills?</button>
      </div>
      <div id="uds-input-area">
        <textarea id="uds-input" placeholder="Ask something..." rows="1"></textarea>
        <button id="uds-send" aria-label="Send">
          <svg viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(widget);

  // Logic
  const toggle = document.getElementById("uds-chat-toggle");
  const panel = document.getElementById("uds-chat-panel");
  const messagesEl = document.getElementById("uds-messages");
  const input = document.getElementById("uds-input");
  const sendBtn = document.getElementById("uds-send");
  const suggestionsEl = document.getElementById("uds-suggestions");
  let history = [], isLoading = false;

  toggle.addEventListener("click", () => {
    const isOpen = panel.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    if (isOpen) setTimeout(() => input.focus(), 220);
  });

  document.querySelectorAll(".uds-suggestion").forEach(btn => {
    btn.addEventListener("click", () => { sendMessage(btn.textContent); suggestionsEl.style.display = "none"; });
  });

  input.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input.value.trim()); } });
  sendBtn.addEventListener("click", () => sendMessage(input.value.trim()));
  input.addEventListener("input", () => { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 80) + "px"; });

  function addMessage(role, text) {
    const el = document.createElement("div");
    el.className = "uds-msg " + role;
    el.textContent = text;
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showTyping() {
    const el = document.createElement("div");
    el.className = "uds-typing";
    el.innerHTML = "<span></span><span></span><span></span>";
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return el;
  }

  async function sendMessage(text) {
    if (!text || isLoading) return;
    isLoading = true;
    input.value = "";
    input.style.height = "auto";
    suggestionsEl.style.display = "none";
    addMessage("user", text);
    history.push({ role: "user", content: text });
    const typingEl = showTyping();
    try {
      const res = await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history }) });
      const data = await res.json();
      typingEl.remove();
      const reply = data.reply || "Sorry, something went wrong.";
      addMessage("bot", reply);
      history.push({ role: "assistant", content: reply });
    } catch (err) {
      typingEl.remove();
      addMessage("bot", "Connection error. Please try again.");
    }
    isLoading = false;
  }
})();
