# SUBAGENTES — Automatización del trabajo repetitivo

Tres agentes ejecutables (`tools/*.mjs`, Node ≥ 18, cero dependencias en runtime)
que asumen el trabajo mecánico y el QA. Se invocan manualmente o desde un hook/CI.

```
┌─────────────────────┐   ┌──────────────────────┐   ┌──────────────────────┐
│ CURADOR DE DATOS     │   │ QA DE ENLACES/ICONOS │   │ SCAFFOLDER DE PÁGINAS │
│ validate-data.mjs    │   │ check-links.mjs      │   │ new-page.mjs          │
│ Contratos, ids,      │   │ Recursos rotos,      │   │ Esqueleto canónico    │
│ horarios, fechas,    │   │ anchors, data-icon y │   │ (head+ambient+chrome  │
│ referencias cruzadas │   │ svgIcon contra el set│   │ +scripts) + controlador│
└──────────┬──────────┘   └──────────┬───────────┘   └──────────┬───────────┘
           │                         │                          │
           └────────────┬────────────┴──────────────────────────┘
                        ▼
              ┌─────────────────────┐
              │ SMOKE TEST (jsdom)  │  tools/smoke-test.mjs
              │ 12 rutas ejecutadas │  DOM real + scripts + asserts
              └─────────────────────┘
```

## 1 · Curador de datos — `node tools/validate-data.mjs`
Carga `js/data/datos.js` en un módulo `vm` (shim de `window`) y valida:
campos obligatorios por ficha, ids únicos, servicios referenciados existentes,
horarios `HH:MM` con `abre < cierra` y días 0–6, fechas `actualizado` válidas
(no futuras = error; futuras = warning), trámites con pasos/requisitos/canales,
líneas completas y teléfonos de rutas que existen en `lineas[]`.
**Exit 1 ante cualquier error** — apto para CI/pre-commit.

## 2 · QA de enlaces e iconos — `node tools/check-links.mjs`
Recorre todos los `.html` y `.js/.mjs`:
- `href`/`src` locales → el archivo existe (ignora `http/mailto/tel/data:`);
- anchors `#seccion` → el `id` existe en la misma página;
- `data-icon="x"` y `svgIcon("x")` y `icono:"x"` → el icono existe en el set.
Atrapa el error más común del proyecto: renombrar un asset o un icono y dejar
referencias huérfanas.

## 3 · Scaffolder — `node tools/new-page.mjs <archivo.html> "<Título>" [data-page]`
Genera la página con el esqueleto canónico (meta+OG, favicon, los 4 CSS en orden,
skip-link, fondo ambiental, placeholders de chrome, orden exacto de scripts) y su
controlador vacío en `js/pages/<slug>.js`. Garantiza que ninguna página nueva nazca
fuera de la biblia. Soporta páginas en subcarpetas (recalcula rutas relativas).

## 4 · Smoke test — `node tools/smoke-test.mjs` (dev)
Requiere `npm install` en la carpeta `tools/` (única dependencia: `jsdom`).
Ejecuta las 12 rutas críticas con DOM real y afirma el resultado:
chrome inyectado, nav activo, contadores, grids poblados, filtros por URL
(`?q=`, `?zona=rural`, `?urg=1`), estado vacío de ficha inexistente, links `tel:`
y galería de iconos. Cubre regresiones que los linters no ven.

## Flujo recomendado
```
cambio en datos.js    → validate-data.mjs
cambio en html/js/css → check-links.mjs + smoke-test.mjs
vista nueva           → new-page.mjs → escribir → los dos QA
entrega               → los cuatro en verde
```
Ejecutar todo de una vez: `cd tools && npm install && npm test` (ver `tools/package.json`).
