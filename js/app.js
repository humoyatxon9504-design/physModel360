/* PhysModel 360 — sahifalar, tillar (uz/ru/en), demolar.
 * Ma’lumotlar: js/data.js (uz) va js/i18n.js (ru, en, interfeys).
 */
(function () {
  const D = window.PM360, I = window.PM360_I18N;
  const app = document.getElementById("app");
  const G = 9.8;
  let lang = "uz";
  let cur = {p: "", a: undefined, s: undefined};
  let searchQ = "";

  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
  const pad = n => String(n + 1).padStart(2, "0");
  const fmt = (x, d = 2) => x.toFixed(d).replace(".", lang === "en" ? "." : ",");

  /* ---------- tarjima yordamchilari ---------- */
  function T(k, v) {
    let s = (I[lang].ui[k] !== undefined ? I[lang].ui[k] : I.uz.ui[k]) || k;
    if (v) for (const x in v) s = s.split("{" + x + "}").join(v[x]);
    return s;
  }
  const secT = j => lang === "uz" ? D.sections[j].t : I[lang].secs[j].t;
  const secV = j => lang === "uz" ? D.sections[j].v : I[lang].secs[j].v;
  const topT = i => lang === "uz" ? D.topics[i].t : I[lang].tops[i];
  const catN = c => lang === "uz" ? c.n : ((I[lang].cats[c.k] || {}).n || c.n);
  const catV = c => lang === "uz" ? c.v : ((I[lang].cats[c.k] || {}).v || c.v);
  const fN = f => lang === "uz" ? f.n : (I[lang].fn[f.f] || f.n);
  const tl = k => lang === "uz" ? k : (I[lang].tl[k] || k);
  const paras = (i, j) => lang === "uz"
    ? ((D.topics[i].m && D.topics[i].m[j]) || [])
    : ((i === 0 && I[lang].m1[j]) || []);
  const CATS = () => D.categories;
  const catOf = i => D.categories.find(c => c.k === D.topicCat[i]);
  const VIDEO_SEC = D.sections.findIndex(s => s.t === "Videodarslar");

  function questionsFor(m) {
    const set = m && m.questions ? "t" : "g";
    const src = m && m.questions ? m.questions : D.questions;
    return src.map((x, idx) => {
      const tr = lang === "uz" ? x : I[lang].qs[set][idx];
      return {q: tr.q, o: tr.o, a: x.a, topic: tl(x.topic)};
    });
  }
  const formulasFor = m => (m && m.formulas) || D.formulas;

  /* ---------- SAHIFALAR ---------- */
  function home() {
    return `<section class="hero">
      <span class="badge">${T("hero_badge")}</span>
      <h1>${T("hero_a")} <span class="grad">${T("hero_grad")}</span> ${T("hero_b")}</h1>
      <p class="lead">${T("lead")}</p>
      <div class="cta">
        <a class="btn primary" data-go="mavzu/0">${T("cta_start")}</a>
        <a class="btn ghost" data-go="kat/mex">${T("cta_mex")}</a>
      </div>
    </section>
    <div class="sec-head"><h2>${T("sec_title")}</h2><p class="muted">${T("sec_sub")}</p></div>
    <div class="cards">${CATS().map(c => {
      const n = D.topicCat.filter(k => k === c.k).length;
      return `<a class="card" data-go="kat/${c.k}" style="--accent:${c.c}">
        <div class="card-top"><span class="ico">${c.i}</span><span class="pill">${T("cat_count", {n})}</span></div>
        <h3>${esc(catN(c))}</h3><p class="muted">${esc(catV(c))}</p>
        <span class="more">${T("cat_open")}</span></a>`;
    }).join("")}</div>`;
  }

  function category(k) {
    const c = CATS().find(x => x.k === k);
    if (!c) return notFound();
    const idx = D.topics.map((m, i) => i).filter(i => D.topicCat[i] === k);
    return `<a class="back" data-go="">${T("back_home")}</a>
      <h2>${c.i} ${esc(catN(c))}</h2><p class="muted">${esc(catV(c))}</p>${topicList(idx)}`;
  }

  function topicList(idx) {
    if (!idx.length) return `<p class="muted">${T("no_topics")}</p>`;
    return `<ul class="rows">${idx.map(i => {
      const h = D.topics[i].h;
      return `<li><a data-go="mavzu/${i}"><span class="n">${pad(i)}</span>
        <span><strong>${esc(topT(i))}</strong></span>
        <span class="hours">${h ? T("hours", {h}) : T("hours_none")}</span></a></li>`;
    }).join("")}</ul>`;
  }

  function search(q) {
    const s = q.trim().toLowerCase();
    const idx = D.topics.map((m, i) => i).filter(i => topT(i).toLowerCase().includes(s));
    return `<h2>${T("search_h")}</h2><p class="muted">${T("search_count", {q: esc(q), n: idx.length})}</p>${topicList(idx)}`;
  }

  function topic(i) {
    const m = D.topics[i];
    if (!m) return notFound();
    const color = catOf(i).c;
    const tiles = D.sections.map((s, j) => `<a class="card sec" data-go="mavzu/${i}/${j}" style="--accent:${color}">
      <div class="card-top"><span class="ico num">${pad(j)}</span></div>
      <h3>${esc(secT(j))}</h3><p class="muted">${esc(secV(j))}</p>
      <span class="more">${T("open")}</span></a>`).join("");
    return `<a class="back" data-go="kat/${D.topicCat[i]}">← ${esc(catN(catOf(i)))}</a>
      <h2>${esc(topT(i))}</h2>
      <p class="muted">${m.h ? T("hours", {h: m.h}) : T("hours_none")} · ${T("sections_count", {n: D.sections.length})}</p>
      <div class="cards">${tiles}</div>`;
  }

  const INFO_SEC = D.sections.findIndex(s => s.t === "Infografikalar");
  const LAB_SEC = D.sections.findIndex(s => s.t === "Virtual laboratoriya");
  const notes = {};   // o‘quvchi xulosalari (sahifa yangilanganda saqlanadi)

  // Infografika: kattaliklar belgilari va grafiklar (kinematika)
  function infographic() {
    const tile = (sym, name, unit, form, c) => `<div class="tile" style="--accent:${c}">
      <div class="sym">${sym}</div><div class="tn">${esc(name)}</div><div class="tu">${esc(unit)}</div><code>${form}</code></div>`;
    const graph = (title, path, xl, yl) => `<figure class="gfx"><figcaption>${esc(title)}</figcaption>
      <svg viewBox="0 0 320 240" role="img" aria-label="${esc(title)}">
        <line x1="50" y1="200" x2="300" y2="200" class="ax"/><line x1="50" y1="200" x2="50" y2="20" class="ax"/>
        <path d="${path}" class="curve"/>
        <text x="298" y="222" class="lbl">${esc(xl)}</text><text x="8" y="16" class="lbl">${esc(yl)}</text>
      </svg></figure>`;
    return `<div class="infog">
      <div class="tiles">
        ${tile("s", T("inf_s"), T("inf_unit_s"), "s = v · t", "#C9A227")}
        ${tile("v", T("inf_v"), T("inf_unit_v"), "v = s / t", "#D98E04")}
        ${tile("a", T("inf_a"), T("inf_unit_a"), "a = (v − v₀) / t", "#A8703A")}
      </div>
      <div class="graphs">
        ${graph(T("inf_gs_u"), "M50 200 L290 40", T("inf_ax_t"), T("inf_ax_s"))}
        ${graph(T("inf_gv_u"), "M50 90 L290 90", T("inf_ax_t"), T("inf_ax_v"))}
        ${graph(T("inf_gs_a"), "M50 200 Q110 200 290 40", T("inf_ax_t"), T("inf_ax_s"))}
        ${graph(T("inf_gv_a"), "M50 200 L290 50", T("inf_ax_t"), T("inf_ax_v"))}
      </div></div>`;
  }

  // Virtual laboratoriya: mavzu, maqsad, jihozlar, tartib (jadval demo ichida)
  function labReport() {
    const L = lang === "uz" ? I.uz.lab0 : (I[lang].lab0 || I.uz.lab0);
    return `<div class="labrep">
      <div class="lrow"><h3>${T("lab_mavzu")}</h3><p>${esc(L.mavzu)}</p></div>
      <div class="lrow"><h3>${T("lab_goal")}</h3><p>${esc(L.maqsad)}</p></div>
      <div class="lrow"><h3>${T("lab_equip")}</h3><ul>${L.jihozlar.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
      <div class="lrow"><h3>${T("lab_steps")}</h3><ol>${L.tartib.map(x => `<li>${esc(x)}</li>`).join("")}</ol></div>
      <div class="lrow"><h3>${T("lab_table")}</h3></div>
    </div>`;
  }

  // Xulosa: o‘quvchi o‘zi yozadi
  function conclusionBox(i) {
    return `<div class="lrow"><h3>${T("lab_concl")}</h3>
      <textarea class="concl" data-lab-text rows="5" placeholder="${esc(T("lab_concl_ph"))}">${esc(notes[i] || "")}</textarea>
      <div><button class="primary" data-lab-save="${i}">${T("lab_save")}</button></div>
      <p class="muted" data-lab-msg>${notes[i] ? T("lab_saved") : ""}</p></div>`;
  }

  const PRJ_SEC = D.sections.findIndex(s => s.t === "Loyiha ishlari");

  // Loyiha: animatsiya (aravacha 10 m yo‘lda), bosqichlar, jihozlar, natija
  function projectVisual() {
    const P = lang === "uz" ? I.uz.pj : (I[lang].pj || I.uz.pj);
    const steps = P.steps.map((s, k) => `<li class="pstep" style="--d:${k * 2}s"><span class="pn">${k + 1}</span><span>${esc(s)}</span></li>`).join("");
    const kit = P.jihoz.map(x => `<li>${esc(x)}</li>`).join("");
    const out = P.natija.map(x => `<li>${esc(x)}</li>`).join("");
    return `<div class="proj">
      <h3>${T("pj_anim")}</h3>
      <svg class="track" viewBox="0 0 320 110" role="img" aria-label="${T("pj_anim")}">
        <line x1="30" y1="70" x2="290" y2="70" class="ax"/>
        <line x1="30" y1="62" x2="30" y2="78" class="ax"/><line x1="290" y1="62" x2="290" y2="78" class="ax"/>
        <text x="30" y="96" class="lbl">0 m</text><text x="290" y="96" class="lbl" text-anchor="end">10 m</text>
        <g class="cart"><rect x="0" y="46" width="34" height="18" rx="4" fill="#C9A227"/>
          <circle cx="8" cy="68" r="5" fill="#3A2E1C"/><circle cx="26" cy="68" r="5" fill="#3A2E1C"/></g>
      </svg>
      <ol class="steps">${steps}</ol>
      <h3>${T("pj_kit")}</h3><ul class="kit">${kit}</ul>
      <h3>${T("pj_out")}</h3><ul class="kit">${out}</ul>
    </div>`;
  }

  const STEAM_SEC = 0;
  const THEORY_SEC = D.sections.findIndex(s => s.t === "Fizika nazariyasi");
  const ticks = [];   // STEAM bosqichlari belgilari

  function stemChecklist() {
    const P = lang === "uz" ? I.uz.stm : (I[lang].stm || I.uz.stm);
    return `<div class="proj"><h3>${T("stm_title")}</h3>
      <ol class="chk">${P.map((x, k) => `<li><label><input type="checkbox" data-tick="${k}" ${ticks[k] ? "checked" : ""}>
        <span>${esc(x)}</span></label></li>`).join("")}</ol>
      <p class="muted" data-prog>${T("stm_prog", {n: ticks.filter(Boolean).length, t: P.length})}</p></div>`;
  }

  function sectionPage(i, j) {
    const m = D.topics[i], s = D.sections[j];
    if (!m || !s) return notFound();
    const isLab = i === 0 && j === LAB_SEC;
    const body = paras(i, j);
    let text = body.length ? body.map(p => `<p>${esc(p)}</p>`).join("")
      : (isLab || j === THEORY_SEC ? "" : `<p class="muted">${T("no_text")}</p>`);
    if (i === 0 && j === INFO_SEC) text += infographic();
    if (j === THEORY_SEC) text += `<div class="lrow files" data-files="${i}"><h3>${T("files_title")}</h3><div data-body></div></div>`;
    if (i === 0 && j === PRJ_SEC) text += projectVisual();

    let videos = "";
    if (j === VIDEO_SEC) {
      videos = `<h3>${T("videos_h")}</h3>` + (m.videos && m.videos.length
        ? `<ul class="vids">${m.videos.map(v => `<li><a href="${esc(v.url)}" target="_blank" rel="noopener">▶ ${esc(v.t)}</a></li>`).join("")}</ul>`
        : `<p class="muted">${T("no_videos")}</p>`);
    }
    const kind = s.d === "lab" ? m.lab : s.d;
    const showDemo = kind && (kind === "test" || kind === "comp" || m.demos.includes(kind));
    const mount = showDemo ? `<div class="mount" data-demo="${kind}"></div>` : "";
    const inner = isLab ? labReport() + mount + conclusionBox(i) : text + videos + mount;
    return `<a class="back" data-go="mavzu/${i}">← ${esc(topT(i))}</a>
      <p class="muted">${T("sec_pos", {i: j + 1, n: D.sections.length})}</p>
      <h2>${esc(secT(j))}</h2>
      <p class="lead">${esc(secV(j))}</p>
      <article class="block">${inner}</article>
      <div class="pager">
        ${j > 0 ? `<a class="btn ghost" data-go="mavzu/${i}/${j - 1}">${T("prev")}</a>` : `<span></span>`}
        ${j < D.sections.length - 1 ? `<a class="btn ghost" data-go="mavzu/${i}/${j + 1}">${T("next")}</a>` : `<span></span>`}
      </div>`;
  }

  function notFound() {
    return `<h2>${T("nf_h")}</h2><p><a data-go="">${T("nf_link")}</a></p>`;
  }

  /* ---------- DEMOLAR ---------- */
  const demos = {
    sim(el) {
      el.innerHTML = `<div class="demo"><h4>${T("sim_title")}</h4>
        <p class="muted">${T("sim_note")}</p>
        <label>${T("sim_h")}: <span class="out" data-hv></span> m
          <input type="range" min="1" max="100" value="20" data-h></label>
        <p>${T("sim_t")}: <span class="out" data-tt></span> s &nbsp; ${T("sim_v")}: <span class="out" data-vv></span> m/s</p>
        <canvas width="600" height="170" aria-label="${T("sim_aria")}"></canvas>
        <button class="primary" data-go-btn>${T("sim_btn")}</button></div>`;
      const inp = $("[data-h]", el), cv = $("canvas", el);
      const upd = () => {
        const h = +inp.value;
        $("[data-hv]", el).textContent = h;
        $("[data-tt]", el).textContent = fmt(Math.sqrt(2 * h / G));
        $("[data-vv]", el).textContent = fmt(Math.sqrt(2 * G * h));
      };
      inp.addEventListener("input", () => { upd(); drawBall(cv, +inp.value, 0); });
      $("[data-go-btn]", el).addEventListener("click", () => animateDrop(cv, +inp.value));
      upd();
      drawBall(cv, +inp.value, 0);
    },

    // O‘quvchi o‘zi model tuzadi: tur, boshlang‘ich qiymatlar, grafik, o‘lchov bilan solishtirish, xulosa
    model(el) {
      el.innerHTML = `<div class="demo"><h4>${T("mdl_title")}</h4>
        <p class="muted">${T("mdl_note")}</p>
        <label>${T("mdl_type")}<select data-type>
          <option value="u">${T("mdl_uniform")}</option><option value="a">${T("mdl_acc")}</option></select></label>
        <label>${T("mdl_v0")}<input type="number" value="2" step="any" data-v0></label>
        <label data-arow hidden>${T("mdl_a")}<input type="number" value="1" step="any" data-a></label>
        <label>${T("mdl_t")}<input type="number" value="5" min="0" step="any" data-t></label>
        <p>${T("mdl_res_s")}: <span class="out" data-s></span> m &nbsp; ${T("mdl_res_v")}: <span class="out" data-vv></span> m/s</p>
        <p class="muted">${T("mdl_plot")}</p>
        <svg class="mplot" viewBox="0 0 320 200" role="img" aria-label="${T("mdl_plot")}"></svg>
        <label>${T("mdl_measured")}<input type="number" min="0" step="any" data-meas></label>
        <p>${T("mdl_err")}: <span class="out" data-err>—</span></p>
        <div class="lrow"><h3>${T("lab_concl")}</h3>
          <textarea class="concl" data-lab-text rows="4" placeholder="${esc(T("lab_concl_ph"))}">${esc(notes.model || "")}</textarea>
          <div><button class="primary" data-lab-save="model">${T("lab_save")}</button></div>
          <p class="muted" data-lab-msg>${notes.model ? T("lab_saved") : ""}</p></div></div>`;
      const type = $("[data-type]", el), v0 = $("[data-v0]", el), acc = $("[data-a]", el),
            tm = $("[data-t]", el), meas = $("[data-meas]", el), arow = $("[data-arow]", el), svg = $(".mplot", el);
      const plot = (V0, A, TM) => {
        const TX = Math.max(TM, 1) * 1.2;
        const sAt = x => V0 * x + A * x * x / 2;
        const Smax = Math.max(sAt(TX), 1);
        const X = x => 40 + (x / TX) * 260, Y = s => 170 - (s / Smax) * 140;
        const pts = [];
        for (let k = 0; k <= 30; k++) { const x = TX * k / 30; pts.push(`${X(x).toFixed(1)},${Y(sAt(x)).toFixed(1)}`); }
        svg.innerHTML = `<line x1="40" y1="170" x2="300" y2="170" class="ax"/><line x1="40" y1="170" x2="40" y2="20" class="ax"/>
          <polyline points="${pts.join(" ")}" class="curve"/>
          <circle cx="${X(TM).toFixed(1)}" cy="${Y(sAt(TM)).toFixed(1)}" r="5" fill="#D98E04"/>
          <text x="296" y="190" class="lbl">t</text><text x="8" y="16" class="lbl">s</text>`;
      };
      const calc = () => {
        const isAcc = type.value === "a";
        arow.hidden = !isAcc;
        const V0 = +v0.value || 0, A = isAcc ? (+acc.value || 0) : 0, TM = +tm.value || 0;
        const s = V0 * TM + A * TM * TM / 2, v = V0 + A * TM;
        $("[data-s]", el).textContent = fmt(s, 1);
        $("[data-vv]", el).textContent = fmt(v, 1);
        const So = +meas.value;
        $("[data-err]", el).textContent = So > 0 ? fmt(Math.abs(s - So) / So * 100, 1) + " %" : "—";
        plot(V0, A, TM);
      };
      [type, v0, acc, tm, meas].forEach(x => x.addEventListener("input", calc));
      calc();
    },

    // PISA uslubidagi savollar: ball va daraja
    pisa(el, m) {
      const P = m && m.pisa;
      if (!P) return;
      const rnd = Math.random().toString(36).slice(2, 7);
      const items = P.items.map((it, k) => {
        const tr = lang === "uz" ? it : ((I[lang].pisa && I[lang].pisa.items[k]) || it);
        return {q: tr.q, o: tr.o, p: it.p};
      });
      const max = items.reduce((s, it) => s + Math.max(...it.p), 0);
      el.innerHTML = `<div class="demo"><h4>${T("pisa_title")}</h4>
        <div data-pq>${items.map((it, k) => `<div class="fq">${k + 1}. ${esc(it.q)}</div>` +
          it.o.map((o, j) => `<label class="opt"><input type="radio" name="pq${k}-${rnd}" value="${j}"> ${esc(o)}</label>`).join("")).join("")}</div>
        <button class="primary" data-pchk>${T("pisa_btn")}</button>
        <div data-pres></div></div>`;
      $("[data-pchk]", el).addEventListener("click", () => {
        let pts = 0;
        items.forEach((it, k) => {
          const sel = el.querySelector(`input[name^="pq${k}-${rnd}"]:checked`);
          if (sel) pts += it.p[+sel.value];
        });
        const lv = P.levels.filter(l => pts >= l.min).pop();
        $("[data-pres]", el).innerHTML = `<p class="${pts >= 3 ? "ok" : "bad"}">${T("pisa_res", {s: pts, n: max})}</p>
          <p>${T("pisa_level", {l: T(lv.key)})}</p>`;
      });
    },

    uniform(el) {
      el.innerHTML = `<div class="demo"><h4>${T("uni_title")}</h4>
        <p class="muted">${T("uni_note")}</p>
        <label>${T("uni_v")}: <span class="out" data-vv></span> m/s
          <input type="range" min="0.5" max="10" step="0.5" value="2" data-v></label>
        <label>${T("uni_t")}: <span class="out" data-tv></span> s
          <input type="range" min="1" max="20" step="1" value="5" data-t></label>
        <p>${T("uni_s")} = <span class="out" data-s></span> m</p>
        <button class="primary" data-start>${T("uni_start")}</button>
                <button class="primary" data-rec>${T("uni_rec")}</button>
        <svg class="track" viewBox="0 0 320 90" role="img" aria-label="${T("uni_track")}">
          <line x1="30" y1="60" x2="290" y2="60" class="ax"/>
          <line x1="30" y1="52" x2="30" y2="68" class="ax"/><line x1="290" y1="52" x2="290" y2="68" class="ax"/>
          <text x="30" y="82" class="lbl">0</text><text x="290" y="82" class="lbl" text-anchor="end">s</text>
          <g data-cart transform="translate(30,0)">
            <rect x="0" y="40" width="36" height="14" rx="4" fill="#C9A227"/>
            <rect x="8" y="30" width="18" height="10" rx="3" fill="#D98E04"/>
            <circle cx="8" cy="57" r="4.5" fill="#3A2E1C"/><circle cx="28" cy="57" r="4.5" fill="#3A2E1C"/>
          </g>
        </svg>
        <p class="muted" data-live>${T("uni_live_t", {t: 0})} · ${T("uni_live_s", {s: 0})}</p>
                <table><thead><tr><th>${T("th_no")}</th><th>${T("th_t")}</th><th>${T("th_s")}</th><th>${T("th_r")}</th></tr></thead><tbody data-tb></tbody></table>
        <p class="muted" data-concl>${T("uni_init")}</p></div>`;
      const rows = [];
      const V = $("[data-v]", el), TT = $("[data-t]", el);
      const upd = () => {
        const v = +V.value, t = +TT.value;
        $("[data-vv]", el).textContent = fmt(v, 1);
        $("[data-tv]", el).textContent = t;
        $("[data-s]", el).textContent = fmt(v * t, 1);
      };
      V.addEventListener("input", upd);
      TT.addEventListener("input", upd);
      $("[data-rec]", el).addEventListener("click", () => {
        const v = +V.value, t = +TT.value;
        rows.push({t, s: v * t});
        $("[data-tb]", el).innerHTML = rows.map((r, i) =>
          `<tr><td>${i + 1}</td><td>${r.t}</td><td>${fmt(r.s, 1)}</td><td>${fmt(r.s / r.t, 1)}</td></tr>`).join("");
        $("[data-concl]", el).textContent = rows.length >= 3
          ? T("lab_table_ok")
          : T("uni_need", {n: rows.length});
      });
      const cart = $("[data-cart]", el), live = $("[data-live]", el);
      let raf = null;
      const place = x => cart.setAttribute("transform", `translate(${x.toFixed(1)},0)`);
      $("[data-start]", el).addEventListener("click", () => {
        if (raf) cancelAnimationFrame(raf);
        const v = +V.value, tot = +TT.value;
        const dur = Math.min(tot, 6) * 1000;   // ekranda 6 s dan oshmaydi, vaqt nisbati saqlanadi
        let t0 = null;
        const step = ts => {
          if (t0 === null) t0 = ts;
          const p = Math.min((ts - t0) / dur, 1);
          place(30 + p * 250);
          live.textContent = `${T("uni_live_t", {t: fmt(p * tot, 1)})} · ${T("uni_live_s", {s: fmt(v * p * tot, 1)})}`;
          raf = p < 1 ? requestAnimationFrame(step) : null;
        };
        place(30);
        raf = requestAnimationFrame(step);
      });
      upd();
    },

    formula(el, m) {
      el.innerHTML = `<div class="demo"><h4>${T("fs_title")}</h4>
        <label>${T("fs_label")}<input type="search" data-fs></label>
        <div data-fl></div></div>`;
      const F = formulasFor(m);
      const draw = () => {
        const q = $("[data-fs]", el).value.trim().toLowerCase();
        const list = F.filter(f => !q || fN(f).toLowerCase().includes(q) || f.f.toLowerCase().includes(q) || f.n.toLowerCase().includes(q));
        $("[data-fl]", el).innerHTML = list.length
          ? list.map(f => `<div class="fl"><code>${esc(f.f)}</code><span>${esc(fN(f))}, ${lang === "en" ? "unit" : lang === "ru" ? "единица" : "birlik"}: ${esc(f.u)}</span></div>`).join("")
          : `<p class="muted">${T("fs_none")}</p>`;
      };
      $("[data-fs]", el).addEventListener("input", draw);
      draw();
    },

    test(el, m) {
      const QS = questionsFor(m);
      el.innerHTML = `<div class="demo"><h4>${T("test_title")}</h4><div data-qs></div>
        <button class="primary" data-chk>${T("test_btn")}</button>
        <div data-res></div></div>`;
      $("[data-qs]", el).innerHTML = QS.map((x, i) =>
        `<div class="fq">${i + 1}. ${esc(x.q)}</div>` +
        x.o.map((o, j) => `<label class="opt"><input type="radio" name="q${i}-${Math.random().toString(36).slice(2, 7)}" value="${j}"> ${esc(o)}</label>`).join("")
      ).join("");
      $("[data-chk]", el).addEventListener("click", () => {
        let score = 0; const wrong = [];
        const results = window.__pm360Results = {};
        QS.forEach((x, i) => {
          const sel = el.querySelector(`input[type=radio][value]:checked[name^="q${i}-"]`);
          const ok = !!sel && +sel.value === x.a;
          results[x.topic] = results[x.topic] || {ok: 0, total: 0};
          results[x.topic].total++;
          if (ok) { score++; results[x.topic].ok++; }
          else wrong.push(T("test_wrong", {i: i + 1, a: esc(x.o[x.a])}));
        });
        $("[data-res]", el).innerHTML = `<p class="${score >= 3 ? "ok" : "bad"}">${T("test_res", {s: score, n: QS.length})}</p>` +
          (wrong.length ? `<p class="muted">${wrong.join("<br>")}</p>` : `<p class="muted">${T("test_all")}</p>`);
      });
    },

    comp(el) {
      const r = window.__pm360Results;
      el.innerHTML = `<div class="demo"><h4>${T("comp_title")}</h4><div data-cb></div></div>`;
      const box = $("[data-cb]", el);
      if (!r) { box.innerHTML = `<p class="muted">${T("comp_none")}</p>`; return; }
      box.innerHTML = Object.keys(r).map(k => {
        const p = Math.round(r[k].ok / r[k].total * 100);
        return `<div class="bar-row"><span>${esc(k)}</span><span>${p}%</span></div>
                <div class="bar"><i style="width:${p}%"></i></div>`;
      }).join("");
    }
  };

  function drawBall(cv, h, s) {
    const ctx = cv.getContext("2d"), W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#3A2E1C"; ctx.fillRect(0, H - 6, W, 6);
    ctx.fillStyle = "#C9A227"; ctx.beginPath();
    ctx.arc(W / 2, 20 + (s / h) * (H - 46), 13, 0, Math.PI * 2); ctx.fill();
  }

  function animateDrop(cv, h) {
    const TT = Math.sqrt(2 * h / G) * 1000;
    let start = null;
    const frame = ts => {
      if (start === null) start = ts;
      const t = ts - start;
      drawBall(cv, h, Math.min(0.5 * G * (t / 1000) ** 2, h));
      if (t < TT) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  /* ---------- MARSHRUTLASH (URL hash ishlatilmaydi) ---------- */
  function go(path) {
    const [p, arg, sub] = (path || "").split("/");
    cur = {p: p || "", a: arg, s: sub};
    draw();
  }

  function draw() {
    const {p, a: arg, s: sub} = cur;
    let html;
    if (p === "") html = home();
    else if (p === "mavzu") html = sub === undefined ? topic(+arg) : sectionPage(+arg, +sub);
    else if (p === "kat") html = category(arg);
    else if (p === "search") html = search(searchQ);
    else html = notFound();

    app.innerHTML = html;
    if (p === "mavzu" && sub !== undefined && window.PM360_FILES) {
      app.querySelectorAll("[data-files]").forEach(el => PM360_FILES.mount(el, +el.dataset.files));
    }
    if (p === "mavzu" && sub !== undefined) {
      app.querySelectorAll("[data-demo]").forEach(el => {
        const name = el.dataset.demo;
        if (demos[name]) demos[name](el, D.topics[+arg]);
      });
    }
    const activeKey = p === "kat" ? "kat/" + arg : p === "mavzu" && catOf(+arg) ? "kat/" + D.topicCat[+arg] : p;
    document.querySelectorAll("[data-nav] [data-go]").forEach(x => x.classList.toggle("active", x.dataset.go === activeKey));
    window.scrollTo(0, 0);
  }

  // Statik matnlar (sarlavha, menyu, qidiruv, footer)
  function applyStatic() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(el => el.textContent = T(el.dataset.i18n));
    document.querySelectorAll("[data-i18n-ph]").forEach(el => el.setAttribute("placeholder", T(el.dataset.i18nPh)));
    document.querySelectorAll("[data-lang]").forEach(b => b.classList.toggle("active", b.dataset.lang === lang));
  }

  function setLang(l) {
    lang = l;
    applyStatic();
    draw();
  }

  document.addEventListener("change", e => {
    const k = e.target.dataset && e.target.dataset.tick;
    if (k === undefined) return;
    ticks[k] = e.target.checked;
    const P = lang === "uz" ? I.uz.stm : (I[lang].stm || I.uz.stm);
    const pr = app.querySelector("[data-prog]");
    if (pr) pr.textContent = T("stm_prog", {n: ticks.filter(Boolean).length, t: P.length});
  });

  document.addEventListener("click", e => {
    const sv = e.target.closest("[data-lab-save]");
    if (sv) {
      notes[sv.dataset.labSave] = app.querySelector("[data-lab-text]").value;
      app.querySelector("[data-lab-msg]").textContent = T("lab_saved");
      return;
    }
    const el = e.target.closest("[data-go]");
    if (el) { e.preventDefault(); go(el.dataset.go); return; }
    const lb = e.target.closest("[data-lang]");
    if (lb) setLang(lb.dataset.lang);
  });

  const qInput = document.getElementById("q");
  qInput.addEventListener("input", () => {
    searchQ = qInput.value;
    if (searchQ.trim()) go("search"); else go("");
  });

  // Yordamchi (assistant.js) uchun API
  D.api = {
    T, getLang: () => lang, secT, secV, topT, catN, catV, fN, paras, questionsFor, formulasFor,
    current: () => cur, catOf: i => catOf(i)
  };

  applyStatic();
  go("");
})();
