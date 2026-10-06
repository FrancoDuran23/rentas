import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, CreditCard, Pause, Play, Smartphone } from "lucide-react";
import clsx from "clsx";
import { OFFICIAL_URL } from "../../data/site";
import { ButtonLink, FOCO_CON_RING } from "../ui/Button";

/**
 * Los avisos del carrusel del sitio oficial (relevados el 2026-10-02, con sus
 * enlaces oficiales), como texto real en lugar de imágenes con texto. Patrón de
 * carrusel de WAI-ARIA: anterior/siguiente, indicadores, "n de 5", avance
 * automático de 7 s con botón de pausa (WCAG 2.2.2) que también se detiene con
 * el puntero encima o el foco adentro; con movimiento reducido, ni avanza solo
 * ni se anima.
 */
interface Aviso {
  titulo: string;
  linea: string;
  dato?: { valor: string; unidad: string };
  icon: ReactNode;
  cta: string;
  href: string;
}

const AVISOS: Aviso[] = [
  {
    titulo: "Régimen permanente de facilidades de pago",
    linea: "Regularizar ahora es más simple.",
    dato: { valor: "36", unidad: "cuotas en Ingresos Brutos" },
    icon: <CreditCard aria-hidden="true" />,
    cta: "Ver el régimen",
    href: `${OFFICIAL_URL}/regimen-permanente-de-facilidades-de-pago/`,
  },
  {
    titulo: "Débito automático para el Inmobiliario mensual",
    linea: "Nuevo servicio web: adherí y no te olvides de pagar.",
    icon: <CreditCard aria-hidden="true" />,
    cta: "Adherir",
    href: `${OFFICIAL_URL}/adhesion-debito-automatico-impuesto-inmobiliario-mensual/`,
  },
  {
    titulo: "Vencimientos 2026",
    linea: "Las próximas fechas, por impuesto.",
    icon: <CalendarDays aria-hidden="true" />,
    cta: "Ver vencimientos",
    href: "/vencimientos",
  },
  {
    titulo: "Pagá con la app de Mercado Pago",
    linea: "Tus impuestos desde el celular.",
    icon: <Smartphone aria-hidden="true" />,
    cta: "Cómo pagar",
    href: `${OFFICIAL_URL}/mercado-pago-app/`,
  },
  {
    titulo: "Nuevo horario en Casa Central",
    linea: "Atención presencial de lunes a viernes, de 7:30 a 15:30.",
    icon: <Clock aria-hidden="true" />,
    cta: "Ver el horario",
    href: `${OFFICIAL_URL}/nuevo-horario-de-atencion-presencial-casa-central/`,
  },
];

const INTERVALO = 7000;

export function Carrusel() {
  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(false); // pausa elegida por la persona
  const [enEspera, setEnEspera] = useState(false); // puntero encima o foco adentro
  const [reducido, setReducido] = useState(false);
  const [dir, setDir] = useState<1 | -1>(1);
  const [anunciar, setAnunciar] = useState(false); // sólo se anuncia lo que la persona cambió
  const inicioToque = useRef<number | null>(null);
  const total = AVISOS.length;

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducido(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const ir = useCallback(
    (i: number, d: 1 | -1, porPersona: boolean) => {
      setDir(d);
      setAnunciar(porPersona);
      setActual((i + total) % total);
    },
    [total],
  );

  const corriendo = !pausado && !enEspera && !reducido;
  useEffect(() => {
    if (!corriendo) return;
    const t = window.setTimeout(() => ir(actual + 1, 1, false), INTERVALO);
    return () => window.clearTimeout(t);
  }, [corriendo, actual, ir]);

  const aviso = AVISOS[actual]!;

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") inicioToque.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (inicioToque.current === null) return;
    const dx = e.clientX - inicioToque.current;
    inicioToque.current = null;
    if (Math.abs(dx) > 48) ir(actual + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1, true);
  };

  const control = clsx(
    "inline-flex size-10 items-center justify-center rounded-full bg-surface text-ink ring-1 ring-line-strong ring-inset transition-colors hover:bg-surface-2 coarse:size-11 [&_svg]:size-5",
    FOCO_CON_RING,
  );

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Avisos de Rentas"
      className="container-page pt-10 sm:pt-14"
      onMouseEnter={() => setEnEspera(true)}
      onMouseLeave={() => setEnEspera(false)}
      onFocus={() => setEnEspera(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setEnEspera(false);
      }}
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-line bg-surface-2 touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (inicioToque.current = null)}
      >
        <div aria-live={anunciar ? "polite" : "off"} aria-atomic="true">
          <div
            key={actual}
            role="group"
            aria-roledescription="aviso"
            aria-label={`${actual + 1} de ${total}`}
            className={clsx(
              "grid min-h-56 items-center gap-6 p-6 sm:min-h-60 sm:p-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-10 lg:px-12",
              !reducido && (dir === 1 ? "animate-[aviso-entra-der_380ms_cubic-bezier(0.22,1,0.36,1)_both]" : "animate-[aviso-entra-izq_380ms_cubic-bezier(0.22,1,0.36,1)_both]"),
            )}
          >
            <div className="min-w-0">
              <h2 className="text-2xl leading-tight font-bold text-ink sm:text-3xl">{aviso.titulo}</h2>
              <p className="mt-2 text-lg text-ink-2">{aviso.linea}</p>
              <ButtonLink to={aviso.href} variant="primary" className="mt-6">
                {aviso.cta}
              </ButtonLink>
            </div>
            {aviso.dato ? (
              <p className="flex items-baseline gap-3 text-brand md:flex-col md:items-end md:gap-0 md:text-right" aria-hidden="true">
                <span className="text-6xl leading-none font-bold tabular tracking-tight sm:text-7xl md:text-8xl">{aviso.dato.valor}</span>
                <span className="text-base font-semibold text-ink-2 md:mt-2">{aviso.dato.unidad}</span>
              </p>
            ) : (
              <span className="hidden size-28 place-items-center rounded-full bg-brand-soft text-brand md:grid [&>svg]:size-12" aria-hidden="true">
                {aviso.icon}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 coarse:gap-0" role="group" aria-label="Elegir aviso">
          {AVISOS.map((a, i) => (
            <button
              key={a.titulo}
              type="button"
              onClick={() => ir(i, i >= actual ? 1 : -1, true)}
              aria-label={`Aviso ${i + 1}: ${a.titulo}`}
              aria-current={i === actual ? "true" : undefined}
              className={clsx("group grid h-11 min-w-6 place-items-center px-1 coarse:min-w-11", FOCO_CON_RING, "rounded-full")}
            >
              <span
                className={clsx(
                  "block h-2 rounded-full transition-[width,background-color] duration-300 ease-out motion-reduce:transition-none",
                  i === actual ? "w-6 bg-brand" : "w-2 bg-line-strong group-hover:bg-ink-3",
                )}
              />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={control}
            onClick={() => setPausado((p) => !p)}
            aria-label={pausado ? "Reanudar avisos" : "Pausar avisos"}
            hidden={reducido}
          >
            {pausado ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
          </button>
          <button type="button" className={control} onClick={() => ir(actual - 1, -1, true)} aria-label="Aviso anterior">
            <ChevronLeft aria-hidden="true" />
          </button>
          <button type="button" className={control} onClick={() => ir(actual + 1, 1, true)} aria-label="Aviso siguiente">
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
