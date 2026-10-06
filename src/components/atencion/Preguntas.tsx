import type { ReactNode } from "react";
import { Link } from "react-router";
import { CANALES, CONTACTO, OFICINAS, PORTAL } from "../../data/contacto";
import { Disclosure, SectionHeader, SmartLink } from "../ui/primitives";

function buildPreguntas(): { pregunta: string; respuesta: ReactNode }[] {
  const central = OFICINAS.find((o) => o.casaCentral);
  const bot = CANALES.find((c) => c.id === "tubot");

  return [
    {
      pregunta: "¿Necesito turno para ir?",
      respuesta: (
        <>
          Sí. Sacá turno en{" "}
          <SmartLink to={PORTAL.turnos.href} className="link">
            Turnos web
          </SmartLink>
          : día y horario, sin clave fiscal.
        </>
      ),
    },
    {
      pregunta: "¿Puedo pagar sin clave fiscal?",
      respuesta: (
        <>
          Sí, en varios casos. Inmobiliario con padrón o CUIT (también por WhatsApp con TuBOT); algunas tasas sin clave.{" "}
          <Link to="/tramites?q=sin%20clave" className="link">
            Trámites sin clave fiscal
          </Link>
          .
        </>
      ),
    },
    {
      pregunta: "¿En qué horario atienden?",
      respuesta: (
        <>
          {central?.horario ? (
            <>
              {central.nombre}: {central.horario.charAt(0).toLowerCase() + central.horario.slice(1)}.{" "}
            </>
          ) : null}
          {bot?.horario ? <>TuBOT: {bot.horario.toLowerCase()}. </> : null}
          Cada delegación puede variar: confirmá en el sitio oficial.
        </>
      ),
    },
    {
      pregunta: "¿Consulta o reclamo?",
      respuesta: (
        <>
          Centro de Atención Omnicanal:{" "}
          <a href={CONTACTO.telefono.href} className="link tabular">
            {CONTACTO.telefono.valor}
          </a>
          , WhatsApp{" "}
          <SmartLink to={CONTACTO.whatsapp.href} className="link tabular">
            {CONTACTO.whatsapp.valor}
          </SmartLink>
          , correo{" "}
          <a href={CONTACTO.email.href} className="link [overflow-wrap:anywhere]">
            {CONTACTO.email.valor}
          </a>
          .
        </>
      ),
    },
  ];
}

export function Preguntas({ id }: { id: string }) {
  const preguntas = buildPreguntas();

  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="border-t border-line">
      <div className="container-page py-14 sm:py-16">
        <SectionHeader id={`${id}-titulo`} title="Preguntas frecuentes" />
        <div className="mt-6 max-w-3xl border-t border-line">
          {preguntas.map((q) => (
            <Disclosure key={q.pregunta} summary={q.pregunta}>
              <p>{q.respuesta}</p>
            </Disclosure>
          ))}
        </div>
      </div>
    </section>
  );
}
