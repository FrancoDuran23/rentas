import { Link } from "react-router";
import clsx from "clsx";
import { IMPUESTOS } from "../../data/impuestos";
import { VENCIMIENTOS, VENCIMIENTOS_INFO } from "../../data/vencimientos";
import { daysBetween, parseISODate, today } from "../../lib/dates";
import { ArrowLink, SectionHeader, SmartLink } from "../ui/primitives";
import type { Vencimiento } from "../../data/types";

/* ------------------------------------------------------------------ */
/* Próximos vencimientos                                               */
/* ------------------------------------------------------------------ */

const MES = new Intl.DateTimeFormat("es-AR", { month: "short" });
const DIA = new Intl.DateTimeFormat("es-AR", { weekday: "short" });

const VENC_CORTO: Record<string, string> = {
  "Ingresos Brutos · Régimen Local": "Ingresos Brutos",
  "Monotributo Unificado": "Monotributo",
  "Impuesto Inmobiliario": "Inmobiliario",
};

function proximasTresFechas(): { fecha: string; items: Vencimiento[] }[] {
  const hoy = today();
  const futuros = VENCIMIENTOS.filter((v) => daysBetween(hoy, parseISODate(v.fecha)) >= 0).sort((a, b) =>
    a.fecha.localeCompare(b.fecha),
  );
  const porFecha = new Map<string, Vencimiento[]>();
  for (const v of futuros) {
    const lista = porFecha.get(v.fecha) ?? [];
    lista.push(v);
    porFecha.set(v.fecha, lista);
  }
  return [...porFecha.keys()]
    .slice(0, 3)
    .map((fecha) => ({ fecha, items: (porFecha.get(fecha) ?? []).slice(0, 2) }));
}

export function ProximosVencimientos() {
  const grupos = proximasTresFechas();

  return (
    <section aria-labelledby="venc-titulo" className="container-page pb-14 sm:pb-16">
      <SectionHeader id="venc-titulo" title="Próximos vencimientos" />
      {grupos.length ? (
        <div className="mt-6 grid gap-8 md:grid-cols-3 md:gap-0">
          {grupos.map((g, index) => {
            const d = parseISODate(g.fecha);
            return (
              <div
                key={g.fecha}
                className={clsx("min-w-0", index > 0 && "md:border-l md:border-line md:pl-8")}
              >
                <time dateTime={g.fecha} className="block leading-none">
                  <span className="text-5xl font-bold tabular text-ink">{d.getDate()}</span>
                  <span className="mt-2 block text-sm font-semibold uppercase text-ink-3">
                    {MES.format(d).replace(".", "")} · {DIA.format(d).replace(".", "")}
                  </span>
                </time>
                <ul className="mt-4 space-y-2 coarse:space-y-7">
                  {g.items.map((v) => {
                    const imp = IMPUESTOS.find((i) => i.slug === v.impuesto);
                    const label = VENC_CORTO[v.titulo] ?? v.titulo;
                    return (
                      <li key={v.titulo + v.detalle}>
                        {imp ? (
                          <Link to={`/impuestos/${imp.slug}`} className="link hit text-[0.95rem] text-ink-2">
                            {label}
                          </Link>
                        ) : (
                          <span className="text-[0.95rem] text-ink-2">{label}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-6 text-ink-3">No hay vencimientos cargados para las próximas semanas.</p>
      )}
      {VENCIMIENTOS_INFO.ilustrativo ? (
        <p className="mt-6 text-sm text-ink-3">
          Fechas orientativas. Confirmalas en el{" "}
          <SmartLink to={VENCIMIENTOS_INFO.oficial} className="link hit">
            calendario oficial
          </SmartLink>
          .
        </p>
      ) : null}
      <p className="mt-4 coarse:mt-8">
        <ArrowLink to="/vencimientos">Calendario completo</ArrowLink>
      </p>
    </section>
  );
}
