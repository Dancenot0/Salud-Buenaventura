/* ============================================================
   SALUD BUENAVENTURA · RENDER COMPARTIDO
   ------------------------------------------------------------
   Marcadores HTML reutilizados por home, directorio, detalle y
   urgencias. Toda presentación de una institución vive aquí:
   cambiar una vez = cambiar en todas partes.
   ============================================================ */
(function (global) {
  "use strict";
  const { svgIcon } = global.SBIcons;
  const U = global.SBUtils;
  const { escapeHTML: esc, badgeEstado, labelDias } = U;

  /** Badges de cabecera: tipo · nivel · verificación. */
  function badgesHTML(ips, opts = {}) {
    const out = [];
    out.push(`<span class="badge badge--info">${esc(ips.tipo)}${ips.nivel && !opts.sinNivel ? ` · ${esc(ips.nivel)}` : ""}</span>`);
    if (ips.urgencias24) out.push(`<span class="badge badge--danger">${svgIcon("siren", { size: 13 })} Urgencias 24 h</span>`);
    out.push(ips.verificado
      ? `<span class="badge badge--ok">${svgIcon("check-circle", { size: 13 })} Verificado</span>`
      : `<span class="badge badge--warn">${svgIcon("alert-circle", { size: 13 })} Por verificar</span>`);
    return out.join("");
  }

  /** Filas de metadatos (dirección, teléfono, horario resumido). */
  function metaRowsHTML(ips, opts = {}) {
    const rows = [];
    rows.push(`<div class="meta-row">${svgIcon("map-pin", { size: 16 })}<span>${esc(ips.direccion)} · <b>${esc(ips.zona)}</b></span></div>`);
    rows.push(`<div class="meta-row">${svgIcon("phone", { size: 16 })}<span><b>${esc(ips.telefono)}</b></span></div>`);
    if (!opts.sinHorario) {
      const h = (ips.horarios || [])[0];
      const resumen = ips.urgencias24
        ? "Urgencias 24 h · " + (h ? `${labelDias(h.dias)} ${h.abre}–${h.cierra}` : "según programación")
        : h ? `${labelDias(h.dias)} · ${h.abre}–${h.cierra}` : "Horario por confirmar";
      rows.push(`<div class="meta-row">${svgIcon("clock", { size: 16 })}<span>${esc(resumen)}</span></div>`);
    }
    return rows.join("");
  }

  /** Tags de servicios (chips pequeños con icono). */
  function servicioTagsHTML(ips, max = 4) {
    const D = global.SBData;
    return (ips.servicios || []).slice(0, max).map((id) => {
      const s = D.servicioById(id);
      return s ? `<span class="tag">${svgIcon(s.icono, { size: 13 })}${esc(s.nombre)}</span>` : "";
    }).join("") + ((ips.servicios || []).length > max
      ? `<span class="tag">+${ips.servicios.length - max} más</span>` : "");
  }

  /**
   * Tarjeta completa de institución (grid del directorio, destacados…).
   * @param {object} ips
   * @param {object} opts { compact:boolean, estado:boolean }
   */
  function ipsCardHTML(ips, opts = {}) {
    const D = global.SBData;
    const estado = opts.estado !== false ? badgeEstado(ips) : "";
    const iconoTipo = ips.tipo.toLowerCase().includes("buque") || ips.tipo.toLowerCase().includes("móvil") || ips.tipo.toLowerCase().includes("movil")
      ? "anchor"
      : ips.tipo.toLowerCase().includes("eps") ? "clipboard-list"
      : ips.tipo.toLowerCase().includes("laboratorio") ? "microscope"
      : ips.tipo.toLowerCase().includes("cruz roja") || ips.tipo.toLowerCase().includes("socorro") ? "firstaid"
      : ips.tipo.toLowerCase().includes("pública") || ips.tipo.toLowerCase().includes("publica") ? "building"
      : ips.tipo.toLowerCase().includes("mental") ? "brain"
      : ips.tipo.toLowerCase().includes("odonto") ? "tooth"
      : "hospital";

    return `
    <article class="card card--hover ips-card reveal" style="--d:${opts.delay || 0}ms">
      <div class="ips-card__head">
        <span class="tile ${ips.urgencias24 ? "tile--danger" : ""}" aria-hidden="true">${svgIcon(iconoTipo)}</span>
        <div>
          <h3 class="ips-card__title">
            <a href="detalle.html?id=${encodeURIComponent(ips.id)}">${esc(ips.nombre)}</a>
          </h3>
          <p class="ips-card__tipo">${esc(ips.entidad)}</p>
        </div>
      </div>
      <div class="ips-card__meta">${metaRowsHTML(ips, { sinHorario: opts.compact })}</div>
      <div class="ips-card__tags">${servicioTagsHTML(ips, opts.compact ? 3 : 4)}</div>
      <div class="ips-card__foot">
        <div>${estado}</div>
        <a class="btn btn--glass btn--sm" href="detalle.html?id=${encodeURIComponent(ips.id)}">
          Ver detalle ${svgIcon("chevron-right", { size: 14 })}
        </a>
      </div>
    </article>`;
  }

  global.SBRender = { ipsCardHTML, badgesHTML, metaRowsHTML, servicioTagsHTML };
})(window);
