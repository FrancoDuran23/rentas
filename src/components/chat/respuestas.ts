import { CONTACTO } from "../../data/contacto";
import { LINKS } from "../../data/site";
import { TRAMITES } from "../../data/tramites";
import { VENCIMIENTOS, VENCIMIENTOS_INFO } from "../../data/vencimientos";
import { countdownLabel, daysBetween, formatShort, parseISODate, today } from "../../lib/dates";
import { normalize, searchTramites } from "../../lib/search";

export type SugerenciaId = "inmobiliario" | "vencimientos" | "libre-deuda" | "plan-pagos" | "persona";

export const SUGERENCIAS_RAPIDAS: { id: SugerenciaId; label: string }[] = [
  { id: "inmobiliario", label: "Pagar el Inmobiliario" },
  { id: "vencimientos", label: "Próximos vencimientos" },
  { id: "libre-deuda", label: "Libre deuda" },
  { id: "plan-pagos", label: "Plan de pagos" },
  { id: "persona", label: "Hablar con una persona" },
];

export type EnlaceRespuesta = { to: string; label: string };

export type TramiteSugerido = { id: string; titulo: string; href: string };

export type RespuestaTuBot = {
  cuerpo: string;
  enlaces?: EnlaceRespuesta[];
  tramites?: TramiteSugerido[];
  mostrarSugerencias?: boolean;
};

const tramiteById = (id: string) => TRAMITES.find((t) => t.id === id);

function incluye(normalizado: string, ...palabras: string[]): boolean {
  return palabras.some((p) => normalizado.includes(normalize(p)));
}

function proximosVencimientos(max = 6) {
  const hoy = today();
  return VENCIMIENTOS.filter((v) => daysBetween(hoy, parseISODate(v.fecha)) >= 0)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(0, max);
}

function respuestaInmobiliario(): RespuestaTuBot {
  const t = tramiteById("inmobiliario-pagar");
  return {
    cuerpo:
      "Podés consultar y pagar el Impuesto Inmobiliario con el padrón del inmueble o el CUIT del titular, sin clave fiscal. También podés ver el detalle del impuesto en este sitio.",
    enlaces: [
      { to: t?.href ?? LINKS.inmobiliarioSinClave, label: "Consultar y pagar en la web oficial" },
      { to: "/impuestos/inmobiliario", label: "Información del Inmobiliario" },
    ],
    mostrarSugerencias: true,
  };
}

function respuestaVencimientos(): RespuestaTuBot {
  const lista = proximosVencimientos();
  if (!lista.length) {
    return {
      cuerpo:
        "No tengo vencimientos próximos cargados en este sitio. Las fechas del calendario impositivo son orientativas: antes de pagar, verificá en el calendario oficial.",
      enlaces: [
        { to: "/vencimientos", label: "Calendario de vencimientos" },
        { to: VENCIMIENTOS_INFO.oficial, label: "Calendario oficial" },
      ],
      mostrarSugerencias: true,
    };
  }

  const lineas = lista.map((v) => {
    const cuenta = countdownLabel(v.fecha);
    const det = v.detalle ? ` · ${v.detalle}` : "";
    return `· ${formatShort(v.fecha)} (${cuenta}): ${v.titulo}${det}`;
  });

  const orientativo = VENCIMIENTOS_INFO.ilustrativo
    ? `Estas fechas son orientativas (basadas en el Calendario Impositivo 2026, ${VENCIMIENTOS_INFO.norma}). Antes de pagar, confirmalas en el calendario oficial.\n\n`
    : "";

  return {
    cuerpo: `${orientativo}Próximos vencimientos que figuran en este sitio:\n\n${lineas.join("\n")}`,
    enlaces: [
      { to: "/vencimientos", label: "Ver calendario completo" },
      { to: VENCIMIENTOS_INFO.oficial, label: "Calendario oficial" },
    ],
    mostrarSugerencias: true,
  };
}

function respuestaLibreDeuda(): RespuestaTuBot {
  const t = tramiteById("certificado-pago");
  return {
    cuerpo:
      "El Certificado de Pago (libre deuda) acredita que un inmueble no registra deuda del Impuesto Inmobiliario. Se tramita por la web con clave fiscal.",
    enlaces: t ? [{ to: t.href, label: t.titulo }] : [{ to: LINKS.login, label: "Ingresar con clave fiscal" }],
    tramites: t ? [{ id: t.id, titulo: t.titulo, href: t.href }] : undefined,
    mostrarSugerencias: true,
  };
}

function respuestaPlanPagos(): RespuestaTuBot {
  const t = tramiteById("plan-pagos");
  return {
    cuerpo:
      "Los planes de facilidades de pago te permiten regularizar deudas de Ingresos Brutos, Inmobiliario, Sellos, tasas y multas en cuotas. El trámite se gestiona en la web con clave fiscal.",
    enlaces: t ? [{ to: t.href, label: t.titulo }] : [{ to: LINKS.facilidades, label: "Planes de facilidades" }],
    tramites: t ? [{ id: t.id, titulo: t.titulo, href: t.href }] : undefined,
    mostrarSugerencias: true,
  };
}

