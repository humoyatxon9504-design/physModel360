/* O‘qituvchi fayllari — server orqali (/api/lessons, /api/upload).
 * O‘qituvchi (role=teacher): yuklaydi va o‘chiradi. Boshqalar: faqat ko‘radi.
 */
(function () {
  const MAX = 4 * 1024 * 1024;   // Vercel so‘rov chegarasi
  const ACCEPT = ".pdf,.png,.jpg,.jpeg,.gif,.webp,.mp4,.webm,.mp3,.txt,.md,.csv,.json,.docx,.pptx,.xlsx";
  const T = (k, v) => (window.PM360.api ? window.PM360.api.T(k, v) : k);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
  const user = () => (window.PM360_AUTH ? window.PM360_AUTH.user() : null);

  function render(box, i, files, msg, needLogin) {
    if (!box) return;
    const body = box.querySelector("[data-body]");
    const u = user();
    if (needLogin || !u) {
      body.innerHTML = `<p class="muted">${T("files_offline")}</p>
        <button class="primary" data-login>${T("auth_login")}</button>`;
      return;
    }
    const teacher = u.role === "teacher";
    const badge = teacher ? `<p class="muted small">${T("files_teacher")}</p>` : "";
    const up = teacher ? `<label class="filepick">${T("files_pick")}<input type="file" data-upload="${i}" multiple accept="${ACCEPT}"></label>` : "";
    const list = files.length
      ? `<ul class="flist">${files.map(f => `<li>
          <a href="${esc(f.url)}" target="_blank" rel="noopener" download="${esc(f.name)}">📎 ${esc(f.name)}</a>
          <span class="muted">${Math.round((f.size || 0) / 1024)} KB</span>
          ${teacher ? `<button class="ghost sm" data-del="${f.id}">${T("files_del")}</button>` : ""}</li>`).join("")}</ul>`
      : `<p class="muted">${T("files_none")}</p>`;
    body.innerHTML = badge + up + (msg ? `<p class="bad">${esc(msg)}</p>` : "") + list;
  }

  async function load(i) {
    const r = await fetch(`/api/lessons?topic=${i}`, {credentials: "same-origin"});
    if (r.status === 401) return {needLogin: true, files: []};
    const j = await r.json();
    return {needLogin: false, files: j.files || []};
  }

  function mount(box, i) {
    box.querySelector("[data-body]").innerHTML = `<p class="muted">…</p>`;
    load(i).then(({needLogin, files}) => render(box, i, files, "", needLogin))
      .catch(() => render(box, i, [], T("files_err", {name: ""}), false));
  }

  document.addEventListener("change", async e => {
    const inp = e.target;
    if (!inp.dataset || inp.dataset.upload === undefined) return;
    const i = +inp.dataset.upload, picked = Array.from(inp.files || []);
    const box = document.querySelector(`[data-files="${i}"]`);
    if (!picked.length) return;
    let msg = "";
    for (const f of picked) {
      if (f.size > MAX) { msg = T("files_big", {name: f.name}); continue; }
      try {
        const r = await fetch(`/api/upload?topic=${i}&name=${encodeURIComponent(f.name)}`, {
          method: "POST", credentials: "same-origin",
          headers: {"Content-Type": f.type || "application/octet-stream"}, body: f
        });
        if (!r.ok) msg = (r.status === 403) ? T("files_teacher_only") : T("files_err", {name: f.name});
      } catch (err) { msg = T("files_err", {name: f.name}); }
    }
    inp.value = "";
    const res = await load(i).catch(() => ({needLogin: false, files: []}));
    render(box, i, res.files, msg, res.needLogin);
  });

  document.addEventListener("click", async e => {
    const login = e.target.closest("[data-login]");
    if (login && window.PM360_AUTH) { window.PM360_AUTH.open(); return; }
    const b = e.target.closest("[data-del]");
    if (!b) return;
    const box = b.closest("[data-files]");
    const i = +box.dataset.files;
    await fetch(`/api/lessons?id=${b.dataset.del}`, {method: "DELETE", credentials: "same-origin"});
    const res = await load(i).catch(() => ({needLogin: false, files: []}));
    render(box, i, res.files, "", res.needLogin);
  });

  // Kirish/chiqish o‘zgarganda ochiq fayllar bo‘limini yangilash
  document.addEventListener("pm360:auth", () => {
    document.querySelectorAll("[data-files]").forEach(el => mount(el, +el.dataset.files));
  });

  window.PM360_FILES = {mount, accept: ACCEPT};
})();
