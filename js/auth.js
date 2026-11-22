/* Kirish / ro‘yxatdan o‘tish oynasi. Server: /api/login, /api/register, /api/me, /api/logout */
(function () {
  const T = (k, v) => (window.PM360.api ? window.PM360.api.T(k, v) : k);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
  let me = null, mode = "login";

  const btn = document.getElementById("authbtn");
  const modal = document.createElement("div");
  modal.className = "amodal";
  modal.hidden = true;
  modal.innerHTML = `<form class="abox" novalidate>
    <h3 data-a="title"></h3>
    <label data-a="rname">${esc(T("auth_name"))}<input name="full_name" autocomplete="name"></label>
    <label>${esc(T("auth_user"))}<input name="username" autocomplete="username" required></label>
    <label>${esc(T("auth_pass"))}<input name="password" type="password" autocomplete="current-password" required></label>
    <label data-a="rrole">${esc(T("auth_role"))}
      <select name="role"><option value="student">${esc(T("auth_role_student"))}</option><option value="teacher">${esc(T("auth_role_teacher"))}</option></select></label>
    <label data-a="rcode">${esc(T("auth_code"))}<input name="teacher_code" autocomplete="off"></label>
    <p class="bad" data-a="err"></p>
    <button class="primary" type="submit" data-a="submit"></button>
    <button type="button" class="ghost" data-a="switch"></button>
    <button type="button" class="ghost" data-a="close">${esc(T("auth_close"))}</button>
  </form>`;
  document.body.appendChild(modal);
  const q = s => modal.querySelector(`[data-a="${s}"]`);
  const form = modal.querySelector("form");

  function paint() {
    const reg = mode === "register";
    q("title").textContent = T(reg ? "auth_reg" : "auth_login");
    q("submit").textContent = T(reg ? "auth_reg" : "auth_login");
    q("switch").textContent = T(reg ? "auth_switch_login" : "auth_switch_reg");
    ["rname", "rrole", "rcode"].forEach(k => q(k).hidden = !reg);
    q("err").textContent = "";
  }

  function label() {
    if (!btn) return;
    btn.textContent = me ? `${me.name} · ${T("auth_logout")}` : T("auth_login");
    btn.dataset.role = me ? me.role : "";
  }

  async function refresh() {
    try {
      const r = await fetch("/api/me", {credentials: "same-origin"});
      me = r.ok ? (await r.json()).user : null;
    } catch (e) { me = null; }
    label();
    document.dispatchEvent(new CustomEvent("pm360:auth"));
  }

  const ERR = {credentials: "auth_bad", exists: "auth_exists", username: "auth_username", password: "auth_short", teacher_code: "auth_code_bad"};
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    try {
      const r = await fetch(mode === "register" ? "/api/register" : "/api/login", {
        method: "POST", credentials: "same-origin",
        headers: {"Content-Type": "application/json"}, body: JSON.stringify(payload)
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { q("err").textContent = T(ERR[j.error] || "auth_server"); return; }
      modal.hidden = true; form.reset(); await refresh();
    } catch (err) { q("err").textContent = T("auth_server"); }
  });
  q("switch").addEventListener("click", () => { mode = mode === "login" ? "register" : "login"; paint(); });
  q("close").addEventListener("click", () => { modal.hidden = true; });

  btn && btn.addEventListener("click", async () => {
    if (me) {
      await fetch("/api/logout", {method: "POST", credentials: "same-origin"});
      await refresh();
      return;
    }
    mode = "login"; paint(); modal.hidden = false;
    form.querySelector("input[name=username]").focus();
  });

  window.PM360_AUTH = { refresh, user: () => me, open: () => { mode = "login"; paint(); modal.hidden = false; } };
  refresh();
})();
