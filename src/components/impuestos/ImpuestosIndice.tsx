import { Link } from "react-router";
import { IMPUESTOS } from "../../data/impuestos";

/**
 * Índice de impuestos como lista con reglas de 1px: nombre y a quién alcanza.
 * Quiénes pagan, trámites y vencimientos viven en la página de cada impuesto.
 */
export function ImpuestosIndice() {
  return (
    <ul aria-label="Impuestos provinciales" className="border-b border-line">
      {IMPUESTOS.map((imp) => (
        <li key={imp.slug} className="border-t border-line py-5 sm:py-6">
          <h2 className="text-xl font-bold">
            <Link to={`/impuestos/${imp.slug}`} className="link">
              {imp.nombre}
            </Link>
          </h2>
          <p className="prose-measure mt-1.5 text-ink-2">{imp.bajada}</p>
        </li>
      ))}
    </ul>
  );
}
