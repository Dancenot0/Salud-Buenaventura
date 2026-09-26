# BIBLIA DE INGENIERÍA Y DISEÑO — Salud Buenaventura

> **Versión 1.0 · Septiembre 2026**
> Plataforma digital para la centralización, orientación y gestión de la información
> de servicios de salud del Distrito de Buenaventura (Valle del Cauca, Colombia).
>
> Este documento es la fuente normativa del producto. Toda decisión de diseño o
> código debe poder rastrearse hasta aquí. Su versión navegable e interactiva es
> `sistema-de-diseno.html`.

---

## 1. Resumen del producto

### 1.1 Qué es
Un canal de **orientación ciudadana** —no un sistema de agendamiento ni de gestión
clínica— que centraliza en un solo punto la oferta de salud del Distrito:
instituciones (IPS), servicios, horarios, requisitos, ubicaciones y canales
oficiales de atención, más rutas de urgencia y guías de trámites paso a paso.

### 1.2 Problema que resuelve
La información de salud de Buenaventura está dispersa: el ciudadano pierde tiempo,
hace desplazamientos innecesarios, satura los puntos físicos y quien tiene menor
conectividad o alfabetización digital queda en desventaja. (Ver documento de
formulación, APA 7.ª ed.)

### 1.3 Público y restricciones de contexto
- Ciudadanía del Distrito, incluida población rural y ribereña (ríos Raposo,
  Cajambre, costa de Juanchaco–Ladrilleros).
- Dispositivos modestos y conectividad irregular → **ligereza radical**: cero
  frameworks, cero fuentes externas, cero peticiones de terceros.
- Lenguaje claro, sin jerga médica ni legal.

### 1.4 Los diez principios (orden de precedencia)
1. **Claridad antes que decoración.** La interfaz existe para encontrar un servicio.
2. **Un solo protagonista por pantalla.** Cada vista tiene una acción principal.
3. **Vidrio con jerarquía, nunca decorativo.** Tres niveles con propósito.
4. **Un hueco de marca.** El color se gasta solo en significado.
5. **Profundidad sutil, no dramática.** Sombras al 3–10 %, tintadas a marca.
6. **Movimiento con causa.** ≤ 700 ms; respeta `prefers-reduced-motion`.
7. **Datos vivos.** Estados calculados (abierto/cerrado), no texto muerto.
8. **Ligereza radical.** 0 dependencias en runtime.
9. **Accesibilidad innegociable.** WCAG 2.2 AA.
10. **Honestidad del dato.** Origen, verificación y fecha visibles en cada ficha.

---

## 2. Identidad visual

### 2.1 Color — Paleta "Azul-Pacífico"
Un único hueco de marca (azul-teal oceánico) + neutros de tinta azulada + acento
arena esporádico + semánticos estrictos. Prohibido: neones, degradados multicolor,
morados "AI-style".

| Rol | Token | Valor | Uso |
|---|---|---|---|
| Marca primaria | `--c-brand-600` | `#14708B` | Botones, enlaces, iconos activos |
| Marca texto | `--c-brand-700` | `#105B72` | Hover, eyebrows, énfasis (7:1 sobre blanco) |
| Marca profunda | `--c-abyss` | `#0A2B36` | Footer, paneles oscuros, toasts |
| Tinta | `--c-ink` | `#0D2530` | Texto principal (≈15:1) |
| Tinta 2 | `--c-ink-2` | `#46616E` | Secundario (≈6:1) |
| Tinta 3 | `--c-ink-3` | `#7C939E` | Meta/terciario — solo UI y ≥18 px |
| Fondo | `--c-bg` | `#F4F8F9` | Base de la aplicación |
| Éxito | `--c-ok` | `#17795A` | Abierto, verificado (5.4:1) |
| Precaución | `--c-warn` | `#9A6B0F` | "Por verificar" (4.6:1) |
| Peligro | `--c-danger` | `#B64438` | Urgencias, error (5.4:1) |
| Acento | `--c-sand` | `#D9B876` | Solo decoración ambiental y detalles |

