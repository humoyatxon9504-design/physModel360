/* AI yordamchi — pastda robot tugmasi, bosilganda chat oynasi ochiladi.
 * Javob manbai: 1) Claude (sample) — nashr qilingan sahifada; 2) sayt ma’lumotlaridan mahalliy javob.
 */
(function () {
  const D = window.PM360;
  const A = () => D.api;               // app.js tayyor bo‘lgach
  const STOP = new Set(["formulasi","formula","mavzu","mavzusi","nima","qanday","haqida","uchun","kerak","bilan",
    "sayt","bolim","bolimi","qilish","berilgan","salom","yordam","nega","qaysi",
    "what","how","is","the","about","for","and","what's","topic","formula","tema","formulа","kakoy","что","как","это","про","формула","формулы","тема","темы","закон","законы","раздел"]);
  const norm = s => s.toLowerCase().replace(/[‘’ʻʼ`']/g, "").replace(/[^\p{L}\p{N}\s]/gu, " ");
  const words = s => norm(s).split(/\s+/).filter(w => w.length > 2);
  const LANG_NAME = {uz: "Uzbek", ru: "Russian", en: "English"};

  const ROBOT = `<svg viewBox="0 0 64 64" aria-hidden="true">
    <line x1="32" y1="8" x2="32" y2="15" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    <circle cx="32" cy="6" r="3.5" fill="#fff"/>
    <rect x="12" y="15" width="40" height="32" rx="11" fill="#fff"/>
    <circle cx="24" cy="30" r="5" fill="#8F6B10"/><circle cx="40" cy="30" r="5" fill="#8F6B10"/>
    <rect x="23" y="39" width="18" height="4" rx="2" fill="#C9A227"/>
    <rect x="18" y="50" width="28" height="9" rx="4.5" fill="#fff"/></svg>`;

  const btn = document.createElement("button");
  btn.className = "bot-btn";
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML = ROBOT;

  const panel = document.createElement("section");
  panel.className = "bot-panel";
  panel.hidden = true;
  panel.innerHTML = `
    <header class="bot-head"><span data-bot="title"></span><button class="bot-x" aria-label="×">×</button></header>
    <div class="bot-log" aria-live="polite"></div>
    <form class="bot-form">
      <input type="text" autocomplete="off">
      <button class="primary" type="submit"></button>
    </form>`;
  document.body.appendChild(btn);
  document.body.appendChild(panel);

  const log = panel.querySelector(".bot-log");
  const form = panel.querySelector("form");
  const input = panel.querySelector("input");
  let greeted = false, greetedLang = null;

  function labels() {
    const T = A().T;
    panel.querySelector("[data-bot=title]").textContent = T("bot_title");
    input.placeholder = T("bot_ph");
    input.setAttribute("aria-label", T("bot_ph"));
    panel.querySelector(".bot-form button").textContent = T("bot_send");
    panel.querySelector(".bot-x").setAttribute("aria-label", T("bot_close"));
    btn.setAttribute("aria-label", T("bot_open"));
  }

  function renderBot(el, text) {
    const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    el.innerHTML = esc(text)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .split("\n").map(l => l.replace(/^\s*[-•*]\s+/, "• ")).join("<br>");
  }

  function add(role, text) {
    const el = document.createElement("div");
    el.className = "msg " + role;
    if (role === "bot") renderBot(el, text); else el.textContent = text;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function toggle(open) {
    panel.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
    if (open) {
      labels();
      if (!greeted || greetedLang !== A().getLang()) {
        greeted = true; greetedLang = A().getLang();
        add("bot", A().T("bot_greet"));
      }
      input.focus();
    }
  }
  btn.addEventListener("click", () => toggle(panel.hidden));
  panel.querySelector(".bot-x").addEventListener("click", () => toggle(false));

  // Claude uchun sayt ma’lumotlari matni
  function contextText() {
    const a = A(), lines = [];
    lines.push("Physics sections: " + D.categories.map(c => a.catN(c)).join(", "));
    lines.push("Topics:");
    D.topics.forEach((m, i) => lines.push(`${i + 1}. ${a.topT(i)} (${a.catN(a.catOf(i))})`));
    lines.push("Formulas:");
    D.formulas.forEach(f => lines.push(`${a.fN(f)}: ${f.f} [${f.u}]`));
    D.topics.forEach((m, i) => D.sections.forEach((s, j) => {
      const ps = a.paras(i, j);
      if (!ps.length) return;
      lines.push(`\n[${a.topT(i)} | ${a.secT(j)}]`);
      ps.forEach(p => lines.push(p));
    }));
    return lines.join("\n");
  }

  // Mahalliy javob: savol so‘zlari bo‘yicha saytdagi eng mos abzaslar, mavzular va formulalar
  function localAnswer(q) {
    const a = A(), T = a.T;
    const qw = new Set(words(q).filter(w => !STOP.has(w)));
    if (!qw.size) return T("bot_empty");
    const items = [];
    D.topics.forEach((m, i) => D.sections.forEach((s, j) => a.paras(i, j).forEach(p =>
      items.push({text: p, label: a.topT(i) + " — " + a.secT(j),
        score: words(p + " " + a.secT(j)).filter(x => qw.has(x)).length}))));
    const best = items.filter(x => x.score > 0).sort((x, y) => y.score - x.score).slice(0, 3);
    const formulas = D.formulas.filter(f => words(a.fN(f)).some(x => qw.has(x)));
    const topics = D.topics.map((m, i) => i).filter(i => words(a.topT(i)).some(x => qw.has(x)));
    if (!best.length && !formulas.length && !topics.length) return T("bot_none");
    const parts = [];
    if (topics.length) parts.push(T("bot_topics") + "\n" + topics.map(i => "• " + a.topT(i)).join("\n"));
    if (formulas.length) parts.push(T("bot_formulas") + "\n" + formulas.map(f => `• ${a.fN(f)}: ${f.f} [${f.u}]`).join("\n"));
    if (best.length) parts.push(T("bot_info") + " (" + best[0].label + "):\n" + best.map(x => "• " + x.text).join("\n"));
    return parts.join("\n\n");
  }

  const withTimeout = (p, ms) => Promise.race([p, new Promise(r => setTimeout(() => r(null), ms))]);

  async function answer(q) {
    const a = A(), lang = a.getLang();
    let text = null;
    try {
      const sample = window.claude && await window.claude.use("sample");
      if (sample) {
        const prompt = `You are the assistant of the "PhysModel 360" physics platform. Answer briefly and precisely in ${LANG_NAME[lang]}, using only physics and the site data below. If the data is not enough, say so.\n\nSITE DATA:\n${contextText()}\n\nQUESTION: ${q}`;
        const r = await withTimeout(sample([{role: "user", content: prompt}], {modelTier: "quick"}), 25000);
        text = r && r.text ? r.text : null;
      }
    } catch (e) { text = null; }
    return text || localAnswer(q);
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    input.value = "";
    add("user", q);
    const wait = add("bot", A().T("bot_wait"));
    renderBot(wait, await answer(q));
    log.scrollTop = log.scrollHeight;
    input.focus();
  });
})();
