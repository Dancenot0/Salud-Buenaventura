#!/usr/bin/env node
/* ============================================================
   SUBAGENTE · SCAFFOLDING DE PÁGINAS
   ------------------------------------------------------------
   Genera una página nueva con el esqueleto canónico (head,
   fondo ambiental, chrome, controles de script) y su
   controlador JS vacío. Garantiza que toda página nazca
   conforme a la biblia: mismos tokens, mismo orden de scripts.
   Uso:  node tools/new-page.mjs <archivo> "<Título>" [data-page]
   Ej:   node tools/new-page.mjs noticias.html "Noticias" noticias
   ============================================================ */
import { writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const [file, title, page = ""] = process.argv.slice(2);

if (!file || !title) {
  console.error("Uso: node tools/new-page.mjs <archivo.html> \"<Título>\" [data-page]");
  process.exit(1);
}
if (!file.endsWith(".html")) { console.error("El archivo debe terminar en .html"); process.exit(1); }

const dest = join(root, file);
const slug = file.replace(/\.html$/, "").replace(/[^a-z0-9]/gi, "-").toLowerCase();
const jsRel = file.includes("/") ? "../".repeat(file.split("/").length - 1) : "";

if (existsSync(dest)) { console.error(`✖ ${file} ya existe.`); process.exit(1); }

const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} · Salud Buenaventura</title>
  <meta name="description" content="${title} — Salud Buenaventura.">
  <meta name="theme-color" content="#F4F8F9">
  <link rel="icon" type="image/svg+xml" href="${jsRel}assets/favicon.svg">
  <link rel="stylesheet" href="${jsRel}css/tokens.css">
  <link rel="stylesheet" href="${jsRel}css/base.css">
  <link rel="stylesheet" href="${jsRel}css/components.css">
  <link rel="stylesheet" href="${jsRel}css/pages.css">
</head>
<body data-page="${page}">

  <a class="skip-link" href="#contenido">Saltar al contenido principal</a>

  <div class="ambient" aria-hidden="true">
    <div class="ambient__mesh"></div>
    <div class="ambient__orb ambient__orb--a"></div>
    <div class="ambient__orb ambient__orb--b"></div>
    <div class="ambient__grain"></div>
  </div>

  <div id="sb-header"></div>

  <main id="contenido" class="page-body">
    <section class="page-head">
      <div class="container">
        <p class="eyebrow reveal">Sección</p>
        <h1 class="h1 display reveal" style="--d:60ms;font-size:var(--fs-h1)">${title}</h1>
        <p class="lead reveal" style="--d:120ms">Descripción de la página.</p>
      </div>
    </section>
  </main>

  <div id="sb-footer"></div>

  <script src="${jsRel}js/core/iconos.js"></script>
  <script src="${jsRel}js/core/utils.js"></script>
  <script src="${jsRel}js/data/datos.js"></script>
  <script src="${jsRel}js/core/render.js"></script>
  <script src="${jsRel}js/core/chrome.js"></script>
  <script src="${jsRel}js/pages/${slug}.js"></script>
</body>
</html>
`;

const js = `/* ============================================================
   SALUD BUENAVENTURA · ${title.toUpperCase()} (${file})
   ============================================================ */
(function () {
  "use strict";
  const { svgIcon } = window.SBIcons;
  const U = window.SBUtils;
  const D = window.SBData;

  function init() {
    /* Controlador de página */
  }

  document.addEventListener("sb:ready", init);
})();
`;

const jsDest = join(root, "js/pages", `${slug}.js`);
writeFileSync(dest, html);
console.log(`✔ Página creada: ${file}`);
if (!existsSync(jsDest)) { writeFileSync(jsDest, js); console.log(`✔ Controlador creado: js/pages/${slug}.js`); }
else console.log(`⚠ js/pages/${slug}.js ya existía — se conserva.`);
