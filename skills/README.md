# SKILLS — Conocimiento de diseño reutilizable

Cuatro "skills" destiladas durante la construcción de Salud Buenaventura.
Formato agent-skill: cada una declara **cuándo usarla**, reglas duras,
recetas copiables y un checklist de verificación. Sirven tanto para humanos
como para agentes de código que trabajen sobre esta base.

| Skill | Resuelve |
|---|---|
| [`glassmorphism/`](glassmorphism/SKILL.md) | Vidrio esmerilado de nivel enterprise: 3 niveles jerárquicos, receta canónica, las 8 reglas duras, fallback y anti-banding. |
| [`estetica-apple/`](estetica-apple/SKILL.md) | Precisión y calma "premium" sin copiar: 7 pilares (tipografía de sistema, un color, espacio, profundidad multicapa, píldoras, curva única, estados reales) + anti-patrones de "plantilla IA". |
| [`motion-y-accesibilidad/`](motion-y-accesibilidad/SKILL.md) | Movimiento con causa (patrones y duraciones), WCAG 2.2 AA operativo: foco con outline, ARIA mínima correcta, teclado, contraste, reduced-motion y rendimiento. |
| [`ui-data-driven/`](ui-data-driven/SKILL.md) | UI vanilla data-driven: contrato de datos, estado derivado (abierto/cerrado en vivo), filtros en URL, patrón chrome `sb:ready`, los 6 estados de una lista y smoke tests con jsdom. |

## Cómo se aplicaron en este proyecto
- **tokens.css** materializa las reglas de las skills (nada de valores crudos).
- **components.css** implementa la receta canónica de vidrio y los estados.
- **utils.js / chrome.js / datos.js** siguen el patrón data-driven completo.
- **tools/** automatiza las verificaciones de los checklists.

## Regla de evolución
Si durante un cambio aparece una decisión de diseño repetida dos veces,
se documenta primero en la skill correspondiente y luego en `docs/BIBLIA.md`.
El código siempre va detrás del criterio, nunca al revés.
