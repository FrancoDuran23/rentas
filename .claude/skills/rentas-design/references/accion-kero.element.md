---
version: anydesign-element-1
name: "Tarjeta de skill de Kero-stack → acción del hero de Rentas"
source: https://kerostack.vercel.app/
captured_at: 2026-10-02
kind: code
target:
  description: "la tarjeta de skill del carrusel (kero-method)"
  selector: "button.card-face.card-front"
colors:
  card: "#111111"
  text-primary: "#F2F1ED"
  text-secondary: "#B9B7B0"
  dot: "#F2F1ED"
  dot-accent: "#F2541B"
  page: "#F2F1ED"
typography:
  name: { fontFamily: "Instrument Sans", fontSize: 16px, fontWeight: 600, letterSpacing: -0.16px, lineHeight: 24px }
  line: { fontFamily: "Instrument Sans", fontSize: 14px, fontWeight: 400, lineHeight: 18.9px }
  by: { fontFamily: "Instrument Sans", fontSize: 14px, fontWeight: 400 }
spacing-used: [12, 16]
rounded-used: { card: 16px }
---

# Element — tarjeta de skill de Kero-stack

> Generado con `anydesign` (element mode). Kind: code · 2026-10-02

## Source & target
- **Fuente:** https://kerostack.vercel.app/ — `button.card-face.card-front` (DOM ✅, estilos computados con Playwright).
- **Contexto:** sobre fondo cálido #F2F1ED con una matriz de puntos gigante detrás; las tarjetas forman un carrusel con perspectiva.

## 1. Qué es
Una tarjeta vertical casi negra que presenta una skill: firma arriba, un ícono hecho de **puntos cuadrados en una grilla** (como una matriz de LED, dibujado en `canvas` con *dither*) con **un solo acento de color**, y abajo el nombre y una línea **"entrada → salida"**. Lo distintivo es el ícono de puntos y el acento único.

## 2. Spec
- **Estructura:** `button > span.card-top > span.card-by` · `canvas.dither` · `span.card-name` · `span.card-line`.
- **Caja:** 214×411px, fondo #111, radio 16px, padding 12px 16px 16px.
- **Sombra:** `0 1px 0 rgba(17,17,17,.04), 0 12px 32px -12px rgba(17,17,17,.18), inset 0 0 0 1px rgba(17,17,17,.09)`.
- **Puntos:** cuadrados de ~3,5px con ~1px de separación (a 1x); 3297 px² en #F2F1ED y 1588 en el acento #F2541B (~1/3 del dibujo es acento).
- **Estados:** hover sin cambio en la cara; el contenedor anima `transform .64s cubic-bezier(.23,1,.32,1)` (carrusel). Focus ❓ (no observado).

## 3. Adaptación a Rentas (lo que se reconstruye)
- Tokens del proyecto en vez de los de Kero: tarjeta `bg-ink` / texto `text-bg` (en oscuro se invierte sola: tarjeta clara con tinta, como las tarjetas blancas del carrusel de Kero); secundario `text-bg/70`.
- Acento: el celeste del isologo (`--celeste` #2581C6 en claro, #5CB3EA en oscuro) en lugar del naranja: es la marca de Rentas, y en puntos (sin texto) no tiene requisito de contraste de texto.
- Familia: Public Sans (regla de familia única del proyecto) en vez de Instrument Sans.
- Ícono: SVG de puntos (nítido, sin JS, sigue el tema) en lugar de `canvas`.
- Línea "entrada → salida" con datos reales de `src/data` (sin inventar).
- Interacción (Emil): con puntero, la tarjeta sube 4px y la sombra crece (`.64s cubic-bezier(.23,1,.32,1)`, la curva medida); al presionar, `scale(.97)`; con movimiento reducido, sin desplazamiento.

## 4. No
- Sin perspectiva 3D ni carrusel (son cuatro acciones a la vista, no una galería).
- Sin la matriz gigante de fondo: el fondo del hero ya es la luz celeste.
