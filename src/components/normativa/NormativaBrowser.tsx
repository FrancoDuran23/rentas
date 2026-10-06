import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router";
import { ArrowUpRight, Search, X } from "lucide-react";
import clsx from "clsx";
import type { Norma } from "../../data/types";
import { Button, chipClass, chipRowClass, revelarChip } from "../ui/Button";
import { SmartLink } from "../ui/primitives";
import { Highlight } from "./bits";
import {
  byRecency,
  matchesTerms,
  normaLabel,
  queryTerms,
  temaDeParam,
  temaInfo,
  TEMAS,
  tipoDeParam,
  tipoInfo,
  TIPOS,
} from "./utils";

/**
 * Buscador de normas: texto libre (sin tildes), filtros por tipo y tema
 * sincronizados con la URL (?q=&tipo=&tema=) y resultados en una tabla
 * que en pantallas chicas se apila en filas.
 */
export function NormativaBrowser({ normas }: { normas: Norma[] }) {
  const [params, setParams] = useSearchParams();
  const inputId = useId();
  const hintId = useId();
  const q = params.get("q") ?? "";
  const tipo = tipoDeParam(params.get("tipo") ?? "");
  const tema = temaDeParam(params.get("tema") ?? "");

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true, preventScrollReset: true });
  };
  const clearAll = () => setParams(new URLSearchParams(), { replace: true, preventScrollReset: true });

  // Tras tocar un chip, el conteo tiene que quedar a la vista: si quedó debajo
  // del borde inferior de la pantalla, lo acercamos lo justo. Se mide después
  // del render, cuando ya apareció (o no) "Limpiar filtros" en la misma fila.
  const conteoRef = useRef<HTMLDivElement>(null);
  const revelarConteo = useRef(false);
  const filtrar = (key: "tipo" | "tema", value: string | null) => {
    revelarConteo.current = ((key === "tipo" ? tipo?.id : tema?.id) ?? null) !== value;
    update(key, value);
  };

  const terms = useMemo(() => queryTerms(q), [q]);

  useEffect(() => {
    if (!revelarConteo.current) return;
    revelarConteo.current = false;
    const el = conteoRef.current;
    if (el && el.getBoundingClientRect().bottom > window.innerHeight) el.scrollIntoView({ block: "nearest" });
  }, [tipo, tema]);

  const { results, tipoCounts, temaCounts } = useMemo(() => {
    const base = normas.filter((n) => matchesTerms(n, terms));
    const tipoCounts = new Map<string, number>();
    const temaCounts = new Map<string, number>();
    for (const n of base) {
      if (!tema || n.tema === tema.id) tipoCounts.set(n.tipo, (tipoCounts.get(n.tipo) ?? 0) + 1);
      if (!tipo || n.tipo === tipo.tipo) temaCounts.set(n.tema, (temaCounts.get(n.tema) ?? 0) + 1);
    }
    const results = base
      .filter((n) => (!tipo || n.tipo === tipo.tipo) && (!tema || n.tema === tema.id))
      .sort(byRecency);
    return { results, tipoCounts, temaCounts };
  }, [normas, terms, tipo, tema]);

  const hasFilters = Boolean(q.trim() || tipo || tema);

  // Primero las más recientes; el resto, detrás de un gesto. Cambiar la búsqueda o un filtro vuelve a plegar.
  const clave = `${q}|${tipo?.id ?? ""}|${tema?.id ?? ""}`;
  const [abiertaPara, setAbiertaPara] = useState<string | null>(null);
  const verTodas = abiertaPara === clave;
  const visibles = verTodas ? results : results.slice(0, VISIBLES);
  const restantes = results.length - visibles.length;
  const tbodyRef = useRef<HTMLTableSectionElement>(null);
  const mostrarTodas = () => {
    setAbiertaPara(clave);
    // El foco pasa a la primera norma que apareció (el botón desaparece).
    requestAnimationFrame(() => tbodyRef.current?.rows[VISIBLES]?.querySelector<HTMLElement>("a, [tabindex]")?.focus());
  };
  const sumTipo = [...tipoCounts.values()].reduce((a, b) => a + b, 0);
  const sumTema = [...temaCounts.values()].reduce((a, b) => a + b, 0);

  return (
    <div>
      <form role="search" aria-label="Buscar normas" onSubmit={(e) => e.preventDefault()} className="max-w-2xl">
        <label htmlFor={inputId} className="block font-semibold text-ink">
          Buscá por número, título o tema
        </label>
        <p id={hintId} className="mt-0.5 text-sm text-ink-3">
          Por ejemplo: 1767, facilidades o sellos.
        </p>
        <div className="relative mt-2">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-ink-3"
            aria-hidden="true"
          />
          <input
            id={inputId}
            type="search"
            value={q}
            onChange={(e) => update("q", e.target.value)}
            aria-describedby={hintId}
            autoComplete="off"
            spellCheck={false}
            className="h-12 w-full min-w-0 rounded-lg border border-ink-3 bg-surface pr-3 pl-11 text-base text-ink placeholder:text-ink-3 sm:h-13 sm:text-lg"
          />
        </div>
      </form>

      <div className="mt-6 grid gap-5">
        <fieldset className="min-w-0">
          <legend className="mb-2 text-sm font-semibold text-ink">Tipo de norma</legend>
          <div className={chipRowClass}>
            <Chip active={!tipo} count={sumTipo} onClick={() => filtrar("tipo", null)}>
              Todos
            </Chip>
            {TIPOS.map((t) => (
              <Chip
                key={t.id}
                active={tipo?.id === t.id}
                count={tipoCounts.get(t.tipo) ?? 0}
                onClick={() => filtrar("tipo", tipo?.id === t.id ? null : t.id)}
              >
                {t.label}
              </Chip>
            ))}
          </div>
        </fieldset>
        <fieldset className="min-w-0">
          <legend className="mb-2 text-sm font-semibold text-ink">Tema</legend>
          <div className={chipRowClass}>
            <Chip active={!tema} count={sumTema} onClick={() => filtrar("tema", null)}>
              Todos
            </Chip>
            {TEMAS.map((t) => (
              <Chip
                key={t.id}
                active={tema?.id === t.id}
                count={temaCounts.get(t.id) ?? 0}
                onClick={() => filtrar("tema", tema?.id === t.id ? null : t.id)}
              >
                {t.label}
              </Chip>
            ))}
          </div>
        </fieldset>
      </div>

      <div ref={conteoRef} className="mt-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p role="status" aria-live="polite" aria-atomic="true" className="text-ink-2">
          <span className="font-semibold text-ink tabular">{results.length}</span>{" "}
          {results.length === 1 ? "norma" : "normas"}
          {hasFilters ? (
            <>
              {" "}
              de <span className="tabular">{normas.length}</span>
            </>
          ) : null}
          {q.trim() ? (
            <>
              {" "}
              para “<span className="text-ink [overflow-wrap:anywhere]">{q.trim()}</span>”
            </>
          ) : null}
          {/* El orden ya lo dice el caption de la tabla; en móvil la frase partía la línea. */}
          {results.length > 1 ? (
            <span className="text-ink-3 max-sm:hidden"> · de la más reciente a la más antigua</span>
          ) : null}
        </p>
        {hasFilters ? (
          <Button variant="secondary" size="sm" onClick={clearAll}>
            <X aria-hidden="true" />
            Limpiar filtros
          </Button>
        ) : null}
      </div>

      {results.length ? (
        <>
          <table role="table" className="mt-4 block w-full text-left md:table">
            <caption className="sr-only">Normas, de la más reciente a la más antigua</caption>
            <thead role="rowgroup" className="max-md:sr-only">
              <tr role="row">
                <th role="columnheader" scope="col" className={clsx(TH, "md:w-[11rem]")}>
                  Norma
                </th>
                <th role="columnheader" scope="col" className={TH}>
                  Título
                </th>
                <th role="columnheader" scope="col" className={clsx(TH, "md:w-[8.5rem]")}>
                  Tema
                </th>
                <th role="columnheader" scope="col" className={clsx(TH, "md:w-[7.5rem] md:pr-0")}>
                  Fuente
                </th>
              </tr>
            </thead>
            <tbody ref={tbodyRef} role="rowgroup" className="block border-b border-line md:table-row-group">
              {visibles.map((n) => (
                <NormaRow key={n.tipo + n.numero + n.anio} norma={n} terms={terms} />
              ))}
            </tbody>
          </table>
          {restantes > 0 ? (
            <Button variant="secondary" className="mt-5" onClick={mostrarTodas}>
              Ver {restantes} {restantes === 1 ? "norma más" : "normas más"}
            </Button>
          ) : null}
          <p className="mt-4 text-sm text-ink-3">Selección de referencia: cada enlace abre su sección oficial.</p>
        </>
      ) : (
        <div className="mt-4 border-y border-line py-10">
          <h3 className="text-lg font-bold text-ink">No encontramos normas con esos filtros</h3>
          <p className="mt-2 text-ink-2">Probá otras palabras, revisá el número o limpiá los filtros.</p>
          {hasFilters ? (
            <Button variant="secondary" className="mt-5" onClick={clearAll}>
              <X aria-hidden="true" />
              Limpiar filtros
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}

/** Normas visibles antes de "Ver N normas más". */
const VISIBLES = 6;

const TH = "border-b border-line-strong pb-3 pr-6 align-bottom text-sm font-semibold text-ink-2";
const TD = "md:table-cell md:border-t md:border-line md:py-4 md:pr-6 md:align-top";

function NormaRow({ norma: n, terms }: { norma: Norma; terms: string[] }) {
  const tipo = tipoInfo(n.tipo).label;
  const numero = `N.º ${n.numero}/${n.anio}`;
  return (
    <tr
      role="row"
      className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-1 border-t border-line py-4 md:table-row md:py-0"
    >
      <td role="cell" className={clsx(TD, "col-span-2 text-sm md:text-base")}>
        <span className="font-semibold text-ink">
          <Highlight text={tipo} terms={terms} />
        </span>
        <span aria-hidden="true" className="text-ink-3 md:hidden">
          {" · "}
        </span>
        <span className="whitespace-nowrap text-ink-2 tabular md:block md:text-sm md:text-ink-3">
          <Highlight text={numero} terms={terms} />
        </span>
      </td>
      <td role="cell" className={clsx(TD, "col-span-2 text-ink")}>
        <Highlight text={n.titulo} terms={terms} />
      </td>
      <td role="cell" className={clsx(TD, "mt-1 text-sm text-ink-3 md:mt-0 md:text-[0.95rem] md:text-ink-2")}>
        <Highlight text={temaInfo(n.tema).label} terms={terms} />
      </td>
      <td role="cell" className={clsx(TD, "mt-1 text-sm md:mt-0 md:pr-0 md:text-[0.95rem]")}>
        {n.href ? (
          <SmartLink to={n.href} className="link hit whitespace-nowrap font-semibold">
            <span className="sr-only">{normaLabel(n)} en el </span>
            Sitio oficial
            <ArrowUpRight className="ml-1 inline size-4 align-[-2px]" aria-hidden="true" />
          </SmartLink>
        ) : (
          <span className="text-ink-3">Sin enlace</span>
        )}
      </td>
    </tr>
  );
}

function Chip({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean;
  count: number;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      onFocus={revelarChip}
      className={chipClass(active, "gap-2")}
    >
      {children}
      <span className={clsx("text-sm tabular", active ? "text-bg/75" : "text-ink-3")}>
        <span className="sr-only">(</span>
        {count}
        <span className="sr-only">)</span>
      </span>
    </button>
  );
}
