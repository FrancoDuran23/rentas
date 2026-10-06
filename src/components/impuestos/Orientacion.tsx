import { getImpuesto } from "../../data/impuestos";
import { ArrowLink, Disclosure } from "../ui/primitives";

/**
 * Situaciones cotidianas → impuesto que corresponde, plegadas detrás de la
 * pregunta. Las que apuntan a un impuesto que no está en IMPUESTOS no se muestran.
 */
const SITUACIONES: { texto: string; slug: string }[] = [
  { texto: "Tengo una casa, un departamento o un terreno", slug: "inmobiliario" },
  { texto: "Tengo un comercio o presto servicios", slug: "ingresos-brutos" },
  { texto: "Firmé un contrato, como un alquiler o una compraventa", slug: "sellos" },
  { texto: "Voy a iniciar un juicio", slug: "tasas" },
  { texto: "Tengo una explotación minera", slug: "minerales" },
];

export function Orientacion({ className }: { className?: string }) {
  const items = SITUACIONES.flatMap((s) => {
    const imp = getImpuesto(s.slug);
    return imp ? [{ texto: s.texto, imp }] : [];
  });
  if (!items.length) return null;

  return (
    <div className={className}>
      <div className="border-t border-line">
        <Disclosure summary="¿No sabés qué impuesto te corresponde?">
          <ul className="grid gap-4">
            {items.map(({ texto, imp }) => (
              <li key={imp.slug} className="min-w-0">
                <p className="text-ink">{texto}</p>
                <p className="mt-1">
                  <ArrowLink to={`/impuestos/${imp.slug}`}>
                    <span className="sr-only">Te corresponde: </span>
                    {imp.nombre}
                  </ArrowLink>
                </p>
              </li>
            ))}
          </ul>
        </Disclosure>
      </div>
    </div>
  );
}
