/* ============================================================
   SALUD BUENAVENTURA · DETALLE DE INSTITUCIÓN (detalle.html)
   Renderiza la ficha completa desde ?id= con horarios en vivo,
   contacto con copiar-al-portapapeles y mapa estilizado.
   ============================================================ */
(function () {
  "use strict";
  const { svgIcon } = window.SBIcons;
  const U = window.SBUtils;
  const R = window.SBRender;
  const D = window.SBData;
  const { qs, escapeHTML: esc, labelDias } = U;

  function init() {
    const id = U.getParam("id");
    const ips = D.ips.find((i) => i.id === id);
    const host = qs("#detalle-root");
    if (!ips) {
      host.innerHTML = `
        <div class="empty">
          ${svgIcon("alert-circle", { size: 40 })}
          <h3>Institución no encontrada</h3>
          <p>El enlace puede estar desactualizado. Explore el directorio completo para encontrar lo que busca.</p>
          <a class="btn btn--primary" href="servicios.html">Ir al directorio</a>
        </div>`;
      document.title = "Ficha no encontrada · Salud Buenaventura";
      return;
    }
    document.title = `${ips.nombre} · Salud Buenaventura`;
    host.innerHTML = view(ips);
    bind(ips);
    U.initReveal(host);
  }

  /* ---------- Tabla de horarios con día actual resaltado ---------- */
  function horariosHTML(ips) {
    const hoy = new Date().getDay();
    const filas = (ips.horarios || []).map((h) => {
      const esHoy = h.dias.includes(hoy);
      return `<tr class="${esHoy ? "is-today" : ""}">
        <td>${esc(labelDias(h.dias))}${esHoy ? ' <span class="badge badge--info" style="margin-left:6px">Hoy</span>' : ""}</td>
        <td><b>${h.abre} – ${h.cierra}</b></td>
        <td class="tiny">${esc(h.nota || "")}</td>
      </tr>`;
    }).join("");
    const extra = ips.urgencias24
      ? `<tr class="is-today"><td>Todos los días</td><td><b>24 horas</b></td><td class="tiny">Servicio de urgencias</td></tr>`
      : "";
    return `
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Días</th><th>Horario</th><th>Nota</th></tr></thead>
          <tbody>${filas}${extra}</tbody>
        </table>
      </div>
      ${ips.notaHorario ? `<p class="tiny" style="margin-top:var(--sp-3)">${svgIcon("info", { size: 13 })} ${esc(ips.notaHorario)}</p>` : ""}`;
  }

  /* ---------- Mapa estilizado (sin dependencias externas) ---------- */
  function mapaHTML(ips) {
    const q = `${ips.direccion}, Buenaventura, Valle del Cauca, Colombia`;
    return `
      <div class="map-card" role="img" aria-label="Ubicación aproximada de ${esc(ips.nombre)}">
        <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="agua" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#B7DCE6"/><stop offset="1" stop-color="#9CCBD9"/>
            </linearGradient>
          </defs>
          <path d="M0 0h400v96c-42 14-70 6-104 22-38 18-52 44-96 52-52 10-72-8-116 4-30 8-56 26-84 22V0Z" fill="url(#agua)" opacity="0.55"/>
          <g stroke="#8FB9C6" stroke-width="1.4" fill="none" opacity="0.65">
            <path d="M0 150 C80 138 130 168 210 152 C280 138 330 160 400 146"/>
            <path d="M60 220 L84 150 L70 96"/>
            <path d="M240 220 L252 160 L296 120"/>
          </g>
          <g stroke="#A9C4CE" stroke-width="6" stroke-linecap="round" opacity="0.55">
            <path d="M20 190 H380"/><path d="M200 60 V210"/>
          </g>
          <g fill="#DCE9EE" opacity="0.9">
            <rect x="120" y="160" width="26" height="18" rx="3"/><rect x="156" y="152" width="22" height="26" rx="3"/>
            <rect x="226" y="164" width="30" height="16" rx="3"/><rect x="266" y="150" width="18" height="30" rx="3"/>
            <rect x="128" y="76" width="24" height="16" rx="3"/><rect x="248" y="80" width="26" height="14" rx="3"/>
          </g>
        </svg>
        <span class="map-pin">${svgIcon("map-pin", { size: 34, stroke: 2 })}</span>
        <a class="map-card__link" href="${U.mapsLink(q)}" target="_blank" rel="noopener">
          ${svgIcon("external-link", { size: 13 })} Abrir en Google Maps
        </a>
      </div>`;
  }

  /* ---------- Vista completa ---------- */
  function view(ips) {
    const icono = ips.zonaGrupo === "Itinerante" ? "anchor" : ips.tipo.toLowerCase().includes("eps") ? "clipboard-list" : "hospital";
    const estado = U.badgeEstado(ips);
    const relacionados = D.ips
      .filter((o) => o.id !== ips.id && (o.zonaGrupo === ips.zonaGrupo || o.tipo === ips.tipo))
      .slice(0, 3);

    return `
    <div class="detail-hero">
      <div class="container">
        <nav class="breadcrumb reveal" aria-label="Ruta de navegación">
          <a href="index.html">Inicio</a> ${svgIcon("chevron-right", { size: 14 })}
          <a href="servicios.html">Directorio</a> ${svgIcon("chevron-right", { size: 14 })}
          <span aria-current="page">${esc(ips.sigla || ips.nombre)}</span>
        </nav>

        <div class="card detail-hero__card reveal" style="margin-top:var(--sp-5)">
          <span class="tile tile--lg ${ips.urgencias24 ? "tile--danger" : ""}" aria-hidden="true">${svgIcon(icono)}</span>
          <div class="detail-hero__id">
            <div class="detail-hero__badges">${R.badgesHTML(ips)}</div>
            <h1 class="detail-hero__title">${esc(ips.nombre)}</h1>
            <p class="lead" style="font-size:1rem">${esc(ips.descripcion)}</p>
            <div class="detail-hero__contacts" style="margin-top:var(--sp-5)">
              <a class="btn btn--primary btn--sm" href="${U.telLink(ips.telefono)}">${svgIcon("phone", { size: 15 })} ${esc(ips.telefono)}</a>
              ${ips.whatsapp ? `<a class="btn btn--glass btn--sm" href="${U.waLink(ips.whatsapp)}" target="_blank" rel="noopener">${svgIcon("message", { size: 15 })} WhatsApp</a>` : ""}
              <button class="btn btn--glass btn--sm" data-copy="${esc(ips.direccion)}">${svgIcon("copy", { size: 15 })} Copiar dirección</button>
              ${ips.web ? `<a class="btn btn--ghost btn--sm" href="${esc(ips.web)}" target="_blank" rel="noopener">Sitio oficial ${svgIcon("external-link", { size: 14 })}</a>` : ""}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="detail-grid">
        <!-- Columna principal -->
        <div class="detail-main">
          <section class="card reveal">
            <h2 class="panel-title">${svgIcon("heart-pulse", { size: 19 })} Servicios disponibles</h2>
            <div class="serv-grid">
              ${(ips.servicios || []).map((id) => {
                const s = D.servicioById(id);
                return s ? `<div class="serv-item" title="${esc(s.desc)}">${svgIcon(s.icono, { size: 16 })}<span>${esc(s.nombre)}</span></div>` : "";
              }).join("")}
            </div>
          </section>

          <section class="card reveal" style="--d:80ms">
            <h2 class="panel-title">${svgIcon("clipboard-list", { size: 19 })} Requisitos para la atención</h2>
            <ul class="checklist">
              ${(ips.requisitos || []).map((r) => `<li>${svgIcon("check-circle", { size: 17 })}<span>${esc(r)}</span></li>`).join("")}
            </ul>
            <div class="alert alert--info" style="margin-top:var(--sp-5)">
              ${svgIcon("info", { size: 20 })}
              <span><span class="alert__title">Antes de desplazarse</span>
              Esta plataforma orienta, no agenda. Confirme disponibilidad por los canales oficiales de la institución.</span>
            </div>
          </section>

          ${relacionados.length ? `
          <section class="reveal" style="--d:140ms">
            <h2 class="panel-title">${svgIcon("users", { size: 19 })} Instituciones relacionadas</h2>
            <div class="ips-grid" style="grid-template-columns:1fr">${relacionados.map((r) => R.ipsCardHTML(r, { compact: true })).join("")}</div>
          </section>` : ""}
        </div>

        <!-- Columna lateral -->
        <aside class="detail-side">
          <section class="card reveal" style="--d:60ms">
            <h2 class="panel-title">${svgIcon("clock", { size: 19 })} Horarios de atención</h2>
            <div style="margin-bottom:var(--sp-4)">${estado}</div>
            ${horariosHTML(ips)}
          </section>

          <section class="card reveal" style="--d:120ms">
            <h2 class="panel-title">${svgIcon("map-pin", { size: 19 })} Ubicación</h2>
            ${mapaHTML(ips)}
            <p class="small muted" style="margin-top:var(--sp-4)">${esc(ips.direccion)}<br>${esc(ips.zona)}</p>
          </section>

          <section class="card reveal" style="--d:180ms">
            <h2 class="panel-title">${svgIcon("headphones", { size: 19 })} Canales oficiales</h2>
            <div class="visual-rows">
              <div class="visual-row">${svgIcon("phone", { size: 16 })}<span><b>${esc(ips.telefono)}</b>
                <button class="icon-btn icon-btn--sm" style="margin-left:auto" data-copy="${esc(ips.telefono)}" aria-label="Copiar teléfono">${svgIcon("copy", { size: 15 })}</button></span></div>
              ${ips.email ? `<div class="visual-row">${svgIcon("mail", { size: 16 })}<span><a class="link" href="mailto:${esc(ips.email)}">${esc(ips.email)}</a></span></div>` : ""}
              ${ips.whatsapp ? `<div class="visual-row">${svgIcon("message", { size: 16 })}<span><a class="link" href="${U.waLink(ips.whatsapp)}" target="_blank" rel="noopener">Escribir por WhatsApp</a></span></div>` : ""}
              <div class="visual-row">${svgIcon("calendar", { size: 16 })}<span>Ficha actualizada: <b>${esc(ips.actualizado)}</b></span></div>
            </div>
          </section>
        </aside>
      </div>

      <div class="alert alert--warn reveal" style="margin-top:var(--sp-8)">
        ${svgIcon("alert-triangle", { size: 20 })}
        <span><span class="alert__title">Gobierno de datos del prototipo</span>
        ${ips.verificado
          ? "Ficha contrastada con fuentes públicas en la fecha indicada. Ante cualquier discrepancia, prevalece la información oficial de la institución."
          : "Ficha con datos ilustrativos del prototipo, pendiente de verificación oficial. Confirme siempre en los canales de la institución antes de desplazarse."}
        </span>
      </div>
    </div>`;
  }

  /* ---------- Interacciones (copiar) ---------- */
  function bind() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-copy]");
      if (btn) U.copyText(btn.dataset.copy, "Copiado al portapapeles");
    });
  }

  document.addEventListener("sb:ready", init);
})();
