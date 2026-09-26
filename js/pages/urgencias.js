/* ============================================================
   SALUD BUENAVENTURA · URGENCIAS (urgencias.html)
   Líneas oficiales, rutas de atención y puntos 24 h.
   ============================================================ */
(function () {
  "use strict";
  const { svgIcon } = window.SBIcons;
  const U = window.SBUtils;
  const R = window.SBRender;
  const D = window.SBData;
  const { qs, escapeHTML: esc } = U;

  function init() {
    renderLineas();
    renderRutas();
    renderPuntos24();
  }

  function renderLineas() {
    const host = qs("#lineas-grid");
    if (!host) return;
    host.innerHTML = D.lineas.map((l, n) => `
      <a class="card card--hover line-card reveal" style="--d:${n * 60}ms" href="${U.telLink(l.numero.replace(/\s/g, ""))}">
        <span class="line-card__num ${l.numero.length > 6 ? "long" : ""}">${esc(l.numero)}</span>
        <span class="line-card__name">${esc(l.nombre)}</span>
        <span class="line-card__desc">${esc(l.desc)}</span>
        <span class="badge badge--neutral" style="width:fit-content">${svgIcon("clock", { size: 12 })} ${esc(l.disponible)}</span>
        <span class="line-card__go">${l.tipo === "emergencia" ? "Llamar ahora" : "Ver canal"} ${svgIcon("arrow-up-right", { size: 14 })}</span>
      </a>`).join("");
    U.initReveal(host);
  }

  function renderRutas() {
    const host = qs("#rutas-list");
    if (!host) return;
    host.innerHTML = D.rutas.map((r, n) => `
      <div class="card route-card reveal" style="--d:${n * 60}ms">
        <div style="display:flex;gap:var(--sp-4);align-items:center;flex-wrap:wrap">
          <span class="tile tile--danger" aria-hidden="true">${svgIcon(r.icono)}</span>
          <div style="flex:1;min-width:200px">
            <h3 class="h3" style="font-size:1.12rem">${esc(r.titulo)}</h3>
            <span class="badge badge--danger" style="margin-top:4px">${svgIcon("alert-triangle", { size: 12 })} ${esc(r.gravedad)}</span>
          </div>
          <div style="display:flex;gap:var(--sp-2)">
            ${r.llamar.map((num) => `<a class="btn btn--danger btn--sm" href="tel:${num}">${svgIcon("phone", { size: 14 })} ${num}</a>`).join("")}
          </div>
        </div>
        <div class="route-card__body">
          <div>
            <h4>Qué hacer</h4>
            <ul>${r.acciones.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
          </div>
          <div>
            <h4>A dónde ir</h4>
            <ul><li>${esc(r.donde)}</li></ul>
            <a class="btn btn--glass btn--sm" href="servicios.html?urg=1" style="margin-top:var(--sp-2)">
              ${svgIcon("siren", { size: 14 })} Ver puntos con urgencias 24 h
            </a>
          </div>
        </div>
      </div>`).join("");
    U.initReveal(host);
  }

  function renderPuntos24() {
    const host = qs("#puntos-24");
    if (!host) return;
    const puntos = D.ips.filter((i) => i.urgencias24);
    host.innerHTML = puntos.map((i, n) => R.ipsCardHTML(i, { compact: true, delay: n * 80 })).join("");
    U.initReveal(host);
  }

  document.addEventListener("sb:ready", init);
})();
