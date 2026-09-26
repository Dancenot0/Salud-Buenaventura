# SKILL · Estética Apple sin copiar a Apple

**Cuándo usarla:** producto que debe sentirse "premium/institucional moderno"
— precisión, calma y profundidad sutil en lugar de efectos.

## Los 7 pilares operativos
1. **Tipografía de sistema, escala generosa.** Stack nativo; cuerpo 17 px/1.58;
   titulares con tracking negativo progresivo (−0.03em en display → −0.018em en h3);
   semibold (600–650) en lugar de 500 para titulares; `text-wrap: balance`.
2. **Un color.** La marca aparece en < 10 % de la pantalla: CTAs, enlaces, iconos
   activos y foco. El resto es tinta sobre neutros. El color extra SIEMPRE es
   semántico (éxito/precaución/peligro), nunca decorativo.
3. **Espacio como material.** Secciones de 96–120 px; contenedor ~1180 px; una
   idea por sección; el vacío alrededor de un elemento ES el elemento.
4. **Profundidad multicapa.** 3 sombras apiladas (contacto 1–2 px, cercanía 8–20 px,
   ambiente 24–56 px) al 3–10 % de alfa, tintadas al hueco de marca. Nada de
   `0 4px 8px rgba(0,0,0,.3)`.
5. **Píldoras y squircles.** CTAs en `border-radius: 999px`; tarjetas 20–28 px;
   inputs 10–14 px; icon tiles ~13 px con gradiente tenue + inset highlight.
6. **Movimiento con curva única.** `cubic-bezier(.22,1,.36,1)` para todo; spring
   sutil (.34,1.32,.64,1) solo en aperturas; 140–700 ms; elevar −1.5/−3 px en
   hover; NUNCA escalar texto en hover.
7. **Estados reales.** Hover, focus-visible, active (`scale(.985)`), disabled,
   vacío, error y carga. Un componente sin estados está incompleto.

## Detalles que venden "premium"
- Highlight especular `inset 0 1px 0 rgba(255,255,255,…)` en TODA superficie clara.
- Botón primario con micro-gradiente vertical (5–8 % de diferencia), no plano.
- Grano al 3–4 % sobre fondos con degradado.
- Números con `tabular-nums` y `decimal-leading-zero` (01, 02…) en pasos.
- Eyebrows: 12 px, MAYÚS, +0.09em, semibold, con filete de 22×2 px delante.
- Enlaces con subrayado al 35 % de alfa y `text-underline-offset: 3px`.
- Bordes internos `1px rgba(tinta, .06–.10)`, nunca `#ccc` sólido.
- Iconos lineales de un solo peso (1.75–1.8 en rejilla 24), mismo set en todo el sitio.

## Anti-patrones (olor a "plantilla IA")
- Degradados morado→azul→rosa; glows neón; `box-shadow` de color saturado.
- Bordes de 2 px negros, "brutalismo" accidental.
- Animaciones en bucle sobre el contenido; partículas; tilt 3D en tarjetas.
- Emojis como iconos de UI; sombras duras bajo texto.
- Más de 2 familias tipográficas; pesos 300 en párrafos largos.

## Checklist final
- [ ] ¿Podría describir la paleta en 2 frases? (si no, sobra color)
- [ ] ¿Todos los radios siguen la escala 10/14/20/28/pill?
- [ ] ¿Cada sombra tiene ≥ 2 capas y alfa ≤ 10 %?
- [ ] ¿El hover más común es elevar + profundizar sombra (sin cambiar colores)?
- [ ] ¿La vista se entiende en escala de grises?
