import { CalendarCheck } from "lucide-react";
import { PORTAL } from "../../data/contacto";
import { ButtonLink } from "../ui/Button";
import { ArrowLink, Disclosure, SectionHeader } from "../ui/primitives";

const PASOS = [
  "Revisá si tu trámite se hace en línea.",
  "Sacá turno web: oficina, día y horario. Sin clave fiscal.",
  "Presentate con la documentación que pida el trámite.",
];

export function Turnos({ id }: { id: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="border-y border-line bg-surface-2">
      <div className="container-page py-14 sm:py-16">
        <SectionHeader id={`${id}-titulo`} title="Turnos presenciales" />
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
          <ButtonLink to={PORTAL.turnos.href} size="lg">
            <CalendarCheck aria-hidden="true" />
            Sacar turno web
          </ButtonLink>
          <ArrowLink to="/tramites?online=1">Trámites en línea</ArrowLink>
        </div>
        <div className="mt-6 max-w-2xl">
          <Disclosure summary="Pasos antes de ir">
            <ol className="list-decimal space-y-2 pl-5">
              {PASOS.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ol>
          </Disclosure>
        </div>
      </div>
    </section>
  );
}
