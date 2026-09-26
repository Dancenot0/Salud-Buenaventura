/* ============================================================
   SALUD BUENAVENTURA · SISTEMA DE DISEÑO (sistema-de-diseno.html)
   Biblia interactiva: paletas copiables, galería de iconos,
   scrollspy de secciones y demostraciones de movimiento.
   ============================================================ */
(function () {
  "use strict";
  const { svgIcon, iconNames } = window.SBIcons;
  const U = window.SBUtils;
  const D = window.SBData;
  const { qs, qsa, escapeHTML: esc } = U;

  function init() {
    renderPaletas();
    renderTokens();
    renderIconos();
    initScrollspy();
    initCopiables();
    initMotionDemo();
    renderMeta();
  }

  const PALETAS = {
    "Marca · Azul-Pacífico": ["brand-50", "brand-100", "brand-200", "brand-300", "brand-400", "brand-500", "brand-600", "brand-700", "brand-800", "brand-900", "abyss"],
    "Neutros · Tinta": ["ink", "ink-2", "ink-3", "paper", "bg"],
    "Semánticos": ["ok", "ok-bg", "warn", "warn-bg", "danger", "danger-bg"],
    "Acento": ["sand", "sand-soft"]
  };

  function renderPaletas() {
    const host = qs("#ds-paletas");
    if (!host) return;
    const cs = getComputedStyle(document.documentElement);
    host.innerHTML = Object.entries(PALETAS).map(([grupo, keys]) => `
      <div style="margin-bottom:var(--sp-8)">
        <h3 class="ds-sub" style="margin-top:0">${esc(grupo)}</h3>
        <div class="swatch-grid">
          ${keys.map((k) => {
            const hex = cs.getPropertyValue(`--c-${k}`).trim();
            return `<button class="swatch" data-copy-var="--c-${k}" aria-label="Copiar token --c-${k}">
              <span class="swatch__color" style="background:${hex || "rgba(13,37,48,0.06)"}"></span>
              <span class="swatch__info">
                <span class="swatch__name">--c-${esc(k)}</span>
                <span class="swatch__hex">${esc(hex) || "—"}</span>
              </span>
            </button>`;
          }).join("")}
        </div>
      </div>`).join("");
  }

  function renderTokens() {
    const grupos = [
      { t: "Radios", keys: ["r-sm", "r-md", "r-lg", "r-xl", "r-pill"] },
      { t: "Movimiento", keys: ["dur-1", "dur-2", "dur-3", "dur-4", "ease-out", "ease-spring", "ease-in-out"] },
      { t: "Vidrio · Chrome", keys: ["glass-chrome-filter", "glass-chrome-border"] },
      { t: "Vidrio · Tarjeta", keys: ["glass-card-filter", "glass-card-border"] },
      { t: "Layout", keys: ["container", "nav-h", "section-y"] }
    ];
    const cs = getComputedStyle(document.documentElement);
    const host = qs("#ds-tokens");
    if (!host) return;
    host.innerHTML = grupos.map((g) => `
      <h3 class="ds-sub">${esc(g.t)}</h3>
      <div class="token-list">
        ${g.keys.map((k) => `
          <button class="token-row" data-copy-var="--${esc(k)}">
            <code>--${esc(k)}</code><span>${esc(cs.getPropertyValue(`--${k}`).trim().slice(0, 64))}</span>
          </button>`).join("")}
      </div>`).join("");
  }

  function renderIconos() {
    const host = qs("#ds-iconos");
    if (!host) return;
    host.innerHTML = iconNames().map((n) => `
      <button class="icon-cell" data-copy-text="svgIcon('${n}')" aria-label="Copiar uso del icono ${esc(n)}">
        ${svgIcon(n, { size: 22 })}<span>${esc(n)}</span>
      </button>`).join("");
  }

  function initScrollspy() {
    const links = qsa(".ds-nav a");
    const sections = links
      .map((a) => qs(a.getAttribute("href")))
      .filter(Boolean);
    if (!sections.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("is-current", a.getAttribute("href") === `#${en.target.id}`));
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach((s) => io.observe(s));
  }

  function initCopiables() {
    document.addEventListener("click", (e) => {
      const varBtn = e.target.closest("[data-copy-var]");
      if (varBtn) {
        const name = varBtn.dataset.copyVar;
        const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        U.copyText(`${name}: ${val};`, `Token ${name} copiado`);
        return;
      }
      const codeBtn = e.target.closest("[data-copy-code]");
      if (codeBtn) {
        const pre = qs(codeBtn.dataset.copyCode);
        if (pre) U.copyText(pre.innerText, "Código copiado");
        return;
      }
      const txtBtn = e.target.closest("[data-copy-text]");
      if (txtBtn) U.copyText(txtBtn.dataset.copyText, "Copiado");
    });
  }

  function initMotionDemo() {
    const box = qs("#motion-box");
    const btns = qsa("[data-motion]");
    if (!box || !btns.length) return;
    const track = box.parentElement;
    btns.forEach((b) => {
      b.addEventListener("click", () => {
        btns.forEach((x) => x.classList.toggle("is-active", x === b));
        const dist = track.clientWidth - box.offsetWidth - 24;
        box.style.transition = "none";
        box.style.transform = "translateX(0)";
        requestAnimationFrame(() => requestAnimationFrame(() => {
          box.style.transition = `transform 1.1s ${b.dataset.motion}`;
          box.style.transform = `translateX(${Math.max(dist, 40)}px)`;
        }));
      });
    });
  }

  function renderMeta() {
    const v = qs("#ds-meta-version");
    if (v) v.textContent = `v${D.meta.version} · actualizado ${D.meta.actualizado}`;
  }

  document.addEventListener("sb:ready", init);
})();