function respuestaPersona(): RespuestaTuBot {
  return {
    cuerpo: `Este chat es una demostración del sitio. Para hablar con un operador del Centro de Atención Omnicanal, usá los canales oficiales:\n\n· Línea gratuita: ${CONTACTO.telefono.valor}\n· WhatsApp: ${CONTACTO.whatsapp.valor}\n· Correo: ${CONTACTO.email.valor}\n\nTambién podés ver horarios y delegaciones en Atención al contribuyente.`,
    enlaces: [
      { to: CONTACTO.telefono.href, label: `Llamar al ${CONTACTO.telefono.valor}` },
      { to: CONTACTO.whatsapp.href, label: "Escribir por WhatsApp" },
      { to: CONTACTO.email.href, label: "Enviar correo" },
      { to: "/atencion", label: "Atención y oficinas" },
    ],
    mostrarSugerencias: true,
  };
}

function respuestaDesdeTramites(consulta: string): RespuestaTuBot | null {
  const hits = searchTramites(TRAMITES, consulta, 3);
  if (!hits.length) return null;
  const lineas = hits.map((t) => `· ${t.titulo}`);
  return {
    cuerpo: `Encontré estos trámites relacionados con tu consulta:\n\n${lineas.join("\n")}`,
    tramites: hits.map((t) => ({ id: t.id, titulo: t.titulo, href: t.href })),
    enlaces: [{ to: `/tramites?q=${encodeURIComponent(consulta.trim())}`, label: "Buscar más trámites" }],
    mostrarSugerencias: true,
  };
}

function clasificarIntento(normalizado: string): RespuestaTuBot | null {
  if (
    incluye(
      normalizado,
      "operador",
      "persona",
      "humano",
      "hablar",
      "llamar",
      "telefono",
      "whatsapp",
      "correo",
      "atencion",
    )
  ) {
    return respuestaPersona();
  }
  if (incluye(normalizado, "vencimiento", "vence", "calendario", "fecha", "proximo", "plazo", "cuando pago")) {
    return respuestaVencimientos();
  }
  if (incluye(normalizado, "libre deuda", "certificado", "escribano", "escritura")) {
    return respuestaLibreDeuda();
  }
  if (incluye(normalizado, "plan", "facilidades", "cuotas", "moratoria", "regularizar", "financiacion")) {
    return respuestaPlanPagos();
  }
  if (
    incluye(
      normalizado,
      "inmobiliario",
      "inmueble",
      "padron",
      "casa",
      "terreno",
      "pagar inmobiliario",
      "impuesto inmobiliario",
    ) ||
    (incluye(normalizado, "pagar", "pago", "boleta") && incluye(normalizado, "casa", "inmueble", "padron"))
  ) {
    return respuestaInmobiliario();
  }
  if (incluye(normalizado, "pagar", "pago") && !incluye(normalizado, "plan", "facilidades")) {
    const pagar = tramiteById("pagar");
    if (pagar) {
      return {
        cuerpo: `${pagar.descripcion}\n\nSi buscás el Inmobiliario sin clave fiscal, también te lo indico con gusto.`,
        enlaces: [{ to: pagar.href, label: pagar.titulo }],
        mostrarSugerencias: true,
      };
    }
  }
  return null;
}

export function mensajeSaludo(): RespuestaTuBot {
  return {
    cuerpo:
      "Hola, soy TuBOT en modo demostración. Respondo con la información de este sitio y te indico cómo seguir en los portales oficiales de Rentas Jujuy.\n\nElegí una opción o escribime tu consulta.",
    mostrarSugerencias: true,
  };
}

export function responderSugerencia(id: SugerenciaId): RespuestaTuBot {
  switch (id) {
    case "inmobiliario":
      return respuestaInmobiliario();
    case "vencimientos":
      return respuestaVencimientos();
    case "libre-deuda":
      return respuestaLibreDeuda();
    case "plan-pagos":
      return respuestaPlanPagos();
    case "persona":
      return respuestaPersona();
  }
}

export function responderTexto(entrada: string): RespuestaTuBot {
  const consulta = entrada.trim();
  if (!consulta) {
    return {
      cuerpo: "Escribime en pocas palabras qué necesitás y te oriento con los trámites de este sitio.",
      mostrarSugerencias: true,
    };
  }

  const normalizado = normalize(consulta);
  const directo = clasificarIntento(normalizado);
  if (directo) return directo;

  const desdeTramites = respuestaDesdeTramites(consulta);
  if (desdeTramites) return desdeTramites;

  return {
    cuerpo:
      "No estoy seguro de haber entendido tu consulta en esta demostración. Probá con una de las opciones rápidas, buscá trámites en el buscador del sitio (/) o contame si querés pagar el Inmobiliario, ver vencimientos o hablar con una persona.",
    enlaces: [{ to: "/tramites", label: "Ir a Trámites" }],
    mostrarSugerencias: true,
  };
}
