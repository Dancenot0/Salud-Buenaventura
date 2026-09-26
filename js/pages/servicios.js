/* ============================================================
   SALUD BUENAVENTURA · DIRECTORIO (servicios.html)
   ------------------------------------------------------------
   Búsqueda + filtros (tipo, zona, servicio, 24 h, verificados)
   con sincronización bidireccional de URL (?q=&tipo=&zona=&
   serv=&urg=&ver=). Renderizado incremental desde SBData.
   ============================================================ */
(function () {
  "use strict";
  const { svgIcon } = window.SBIcons;
  const U = window.SBUtils;
  const R = window.SBRender;
  const D = window.SBData;
  const { qs, qsa, escapeHTML: esc, debounce } = U;

  const state = { q: "", tipo: "", zona: "", serv: "", urg: false, ver: false, sort: "relevancia" };

  function init() {
    buildFilterOptions();
    readURL();
    bindEvents();
    render();
  }

  /* ---------- Opciones dinámicas de selects ---------- */
  function buildFilterOptions() {
    const tipos = [...new Set(D.ips.map((i) => i.tipo))].sort((a, b) => a.localeCompare(b, "es"));
    const zonas = [...new Set(D.ips.map((i) => i.zonaGrupo))];
    const ordenZonas = ["Centro", "Urbana norte", "Urbana sur", "Rural ríos", "Rural costa", "Itinerante"];
    zonas.sort((a, b) => ordenZonas.indexOf(a) - ordenZonas.indexOf(b));

    qs("#f-tipo").innerHTML = `<option value="">Todos los tipos</option>` +
      tipos.map((t) => `<option value="${esc(t)}">${esc(t)}</option>`).join("");
    qs("#f-zona").innerHTML = `<option value="">Todas las zonas</option>` +
      zonas.map((z) => `<option value="${esc(z)}">${esc(z)}</option>`).join("") +
      `<option value="rural">Zona rural e itinerante</option>`;
  }

  const ZONAS_RURALES = ["Rural ríos", "Rural costa", "Itinerante"];

  /* ---------- Estado ⇄ URL ---------- */
  function readURL() {
    state.q = U.getParam("q") || "";
    state.tipo = U.getParam("tipo") || "";
    state.zona = U.getParam("zona") || "";
    state.serv = U.getParam("serv") || "";
    state.urg = U.getParam("urg") === "1";
    state.ver = U.getParam("ver") === "1";
    qs("#f-q").value = state.q;
    qs("#f-tipo").value = state.tipo;
    qs("#f-zona").value = state.zona;
    qsa("[data-chip]").forEach((c) => {
      const k = c.dataset.chip;
      const activo = k === "urg" ? state.urg : k === "ver" ? state.ver : state.serv === c.dataset.serv;
      c.classList.toggle("is-active", Boolean(activo));
    });
  }

  function writeURL() {
    U.setParams({
      q: state.q || null, tipo: state.tipo || null, zona: state.zona || null,
      serv: state.serv || null, urg: state.urg ? "1" : null, ver: state.ver ? "1" : null
    });
  }

  /* ---------- Filtrado ---------- */
  function filtrar() {
    const q = state.q.trim().toLowerCase();
    let out = D.ips.filter((i) => {
      if (state.tipo && i.tipo !== state.tipo) return false;
      if (state.zona) {
        if (state.zona === "rural") { if (!ZONAS_RURALES.includes(i.zonaGrupo)) return false; }
        else if (i.zonaGrupo !== state.zona) return false;
      }
      if (state.serv && !(i.servicios || []).includes(state.serv)) return false;
      if (state.urg && !i.urgencias24) return false;
      if (state.ver && !i.verificado) return false;
      if (q) {
        const hay = [i.nombre, i.tipo, i.entidad, i.direccion, i.zona, i.descripcion,
          ...(i.servicios || []).map((s) => D.servicioById(s)?.nombre || "")
        ].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (state.sort === "nombre") {
      out.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    } else {
      /* relevancia: destacados primero, verificados después, 24 h después */
      out.sort((a, b) =>
        (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0) ||
        (b.verificado ? 1 : 0) - (a.verificado ? 1 : 0) ||
        (b.urgencias24 ? 1 : 0) - (a.urgencias24 ? 1 : 0));
    }
    return out;
  }

  /* ---------- Render ---------- */
  function render() {
    const resultados = filtrar();
    const grid = qs("#resultados");
    const count = qs("#result-count");

    count.innerHTML = resultados.length === D.ips.length
      ? `<strong>${resultados.length}</strong> instituciones en el directorio`
      : `<strong>${resultados.length}</strong> de ${D.ips.length} instituciones coinciden`;

    if (!resultados.length) {
      grid.innerHTML = `
        <div class="empty" style="grid-column:1/-1">
          ${svgIcon("search", { size: 40 })}
          <h3>Sin resultados para esta búsqueda</h3>
          <p>Pruebe con otros términos («odontología», «laboratorio», «EPS») o limpie los filtros para ver el directorio completo.</p>
          <button class="btn btn--glass" id="limpiar-filtros">${svgIcon("x", { size: 15 })} Limpiar filtros</button>
        </div>`;
      qs("#limpiar-filtros").addEventListener("click", limpiar);
      return;
    }

    grid.innerHTML = resultados.map((i, n) => R.ipsCardHTML(i, { delay: Math.min(n, 6) * 60 })).join("");
    U.initReveal(grid);
  }

  function limpiar() {
    Object.assign(state, { q: "", tipo: "", zona: "", serv: "", urg: false, ver: false });
    qs("#f-q").value = ""; qs("#f-tipo").value = ""; qs("#f-zona").value = "";
    qsa("[data-chip]").forEach((c) => c.classList.remove("is-active"));
    writeURL(); render();
  }

  /* ---------- Eventos ---------- */
  function bindEvents() {
    qs("#f-q").addEventListener("input", debounce((e) => {
      state.q = e.target.value; writeURL(); render();
    }, 200));

    qs("#f-tipo").addEventListener("change", (e) => { state.tipo = e.target.value; writeURL(); render(); });
    qs("#f-zona").addEventListener("change", (e) => { state.zona = e.target.value; writeURL(); render(); });
    qs("#f-sort").addEventListener("change", (e) => { state.sort = e.target.value; render(); });

    qsa("[data-chip]").forEach((c) => {
      c.addEventListener("click", () => {
        const k = c.dataset.chip;
        if (k === "urg") { state.urg = !state.urg; c.classList.toggle("is-active", state.urg); }
        else if (k === "ver") { state.ver = !state.ver; c.classList.toggle("is-active", state.ver); }
        else if (c.dataset.serv) {
          const activo = c.classList.contains("is-active");
          qsa("[data-chip][data-serv]").forEach((x) => x.classList.remove("is-active"));
          state.serv = activo ? "" : c.dataset.serv;
          if (!activo) c.classList.add("is-active");
        }
        writeURL(); render();
      });
    });

    qs("#btn-limpiar").addEventListener("click", limpiar);
  }

  document.addEventListener("sb:ready", init);
})();
