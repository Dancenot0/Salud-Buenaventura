/* ============================================================
   SALUD BUENAVENTURA · HOME (index.html)
   ============================================================ */
(function () {
  "use strict";
  const { svgIcon } = window.SBIcons;
  const U = window.SBUtils;
  const R = window.SBRender;
  const D = window.SBData;
  const { qs, qsa, el, escapeHTML: esc } = U;

  function init() {
    renderHeroVisual();
    renderPopulares();
    renderDestacadas();
    renderContadores();
    renderAvisos();
    renderFaqs();
    initBusqueda();
  }

  /* ---------- Composición visual del hero ---------- */
  function renderHeroVisual() {
    const host = qs("#hero-visual");
    if (!host) return;
    const ips = D.ips.find((i) => i.id === "hospital-luis-ablanque") || D.ips[0];
    const estado = U.estadoAbierto(ips);
    const abiertas = D.ips.filter((i) => U.estadoAbierto(i).abierto).length;

    host.innerHTML = `
      <div class="visual-stack">
        <div class="visual-ghost" aria-hidden="true"></div>
        <div class="visual-card visual-main">
          <div class="visual-card__head">
            <span class="tile tile--danger" aria-hidden="true">${svgIcon("hospital")}</span>
            <div>
              <div class="visual-card__name">${esc(ips.nombre)}</div>
              <div class="visual-card__tipo">${esc(ips.tipo)} · ${esc(ips.nivel)}</div>
            </div>
          </div>
          <div class="visual-rows">
            <div class="visual-row">${svgIcon("siren", { size: 16 })}<span><b>Urgencias 24 h</b> · todos los días</span></div>
            <div class="visual-row">${svgIcon("map-pin", { size: 16 })}<span>${esc(ips.direccion)}</span></div>
            <div class="visual-row">${svgIcon("clock", { size: 16 })}<span>${esc(estado.texto)}</span></div>
          </div>
          <div class="visual-actions">
            <a class="btn btn--primary btn--sm" href="detalle.html?id=${ips.id}">Ver ficha completa</a>
            <a class="btn btn--glass btn--sm" href="${U.telLink(ips.telefono)}">${svgIcon("phone", { size: 14 })} Llamar</a>
          </div>
        </div>
        <div class="visual-card visual-side">
          <div class="visual-side__label">Disponibilidad ahora</div>
          <div class="visual-side__value">${abiertas}<span style="font-size:.9rem;color:var(--c-ink-3);font-weight:500"> / ${D.ips.length}</span></div>
          <div class="visual-side__hint"><span class="dot dot--ok"></span> instituciones abiertas en este momento</div>
        </div>
      </div>`;
  }

  /* ---------- Servicios más buscados (top por cobertura) ---------- */
  function renderPopulares() {
    const host = qs("#popular-grid");
    if (!host) return;
    const conteo = {};
    D.ips.forEach((i) => (i.servicios || []).forEach((s) => { conteo[s] = (conteo[s] || 0) + 1; }));
    const top = Object.entries(conteo).sort((a, b) => b[1] - a[1]).slice(0, 8);

    host.innerHTML = top.map(([id, n]) => {
      const s = D.servicioById(id);
      if (!s) return "";
      return `<a class="popular-item" href="servicios.html?serv=${encodeURIComponent(id)}">
        ${svgIcon(s.icono, { size: 19 })}
        <span>${esc(s.nombre)}<small>Disponible en ${n} ${n === 1 ? "institución" : "instituciones"}</small></span>
      </a>`;
    }).join("");
  }

  /* ---------- Instituciones destacadas ---------- */
  function renderDestacadas() {
    const host = qs("#featured-grid");
    if (!host) return;
    const destacadas = D.ips.filter((i) => i.destacado).slice(0, 3);
    host.innerHTML = destacadas.map((i, n) => R.ipsCardHTML(i, { delay: n * 90 })).join("");
    U.initReveal(host);
  }

  /* ---------- Contadores ---------- */
  function renderContadores() {
    const urg = D.ips.filter((i) => i.urgencias24).length;
    const rural = D.ips.filter((i) => i.zonaGrupo.startsWith("Rural") || i.zonaGrupo === "Itinerante").length;
    const map = {
      "#stat-ips": { n: D.ips.length, suf: "" },
      "#stat-servicios": { n: D.servicios.length, suf: "" },
      "#stat-urgencias": { n: urg, suf: "/7" },
      "#stat-rural": { n: rural, suf: "" }
    };
    for (const [sel, cfg] of Object.entries(map)) {
      const node = qs(sel);
      if (node) { node.dataset.count = cfg.n; node.dataset.suffix = cfg.suf; node.textContent = "0"; }
    }
    U.initCounters(); // vincula ahora que los valores reales están en data-count
  }

  /* ---------- Avisos ---------- */
  function renderAvisos() {
    const host = qs("#news-list");
    if (!host) return;
    const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    host.innerHTML = D.avisos.slice(0, 4).map((a) => {
      const d = new Date(a.fecha + "T12:00:00");
      return `<a class="news-item reveal" href="proyecto.html">
        <div class="news-item__date">
          <span class="news-item__day">${String(d.getDate()).padStart(2, "0")}</span>
          <span class="news-item__month">${MESES[d.getMonth()]}</span>
        </div>
        <div class="news-item__body">
          <div class="news-item__title">${esc(a.titulo)}</div>
          <div class="news-item__excerpt">${esc(a.extracto)}</div>
        </div>
        <span class="badge badge--info news-item__cat">${svgIcon(a.icono, { size: 13 })} ${esc(a.categoria)}</span>
      </a>`;
    }).join("");
    U.initReveal(host);
  }

  /* ---------- FAQ ---------- */
  function renderFaqs() {
    const host = qs("#faq-list");
    if (!host) return;
    host.innerHTML = D.faqs.map((f, idx) => `
      <div class="acc-item">
        <button class="acc-trigger" aria-expanded="false" aria-controls="faq-p-${idx}" id="faq-t-${idx}">
          ${esc(f.q)}
          <span class="acc-trigger__chev" aria-hidden="true">${svgIcon("chevron-down", { size: 18 })}</span>
        </button>
        <div class="acc-panel" id="faq-p-${idx}" role="region" aria-labelledby="faq-t-${idx}">
          <div class="acc-panel__inner"><div class="acc-panel__content">${esc(f.a)}</div></div>
        </div>
      </div>`).join("");
  }

  /* ---------- Búsqueda del hero + chips rápidos ---------- */
  function initBusqueda() {
    const form = qs("#hero-search-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const q = qs("#hero-search-input").value.trim();
        location.href = q ? `servicios.html?q=${encodeURIComponent(q)}` : "servicios.html";
      });
    }
    qsa("[data-chip-serv]").forEach((chip) => {
      chip.addEventListener("click", () => {
        location.href = `servicios.html?serv=${encodeURIComponent(chip.dataset.chipServ)}`;
      });
    });
  }

  document.addEventListener("sb:ready", init);
})();
