---
version: 1
slug: "src-pages-ingresarpage-tsx"
primary_target: "src/pages/IngresarPage.tsx"
related_targets: ["src/components/layout/Layout.tsx"]
---

# Ingresar con Clave Fiscal

Modo: Operate. Audiencia: vecinos y profesionales de Jujuy, a menudo en el celular, que vienen a entrar a su cuenta de Rentas. Tarea: CUIT + clave → ingresar; si no tienen clave, pedirla; si no la necesitan, pagar o consultar sin clave. Restricción: prototipo sin backend; el formulario nunca envía ni guarda nada y lo dice de forma visible; deriva al portal oficial. Usuario: "el login está raro, horrible; rehacelo con los componentes de kero" (pick-ui-library: base-ui, Sonner, motion).

## Direction contract

THESIS: el formulario es la credencial de Clave Fiscal. Rechaza la página de formulario administrativo (aviso ámbar arriba, dos columnas con el mismo peso, campos chicos).
OWN-WORLD: el del sitio (DESIGN.md / skill rentas-design): blanco, tinta, el azul del isologo; la credencial es una tarjeta con cabecera de marca (isologo + "Clave Fiscal"), filete, campos amplios y el CUIT en cifras tabulares grandes con sus guiones.
STORY: la persona reconoce su credencial, escribe su CUIT y su clave sin dudar, entiende que es una demostración, y si no tiene clave sabe en un toque cómo pedirla.
FIRST VIEWPORT: en 390 y 1440, la credencial centrada (máx. 28rem) sobre fondo surface-2 con el velo de luz; dentro, cabecera de marca, CUIT grande, clave con mostrar/ocultar y "¿La olvidaste?" en su etiqueta, botón primario a lo ancho, y una línea de demostración con el enlace oficial. Debajo de la credencial, chico: primera vez, sin clave, ayuda.
FORM: la credencial (6.ª de 7 en mi lista ordenada; la tirada). Seed 8b51415d.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
