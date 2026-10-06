# Investigación — Rentas Jujuy

> kero-research · 2026-10-02 · 3 investigadores en paralelo (usuarios, competencia, medición del sitio actual)

## Tesis

**El sitio de Rentas no falla por falta de información: falla porque la tarea está escondida.** Las cuatro acciones son imágenes que un lector de pantalla no anuncia, el sistema online no funciona en el celular y, justo el día del vencimiento, se cae. El producto pone la tarea en verbo y a dos toques desde el teléfono, con la próxima fecha a la vista y un plan B para cuando el sistema falla.

## Lo que existe (medido, 2026-10-02, Playwright + Chromium, 390 y 1440)

| Hallazgo | Dato | Fuente |
|---|---|---|
| El sistema online no es usable en el teléfono | `winmscf.aspx` sin viewport: se dibuja a 1050px y se achica 2,7× (16px → ~6px); el login tiene scroll horizontal 1050/390 y `user-scalable=no` | medición propia, capturas en `scratchpad/research-oficial/` |
| Las 4 acciones principales son imágenes de texto | PAGAR.png, CONSULTAR.png, CLAVEFISCAL.png, 3-1.png con `alt` vacío; 12 de 65 enlaces sin nombre accesible; 21 de 43 imágenes con `alt` vacío | medición propia |
| Foco invisible | 18 de 20 tabulaciones sin indicador en el inicio; 20 de 20 en /pagar/ | medición propia |
| Contraste bajo | 29 de 41 textos bajo 4,5:1 en el inicio a 390; 34 de 36 en `winmscf.aspx` | medición propia (kero-audit checks.js) |
| Pesado y largo | 5.266 KB en 85 requests (78% imágenes); carga 4,45s en 390; 7,8 pantallas; sin H1 | medición propia |
| La tarea principal queda última | Pagar Inmobiliario es el 4.º círculo, a ~2 pantallas en el teléfono (y=1676) | medición propia |
| El texto real es mínimo | 80–81 palabras de texto en el inicio; el resto está en imágenes | medición propia |

## Los usuarios

- **El sistema falla en los vencimientos (hecho, reconocido por Rentas).** RG 1762/2026 (20/07/2026) prorroga el anticipo de junio de IIBB "debido a cuestiones operativas y sistémicas"; RG 1764 lo extiende al 29/07. https://rentasjujuy.gob.ar/wp-content/uploads/2026/07/RES-1762-2026-Modifica-Vto-Junio-26-Regimen-Local-SITI-SIR.pdf
- **Prórrogas en serie para contadores (hecho):** CM05 2024, SIRTAC sep-2025, SIRCREB/SIRCUPA nov-2025, SIFERE ene-2026 (RG 1749), SIRTAC jun-2026. https://siap.blogdelcontador.com.ar/organismo/dpr-direccion-provincial-de-rentas-jujuy/ (leído 02/10/2026). Que respondan a reclamos es inferencia.
- **Clave fiscal con fricción (hecho documental):** contraseña de 8–15 caracteres con símbolos, PDF de respaldo para la primera solicitud web, turno si es presencial. https://www.rentasjujuyonline.gob.ar/cedulavirtual/preguntasfrecuentesp.aspx — que confunda es inferencia.
- **Interior y poca destreza digital (hecho, reconocido por el organismo):** "Rentas con Vos" (ene-2026) para localidades sin delegación y para capacitar. https://rentasjujuy.gob.ar/wp-content/uploads/2026/01/Parte-de-Prensa-N°3-2026-Rentas-Con-Vos.pdf
- **Suba del Inmobiliario (hecho):** bases +115% en 2025. https://chequeado.com/el-explicador/impuesto-inmobiliario-que-es-como-se-calcula-y-cuanto-aumentara-en-2025-en-cada-provincia/ (03/02/2025)
- **Paros que cortan la atención presencial (hecho):** 28/11/2025. https://www.jujuydice.com.ar/noticias/jujuy-3/trabajadores-de-rentas-con-paro-y-movilizacion-ante-una-reforma-laboral-encubierta-56464
- **Opinión, sin confirmar que sea la DPR:** filas de "más de 4 horas" (Jujuy al Momento, 09/02/2022; probablemente Rentas municipal de Palpalá). https://www.jujuyalmomento.com/vecinos/rentas-vecinos-tildan-vergonzosa-la-atencion-y-piden-que-el-director-de-la-cara-n133580
- **TuBOT:** sin opiniones públicas encontradas; sólo el anuncio de lanzamiento (Todo Jujuy, jun-2023).

