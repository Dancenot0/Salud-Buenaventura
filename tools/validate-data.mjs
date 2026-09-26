#!/usr/bin/env node
/* ============================================================
   SUBAGENTE · CURADOR DE DATOS
   ------------------------------------------------------------
   Valida la integridad de js/data/datos.js sin necesidad de
   navegador (módulo vm + shim de window). Reglas:
     1. Campos obligatorios por ficha de institución.
     2. IDs únicos y referencias de servicios existentes.
     3. Horarios bien formados (HH:MM, dias 0–6, abre < cierra).
     4. Fechas `actualizado` válidas y no futuras.
     5. Trámites con pasos/requisitos/canales no vacíos.
     6. Líneas y rutas de emergencia completas.
   Uso:  node tools/validate-data.mjs   → exit 0 | 1
   ============================================================ */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "js/data/datos.js"), "utf8");

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(src, sandbox);
const D = sandbox.window.SBData;

const errors = [];
const warns = [];
const err = (m) => errors.push(m);
const warn = (m) => warns.push(m);

const REQ_IPS = ["id", "nombre", "tipo", "entidad", "direccion", "zona", "zonaGrupo", "telefono", "servicios", "descripcion", "actualizado"];
const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;
const hoy = new Date(); hoy.setHours(0, 0, 0, 0);

/* 1–4 · Instituciones */
const ids = new Set();
for (const i of D.ips) {
  const tag = `ips[${i.id || "?"}]`;
  if (!i.id || ids.has(i.id)) err(`${tag}: id ausente o duplicado`);
  ids.add(i.id);
  for (const f of REQ_IPS) if (i[f] == null || i[f] === "" || (Array.isArray(i[f]) && !i[f].length)) err(`${tag}: falta campo "${f}"`);
  if (typeof i.verificado !== "boolean") err(`${tag}: "verificado" debe ser boolean`);
  for (const s of i.servicios || []) {
    if (!D.servicios.some((c) => c.id === s)) err(`${tag}: servicio inexistente "${s}"`);
  }
  if (!i.horarios?.length && !i.urgencias24) err(`${tag}: sin horarios ni urgencias24`);
  for (const h of i.horarios || []) {
    if (!Array.isArray(h.dias) || !h.dias.length || h.dias.some((d) => d < 0 || d > 6)) err(`${tag}: dias inválidos`);
    if (!HHMM.test(h.abre) || !HHMM.test(h.cierra)) err(`${tag}: horario no HH:MM (${h.abre}–${h.cierra})`);
    else if (h.abre >= h.cierra && h.cierra !== "23:59") err(`${tag}: abre >= cierra (${h.abre}–${h.cierra})`);
  }
  const f = new Date(i.actualizado + "T12:00:00");
  if (isNaN(f)) err(`${tag}: fecha "actualizado" inválida (${i.actualizado})`);
  else if (f > new Date(hoy.getTime() + 864e5)) warn(`${tag}: fecha de actualización futura (${i.actualizado})`);
  if (i.verificado && !i.web && !String(i.telefono).match(/^\d{3}$/)) warn(`${tag}: verificado sin web ni línea corta — revise la fuente`);
}

/* 5 · Trámites */
for (const t of D.tramites) {
  const tag = `tramites[${t.id}]`;
  if (!t.titulo || !t.resumen || !t.entidad || !t.duracion || !t.costo) err(`${tag}: campos incompletos`);
  if (!t.pasos?.length) err(`${tag}: sin pasos`);
  if (!t.requisitos?.length) err(`${tag}: sin requisitos`);
  if (!t.canales?.length) err(`${tag}: sin canales`);
}

/* 6 · Líneas y rutas */
const nums = new Set(D.lineas.map((l) => l.numero));
for (const l of D.lineas) {
  if (!l.numero || !l.nombre || !l.desc || !l.disponible) err(`lineas[${l.numero || "?"}]: incompleta`);
}
for (const r of D.rutas) {
  if (!r.titulo || !r.icono || !r.donde) err(`rutas[${r.id}]: incompleta`);
  if (!r.acciones?.length) err(`rutas[${r.id}]: sin acciones`);
  if (!r.llamar?.length) err(`rutas[${r.id}]: sin teléfonos`);
  for (const n of r.llamar || []) if (!nums.has(n)) warn(`rutas[${r.id}]: llama a ${n}, no está en lineas[]`);
}

/* 7 · Catálogo */
for (const s of D.servicios) {
  if (!s.id || !s.nombre || !s.grupo || !s.icono || !s.desc) err(`servicios[${s.id}]: incompleto`);
}

/* 8 · Avisos y FAQ */
for (const a of D.avisos) if (!a.fecha || !a.titulo || !a.extracto || !a.categoria) err(`avisos: entrada incompleta (${a.titulo || "?"})`);
for (const f of D.faqs) if (!f.q || !f.a) err(`faqs: entrada incompleta`);

/* Reporte */
const pad = (s, n) => (s + " ".repeat(n)).slice(0, n);
console.log(`\n${pad("SUBAGENTE · CURADOR DE DATOS", 42)}`);
console.log(pad("─", 46));
console.log(`  instituciones : ${D.ips.length}`);
console.log(`  servicios     : ${D.servicios.length}`);
console.log(`  trámites      : ${D.tramites.length}`);
console.log(`  líneas        : ${D.lineas.length}   rutas: ${D.rutas.length}`);
console.log(`  avisos        : ${D.avisos.length}   faqs: ${D.faqs.length}`);
console.log(pad("─", 46));
if (warns.length) { console.log(`⚠ ${warns.length} advertencia(s):`); warns.forEach((w) => console.log(`   · ${w}`)); }
if (errors.length) { console.log(`✖ ${errors.length} error(es):`); errors.forEach((e) => console.log(`   · ${e}`)); process.exit(1); }
console.log(`✔ Datos íntegros — sin errores.\n`);
