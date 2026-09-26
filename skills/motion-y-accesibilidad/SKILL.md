# SKILL · Movimiento y Accesibilidad (vanilla JS, sin dependencias)

**Cuándo usarla:** interfaces con animación de scroll, acordeones, contadores,
menús y filtros que deben ser usables por todos y rendir en gama baja.

## Movimiento con causa
Cada animación responde una pregunta del usuario. Si no responde ninguna, se elimina.

| Cambio | Patrón | Duración/curva |
|---|---|---|
| ¿Esto es clicable? | elevar −1.5 px + sombra | 140 ms / ease-out |
| ¿Qué contiene esto? | acordeón `grid-template-rows: 0fr→1fr` | 420 ms / ease-out |
| ¿Dónde estoy ahora? | underline/pill de nav, `aria-current` | 240 ms |
| ¿Cambió el resultado? | fade+18 px stagger 60–90 ms | 420–700 ms |
| ¿Se guardó/copió? | toast con spring sutil | 420 ms in / 240 out |

**Revelado por scroll** (IntersectionObserver, auto-desconectar):
```js
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add("is-visible"); io.unobserve(e.target);
}), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
```
Fallback sin IO: añadir `is-visible` a todo inmediatamente.

**Acordeón sin medir alturas:** `grid-template-rows: 0fr → 1fr` sobre un contenedor
con `overflow:hidden`. Cero JS de medición, cero saltos, funciona con contenido dinámico.

**Reduced motion:** bloque global que fija duraciones a 0.01 ms y desactiva
animaciones/keyframes, más `scroll-behavior: auto`. El contenido debe ser igual
de completo, solo que sin desplazamientos.

## Accesibilidad checklist (WCAG 2.2 AA)
- **Foco visible con `outline`, no `box-shadow`:** los componentes pisan el
  box-shadow; el outline nunca. `outline: 3px solid rgba(marca,.65); offset 2px`
  + variante clara sobre superficies oscuras.
- **Skip-link** como primer elemento focusable, oculto con `transform` (no `display:none`).
- **Jerarquía:** un `h1` por página; saltos de nivel prohibidos; `h2/h3` reales
  aunque se maquillen pequeños.
- **ARIA mínima y correcta:** `aria-current="page"`, `aria-expanded` + `aria-controls`
  en disclosures, `aria-live="polite"` en conteos de resultados y toasts,
  `role="search"` en barras de búsqueda, `aria-modal` + label en diálogos.
- **Iconos `aria-hidden="true"` + `focusable="false"`** cuando hay texto adyacente;
  `aria-label` en botones de solo icono.
- **Labels:** `sr-only` para inputs visuales; placeholder nunca sustituye al label.
- **Teclado:** Escape cierra hojas/modales; al abrir, mover foco al primer
  elemento y bloquear scroll del fondo; al cerrar, devolver foco al disparador.
- **Atajos:** `/` enfoca la búsqueda, pero se ignora dentro de inputs y con
  modificadores (no secuestrar atajos del lector de pantalla).
- **Contraste:** texto ≥ 4.5:1 (3:1 en ≥ 24 px o 19 px bold); UI e iconos ≥ 3:1.
- **Táctil:** ≥ 44×44 px de área efectiva (usar padding, no solo el glyph).
- **Estados vacíos y de error** con acción de salida (nunca un callejón sin salida).

## Rendimiento
- Animar solo `transform` y `opacity`; `will-change` puntual y retirado.
- Observadores que se auto-desconectan; `debounce` (200 ms) en inputs de búsqueda.
- `passive: true` en listeners de scroll.
- Delegación de eventos para listas renderizadas dinámicamente.
- Escape de HTML en todo dato interpolado (`escapeHTML`) — XSS y estabilidad.

## Verificación
1. Navegar toda la vista solo con teclado: ¿se ve siempre el foco?
2. Activar `prefers-reduced-motion` y recargar: ¿nada se mueve, nada se rompe?
3. Zoom al 200 %: ¿sin scroll horizontal ni texto cortado?
4. Lector de pantalla: ¿los resultados filtrados anuncian el cambio?
5. Desactivar CSS: ¿el orden del DOM sigue teniendo sentido?