**Regla 60-30-10:** 60 % neutros, 30 % tinta, 10 % marca+semánticos.

### 2.2 Tipografía
Stack nativo (`-apple-system, "SF Pro Text", "Segoe UI", Roboto…`): cero descargas
y métrica de plataforma — la base de la estética Apple sin pagar su coste.

| Nivel | Tamaño | Peso | Tracking |
|---|---|---|---|
| Display | clamp(41.6→64 px) | 700 | −0.03em |
| H1 | clamp(32→46 px) | 700 | −0.018em |
| H2 | clamp(26→37 px) | 700 | −0.018em |
| H3 | 21.6 px | 620 | −0.018em |
| Lead | 19.2 px | 400 | 0 |
| Body | **17 px** / 1.58 | 400 | 0 |
| Small / XS | 15 / 13 px | 400–620 | 0 |
| Eyebrow | 12 px MAYÚS | 620 | +0.09em |

Reglas: nunca < 12 px en contenido legible; `text-wrap: balance` en titulares;
`tabular-nums` en datos numéricos; máx. ~72 caracteres por línea de lectura.

### 2.3 Iconografía
Set propio (`js/core/iconos.js`): rejilla 24×24, stroke 1.8, terminales redondeadas,
un solo peso, `aria-hidden` siempre (el texto adyacente explica). Prohibido mezclar
estilos (filled + outline) en una misma vista.

---

## 3. Glassmorphism (el lenguaje visual)

### 3.1 Condición de existencia
El vidrio solo es legible sobre un **fondo ambiental por capas** (`.ambient`):
malla de gradientes radiales de baja saturación + dos orbes de deriva lentísima
(84–96 s) + grano SVG al 3.5 % (elimina el banding del blur). Sin relieve detrás,
el blur no revela nada y el vidrio se ve gris.

### 3.2 Los tres niveles (jerarquía, no decoración)
| Nivel | Receta | Uso |
|---|---|---|
| **1 · Chrome** | blanco 66–82 % · `blur(22px) saturate(185%)` | navbar, toolbar sticky, sheet móvil |
| **2 · Superficie** | blanco 52–72 % · `blur(18px) saturate(170%)` | tarjetas, paneles, modales |
| **3 · Velo** | blanco 42 % · `blur(10px) saturate(140%)` | chips, filas internas, celdas |
| **Oscuro** | `rgba(14,59,74,.94)`→`rgba(10,43,54,.97)` | footer, panel CTA, toasts |

### 3.3 Receta canónica
```css
.glass {
  background: linear-gradient(158deg, rgba(255,255,255,.72), rgba(255,255,255,.52));
  backdrop-filter: blur(18px) saturate(170%);
  border: 1px solid rgba(255,255,255,.68);          /* canto pulido */
  box-shadow:
    0 1px 2px  rgba(10,43,54,.03),                  /* contacto   */
    0 8px 20px rgba(10,43,54,.06),                  /* cercanía   */
    0 24px 48px rgba(10,43,54,.06),                 /* ambiente   */
    inset 0 1px 0 rgba(255,255,255,.85);            /* especular  */
}
```

### 3.4 Las cinco leyes
1. **Saturación ≥ 160 %** — sin ella el blur se ve sucio.
2. **Borde siempre blanco translúcido** (55–85 %), nunca gris.
3. **Highlight especular** `inset 0 1px 0` blanco: la mitad del realismo.
4. **Texto sólido sobre vidrio** — jamás texto translúcido (contraste AA).
5. **Presupuesto de blur** — ≤ 6 superficies con `backdrop-filter` por viewport.
6. *(Bonus)* **Nunca vidrio sobre vidrio.** El velo (3) vive dentro de una
   superficie (2), pero dos superficies no se apilan.

### 3.5 Degradación
`@supports not (backdrop-filter…)` → las variables de vidrio caen a fondos
sólidos al 92–96 %. La interfaz sigue siendo correcta sin el efecto.

---

## 4. Espacio, forma y profundidad

