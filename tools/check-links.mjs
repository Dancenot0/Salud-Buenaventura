#!/usr/bin/env node
/* ============================================================
   SUBAGENTE · QA DE ENLACES E ICONOS
   ------------------------------------------------------------
   Recorre todos los *.html y *.js del proyecto y verifica:
     1. href/src locales → el archivo existe en disco.
     2. data-icon="x" (HTML) y svgIcon("x") (JS) → el icono
        existe en el diccionario js/core/iconos.js.
     3. Anchors internos (#seccion) → el id existe en la página.
   Uso:  node tools/check-links.mjs   → exit 0 | 1
   ============================================================ */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

/* Diccionario de iconos (vm + shim) */
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(readFileSync(join(root, "js/core/iconos.js"), "utf8"), sandbox);
const ICONS = new Set(sandbox.window.SBIcons.iconNames());

/* Recursión de archivos (ignora node_modules/ocultos) */
function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (e.startsWith(".") || e === "node_modules") continue;
    const p = join(dir, e);
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}

const files = walk(root);
const htmls = files.filter((f) => f.endsWith(".html"));
const jss = files.filter((f) => f.endsWith(".js") || f.endsWith(".mjs"));

/* 1 · Enlaces y recursos locales en HTML */
for (const f of htmls) {
  const txt = readFileSync(f, "utf8");
  const rel = relative(root, f);
  const ids = new Set([...txt.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

  for (const m of txt.matchAll(/(?:href|src)="([^"#][^"]*)"/g)) {
    let url = m[1].split("#")[0].split("?")[0];
    if (/^(https?:|mailto:|tel:|data:|javascript:|wa\.me|\/\/)/.test(url) || !url) continue;
    const target = join(dirname(f), decodeURIComponent(url));
    if (!existsSync(target)) errors.push(`${rel}: recurso inexistente → ${m[1]}`);
  }
  /* 3 · anchors internos */
  for (const m of txt.matchAll(/href="#([^"]+)"/g)) {
    if (!ids.has(m[1])) errors.push(`${rel}: anchor #${m[1]} sin id en la página`);
  }
  /* 2 · data-icon en HTML */
  for (const m of txt.matchAll(/data-icon="([^"]+)"/g)) {
    if (!ICONS.has(m[1])) errors.push(`${rel}: data-icon="${m[1]}" no existe en el set`);
  }
}

/* 2 · svgIcon("x") en JS */
for (const f of jss) {
  const txt = readFileSync(f, "utf8");
  const rel = relative(root, f);
  for (const m of txt.matchAll(/svgIcon\(\s*"([^"$]+)"/g)) {
    if (!ICONS.has(m[1])) errors.push(`${rel}: svgIcon("${m[1]}") no existe en el set`);
  }
  for (const m of txt.matchAll(/icono:\s*"([^"]+)"/g)) {
    if (!ICONS.has(m[1])) errors.push(`${rel}: icono de datos "${m[1]}" no existe en el set`);
  }
}

console.log(`\nSUBAGENTE · QA`);
console.log("─".repeat(46));
console.log(`  html revisados : ${htmls.length}`);
console.log(`  js revisados   : ${jss.length}`);
console.log(`  iconos en set  : ${ICONS.size}`);
console.log("─".repeat(46));
if (errors.length) {
  console.log(`✖ ${errors.length} problema(s):`);
  errors.forEach((e) => console.log(`   · ${e}`));
  process.exit(1);
}
console.log(`✔ Enlaces, recursos e iconos íntegros.\n`);
