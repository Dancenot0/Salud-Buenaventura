/* ============================================================
   SALUD BUENAVENTURA · CHROME (cabecera + pie compartidos)
   ------------------------------------------------------------
   "Subagente" DRY: todas las páginas montan <div id="sb-header">
   y <div id="sb-footer">; este módulo inyecta la navegación y el
   pie completos, marca el enlace activo según body[data-page],
   y activa: navbar con scroll, hoja móvil, atajo "/" de búsqueda,
   iconos estáticos, revelados, contadores y acordeones.
   ============================================================ */
(function (global) {
  "use strict";
  const { svgIcon } = global.SBIcons;
  const U = global.SBUtils;
  const { qs, el } = U;

  const LINKS = [
    { href: "index.html",     page: "inicio",    label: "Inicio" },
    { href: "servicios.html", page: "directorio",label: "Directorio" },
    { href: "tramites.html",  page: "tramites",  label: "Trámites" },
    { href: "urgencias.html", page: "urgencias", label: "Urgencias" },
    { href: "proyecto.html",  page: "proyecto",  label: "El proyecto" }
  ];

  /* ---------- Logotipo (cruz médica + ola del Pacífico) ---------- */
  function logoMark() {
    return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10.2 4.2h3.6v5.4h5.4v3.6h-5.4v5.4h-3.6v-5.4H4.8V9.6h5.4V4.2Z" fill="currentColor"/>
      <path d="M3.4 19.6c1.6-1.3 3.1-1.3 4.6 0 1.5 1.3 3 1.3 4.6 0 1.5-1.3 3-1.3 4.6 0 .9.8 1.8 1.1 2.7.9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" opacity="0.85"/>
    </svg>`;
  }

  function brandHTML(opts = {}) {
    const sub = opts.sub ? `<span class="brand__sub">${opts.sub}</span>` : "";
    return `<span class="brand__mark" aria-hidden="true">${logoMark()}</span>
      <span class="brand__name">Salud <strong>Buenaventura</strong>${sub}</span>`;
  }

  /* ---------- Cabecera ---------- */
  function renderHeader() {
    const page = document.body.dataset.page || "";
    const links = LINKS.map((l) =>
      `<a class="nav__link" href="${l.href}"${l.page === page ? ' aria-current="page"' : ""}>${l.label}</a>`
    ).join("");

    const header = el("header", { class: "nav", id: "sb-nav" });
    header.innerHTML = `
      <div class="nav__inner container">
        <a class="brand" href="index.html" aria-label="Salud Buenaventura — inicio">
          ${brandHTML({ sub: "Distrito · Colombia" })}
        </a>
        <nav class="nav__links" aria-label="Navegación principal">${links}</nav>
        <div class="nav__actions">
          <a class="btn btn--danger-soft btn--sm nav__desktop-cta" href="urgencias.html">
            ${svgIcon("siren", { size: 15 })} Urgencias · 123
          </a>
          <button class="nav__burger" id="sb-burger" aria-label="Abrir menú" aria-expanded="false" aria-controls="sb-sheet">
            ${svgIcon("menu", { size: 20 })}
          </button>
        </div>
      </div>`;

    /* Hoja móvil */
    const sheet = el("div", { class: "sheet", id: "sb-sheet", role: "dialog", "aria-modal": "true", "aria-label": "Menú de navegación" });
    const sheetLinks = LINKS.map((l) =>
      `<a class="sheet__link" href="${l.href}"${l.page === page ? ' aria-current="page"' : ""}>${l.label}
        <span aria-hidden="true">${svgIcon("chevron-right", { size: 16 })}</span></a>`
    ).join("");
    sheet.innerHTML = `
      <div class="sheet__scrim" data-close-sheet></div>
      <div class="sheet__panel">
        <div class="sheet__head">
          <a class="brand" href="index.html">${brandHTML()}</a>
          <button class="sheet__close" data-close-sheet aria-label="Cerrar menú">${svgIcon("x", { size: 18 })}</button>
        </div>
        ${sheetLinks}
        <a class="btn btn--danger btn--block" href="urgencias.html" style="margin-top:1rem">
          ${svgIcon("siren", { size: 16 })} Urgencias · Línea 123
        </a>
        <a class="btn btn--glass btn--block" href="sistema-de-diseno.html" style="margin-top:.5rem">
          ${svgIcon("star", { size: 16 })} Sistema de diseño
        </a>
      </div>`;

    document.body.prepend(sheet);
    qs("#sb-header").replaceWith(header);

    /* Comportamiento: scroll + hoja + escape */
    const nav = qs("#sb-nav");
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const openSheet = (open) => {
      sheet.classList.toggle("is-open", open);
      qs("#sb-burger").setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
      if (open) sheet.querySelector(".sheet__link, .sheet__close")?.focus();
    };
    qs("#sb-burger").addEventListener("click", () => openSheet(true));
    sheet.querySelectorAll("[data-close-sheet], a").forEach((n) =>
      n.addEventListener("click", () => openSheet(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") openSheet(false); });
  }

  /* ---------- Pie ---------- */
  function renderFooter() {
    const year = new Date().getFullYear();
    const footer = el("footer", { class: "footer" });
    footer.innerHTML = `
      <div class="container">
        <div class="footer__grid">
          <div>
            <div class="footer__brandline">${brandHTML({ sub: "Prototipo · 2026" })}</div>
            <p class="footer__desc">
              Plataforma de orientación ciudadana que centraliza la información de los
              servicios de salud del Distrito de Buenaventura. No sustituye los sistemas
              institucionales de agendamiento ni la gestión clínica.
            </p>
            <a class="footer__sos" href="urgencias.html">${svgIcon("siren", { size: 15 })} Emergencias · Llamar al 123</a>
          </div>
          <div>
            <h4>Plataforma</h4>
            <div class="footer__links">
              <a href="index.html">Inicio</a>
              <a href="servicios.html">Directorio de servicios</a>
              <a href="tramites.html">Trámites guiados</a>
              <a href="urgencias.html">Urgencias y rutas</a>
            </div>
          </div>
          <div>
            <h4>Institucional</h4>
            <div class="footer__links">
              <a href="proyecto.html">Sobre el proyecto</a>
              <a href="sistema-de-diseno.html">Sistema de diseño</a>
              <a href="https://www.minsalud.gov.co" target="_blank" rel="noopener">MinSalud ${svgIcon("external-link", { size: 12 })}</a>
              <a href="https://www.supersalud.gov.co" target="_blank" rel="noopener">SuperSalud ${svgIcon("external-link", { size: 12 })}</a>
            </div>
          </div>
          <div>
            <h4>Contacto del prototipo</h4>
            <div class="footer__links">
              <a href="mailto:contacto@saludbuenaventura.demo">contacto@saludbuenaventura.demo</a>
              <a href="proyecto.html#metodologia">Metodología y equipo</a>
              <a href="proyecto.html#datos">Gobierno de datos</a>
            </div>
          </div>
        </div>
        <div class="footer__bottom">
          <span>© ${year} Salud Buenaventura · Prototipo académico con datos ilustrativos sujetos a verificación oficial.</span>
          <span class="footer__legal">
            <a href="proyecto.html#riesgos">Riesgos y mitigación</a>
            <a href="sistema-de-diseno.html">Biblia de diseño v1.0</a>
          </span>
        </div>
      </div>`;
    qs("#sb-footer").replaceWith(footer);
  }

  /* ---------- Atajo de teclado "/" → búsqueda ---------- */
  function initShortcut() {
    document.addEventListener("keydown", (e) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable) return;
      const input = qs('[data-search-main]');
      if (input) { e.preventDefault(); input.focus(); input.select?.(); }
    });
  }

  /* ---------- Arranque ---------- */
  function boot() {
    if (qs("#sb-header")) renderHeader();
    if (qs("#sb-footer")) renderFooter();
    U.hydrateIcons();
    U.initAccordions();
    U.initReveal();
    U.initCounters();
    initShortcut();
    document.body.classList.add("is-ready");
    document.dispatchEvent(new CustomEvent("sb:ready"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }

  global.SBChrome = { brandHTML, logoMark, LINKS };
})(window);
