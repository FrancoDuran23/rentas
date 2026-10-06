---
name: rentas-design
description: Sistema de diseño de Rentas Jujuy (propuesta de rediseño del portal de la Dirección Provincial de Rentas). Cargala antes de tocar cualquier pantalla, componente o token de este proyecto; al elegir color, tipografía, espaciado, íconos, movimiento, foco o estados; al tocar el logo o el velo de luz; y antes de dar una pantalla por terminada. Manda sobre el código: si una pantalla no coincide, se corrige la pantalla.
---

# Rentas Jujuy: sistema de diseño

Esta skill es la fuente del sistema. `DESIGN.md` queda como historia y como detalle de componentes; si los dos no coinciden, vale esta skill y el código que corre en `src/styles/index.css`. Las pantallas piden roles (`bg-surface-2`, `text-ink-3`), nunca colores.

## 1. Qué es el producto en pantalla

- Propuesta de rediseño del sitio de la DPR de Jujuy: SPA estática (Vite, React 19, Tailwind 4, react-router). No procesa trámites: toda acción deriva a los portales oficiales (rentasjujuy.gob.ar y rentasjujuyonline.gob.ar). Por qué: es un concepto para presentar, implementable por el equipo de la DPR.
- Pantallas: Inicio, Trámites (búsqueda y filtros), Impuestos (índice y detalle), Vencimientos (calendario, agenda, .ics), Atención, Normativa, Noticias, Centro de ayuda, 404 y buscador global (`/` o Ctrl/⌘+K).
- Dos públicos con el mismo peso: el vecino que llega desde el celular, con datos móviles y poca práctica, y el profesional (contador, gestor) que vuelve seguido y quiere ir directo. Por eso: lenguaje llano y caminos densos en la misma superficie.
- Accesibilidad: WCAG 2.2 AA, teclado completo, legible a 200% de zoom y desde 360px de ancho.

## 2. La marca

