# SKILL · UI data-driven sin frameworks

**Cuándo usarla:** prototipos o productos ligeros donde una fuente de datos debe
poblar múltiples vistas (tarjetas, fichas, filtros) manteniendo consistencia.

## Arquitectura de 4 capas
```
data/     contrato único (window.SBData) — hoy un archivo, mañana una API
core/     utilidades puras: DOM, fechas, estado derivado, iconos
render/   marcadores compartidos (la ficha se escribe UNA vez)
pages/    un controlador por vista; solo orquesta
```
Regla de dependencia: `pages → core/render → data`. Nada en `data/` toca el DOM.

## Contrato antes que vistas
Definir el modelo con tipos y obligatoriedad (ver `docs/BIBLIA.md §8.3`) y
**validarlo con script** antes de renderizar. Los fallos de datos se detectan en
CI, no en pantalla.

## Estado derivado, no copiado
Los badges de estado se calculan en el momento (`estadoAbierto(ips, now)`), nunca
se guardan como texto. Un dato derivado almacenado es un dato que miente.

```js
/* Horarios: días 0–6, "HH:MM" → minutos; soporta jornadas partidas */
const toMin = (hhmm) => { const [h,m] = hhmm.split(":").map(Number); return h*60+(m||0); };
```
Salida siempre en 3 variantes: abierto (verde), cerrado con próxima apertura
(neutro), permanente 24 h (rojo). Incluir "abre mañana/ el lunes" — la precisión
es lo que genera confianza.

## Estado en la URL
Todo filtro vive en `?q=&tipo=&zona=&serv=&urg=&ver=` con `history.replaceState`:
- la vista es recargable y compartible (un ciudadano manda el link por WhatsApp);
- `readURL()` al iniciar → `writeURL()` en cada cambio → `render()`;
- soportar **alias** (`zona=rural` agrupa varias zonas) sin romper los selects.

## Plantillas y seguridad
- Funciones puras `xCardHTML(item, opts)` que devuelven string; `opts` para
  variantes (`compact`, `delay` del stagger).
- **Siempre** `escapeHTML()` sobre datos interpolados.
- Tras `innerHTML = …`, relanzar los observers de la zona (`initReveal(host)`).
- Los elementos dinámicos que ya son visibles al nacer deben recibir su clase
  final de inmediato (evitar parpadeo de opacity 0).

## Orden de arranque (patrón chrome)
```
DOM → chrome.js inyecta header/footer, hidrata iconos,
      arranca observers globales → dispatch "sb:ready"
    → cada controlador de página escucha "sb:ready" e inicializa
```
Evita condiciones de carrera: ninguna página toca el DOM antes de que exista la
navegación. Los contadores se **vinculan al final**, cuando su `data-count` ya
tiene el valor real (si se vinculan antes, animan a 0).

## Los 6 estados de toda lista
1. Carga inicial · 2. Con resultados · 3. Vacío por filtro (con botón "limpiar") ·
4. Vacío por inexistencia · 5. Error de datos · 6. Sin JS (`<noscript>`).
Si falta alguno, la lista está incompleta.

## Testeo sin navegador
`jsdom` + `runScripts:"dangerously"` + `resources:"usable"` permite ejecutar las
páginas y afirmar el DOM renderizado (ver `tools/smoke-test.mjs`): rutas con
query, conteos, chips activos, estados vacíos y ausencia de errores de runtime.
Es el test más barato y de mayor cobertura para un sitio vanilla.
