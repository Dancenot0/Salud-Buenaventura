/* ============================================================
   SALUD BUENAVENTURA · TRÁMITES (tramites.html)
   Guías paso a paso con filtro por categoría y búsqueda.
   ============================================================ */
(function () {
  "use strict";
  const { svgIcon } = window.SBIcons;
  const U = window.SBUtils;
  const D = window.SBData;
  const { qs, qsa, escapeHTML: esc, debounce } = U;

  let state = { q: "", cat: "" };

  function init() {
    state.cat = U.getParam("cat") || "";
    state.q = U.getParam("q") || "";
    qs("#t-q").value = state.q;
    renderChips();
    bind();
    render();
  }

  function renderChips() {
    const cats = [...new Set(D.tramites.map((t) => t.categoria))];
    qs("#t-chips").innerHTML =
      `<button class="chip ${state.cat === "" ? "is-active" : ""}" data-cat="">Todas</button>` +
      cats.map((c) =>
        `<button class="chip ${state.cat === c ? "is-active" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`
      ).join("");
    qsa("#t-chips .chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        state.cat = chip.dataset.cat;
        qsa("#t-chips .chip").forEach((c) => c.classList.toggle("is-active", c === chip));
        U.setParams({ cat: state.cat || null });
        render();
      });
    });
  }

  function filtrar() {
    const q = state.q.trim().toLowerCase();
    return D.tramites.filter((t) => {
      if (state.cat && t.categoria !== state.cat) return false;
      if (q && !(t.titulo + " " + t.resumen + " " + t.entidad).toLowerCase().includes(q)) return false;
      return true;
    });
  }

  function render() {
    const host = qs("#tramites-list");
    const out = filtrar();
    qs("#tramites-count").innerHTML = `<strong>${out.length}</strong> de ${D.tramites.length} trámites`;

    if (!out.length) {
      host.innerHTML = `
        <div class="empty">
          ${svgIcon("search", { size: 40 })}
          <h3>No encontramos ese trámite</h3>
          <p>Pruebe con «EPS», «Sisbén», «vacunas» o «queja», o limpie los filtros.</p>
          <button class="btn btn--glass" id="t-limpiar">Limpiar filtros</button>
        </div>`;
      qs("#t-limpiar").addEventListener("click", () => {
        state = { q: "", cat: "" };
        qs("#t-q").value = "";
        renderChips(); U.setParams({ q: null, cat: null }); render();
      });
      return;
    }

    host.innerHTML = out.map((t, idx) => `
      <div class="acc-item reveal" style="--d:${Math.min(idx, 5) * 60}ms">
        <button class="acc-trigger" aria-expanded="false" aria-controls="tr-p-${esc(t.id)}" id="tr-t-${esc(t.id)}">
          <span class="tile" style="width:38px;height:38px;border-radius:11px" aria-hidden="true">
            ${svgIcon(t.categoria === "Afiliación" ? "clipboard-list" : t.categoria === "Certificados" ? "file-text" : t.categoria === "Verificación" ? "shield-check" : "stethoscope", { size: 19 })}
          </span>
          <span class="tramite-head">
            <span>
              ${esc(t.titulo)}
              <span class="tiny" style="display:block;font-weight:400">${esc(t.entidad)}</span>
            </span>
            <span class="tramite-meta">
              <span class="badge badge--neutral">${svgIcon("hourglass", { size: 12 })} ${esc(t.duracion)}</span>
              <span class="badge ${t.costo === "Gratuito" ? "badge--ok" : "badge--neutral"}">${svgIcon("banknote", { size: 12 })} ${esc(t.costo)}</span>
            </span>
          </span>
          <span class="acc-trigger__chev" aria-hidden="true">${svgIcon("chevron-down", { size: 18 })}</span>
        </button>
        <div class="acc-panel" id="tr-p-${esc(t.id)}" role="region" aria-labelledby="tr-t-${esc(t.id)}">
          <div class="acc-panel__inner"><div class="acc-panel__content">
            <p style="margin-bottom:var(--sp-5)">${esc(t.resumen)}</p>
            <div class="tramite-body">
              <div>
                <h4 style="font-size:var(--fs-xs);text-transform:uppercase;letter-spacing:.08em;color:var(--c-ink-3);margin-bottom:var(--sp-4)">Paso a paso</h4>
                <ol class="mini-steps">
                  ${t.pasos.map((p) => `<li><span><b>${esc(p.t)}</b><span>${esc(p.d)}</span></span></li>`).join("")}
                </ol>
              </div>
              <div>
                <h4 style="font-size:var(--fs-xs);text-transform:uppercase;letter-spacing:.08em;color:var(--c-ink-3);margin-bottom:var(--sp-4)">Requisitos</h4>
                <ul class="checklist">
                  ${t.requisitos.map((r) => `<li>${svgIcon("check-circle", { size: 17 })}<span>${esc(r)}</span></li>`).join("")}
                </ul>
                <h4 style="font-size:var(--fs-xs);text-transform:uppercase;letter-spacing:.08em;color:var(--c-ink-3);margin:var(--sp-5) 0 var(--sp-3)">Canales</h4>
                <div style="display:flex;flex-wrap:wrap;gap:var(--sp-2)">
                  ${t.canales.map((c) => `<span class="badge badge--info">${esc(c)}</span>`).join("")}
                </div>
                ${t.tip ? `<div class="alert alert--warn" style="margin-top:var(--sp-5)">${svgIcon("info", { size: 18 })}<span>${esc(t.tip)}</span></div>` : ""}
              </div>
            </div>
          </div></div>
        </div>
      </div>`).join("");
    U.initReveal(host);
  }

  function bind() {
    qs("#t-q").addEventListener("input", debounce((e) => {
      state.q = e.target.value; U.setParams({ q: state.q || null }); render();
    }, 200));
  }

  document.addEventListener("sb:ready", init);
})();