- **Espaciado:** rejilla de 4 px (`--sp-1…--sp-24`). Ritmo de sección:
  `--section-y: clamp(72px, 3rem+6vw, 120px)`. Contenedor 1180 px, gutters fluidos.
- **Radios:** 10 (inputs) · 14 (badges) · 20 (tarjetas) · 28 (paneles hero, modales)
  · pill (CTAs, chips, navbar). Un componente = un radio; no se mezclan.
- **Sombras:** multicapa (contacto + cercanía + ambiente) tintadas `rgba(10,43,54,…)`.
  El hover de tarjeta eleva −3 px y profundiza la sombra — nunca cambia el color
  del borde a marca.
- **Elevación = importancia:** chrome (1) > superficie (2) > velo (3). Los modales
  añaden scrim `rgba(8,26,34,.45)` + blur 8 px.

## 5. Movimiento

| Token | Valor | Uso |
|---|---|---|
| `--ease-out` | `cubic-bezier(.22,1,.36,1)` | **Curva firma** de todo el sistema |
| `--ease-spring` | `cubic-bezier(.34,1.32,.64,1)` | Aperturas (sheet, modal, toasts) |
| `--ease-in-out` | `cubic-bezier(.65,0,.35,1)` | Deriva ambiental |
| `--dur-1…4` | 140 / 240 / 420 / 700 ms | micro → escena |

Patrones firmados:
- **Revelado por scroll:** fade + 18 px de elevación, stagger 60–90 ms, una sola vez.
- **Hover de tarjeta:** `translateY(-3px)` + sombra profunda (240 ms).
- **Acordeón:** `grid-template-rows: 0fr → 1fr` (altura automática sin JS de medición).
- **Contadores:** ease-out cuártico, 1.2 s, al entrar en viewport.
- **Navbar:** transparente → chrome al pasar 8 px de scroll.

`prefers-reduced-motion: reduce` desactiva todo (globally + por componente).
Ninguna animación decorativa en bucle cerca de texto de lectura; los orbes del
fondo se mueven < 5 vmax en 84–96 s (imperceptible en la periferia).

---

## 6. Inventario de componentes

Todos en `css/components.css`, numerados por sección. Estados obligatorios:
reposo · hover · active · focus-visible · disabled (cuando aplique).

| # | Componente | Notas clave |
|---|---|---|
| 1 | Superficies `.glass`, `.glass--chrome/-veil/-dark` | Recetas del §3 |
| 2 | Navbar + hoja móvil | Chrome nivel 1; `aria-current`, `aria-expanded`, Escape cierra, focus inicial |
| 3 | Botones (`primary/glass/ghost/danger/danger-soft/dark`, `sm/lg/block`) + `.icon-btn` | Píldora; highlight interior; ≥ 44 px de área táctil |
| 4 | Tarjetas (`.card`, `.ips-card`) | Ficha de institución = pieza central del producto |
| 5 | Badges, dots de estado, chips (filtro), tags (servicio) | Estado abierto/cerrado/24 h calculado en vivo |
| 6 | Formularios: `.input`, `.select`, `.searchbar` (command bar con kbd `/`) | Foco con anillo de marca; placeholder nunca como label |
| 7 | Acordeón | Patrón disclosure completo (ARIA) |
| 8 | Tablas | Fila de "hoy" resaltada en horarios |
| 9 | Alertas (`danger/warn/info`) | Siempre con icono + título + cuerpo |
| 10 | Toast | `aria-live=polite`, auto-expira 2.4 s |
| 11 | Modal | Scrim + spring; no usado aún en flujos (reservado) |
| 12 | Footer oscuro | Ancla visual; enlaces institucionales reales |
| 13 | Breadcrumb, checklist, steps, empty state, stat | Vacíos y errores son estados de primera clase |

---

## 7. Arquitectura de información

