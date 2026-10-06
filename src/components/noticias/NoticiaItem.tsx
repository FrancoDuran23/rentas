import { useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import clsx from "clsx";
import type { Noticia } from "../../data/types";
import { parseISODate } from "../../lib/dates";
import { ArrowLink, SmartLink } from "../ui/primitives";
import { categoriaRelacionada, hostDe } from "./categorias";

const fmtDiaMes = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long" });

/** Fondo suave detrás del elemento al que se llega por /noticias#slug. */
export const RESALTADO =
  "before:absolute before:-inset-x-3 before:inset-y-0 before:-z-10 before:rounded-lg before:bg-brand-soft sm:before:-inset-x-4";

/**
 * Una noticia del archivo: fecha, categoría y título a la vista; el resumen y
 * el enlace a la nota oficial (o a un trámite relacionado) se despliegan con
 * el título (acordeón con encabezado y botón, patrón GOV.UK). Si se llega por
 * /noticias#slug, arranca abierta. Sin destino no hay enlace: nunca un enlace muerto.
 */
export function NoticiaItem({ noticia: n, highlighted = false }: { noticia: Noticia; highlighted?: boolean }) {
  const relacionado = n.href ? undefined : categoriaRelacionada(n.categoria);
  const [abierta, setAbierta] = useState(highlighted);
  const panelId = `${n.slug}-resumen`;
  return (
    <li
      id={n.slug}
      className={clsx("relative isolate scroll-mt-28 border-t border-line py-5", highlighted && RESALTADO)}
    >
      <p className="text-sm text-ink-3">
        {/* El mes y el año ya los dice el encabezado del grupo. */}
        <time dateTime={n.fecha}>{fmtDiaMes.format(parseISODate(n.fecha))}</time> ·{" "}
        <span className="sr-only">Categoría: </span>
        {n.categoria}
      </p>
      <h3 className="mt-1 text-lg leading-snug font-semibold text-ink">
        <button
          type="button"
          aria-expanded={abierta}
          aria-controls={panelId}
          onClick={() => setAbierta((v) => !v)}
          className="group flex w-full cursor-pointer items-start justify-between gap-4 rounded-sm text-left hover:text-brand"
        >
          {n.titulo}
          <ChevronDown
            className={clsx(
              "mt-1 size-5 shrink-0 text-ink-3 transition-transform motion-reduce:transition-none",
              abierta && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>
      </h3>
      <div id={panelId} hidden={!abierta}>
        <p className="prose-measure mt-1.5 text-ink-2">{n.resumen}</p>
        {n.href ? (
          <p className="mt-3">
            <SmartLink to={n.href} className="link font-semibold">
              Leer la nota en {hostDe(n.href)}
              <span className="sr-only">: {n.titulo}</span>
              <ArrowUpRight className="ml-1 inline size-4 align-[-2px]" aria-hidden="true" />
            </SmartLink>
          </p>
        ) : relacionado ? (
          <p className="mt-3">
            <ArrowLink to={relacionado.to}>{relacionado.label}</ArrowLink>
          </p>
        ) : null}
      </div>
    </li>
  );
}
