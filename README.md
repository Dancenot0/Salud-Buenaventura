# Salud Buenaventura · Prototipo de plataforma de orientación en salud

Plataforma digital para la **centralización, orientación y gestión de la información
de los servicios de salud** del Distrito de Buenaventura (Valle del Cauca, Colombia).
Prototipo funcional construido con **HTML + CSS + JavaScript vanilla** — cero
dependencias en runtime, cero peticiones externas.

> Diseño enterprise con glassmorphism pulido y estética Apple: jerarquía clara,
> un solo color de marca (Azul-Pacífico), tipografía de sistema, profundidad
> sutil y movimiento con causa. Sin neones, sin "estilo IA".

## Abrir el proyecto

No requiere instalación ni build:

```bash
# Opción A — abrir directamente
open index.html            # macOS
xdg-open index.html        # Linux

# Opción B — servidor estático (recomendado)
python3 -m http.server 8080
# → http://localhost:8080
```

## Páginas

| Página | Contenido |
|---|---|
| `index.html` | Hero con búsqueda en vivo, banda SOS 123/125/132, accesos rápidos, servicios más buscados, instituciones destacadas, avisos, FAQ |
| `servicios.html` | Directorio filtrable (texto, tipo, zona, servicio, 24 h, verificados) con estado en la URL |
| `detalle.html?id=…` | Ficha de institución: horarios con día actual, requisitos, mapa, canales oficiales, relacionadas |
| `tramites.html` | 9 guías paso a paso (EPS, Sisbén, citas, ADRES, vacunas, traslados, Supersalud…) |
| `urgencias.html` | Líneas oficiales, 6 rutas "qué hacer" (incl. ofidismo y dengue) y puntos 24 h |
| `proyecto.html` | Formulación: problema, objetivos, metodología híbrida, gobierno de datos, riesgos, equipo, referencias APA |
| `sistema-de-diseno.html` | **Biblia de diseño interactiva**: tokens copiables, recetas de vidrio, componentes vivos, reglas |

## Estructura

```
salud-buenaventura/
├── css/          tokens → base → components → pages (cascada estricta)
├── js/
│   ├── core/     iconos (set SVG propio) · utils (horarios en vivo, toast, URL)
│   │             render (fichas compartidas) · chrome (header/footer DRY, sb:ready)
│   ├── data/     datos.js — contrato central (mock de API)
│   └── pages/    un controlador por página
├── docs/         BIBLIA.md (documento de ingeniería) · AGENTES.md (subagentes)
├── skills/       4 skills de diseño reutilizables (ver skills/README.md)
├── tools/        subagentes de QA: validate-data · check-links · new-page · smoke-test
└── assets/       favicon.svg
```

## QA (subagentes)

```bash
node tools/validate-data.mjs     # integridad del contrato de datos
node tools/check-links.mjs       # enlaces, anchors e iconos válidos
cd tools && npm install          # solo para el smoke test (jsdom, dev)
node tools/smoke-test.mjs        # 12 rutas ejecutadas con DOM real + asserts
```

## Documentación

- **`docs/BIBLIA.md`** — biblia de ingeniería y diseño (normativa).
- **`sistema-de-diseno.html`** — la misma biblia, navegable e interactiva.
- **`docs/AGENTES.md`** — subagentes de automatización.
- **`skills/`** — conocimiento de diseño reutilizable en formato agent-skill.

## Aviso de datos

Prototipo académico. Las fichas marcadas **«Por verificar»** contienen datos
ilustrativos; las marcadas **«Verificado»** provienen de fuentes públicas
(sitio oficial del Hospital Distrital Luis Ablanque de la Plata, líneas nacionales
de emergencia). La plataforma orienta: no agenda citas ni despacha ambulancias.

---
Equipo de Proyecto · 2026 · Metodología híbrida (Ágil–Tradicional) · v1.0.0
