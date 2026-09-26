/* ============================================================
   SUBAGENTE · SMOKE TEST DE PÁGINAS
   ------------------------------------------------------------
   Ejecuta cada página con jsdom (DOM real + scripts) y verifica
   el resultado renderizado: chrome inyectado, listas de datos,
   filtros por URL, estados vacíos y ausencia de errores de JS.
   Requisito:  npm install --prefix tools jsdom   (solo dev)
   Uso:        node tools/smoke-test.mjs
   ============================================================ */
import { JSDOM, VirtualConsole } from "jsdom";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const cases = [
  {
    file: "index.html",
    checks: [
      ["header inyectado", (d) => !!d.querySelector("#sb-nav")],
      ["footer inyectado", (d) => !!d.querySelector("footer.footer")],
      ["nav activo = Inicio", (d) => d.querySelector('.nav__link[aria-current="page"]')?.textContent.trim() === "Inicio"],
      ["hero visual renderizado", (d) => !!d.querySelector("#hero-visual .visual-card")],
      ["destacadas >= 3", (d) => d.querySelectorAll("#featured-grid .ips-card").length >= 3],
      ["populares = 8", (d) => d.querySelectorAll("#popular-grid .popular-item").length === 8],
      ["avisos = 4", (d) => d.querySelectorAll("#news-list .news-item").length === 4],
      ["faqs = 6", (d) => d.querySelectorAll("#faq-list .acc-item").length === 6],
      ["contador stat-ips = 18", (d) => d.querySelector("#stat-ips").textContent.trim() === "18"],
      ["iconos hidratados", (d) => d.querySelectorAll("[data-icon]").length === 0 && d.querySelectorAll("svg").length > 20],
    ],
  },
  {
    file: "servicios.html",
    checks: [
      ["18 tarjetas", (d) => d.querySelectorAll("#resultados .ips-card").length === 18],
      ["select tipo con opciones", (d) => d.querySelectorAll("#f-tipo option").length > 5],
      ["select zona con alias rural", (d) => [...d.querySelectorAll("#f-zona option")].some((o) => o.value === "rural")],
      ["conteo visible", (d) => d.querySelector("#result-count").textContent.includes("18")],
    ],
  },
  {
    file: "servicios.html?q=odontolog",
    checks: [
      ["filtro q=odontolog >= 1", (d) => d.querySelectorAll("#resultados .ips-card").length >= 1],
      ["input sincronizado", (d) => d.querySelector("#f-q").value === "odontolog"],
    ],
  },
  {
    file: "servicios.html?zona=rural",
    checks: [["alias rural filtra 4", (d) => d.querySelectorAll("#resultados .ips-card").length === 4]],
  },
  {
    file: "servicios.html?urg=1",
    checks: [
      ["urg=1 deja 2", (d) => d.querySelectorAll("#resultados .ips-card").length === 2],
      ["chip urg activo", (d) => d.querySelector('[data-chip="urg"]').classList.contains("is-active")],
    ],
  },
  {
    file: "detalle.html?id=hospital-luis-ablanque",
    checks: [
      ["titulo correcto", (d) => d.querySelector(".detail-hero__title").textContent.includes("Luis Ablanque")],
      ["document.title actualizado", (d) => d.title.includes("Luis Ablanque")],
      ["servicios listados >= 10", (d) => d.querySelectorAll(".serv-item").length >= 10],
      ["tabla horarios", (d) => d.querySelectorAll(".table tbody tr").length >= 2],
      ["badge urgencias 24", (d) => d.body.innerHTML.includes("Urgencias 24 h")],
      ["mapa + link google", (d) => !!d.querySelector(".map-card__link")?.href.includes("google.com/maps")],
      ["relacionadas >= 1", (d) => d.querySelectorAll(".ips-card").length >= 1],
    ],
  },
  {
    file: "detalle.html?id=no-existe",
    checks: [["estado vacio amigable", (d) => d.body.textContent.includes("Institución no encontrada")]],
  },
  {
    file: "tramites.html",
    checks: [
      ["9 tramites", (d) => d.querySelectorAll("#tramites-list .acc-item").length === 9],
      ["chips de categoria", (d) => d.querySelectorAll("#t-chips .chip").length >= 4],
      ["pasos renderizados", (d) => d.querySelectorAll(".mini-steps li").length > 20],
    ],
  },
  {
    file: "tramites.html?q=encuesta",
    checks: [["busqueda encuesta = 1 (Sisbén)", (d) => d.querySelectorAll("#tramites-list .acc-item").length === 1]],
  },
  {
    file: "urgencias.html",
    checks: [
      ["6 lineas", (d) => d.querySelectorAll("#lineas-grid .line-card").length === 6],
      ["6 rutas", (d) => d.querySelectorAll("#rutas-list .route-card").length === 6],
      ["puntos 24h >= 2", (d) => d.querySelectorAll("#puntos-24 .ips-card").length >= 2],
      ["tel links", (d) => [...d.querySelectorAll("#lineas-grid a")].every((a) => a.href.startsWith("tel:"))],
    ],
  },
  {
    file: "proyecto.html",
    checks: [
      ["timeline 4 fases", (d) => d.querySelectorAll(".timeline__item").length === 4],
      ["tabla riesgos >= 6", (d) => d.querySelectorAll("tbody tr").length >= 6],
    ],
  },
  {
    file: "sistema-de-diseno.html",
    checks: [
      ["paletas renderizadas", (d) => d.querySelectorAll("#ds-paletas .swatch").length > 15],
      ["tokens renderizados", (d) => d.querySelectorAll("#ds-tokens .token-row").length > 10],
      ["galeria iconos", (d) => d.querySelectorAll("#ds-iconos .icon-cell").length > 40],
      ["card demo", (d) => !!d.querySelector("#ds-card-demo .ips-card")],
      ["nav secciones", (d) => d.querySelectorAll(".ds-nav a").length === 11],
    ],
  },
];

let failed = 0;
for (const c of cases) {
  const [file, query] = c.file.split("?");
  const path = join(ROOT, file);
  const url = "file://" + path + (query ? "?" + query : "");
  const vc = new VirtualConsole();
  const runtimeErrors = [];
  vc.on("jsdomError", (e) => runtimeErrors.push(e.message || String(e)));

  const dom = await JSDOM.fromFile(path, {
    url, runScripts: "dangerously", resources: "usable",
    pretendToBeVisual: true, virtualConsole: vc,
  });
  await new Promise((r) => dom.window.addEventListener("load", r, { once: true }));
  await new Promise((r) => setTimeout(r, 400));

  const d = dom.window.document;
  const results = c.checks.map(([name, fn]) => {
    try { return [name, Boolean(fn(d))]; } catch (e) { return [name, false, e.message]; }
  });
  const bad = results.filter((r) => !r[1]);
  const ok = bad.length === 0 && runtimeErrors.length === 0;
  console.log(`${ok ? "✔" : "✖"} ${c.file}`);
  if (!ok) {
    failed++;
    bad.forEach(([n, , e]) => console.log(`    · FALLO: ${n}${e ? " → " + e : ""}`));
    runtimeErrors.slice(0, 4).forEach((e) => console.log(`    · JS: ${e.split("\n")[0]}`));
  }
  dom.window.close();
}
console.log(failed ? `\n${failed} caso(s) con fallos` : "\nTodas las páginas pasan el smoke test");
process.exit(failed ? 1 : 0);