- Dirección del usuario: el canon de un portal de servicios públicos, ejecutado al máximo (claridad GOV.UK, familiaridad argentina.gob.ar). Sin mundo propio. Por qué: es un portal de trámites, la confianza sale de lo conocido.
- **Isologo oficial** en `public/brand/` (versión completa con arcos celestes, aportada por el usuario en oct. 2026): `logo-rentas-96.png`, `logo-rentas-180.png` (2x y apple-touch-icon) y `favicon-64.png`. Se muestra a 40×40px con `alt=""` porque el enlace lleva "Rentas Jujuy, ir al inicio". Fondo blanco quitado sólo fuera del círculo: la R y el disco quedan intactos. Por qué: funciona en modo oscuro sin redibujar la marca.
- Nunca redibujar, recolorear ni reencuadrar el isologo, ni ponerlo sobre fondos de color. Si llega una versión mejor (vector), se reemplazan esos tres archivos y nada más.
- **El gesto propio** es la luz celeste de los arcos del isologo que se desplaza: shader vgpu detrás del hero de inicio (obligatorio) con su velo CSS equivalente, y un velo tenue en la cabecera de cada página interna (`PageIntro`). En ningún otro lugar.
- **Intensidad (usuario, oct. 2026):** "está muy normalito, pensé que ibas a agregarle un efecto atrás" → sólo el inicio, **más visible, sin protagonismo**: se ve apenas carga, pero el buscador sigue siendo lo primero. Las cabeceras internas siguen tenues. Por qué: la versión "leve y suave" anterior no se percibía, sobre todo en navegadores sin WebGPU.
- **Fluidez (usuario):** "un poco más fluida la animación" → el velo CSS recorre elipses cerradas de 48 puntos en `linear` infinito (sin `alternate` ni `ease-in-out`, que frenaban en cada extremo) y el shader corre a 60 fps con mouse y pantalla ancha (30 en táctil o angosta).
- **Nada se copia de kerostack.vercel.app** (usuario: "terrible… usá las skills, no el gráfico del otro"). Kero-stack es el método (skills), no una referencia visual. La dirección visual la da el usuario.
- **Librerías (kero-method → `pick-ui-library`, lista de Emil Kowalski):** antes de armar a mano un control, se usa la de la lista: **base-ui** (`@base-ui/react`: Form, Field, diálogos, popovers, menús), **Sonner** (avisos; `Toaster` montado en `Layout.tsx` con los tokens), **motion** (resortes, entradas, gestos; para un hover o fundido simple alcanza CSS), **NumberFlow** (números que cambian). Usuario: "rehacelo con los componentes que dicen las skills".
- **Login = la credencial de Clave Fiscal** (elegido por el usuario con impeccable, seed 8b51415d; brief en `.impeccable/surfaces/src-pages-ingresarpage-tsx.md`): tarjeta centrada con cabecera `brand-soft` (isologo + "Clave Fiscal"), CUIT grande en cifras tabulares, clave con "¿La olvidaste?" en su etiqueta, botón a lo ancho, línea de demostración permanente; lo secundario chico debajo. Rechazados: dos columnas con aviso ámbar arriba ("raro, horrible").
- **Accesos rápidos del hero (impeccable `bolder`; usuario: "muy feas o simples"):** amplifican lo que el sistema ya tiene, sin efectos nuevos: verbo a escala de título (700, hasta 1.75rem), ícono grande en `brand`, fondo `brand-soft`; el gesto es que la tarjeta entera pasa a `brand` con texto `brand-ink` al pasar el puntero, y se hunde al presionar. Rechazadas antes: blancas con ícono chico, medallones pálidos, tablero de ventanillas, tarjetas negras copiadas de kerostack.
- **Gobierno de Jujuy:** su logo (jujuy.gob.ar, azul #14304D; blanco en oscuro) va en la barra institucional junto a "Ministerio de Hacienda y Finanzas" y en el pie. Nunca junto al logo de Rentas en el header ("horrible, re mal dispuesto").
- **Inicio (usuario, con el sitio oficial como referencia):** hero → carrusel con los avisos del carrusel oficial (texto real, no imágenes; pausa, anterior/siguiente, "n de 5") → próximos vencimientos → medios de pago (logos oficiales en círculos). "Más frecuentes" se sacó: repetía las acciones y el pie.
- **TuBOT** es la mascota oficial (tucán con la R, `public/brand/tubot-*.png`, tomada del widget Botmaker del sitio oficial) y un chat simulado que responde sólo con `src/data`. No aparece en `/ingresar`.

## 3. Color

Tokens en `src/styles/index.css` (`:root`, `[data-theme="dark"]` y `prefers-color-scheme: dark` sin elección guardada). El modo oscuro redefine los mismos roles; ningún componente pregunta el modo salvo el anillo de menús, el telón del diálogo y los uniforms del shader.

| Rol | Claro | Oscuro | Uso |
|---|---|---|---|
| `bg` / `surface` | #ffffff / #ffffff | #0d1117 / #121821 | página y paneles |
| `surface-2` | #f4f6f9 | #171f2b | bandas tonales, footer, hovers |
| `surface-3` | #e9edf3 | #1f2937 | sólo hover del botón `subtle` |
| `ink` | #0b0f19 | #eef2f7 | títulos, texto principal, relleno de chip activo |
| `ink-2` | #2a303b | #d2d8e1 | bajadas, cuerpo, navegación en reposo |
| `ink-3` | #4a5260 | #aeb6c3 | metadatos, descripciones (7,9:1 sobre blanco) |
| `line` / `line-strong` | #d3d9e3 / #aeb8c6 | #2e3a4d / #46556c | filetes; `line-strong` da ~2:1 y nunca es el único límite de un campo |
| `brand` / `brand-hover` | #0068a3 / #00588c | #5cb3ea / #8dcaf1 | enlaces, botón primario, activo, hoy |
| `brand-ink` / `brand-soft` | #ffffff / #e6f1f8 | #031a2b / #0d2a3f | texto sobre primario / fondo info |
| `ok`, `warn`, `danger` (+ `-soft`) | #12733a, #8a5300, #b42318 | #6fd39a, #f2bb5c, #ff8e83 | sólo estado, siempre con texto o ícono |
| `focus` / `focus-ink` | #ffd21f / #0b0f19 | iguales | sólo foco y skip link |

- **Azul único.** `brand` marca lo que se toca y lo que está activo. Nunca fondo de bandas, títulos ni decoración. Por qué: si el azul está en todos lados deja de decir "tocá acá".
- **Color con significado.** Verde, ámbar y rojo sólo para estado. Ninguna categoría tiene color propio. Deuda conocida: el canal del trámite y "Clave fiscal" usan el badge `info` (azul de marca) como categoría (`TramitesPage.tsx`, `TramitesImpuesto.tsx`), lo que choca con el azul único. No lo repitas en piezas nuevas; corregirlo es decisión abierta (sección 14).
- **Texto medido sobre lo pintado:** todo texto ≥ 4,5:1 sobre su fondo real, incluido el velo de luz en cualquier cuadro. `--celeste` (#2581c6, 4,17:1) nunca lleva texto.
- **Claro de la luz:** la fila "Más buscados" (enlaces azules) lleva un claro quieto medido en vivo (`useClear` en `Hero.tsx` → uniform `clear` del shader y `.veil-clear` en CSS): ahí la luz se topea en 0,45 (fondo ≥ 0,75 de luminancia en claro, ≤ 0,05 en oscuro). Los accesos directos van en un panel `surface`. Todo texto nuevo sobre la luz necesita lo mismo o un panel.
- **Grises con presencia (usuario, oct. 2026):** "los grises no se notan mucho": textos grises y líneas se subieron un escalón (más oscuros en claro, más claros en oscuro). No los vuelvas a aclarar en claro ni a oscurecer en oscuro.
- Reservados sin uso: `--celeste`, `--visited`. No asignarles rol sin decisión del usuario.

## 4. Tipografía y cifras

- Una sola familia: Public Sans Variable (400, 500, 600, 700). Sin serif, itálica de acento ni monoespaciada. Por qué: la jerarquía sale de tamaño y peso; las exploraciones con serif itálica se descartaron.
- Escala: display 3rem (2.25rem móvil), headline 2.5rem (1.875rem), title 1.75rem (1.5rem), subhead 1.25rem, item-title 1.125rem, lead 1.125rem `ink-2`, link-title 1.05rem 600, body 1rem/1.6, body-sm 0.95rem, nav 0.95rem 500, button 0.95rem 600 (0.875rem sm, 1rem lg), label 0.875rem.
- **Mínimo de lectura: 14px (0.875rem).** Badges, cuentas regresivas, conteos de chips, días de la semana del calendario, mes abreviado bajo una fecha, barra institucional y bajada del logo van a 0.875rem. Por qué: un portal público con usuarios mayores y celulares chicos; a 12px se ve apretado y barato. Las mayúsculas (caption) sólo en el mes o día abreviado bajo una fecha.
- **Cifras tabulares** (`.tabular`) en fechas, teléfonos, conteos, cuentas regresivas y números de paso. Por qué: se alinean y no saltan al cambiar.
- Títulos con `text-wrap: balance` y `letter-spacing: -0.015em`; párrafos con `pretty`.
- Medida de lectura: 68ch (`.prose-measure`) en prosa, 42rem en bajadas, 48rem en títulos de página.

## 4b. Presupuesto de texto

**Dirección del usuario (oct. 2026): "que se sienta menos abrumador, tiene mucho texto".** Tesis de `docs/research.md`: la tarea está escondida; el producto la pone en verbo, a dos toques desde el teléfono.

- Tope de palabras visibles dentro de `<main>`, medido a 390px (lo que está en un `<details>` cerrado no cuenta):

| Página | Tope |
|---|---|
| Inicio | 120 |
| Impuestos (índice) | 150 |
| Ingresar | 150 |
| Vencimientos, Noticias, Ayuda | 250 |
| Detalle de impuesto | 300 |
| Trámites, Atención | 350 |
| Normativa | 450 |

- Se mide con `scratchpad/audit-run/words.mjs` (Playwright: `main.innerText` por ruta). Si se pierde el scratchpad, el script es: abrir cada ruta a 390px y contar `document.querySelector('main').innerText.split(/\s+/)`.
- Cómo se baja: (1) sacar lo que no ayuda a decidir (descripciones bajo enlaces que se explican solos, bajadas que repiten el título); (2) lo largo detrás de un `Disclosure` o en la página de detalle; (3) títulos de 2–5 palabras, bajada de una línea como máximo; (4) listas, no párrafos.
- Nunca se pierde: una tarea, un enlace oficial, un dato de contacto, la nota de vencimientos orientativos.

## 5. Espacio, forma y profundidad

- Escala de espaciado: la de Tailwind, declarada en `kero-audit.json`. Se usan medios pasos (2, 6, 10, 14px) dentro de controles compactos (badges, chips, kbd, botón sm) y también en filas de lista (`py-3.5`), migas y metadatos (`gap-1.5`, `mt-0.5`). 44px sólo como inset de campo con lupa. Si se normalizan a múltiplos de 4 entre bloques es decisión abierta.
- Contenedor único `container-page`: 76rem, márgenes 1rem / 1.5rem (sm) / 2rem (lg). Ningún bloque define su propio ancho de página. Pistas de grilla siempre `minmax(0, …)`.
- Ritmo: secciones de inicio 3.5rem (4rem sm); `PageIntro` 2rem (3rem sm); 1.5rem entre encabezado de sección y contenido.
- Radios: 8px controles, 12px contenedores, 6px badges y kbd, píldora sólo en chips de filtro y círculos de paso, 4px anillo de foco. **Concéntricos:** un radio interior es el exterior menos el inset.
- Plano: filetes de 1px y bandas tonales. Una sola sombra (`shadow-pop`) para lo que flota (menú de Impuestos, buscador global); en oscuro se suma anillo de 1px `line`. Sin glow, halos ni degradés de color.

## 6. Imágenes, íconos y marcas

- Un solo set: lucide-react. 16px (`size-4`) junto a texto de 14–16px, 20px (`size-5`) en botones de ícono y avisos, 14px en badges y migas; en botones, 1.1em. Excepción: el ícono del botón de tema mide 1.15rem.
- Enlaces externos: flecha diagonal (ArrowUpRight) y "(se abre en una pestaña nueva)" para lectores de pantalla.
- Sin fotografía: la DPR no aportó fotos y no se inventan.

## 7. Navegación

- Barra institucional `surface-2` (oculta con menos de 480px de alto). Header fijo de 64px (72px desde lg): logo, navegación, búsqueda, tema, botón primario "Ingresar con clave fiscal". Opaco en celulares y translúcido (85%, blur) desde md. Por qué: el blur dejaba una mancha detrás del logo en celulares.
- Navegación completa desde lg (`SiteHeader.tsx`); debajo, botón de menú. Entre md y lg la búsqueda es un campo falso (`w-56`). En xl sólo cambia el texto del botón de clave fiscal a su versión larga.
- Navegación activa: borde inferior de 3px `brand`, texto `ink`.
- Una sola acción primaria por vista: en el header es "Ingresar con clave fiscal".

## 8. Movimiento

- Cambios de color de 150ms (100ms en opciones del buscador). Menús y diálogos: `pop-in` de 160ms, `cubic-bezier(0.22, 1, 0.36, 1)`, opacidad y −4px. Chevrons giran 180°.
- Velo CSS: sólo `transform`, ciclos de 26 y 33s. Shader: 60fps (30 y media resolución en táctil o con menos de 768px), pausa fuera de pantalla y con la pestaña oculta.
- Con `prefers-reduced-motion`: sin velo animado, shader quieto en t=0, sin `pop-in`, scroll automático y chevrons sin giro animado (`motion-reduce:transition-none` junto a todo `transition-transform`). Los fundidos de color se mantienen porque no son desplazamiento.

## 9. Foco, teclado y toque

- **Foco global (patrón GOV.UK):** controles con contorno amarillo de 3px más anillo `focus-ink` de 5px; enlaces de texto con fondo amarillo, texto `focus-ink` y barra inferior oscura. Campos de texto: el campo del hero muestra sólo el amarillo porque su borde de tinta ya hace de límite.
- Un `ring-*` de Tailwind es un box-shadow y pisa el anillo oscuro: todo control con `ring-*` lleva `FOCO_CON_RING`, exportado de `src/components/ui/Button.tsx` (o usá `buttonClass`/`chipClass`, que ya lo traen). Faltaba en las flechas de mes, los días de `DayPanel` y los chips de `Extras`.
- Un enlace con forma de botón (`ButtonLink`) toma el foco de enlace: fondo amarillo y texto `focus-ink`; su fondo de variante no puede ganarle al amarillo. En la variante secundaria, `FOCO_CON_RING` reemplaza la barra inferior por un anillo oscuro completo.
- Dos áreas `hit` apiladas necesitan 28px entre ellas en táctil (14 + 14) o se pisan: por eso `coarse:gap-7` en la agenda, el panel del día y los contactos de Atención.
- Áreas de toque: 44px en pantallas táctiles (`coarse:`), 24px con puntero. Todo enlace o botón suelto fuera de prosa (migas, `ArrowLink`, "Ver información", "Agregar", "Cómo llegar", "Volver arriba") lleva la utilidad `hit` (`index.css`): padding vertical de 4px (14px táctil) compensado con margen negativo, así crece el área sin mover el layout. Por qué: 20px de alto no se acierta con el dedo y no cumple WCAG 2.5.8.
- `hit` usa `margin-block`: no la combines con un `mt-*`/`mb-*` en el mismo elemento (una pisa a la otra). Poné el margen en un contenedor.
- Las redes ("X" mide 11px) agrandan el ancho táctil con un `::before` de 44px centrado y no con `min-w`, para que la "X" no quede corrida respecto de las demás.
- Zoom libre: nunca `maximum-scale` ni `user-scalable=no`.

## 10. Estados

- Búsquedas y filtros sin resultados: mensaje que dice qué probar y cómo limpiar el filtro.
- Datos orientativos (vencimientos) siempre rotulados como orientativos, con enlace al calendario oficial.
- Sin WebGPU, con ahorro de datos o adaptador de software: queda el velo CSS, sin aviso (es mejora progresiva).
- `Notice` de peligro con `role="alert"`; la cantidad de resultados del buscador por `aria-live`.

## 11. Escritura

- Español rioplatense con voseo, claro y cálido, de servicio público. Sin marketing.
- Nombres: "Dirección Provincial de Rentas" / "Rentas Jujuy"; dependencia: Ministerio de Hacienda y Finanzas, Gobierno de Jujuy.
- Nunca inventar fechas, montos, porcentajes, estadísticas ni testimonios. El Impuesto Automotor es municipal: se redirige, no se ofrece.

## 12. Rechazo automático

- Eyebrows o rótulos sobre los títulos: el usuario pidió el canon sin adornos.
- Grillas de tarjetas iguales con ícono para trámites o servicios: es la estructura genérica; aquí van `LinkList` con filetes. Única excepción, elegida por el usuario: las cuatro acciones del hero (ícono y verbo, nada más).
- Tarjetas copiadas de kerostack.vercel.app (oscuras con dibujo de puntos, isométricas, numeradas): rechazadas.
- **Inicio cargado de texto (usuario, oct. 2026):** "entre tanto texto me abruma la info; fijate la página oficial cómo está sintetizado". El inicio es: hero (título, buscador, 4 acciones: Pagar, Consultar, Clave fiscal, Pagar Inmobiliario) → Más frecuentes (8 enlaces de una línea, sin descripción, sin repetir las acciones) → Próximos vencimientos (3 fechas grandes, orientativas) → Novedades (3 títulos). Nada de bajadas ni descripciones en el inicio; el detalle vive en las páginas internas.
- Bandas oscuras o azules de hero, paleta terrosa, estratos de Siete Colores, aguayo, serif itálica: exploraciones descartadas por el usuario.
- Aviso de "prototipo no oficial" visible: el usuario lo sacó (`SHOW_PROTOTYPE_NOTICE = false`).
- Variantes de botón `inverse` e `inverse-outline`: resto de la banda azul descartada, sin uso.
- Servidor de desarrollo expuesto a la red (`--host`): el usuario lo quiere sólo en localhost.

## 13. Trampas del proyecto

- **kero-audit marca el foco en 1,45:1 y es falso.** Mide sólo el `outline` amarillo contra el fondo y no ve el anillo oscuro de 5px (`box-shadow`) que lo rodea (19:1 sobre blanco). Antes de "arreglarlo", verificá que el control tenga el box-shadow puesto; si no lo tiene, ese sí es el bug (le falta `FOCO_CON_RING`).
- **El reduced motion de kero-audit cuenta transiciones de color.** Lo que hay que mirar es que no quede nada que se desplace (transform, translate, top/left, animaciones).
- **kero-audit mide el rectángulo del elemento y no ve un `::before` de área de toque**: la "X" de redes sale 26×44 en táctil y su área real es 44×44. Es lectura falsa; no la "arregles" con `min-w`.
- **kero-audit no mide el modo oscuro.** Corré `checks.js` a mano en un contexto con `colorScheme: 'dark'` y reportá su denominador.
- **El watcher de Vite perdió una segunda escritura rápida** al mismo archivo y siguió sirviendo la versión vieja. Después de editar varios archivos por script, hacé `touch` y verificá el módulo servido (`curl localhost:<puerto>/src/...`) antes de medir.
- **Utilidades de Tailwind ganan a `@layer base`.** Un estilo global de foco que tiene que imponerse a un `bg-*` necesita `!important` o vivir en la capa de utilidades.
- **Puerto 5173 compartido** con otro proyecto del usuario (`astroam-monad`): levantá con `--port` fijo y `--strictPort`, y verificá el `<title>` antes de medir. Un 200 de otro proyecto no prueba nada.
- **El blur del header en celulares** dejaba una mancha detrás del logo: por eso es opaco bajo md.
- **Chromium en Linux (el navegador del usuario) no expone WebGPU por defecto** (Intel Gen11: sólo con `--enable-unsafe-webgpu --enable-features=Vulkan`): lo que se ve es el velo CSS. Todo cambio de la luz se hace y se mide en las dos rutas.
- **Medir contraste sobre una animación:** escondé el texto con `transition: none` y esperá: con la transición de color de 150ms el primer cuadro mide las letras a medio desaparecer como si fueran fondo. Y el mínimo de un muestreo arranca en `+Infinity`, no en un valor de la escala equivocada.
- **`pkill -f <patrón>` mata la propia shell** si el patrón aparece en la línea de comandos: usá `pgrep` y matá por PID.
- **Contar palabras con `innerText` cuenta el texto `.sr-only`** ("(se abre en una pestaña nueva)" sumaba 66 palabras invisibles en el inicio): el contador las saca antes de medir.
- **Filas que se parten con `hit`:** si una lista de enlaces con `hit` puede quedar apilada en el celular (wrap o columna), el espacio vertical táctil es `coarse:gap-y-7` / `coarse:space-y-7` / `coarse:mt-7`, o las áreas se pisan.
- **SwiftShader** (adaptador WebGPU por software) frenaba toda la página: se detecta y se usa el velo CSS.
- **El contenido de un `<details>` cerrado tiene rectángulos** en Chrome aunque no se pinte ni se pueda tocar. Un chequeo de solapes o de áreas de toque tiene que excluirlo o da falsos positivos.
- **Un recorrido de foco con tope corto miente.** En `/vencimientos` hay más de 70 elementos antes del calendario; con tope de 70 los controles sin `FOCO_CON_RING` pasaron como correctos. Recorré hasta que el foco vuelva al principio.
- **`cursor-agent` en modo script** pide confianza en el directorio: usá `--trust` (no `--force`) y `--mode ask` para revisiones de solo lectura. Un worktree parte del último commit: para revisar cambios sin commitear, pasá el diff como archivo.
- **El scratchpad de la sesión se borra** cuando la sesión se reinicia: las herramientas de medición se recrean, no se dan por presentes.

## 14. Decisiones abiertas

- Destino de publicación oficial (hoy GitHub Pages, rama `gh-pages`).
- Si la DPR aportará fotografía o una versión vectorial del isologo.
- Rol de `--celeste` y `--visited` (declarados, sin uso).
- Si el canal del trámite y "Clave fiscal" dejan de usar el badge azul `info` (categoría con color de marca, contra el azul único).
- Si se normalizan los medios pasos de espaciado entre bloques (`py-3.5` en filas, `gap-1.5`, `mt-0.5`).
- `wght-italic.css` de Public Sans está importado y la interfaz no usa itálica: quitarlo ahorra peso, pero es decisión del usuario.

## 15. Antes de decir que está terminado

- ¿Corriste `kero-audit` con `kero-audit.json` en 390, 420 y 1440 (420 es donde aparece la bajada del logo), más `checks.js` en oscuro, y reportaste cada número con su denominador?
- ¿Recorriste el foco con Tab y confirmaste el anillo oscuro (el audit no lo ve)?
- ¿Miraste las capturas, no sólo el informe?
- ¿El logo se ve sobre `bg` y `surface-2` en los dos temas?
- ¿Hay una sola acción primaria por vista?
- ¿Todo dato no oficial dice que es orientativo?
- ¿Escribiste acá las correcciones de esta ronda?
