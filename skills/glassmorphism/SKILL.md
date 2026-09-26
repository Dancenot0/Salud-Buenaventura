# SKILL · Glassmorphism Enterprise (nivel pulido)

**Cuándo usarla:** cualquier interfaz que pida "vidrio esmerilado" sin caer en el
look genérico de plantilla (neón, blobs saturados, blur grisáceo).

## Entrada/salida
- **Entrada:** jerarquía de superficies de la vista + fondo con capas.
- **Salida:** superficies de vidrio con nivel asignado, receta exacta y fallback.

## Reglas duras
1. **El vidrio necesita relieve detrás.** Sin fondo ambiental (gradientes radiales
   suaves, orbes lentos, textura), el blur no revela nada → se ve gris y barato.
   Presupuesto del fondo: saturación de blobs ≤ 30 % de opacidad efectiva.
2. **Tres niveles, nunca más:** chrome (blur 20–24, saturate 175–190, fondo
   65–85 %), superficie (blur 16–20, saturate 160–180, fondo 50–75 %), velo
   (blur 8–12, saturate 130–150, fondo ~40 %). Asignar por rol, no por gusto.
3. **Anatomía obligatoria de cada superficie:**
   - fondo: `linear-gradient(155–165deg, rgba(255,255,255,H+0.2), rgba(255,255,255,H))`
   - borde: `1px solid rgba(255,255,255,.55–.85)` (blanco, jamás gris)
   - especular: `inset 0 1px 0 rgba(255,255,255,.7–.95)` arriba
   - sombra multicapa tintada al hueco de marca, 3–10 % de alfa
4. **Texto sólido siempre:** mínimo 4.5:1 contra el *peor* fondo posible detrás
   del vidrio. Si el fondo ambiental varía, probar el texto sobre la zona más clara.
5. **Presupuesto de render:** ≤ 6 `backdrop-filter` visibles por viewport; el blur
   es caro en gama baja. En móvil, degradar chrome a sólido al hacer scroll rápido.
6. **Nunca vidrio sobre vidrio** (dos niveles iguales apilados). Un velo DENTRO de
   una superficie sí es válido (jerarquía interna).
7. **Grano anti-banding:** ruido SVG (`feTurbulence`) al 3–4 %, `mix-blend-mode:
   multiply`, sobre el fondo ambiental. Elimina las bandas del blur en degradados.
8. **Fallback `@supports`:** sin `backdrop-filter`, fondos sólidos 92–96 %. La UI
   debe seguir siendo correcta (no "mitad rota").

## Receta canónica (copiar/adaptar)
```css
.glass {
  background: linear-gradient(158deg, rgba(255,255,255,.72), rgba(255,255,255,.52));
  backdrop-filter: blur(18px) saturate(170%);
  border: 1px solid rgba(255,255,255,.68);
  box-shadow:
    0 1px 2px rgba(H,.03), 0 8px 20px rgba(H,.06), 0 24px 48px rgba(H,.06),
    inset 0 1px 0 rgba(255,255,255,.85);
  border-radius: 20px; /* un radio por rol de componente */
}
.glass:hover { transform: translateY(-3px); border-color: rgba(255,255,255,.9); }
/* transición: 240ms cubic-bezier(.22,1,.36,1) */
```

## Test rápido de calidad
- [ ] ¿Se distingue chrome de tarjeta de chip a un metro de la pantalla?
- [ ] ¿El borde se ve como canto pulido (blanco) y no como línea gris?
- [ ] ¿Hay highlight especular superior en TODAS las superficies?
- [ ] ¿El texto pasa AA sobre la zona MÁS clara del fondo?
- [ ] ¿Con `backdrop-filter` desactivado la UI sigue siendo utilizable?
- [ ] ¿Menos de 7 blurs simultáneos en la vista más densa?
