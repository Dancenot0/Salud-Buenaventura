/* ============================================================
   SALUD BUENAVENTURA · UTILIDADES NÚCLEO
   Helpers de DOM, estado de apertura en vivo, portapapeles,
   revelado por scroll, contadores y sincronización con URL.
   ============================================================ */
(function (global) {
  "use strict";

  const { svgIcon } = global.SBIcons;

  /* ---------- DOM ---------- */
  const qs  = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /** Crea un elemento con atributos e hijos en una sola llamada. */
  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null) continue;
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    }
    for (const c of children.flat()) {
      if (c == null) continue;
      node.append(c.nodeType ? c : document.createTextNode(String(c)));
    }
    return node;
  }

  const debounce = (fn, ms = 220) => {
    let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  };

  /* ---------- Texto ---------- */
  const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- URL / parámetros ---------- */
  const getParam = (name) => new URLSearchParams(location.search).get(name);

  /** Actualiza la URL sin recargar (historial limpio en el directorio).
   *  try/catch: file:// (origin null) bloquea replaceState en algunos
   *  navegadores; los filtros siguen funcionando sin URL sincronizada. */
  function setParams(obj) {
    try {
      const p = new URLSearchParams(location.search);
      for (const [k, v] of Object.entries(obj)) {
        if (v === null || v === "" || v === undefined) p.delete(k);
        else p.set(k, v);
      }
      const q = p.toString();
      history.replaceState(null, "", q ? `${location.pathname}?${q}` : location.pathname);
    } catch { /* file:// sin History API: degradación silenciosa */ }
  }

  /* ---------- Toast ---------- */
  function toast(message, iconName = "check-circle") {
    let stack = qs(".toast-stack");
    if (!stack) { stack = el("div", { class: "toast-stack", "aria-live": "polite" }); document.body.append(stack); }
    const t = el("div", { class: "toast", role: "status" });
    t.innerHTML = svgIcon(iconName, { size: 16 }) + `<span>${escapeHTML(message)}</span>`;
    stack.append(t);
    setTimeout(() => { t.classList.add("is-out"); setTimeout(() => t.remove(), 300); }, 2400);
  }

  /* ---------- Portapapeles (con fallback) ---------- */
  async function copyText(text, okMessage = "Copiado al portapapeles") {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = el("textarea", { style: "position:fixed;opacity:0" });
      ta.value = text; document.body.append(ta); ta.select();
      try { document.execCommand("copy"); } catch { /* noop */ }
      ta.remove();
    }
    toast(okMessage);
  }

  /* ============================================================
     ESTADO DE APERTURA EN VIVO
     ------------------------------------------------------------
     Modelo de horarios por institución:
       horarios: [{ dias:[1..5], abre:"07:00", cierra:"17:00" }, …]
       urgencias24: boolean
     días: 0 = domingo … 6 = sábado (convención Date.getDay()).
     ============================================================ */
  const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const DIAS_CORTOS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

  const toMin = (hhmm) => {
    const [h, m] = String(hhmm).split(":").map(Number);
    return h * 60 + (m || 0);
  };

  /** Formatea un rango de días legible: "lun a vie", "sáb", "dom y lun". */
  function labelDias(dias) {
    const d = [...dias].sort((a, b) => a - b);
    if (d.length === 7) return "todos los días";
    const seq = d.every((v, i) => i === 0 || v === d[i - 1] + 1);
    if (seq && d.length > 2) return `${DIAS_CORTOS[d[0]]} a ${DIAS_CORTOS[d[d.length - 1]]}`;
    if (seq && d.length === 2) return `${DIAS_CORTOS[d[0]]} y ${DIAS_CORTOS[d[1]]}`;
    return d.map((x) => DIAS_CORTOS[x]).join(", ");
  }

  /**
   * Calcula si una institución está abierta AHORA.
   * @returns {{abierto:boolean|null, texto:string, clase:string}}
   *   clase ∈ "ok" | "closed" | "24"
   */
  function estadoAbierto(ips, now = new Date()) {
    if (ips.urgencias24) {
      return { abierto: true, texto: "Urgencias 24 h", clase: "24" };
    }
    const day = now.getDay();
    const mins = now.getHours() * 60 + now.getMinutes();
    let match = null, next = null;

    for (const h of ips.horarios || []) {
      if (!h.dias.includes(day)) continue;
      const a = toMin(h.abre), c = toMin(h.cierra);
      if (mins >= a && mins < c) { match = h; break; }
      if (mins < a) { next = next && toMin(next.abre) < a ? next : h; }
    }
    if (match) {
      return { abierto: true, texto: `Abierto · cierra ${match.cierra}`, clase: "ok" };
    }
    /* Busca la próxima apertura (hoy más tarde o próximos 7 días). */
    for (let i = 0; i <= 7 && !next; i++) {
      const d = (day + i) % 7;
      for (const h of ips.horarios || []) {
        if (!h.dias.includes(d)) continue;
        if (i === 0 && toMin(h.abre) <= mins) continue;
        next = { ...h, dia: d, enDias: i };
        break;
      }
    }
    if (next) {
      const cuando = (next.enDias || 0) === 0 ? "hoy" : (next.enDias === 1 ? "mañana" : `el ${DIAS[next.dia]}`);
      return { abierto: false, texto: `Cerrado · abre ${cuando} ${next.abre}`, clase: "closed" };
    }
    return { abierto: null, texto: "Horario por confirmar", clase: "closed" };
  }

  /** Marca el badge de estado listo para insertar. */
  function badgeEstado(ips, now) {
    const e = estadoAbierto(ips, now);
    const dot = e.clase === "24" ? "24" : e.clase === "ok" ? "ok" : "closed";
    const kind = e.clase === "24" ? "danger" : e.clase === "ok" ? "ok" : "neutral";
    return `<span class="badge badge--${kind}"><span class="dot dot--${dot}"></span>${escapeHTML(e.texto)}</span>`;
  }

  /* ---------- Revelado por scroll ---------- */
  function initReveal(root = document) {
    const items = qsa(".reveal:not(.is-visible)", root);
    if (!items.length) return;
    if (!("IntersectionObserver" in global)) { items.forEach((n) => n.classList.add("is-visible")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach((n) => io.observe(n));
  }

  /* ---------- Contadores animados ---------- */
  function initCounters(root = document) {
    qsa("[data-count]:not([data-count-bound])", root).forEach((node) => {
      node.dataset.countBound = "1";
      const suffix = node.dataset.suffix || "";
      const dur = 1200;
      if (!("IntersectionObserver" in global)) { node.textContent = node.dataset.count + suffix; return; }
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          io.disconnect();
          const target = parseFloat(node.dataset.count) || 0; // se lee al disparar: permite fijar el valor después
          const t0 = performance.now();
          const tick = (t) => {
            const p = Math.min(1, (t - t0) / dur);
            const eased = 1 - Math.pow(1 - p, 4);
            node.textContent = Math.round(target * eased).toLocaleString("es-CO") + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      }, { threshold: 0.5 });
      io.observe(node);
    });
  }

  /* ---------- Acordeones ----------
     Delegación: cualquier .acc-trigger abre/cierra su .acc-item
     y cierra los hermanos del mismo .accordion (exclusividad
     opcional con data-exclusive).                               */
  function initAccordions(root = document) {
    root.addEventListener("click", (ev) => {
      const trigger = ev.target.closest(".acc-trigger");
      if (!trigger) return;
      const item = trigger.closest(".acc-item");
      const acc = item.closest(".accordion");
      const open = item.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(open));
      if (acc && acc.dataset.exclusive === "true") {
        qsa(".acc-item.is-open", acc).forEach((other) => {
          if (other !== item) {
            other.classList.remove("is-open");
            other.querySelector(".acc-trigger")?.setAttribute("aria-expanded", "false");
          }
        });
      }
    });
  }

  /* ---------- Hidratación de iconos estáticos ---------- */
  function hydrateIcons(root = document) {
    qsa("[data-icon]", root).forEach((node) => {
      const size = parseInt(node.dataset.iconSize || "24", 10);
      node.innerHTML = svgIcon(node.dataset.icon, { size });
      node.removeAttribute("data-icon");
    });
  }

  /* ---------- Enlaces de contacto ---------- */
  const telLink = (tel) => `tel:${String(tel).replace(/[^+\d]/g, "")}`;
  const waLink  = (tel) => `https://wa.me/${String(tel).replace(/[^+\d]/g, "").replace(/^0/, "57")}`;
  const mapsLink = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  global.SBUtils = {
    qs, qsa, el, debounce, capitalize, escapeHTML,
    getParam, setParams, toast, copyText,
    estadoAbierto, badgeEstado, labelDias, DIAS, DIAS_CORTOS,
    initReveal, initCounters, initAccordions, hydrateIcons,
    telLink, waLink, mapsLink
  };
})(window);