```
Inicio (index.html)
 ├─ Buscar (hero) ────────────────► Directorio (servicios.html) ──► Ficha (detalle.html?id=)
 ├─ Urgencias 123/125/132 ────────► Urgencias (urgencias.html)
 │                                    ├─ Líneas oficiales (tel:)
 │                                    ├─ Rutas "qué hacer" (6 escenarios)
 │                                    └─ Puntos 24 h (desde datos)
 ├─ Trámites ─────────────────────► Trámites (tramites.html) · guías paso a paso (9)
 └─ El proyecto ──────────────────► Proyecto (proyecto.html) · formulación, metodología,
                                     gobierno de datos, riesgos, equipo, referencias
Sistema de diseño (sistema-de-diseno.html) · biblia interactiva
```

Modelo mental: **necesidad → orientación → canal oficial**. La plataforma nunca
promete lo que no hace (no agenda, no despacha ambulancias): cada página lo declara.

---

## 8. Arquitectura técnica

### 8.1 Capas
```
css/  tokens.css → base.css → components.css → pages.css   (cascada estricta)
js/   core/ (iconos, utils, render, chrome) · data/ (datos) · pages/ (controladores)
```
Regla de dependencia: `pages → core → data`. `tokens.css` no contiene reglas
visuales; `pages.css` no repite patrones de ≥ 2 páginas (viven en components).

### 8.2 Patrón chrome (DRY)
Cada página declara `<div id="sb-header">` y `<div id="sb-footer">`;
`chrome.js` los sustituye por la navegación completa, marca el enlace activo
según `body[data-page]`, hidrata iconos estáticos (`[data-icon]`), arranca
revelados/contadores/acordeones y dispara el evento **`sb:ready`**. Los
controladores de página solo trabajan tras ese evento.

### 8.3 Contrato de datos (`js/data/datos.js` → `window.SBData`)
```ts
meta      { nombre, version, actualizado, disclaimer }
servicios [{ id, nombre, grupo, icono, desc }]                 // taxonomía central
ips       [{ id, nombre, sigla, tipo, nivel, entidad, direccion,
             zona, zonaGrupo, telefono, whatsapp?, email?, web?,
             horarios:[{dias[0-6], abre"HH:MM", cierra, nota?}],
             urgencias24, notaHorario?, servicios[id…],
             requisitos[], descripcion, verificado, actualizado"ISO",
             destacado? }]
tramites  [{ id, titulo, categoria, resumen, entidad, duracion,
             costo, canales[], pasos[{t,d}], requisitos[], tip? }]
lineas    [{ numero, nombre, desc, tipo, disponible }]
rutas     [{ id, titulo, icono, gravedad, acciones[], donde, llamar[] }]
avisos    [{ fecha"ISO", titulo, extracto, categoria, icono }]
faqs      [{ q, a }]
```
**Sustitución por API:** mantener el contrato y reemplazar el IIFE por un
`fetch` hydrate antes de `sb:ready`; ninguna vista cambia.

### 8.4 Estado en la URL
El directorio sincroniza `?q=&tipo=&zona=&serv=&urg=&ver=` con
`history.replaceState`: toda vista filtrada es recargable y compartible
(incluido el alias `zona=rural`). La ficha usa `?id=` con estado vacío propio
para ids desconocidos.

### 8.5 Estado de apertura en vivo
`utils.estadoAbierto(ips, now)` cruza `horarios[]` (días 0–6, `HH:MM`) con el
reloj local y produce `{abierto, texto, clase}` → badges "Abierto · cierra 16:00",
"Cerrado · abre mañana 07:00" o "Urgencias 24 h". Maneja jornadas partidas
(dos rangos el mismo día).

---

## 9. Accesibilidad (WCAG 2.2 AA)

- Contrastes verificados (§2.1) y documento en `sistema-de-diseno.html#accesibilidad`.
- Skip-link, landmarks (`header/nav/main/footer`), una sola jerarquía `h1→h3`.
- Foco visible con **outline** (no box-shadow, para que ningún componente lo pise):
  `3px rgba(34,137,164,.65)` + variante clara en superficies oscuras.
