/* ============================================================
   SALUD BUENAVENTURA · ICONOS
   ------------------------------------------------------------
   Set propio de iconos lineales (rejilla 24×24, stroke 1.8,
   terminales redondeadas). Cero dependencias externas.
   Uso en JS:  svgIcon("search")  → string SVG completo.
   Uso en HTML: <span data-icon="search"></span> → se hidrata
   automáticamente en DOMContentLoaded (ver chrome.js).
   ============================================================ */
(function (global) {
  "use strict";

  const PATHS = {
    /* — Navegación y UI — */
    search: '<circle cx="11" cy="11" r="7"/><path d="m20.5 20.5-4.2-4.2"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    "chevron-right": '<path d="m9 6 6 6-6 6"/>',
    "chevron-left": '<path d="m15 6-6 6 6 6"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    "arrow-right": '<path d="M4 12h16"/><path d="m14 6 6 6-6 6"/>',
    "arrow-up-right": '<path d="M7 17 17 7"/><path d="M8 7h9v9"/>',
    "external-link": '<path d="M14 4h6v6"/><path d="M20 4 10.5 13.5"/><path d="M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    "check-circle": '<circle cx="12" cy="12" r="9"/><path d="m8.5 12.2 2.4 2.4 4.6-4.9"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><path d="M12 7.6h.01"/>',
    "alert-triangle": '<path d="M10.3 3.9 2.5 17.4A2 2 0 0 0 4.2 20.4h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4.5"/><path d="M12 17h.01"/>',
    "alert-circle": '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5"/><path d="M12 16h.01"/>',
    bell: '<path d="M6 8.5a6 6 0 0 1 12 0c0 5 2 6.5 2 6.5H4s2-1.5 2-6.5Z"/><path d="M10 18.5a2.2 2.2 0 0 0 4 0"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z"/>',
    zap: '<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z"/>',

    /* — Datos y contacto — */
    "map-pin": '<path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11Z"/><circle cx="12" cy="10" r="2.6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 1.8"/>',
    hourglass: '<path d="M6 2h12"/><path d="M6 22h12"/><path d="M6 2v5.5L12 12l6-4.5V2"/><path d="M6 22v-5.5L12 12l6 4.5V22"/>',
    phone: '<path d="M6.6 3h2.8l1.5 4-2 1.4a12.5 12.5 0 0 0 5.7 5.7l1.4-2 4 1.5v2.8a2.1 2.1 0 0 1-2.3 2.1A17.6 17.6 0 0 1 4.5 5.3 2.1 2.1 0 0 1 6.6 3Z"/>',
    mail: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m3.2 7 8.8 6 8.8-6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z"/>',
    message: '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-3.8-.9L3 21l1.9-4.9A8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4Z"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
    banknote: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
    headphones: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2.5" y="14" width="4.5" height="7" rx="2"/><rect x="17" y="14" width="4.5" height="7" rx="2"/>',
    smartphone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',

    /* — Salud (categorías de servicio) — */
    cross: '<path d="M9.5 3h5v6.5H21v5h-6.5V21h-5v-6.5H3v-5h6.5V3Z"/>',
    siren: '<path d="M7 18v-6a5 5 0 0 1 10 0v6"/><path d="M5 21h14a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1Z"/><path d="M12 3v1.5M4.2 6.2l1.1 1.1M19.8 6.2l-1.1 1.1"/>',
    "heart-pulse": '<path d="M12 20.7S3.8 15.4 3.8 9.6a4.4 4.4 0 0 1 8.2-2.3 4.4 4.4 0 0 1 8.2 2.3c0 5.8-8.2 11.1-8.2 11.1Z"/><path d="M7.6 10.2h2l1.2-2 1.9 3.6 1.3-1.6h2.4"/>',
    stethoscope: '<path d="M5.5 3v5a5 5 0 0 0 10 0V3"/><path d="M5.5 3H4M15.5 3H17"/><path d="M10.5 13v2.5a4.5 4.5 0 0 0 9 0V14"/><circle cx="19.5" cy="12" r="2"/>',
    hospital: '<path d="M4 21V8.7L12 4l8 4.7V21"/><path d="M3 21h18"/><path d="M9.5 21v-4.5h5V21"/><path d="M12 8.6v3.2M10.4 10.2h3.2"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/><path d="M10 21v-2.5h4V21"/>',
    tooth: '<path d="M12 5.5c-1.3-1.4-3-2.1-4.6-1.7C5.3 4.3 4.2 6.2 4.5 8.4c.2 1.7.9 2.9 1.4 4.6.4 1.5.5 3.2.8 4.7.2 1.2.8 2.1 1.7 2.1 1 0 1.5-1 1.8-2.4.3-1.6.6-3.6 1.8-3.6s1.5 2 1.8 3.6c.3 1.4.8 2.4 1.8 2.4.9 0 1.5-.9 1.7-2.1.3-1.5.4-3.2.8-4.7.5-1.7 1.2-2.9 1.4-4.6.3-2.2-.8-4.1-2.9-4.6-1.6-.4-3.3.3-4.6 1.7Z"/>',
    baby: '<circle cx="12" cy="7" r="3.5"/><path d="M10.5 6.8h.01M13.5 6.8h.01"/><path d="M10.8 8.6c.3.3.7.5 1.2.5s.9-.2 1.2-.5"/><path d="M12 10.5c-3 0-5 1.8-5 4.2V21h10v-6.3c0-2.4-2-4.2-5-4.2Z"/>',
    pill: '<rect x="1.8" y="8.5" width="20.4" height="7" rx="3.5" transform="rotate(-45 12 12)"/><path d="m8.5 8.5 7 7"/>',
    syringe: '<path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/>',
    microscope: '<path d="M6 18h8"/><path d="M3.5 21.5h17"/><path d="M14 21.5a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>',
    thermometer: '<path d="M14 14.8V5a2 2 0 1 0-4 0v9.8a4.5 4.5 0 1 0 4 0Z"/><path d="M12 9.5v6"/>',
    activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    bed: '<path d="M3 5v14"/><path d="M3 11h13a5 5 0 0 1 5 5v3"/><path d="M3 19h18"/><circle cx="7.5" cy="8" r="1.8"/>',
    scan: '<path d="M4 8V6a2 2 0 0 1 2-2h2"/><path d="M16 4h2a2 2 0 0 1 2 2v2"/><path d="M20 16v2a2 2 0 0 1-2 2h-2"/><path d="M8 20H6a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>',
    firstaid: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7"/><path d="M12 11v5M9.5 13.5h5"/>',
    droplet: '<path d="M12 22a7 7 0 0 0 7-7c0-5-7-12-7-12S5 10 5 15a7 7 0 0 0 7 7Z"/>',
    brain: '<path d="M12 4.5a3 3 0 0 0-5.9-.7A2.8 2.8 0 0 0 3.6 6a3 3 0 0 0-.5 4.4A3 3 0 0 0 4 15.6a2.9 2.9 0 0 0 3.3 3.8A3 3 0 0 0 12 18.5Z"/><path d="M12 4.5a3 3 0 0 1 5.9-.7A2.8 2.8 0 0 1 20.4 6a3 3 0 0 1 .5 4.4A3 3 0 0 1 20 15.6a2.9 2.9 0 0 1-3.3 3.8A3 3 0 0 1 12 18.5Z"/><path d="M12 4.5v14"/>',
    video: '<rect x="2.5" y="6" width="13" height="12" rx="2.5"/><path d="m15.5 10.5 6-3.5v10l-6-3.5"/>',
    anchor: '<circle cx="12" cy="5" r="2.5"/><path d="M12 7.5V21"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/><path d="M8 12h8"/>',
    eye: '<path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',

    /* — Institución y ciudadanos — */
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    "shield-check": '<path d="M12 22s8-3.2 8-9.5V5.8L12 2.5 4 5.8v6.7C4 18.8 12 22 12 22Z"/><path d="m9 11.8 2.2 2.2L15.5 9.5"/>',
    "file-text": '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/>',
    "clipboard-list": '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 12 1.5 1.5L13 11"/><path d="M15 12h2"/><path d="m9 16.5 1.5 1.5L13 15.5"/><path d="M15 16.5h2"/>',
    route: '<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h6.5"/>',
    accessibility: '<circle cx="12" cy="4.5" r="2"/><path d="m4.5 8.5 7.5 2 7.5-2"/><path d="M12 10.5V15"/><path d="m8.5 21 3.5-6 3.5 6"/>'
  };

  /**
   * Devuelve el SVG completo de un icono.
   * @param {string} name  Nombre del icono (clave de PATHS).
   * @param {object} [o]  { size:number, stroke:number, cls:string }
   */
  function svgIcon(name, o = {}) {
    const body = PATHS[name] || PATHS.info;
    const size = o.size || 24;
    const stroke = o.stroke || 1.8;
    const cls = o.cls ? ` class="${o.cls}"` : "";
    return `<svg${cls} xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
  }

  /** Lista de nombres (para la galería del sistema de diseño). */
  function iconNames() { return Object.keys(PATHS); }

  global.SBIcons = { svgIcon, iconNames, PATHS };
})(window);
