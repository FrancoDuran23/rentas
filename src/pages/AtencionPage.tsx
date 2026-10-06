import { PageIntro } from "../components/ui/primitives";
import { Canales } from "../components/atencion/Canales";
import { Turnos } from "../components/atencion/Turnos";
import { Oficinas } from "../components/atencion/Oficinas";
import { RentasConVos } from "../components/atencion/RentasConVos";
import { PagosYRedes } from "../components/atencion/PagosYRedes";
import { Preguntas } from "../components/atencion/Preguntas";
import { useDocumentTitle } from "../lib/useDocumentTitle";

const EN_ESTA_PAGINA = [
  { id: "canales", label: "Canales" },
  { id: "turnos", label: "Turnos" },
  { id: "oficinas", label: "Oficinas" },
  { id: "medios-de-pago", label: "Pagos" },
  { id: "preguntas", label: "Preguntas" },
];

export function AtencionPage() {
  useDocumentTitle("Atención al contribuyente");

  return (
    <>
      <PageIntro title="Atención" breadcrumbs={[{ label: "Atención" }]}>
        <nav aria-label="Secciones de esta página" className="flex flex-wrap gap-x-5 gap-y-2 text-[0.95rem]">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 coarse:gap-y-7">
            {EN_ESTA_PAGINA.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="link font-semibold hit">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageIntro>

      <Canales id="canales" />
      <Turnos id="turnos" />
      <Oficinas id="oficinas" />
      <RentasConVos />
      <PagosYRedes id="medios-de-pago" />
      <Preguntas id="preguntas" />
    </>
  );
}