- ARIA: `aria-current` (nav, breadcrumb), `aria-expanded/controls` (acordeones,
  menú), `aria-live=polite` (conteo de resultados, toasts), `role=search`,
  labels sr-only en inputs/selects, iconos `aria-hidden`.
- Teclado: navegación completa, `/` enfoca la búsqueda, `Escape` cierra la hoja
  móvil; el menú mueve el foco al abrirse y bloquea el scroll del fondo.
- Táctil: objetivos ≥ 44×44 px; cuerpo 17 px.
- Movimiento: `prefers-reduced-motion` global.
- Degradación: sin JS hay `<noscript>` orientativo; sin `backdrop-filter`,
  superficies sólidas.

## 10. Rendimiento

| Presupuesto | Límite | Real (v1.0) |
|---|---|---|
| Peticiones a terceros | 0 | 0 |
| CSS (4 archivos, sin minificar) | < 90 KB | ≈ 58 KB |
| JS (core+datos+páginas) | < 120 KB | ≈ 70 KB |
| Fuentes web | 0 (stack nativo) | 0 |
| `backdrop-filter` por viewport | ≤ 6 | ✓ |

Técnicas: scripts al final del body (sin `defer` necesario), SVG inline
(cero peticiones de iconos), orbes con `filter: blur` fijo (composición GPU),
observadores que se auto-desconectan, eventos delegados.

## 11. Gobierno de datos

- Cada ficha declara `verificado` (badge verde/ámbar) y `actualizado` (fecha visible).
- Fuentes: sitios oficiales de las instituciones, líneas nacionales de emergencia y
  el levantamiento de campo de la Fase 1 del proyecto.
- Las fichas `verificado:false` son **ilustrativas** y se muestran con el aviso
  "Por verificar" + disclaimer global en footer y fichas.
- Ciclo de reporte ciudadano (mailto) → verificación → actualización de `datos.js`.
- Minimización: la plataforma no pide ni almacena datos personales (Ley 1581/2012).

## 12. QA y tooling (subagentes)

| Herramienta | Función | Cuándo |
|---|---|---|
| `tools/validate-data.mjs` | Integridad del contrato de datos (campos, ids únicos, horarios HH:MM, fechas, referencias de servicios/líneas) | Tras tocar `datos.js` |
| `tools/check-links.mjs` | Enlaces/recursos locales existentes, anchors internos y **iconos válidos** en HTML+JS | Tras tocar cualquier página |
| `tools/new-page.mjs` | Scaffolding de página + controlador con el esqueleto canónico | Al crear vistas |
| `tools/smoke-test.mjs` | Ejecuta las 12 rutas con jsdom y afirma el DOM renderizado (requiere `npm i jsdom`, solo dev) | Antes de entregar |

Ver `docs/AGENTES.md` y `skills/` para el conocimiento reutilizable de diseño.

## 13. Hoja de ruta

- **v1.1** — Modo oscuro (los tokens ya están centralizados: solo re-mapear la
  tabla), impresión de fichas, PWA offline-first (el directorio debe funcionar
  sin red una vez cargado).
- **v1.2** — API real + panel de actualización para IPS, geolocalización
  ("el más cercano"), mapa interactivo con tiles, versionado de fichas.
- **v2.0** — App móvil liviana, canales bidireccionales (WhatsApp bot),
  métricas de adopción y de reducción de desplazamientos.

## 14. Definition of Done (por historia de usuario)

1. Funciona en las 12 rutas del smoke test sin errores de consola.
2. Cumple los principios §1.4 y las leyes de vidrio §3.4.
3. Estados completos: reposo/hover/focus/active/disabled/vacío/error.
4. AA de accesibilidad (§9) y presupuestos de rendimiento (§10).
5. Sin dependencias nuevas; tokens existentes (nada de valores crudos).
6. Datos con `verificado`/`actualizado` coherentes; pasa `validate-data.mjs`.

---

*Biblia v1.0 — Salud Buenaventura. Documento vivo: los cambios se versionan aquí
y en `sistema-de-diseno.html` antes de tocar el código.*