## La competencia (leída por lo que hace con la tarea; consultado 2026-10-02)

| Portal | Qué pone primero | Acierto | Error |
|---|---|---|---|
| Rentas Córdoba | "¿Qué necesitás hacer hoy?": Ver y pagar / Iniciar gestiones / 3 próximos vencimientos | Verbos, ~540 palabras, pagar sin entrar a la cuenta | Sin buscador; varios h1 |
| GOV.UK | Buscador como h1 + "Popular" | Cada tarea abre con el plazo; medios de pago ordenados por acreditación | — |
| ARCA | Clave fiscal + "Más consultados" | "Vencimientos de OCTUBRE" por terminación de CUIT, con formas de pago por fila | Sin buscador en el inicio |
| ATM Mendoza | Vencimientos y menú por impuesto | Cada impuesto con verbos y su próximo vencimiento | Vencimientos como rangos; institucional en el inicio |
| AGIP | "Cómo obtener mi boleta" + buscador | Pagos / Vencimientos / Trámites; alerta de estafas | SPA vacía sin JS; agenda mensual sin "lo próximo" |
| ARBA | Banner de vencimiento con botón "Ingresá para pagarla" | Buscador de trámites | Noticias antes que pagar; ~1.330 palabras |
| DGR Tucumán | Menú denso + "Accesos más utilizados" | Pagar sin boleta con padrón | ~1.030 palabras; avisos en mayúsculas |
| DGR Salta / API Santa Fe | Clave fiscal / lista de 14 enlaces | Tira de fechas (Salta); buscador (Santa Fe) | Pagar sin clave queda 10.º de 10; ninguna tarea primero |

**Patrones ya probados:** (1) arrancar por el verbo, pagar sin cuenta eligiendo impuesto y luego identificador; (2) próximos vencimientos, no un calendario, con la forma de pago al lado; (3) buscador en lenguaje de la persona + lista corta de lo más consultado.

**Lo que nadie resuelve:** que el sistema se cae en el vencimiento (CPCE Córdoba, 06/02/2025: https://web.cpcecba.org.ar/rentas-el-cpce-cordoba-notifica-problemas-en-el-sitio-web-del-organismo/; ARCA 30/07/2025: blogdelcontador news-46042) — ningún portal muestra el estado del servicio ni ofrece un plan B; un camino con ayuda para quien no se maneja solo; "¿cómo obtengo mi boleta?" cuando se elimina el papel (AGIP, desde 30/04/2026).

## El dato que cambia la conversación

La queja mejor documentada no la escriben los usuarios: **la escribe Rentas en sus resoluciones**, al prorrogar vencimientos por fallas propias. El rediseño no compite por estética sino por **confiabilidad visible**: decir el estado del servicio, la próxima fecha y qué hacer si el sistema no responde.

## Fuentes

- Usuarios: ~20 fuentes de ~25 búsquedas (5 medios locales, 8 documentos oficiales, 1 sitio profesional, 5 directorios de reseñas con 403 o sin reseñas). Reseñas directas casi inexistentes: la queja del contribuyente termina en canales propios (0800, WhatsApp, TuBOT). Para saber más hacen falta datos de Rentas (motivos de contacto, registros del bot).
- Competencia: 15 páginas oficiales renderizadas, 5 de prensa o entidades profesionales, 1 anuncio oficial de CABA. Sin reseñas de tiendas.
- Sitio actual: medición directa con Playwright en 390 y 1440 (4 páginas). Faltó: pasos después de "Buscar" en el Inmobiliario (requieren CUIT real) y el menú móvil.
- Lo marcado como inferencia u opinión no es hecho.
