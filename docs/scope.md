# Alcance — qué hace el producto

> kero-scope · 2026-10-02 · traza a la tesis de `docs/research.md`: la tarea en verbo, a dos toques desde el teléfono, con la próxima fecha a la vista y un plan B cuando el sistema falla.

## Pagar

| Código | Función | Qué hace |
|---|---|---|
| PAG-1 | Pagar sin clave | La persona elige el impuesto y escribe su padrón o CUIT y llega a su boleta, sin cuenta. |
| PAG-2 | Inmobiliario primero | Quien vino a pagar la casa lo encuentra arriba de todo en el teléfono, no cuarto ni a dos pantallas. |
| PAG-3 | Medios de pago por acreditación | La persona sabe qué medio acredita hoy y cuál tarda, antes de elegir. |
| PAG-4 | Cómo obtener mi boleta | Quien no tiene boleta en papel sabe en un paso cómo conseguirla. |

## Saber cuándo vence

| Código | Función | Qué hace |
|---|---|---|
| VEN-1 | Próximos vencimientos | La persona ve las tres fechas que siguen, con qué vence y cómo pagarlo, sin abrir un calendario. |
| VEN-2 | Calendario y recordatorio | La persona agrega sus vencimientos a su propio calendario (.ics). |
| VEN-3 | Vencimiento en cada impuesto | En la página de cada impuesto, su próxima fecha está arriba. |
| VEN-4 | Prórrogas visibles | Cuando Rentas prorroga una fecha, la fecha nueva y la resolución aparecen donde estaba la vieja. |

## Hacer un trámite

| Código | Función | Qué hace |
|---|---|---|
| TRA-1 | Buscador en palabras de la persona | Escribe "libre deuda" o "plan de pagos" y llega al trámite. |
| TRA-2 | Lo más consultado | Una lista corta de los trámites que más se hacen, sin explicar cada uno. |
| TRA-3 | Catálogo de trámites | Todos los trámites filtrables por impuesto y por si piden clave fiscal. |
| TRA-4 | Ingreso con clave fiscal usable en el teléfono | La persona entra con CUIT y clave en un formulario que se lee y se toca en el celular. |
| TRA-5 | Primera clave sin fricción | Quien no tiene clave sabe qué necesita y en qué orden antes de empezar. |

## Que el sistema no me deje a pie

| Código | Función | Qué hace |
|---|---|---|
| EST-1 | Estado del servicio | La persona sabe si el sistema funciona antes de intentar pagar. |
| EST-2 | Plan B el día del vencimiento | Si el sistema no responde, la persona ve qué hacer: otro medio, el canal de ayuda o la prórroga vigente. |

## Pedir ayuda

| Código | Función | Qué hace |
|---|---|---|
| AYU-1 | TuBOT | Responde lo frecuente con la información del sitio y deriva a una persona. |
| AYU-2 | Canales | 0800, WhatsApp, correo y oficinas con horario, a un toque. |
| AYU-3 | Ayuda en el territorio | Quien no se maneja solo encuentra la delegación o "Rentas con Vos" más cercano. |

## Informarse

| Código | Función | Qué hace |
|---|---|---|
| INF-1 | Novedades | Las últimas resoluciones y anuncios con fecha, sin carrusel de imágenes. |
| INF-2 | Normativa | Leyes, decretos y resoluciones buscables. |
| INF-3 | Cada impuesto explicado | Quién paga, cuánto y cómo, en lenguaje llano. |

## Lo que el producto no hace

- **No procesa pagos ni inicia sesión real:** es un front que deriva a los sistemas oficiales (no hay backend). Por eso EST-1 y PAG-1 muestran el camino y el estado, no ejecutan el pago.
- **No ofrece el Impuesto Automotor:** es municipal (Const. de Jujuy, art. 215); redirige.
- **No inventa fechas, montos ni estados:** los vencimientos son orientativos y lo dicen; EST-1 necesita un dato real de Rentas para salir del prototipo.
