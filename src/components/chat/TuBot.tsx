import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link, useLocation } from "react-router";
import clsx from "clsx";
import { Send, X } from "lucide-react";

const BASE = import.meta.env.BASE_URL;
const EASE_OUT_QUINT = "cubic-bezier(0.22, 1, 0.36, 1)";
import { FOCO_CON_RING, isExternal } from "../ui/Button";
import { SmartLink } from "../ui/primitives";
import {
  mensajeSaludo,
  responderSugerencia,
  responderTexto,
  SUGERENCIAS_RAPIDAS,
  type RespuestaTuBot,
  type SugerenciaId,
} from "./respuestas";

type Mensaje =
  | { rol: "usuario"; texto: string }
  | { rol: "bot"; respuesta: RespuestaTuBot };

function EnlaceRespuesta({ to, label }: { to: string; label: string }) {
  if (isExternal(to)) {
    return (
      <SmartLink to={to} className="link hit inline-flex items-center gap-1 text-sm font-semibold">
        {label}
      </SmartLink>
    );
  }
  return (
    <Link to={to} className="link hit inline-flex items-center gap-1 text-sm font-semibold">
      {label}
    </Link>
  );
}

function BurbujaBot({ respuesta }: { respuesta: RespuestaTuBot }) {
  return (
    <div className="max-w-[92%] rounded-xl rounded-bl-md border border-line bg-surface px-3.5 py-2.5 text-sm text-ink-2">
      <p className="text-pretty whitespace-pre-wrap">{respuesta.cuerpo}</p>
      {respuesta.tramites?.length ? (
        <ul className="mt-3 space-y-2 border-t border-line pt-3">
          {respuesta.tramites.map((t) => (
            <li key={t.id}>
              {isExternal(t.href) ? (
                <SmartLink to={t.href} className="link font-semibold">
                  {t.titulo}
                </SmartLink>
              ) : (
                <Link to={t.href} className="link font-semibold">
                  {t.titulo}
                </Link>
              )}
            </li>
          ))}
        </ul>
      ) : null}
      {respuesta.enlaces?.length ? (
        <div className="mt-3 flex flex-col items-start gap-1 border-t border-line pt-3">
          {respuesta.enlaces.map((e) => (
            <EnlaceRespuesta key={`${e.to}-${e.label}`} to={e.to} label={e.label} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function BurbujaUsuario({ texto }: { texto: string }) {
  return (
    <div className="max-w-[92%] rounded-xl rounded-br-md bg-brand-soft px-3.5 py-2.5 text-sm text-ink">
      <p className="text-pretty">{texto}</p>
    </div>
  );
}

function ChipSugerencia({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "inline-flex h-9 shrink-0 items-center rounded-full bg-surface px-3.5 text-sm font-medium text-ink-2 ring-1 ring-line-strong ring-inset transition-colors hover:bg-surface-2 hover:text-ink coarse:h-11",
        FOCO_CON_RING,
      )}
    >
      {children}
    </button>
  );
}

export function TuBot() {
  const { pathname } = useLocation();
  const tituloId = useId();
  const lanzadorRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listaRef = useRef<HTMLDivElement>(null);
  const demoraRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [abierto, setAbierto] = useState(false);
  const [escribiendo, setEscribiendo] = useState(false);
  const [borrador, setBorrador] = useState("");
  const [mensajes, setMensajes] = useState<Mensaje[]>(() => [{ rol: "bot", respuesta: mensajeSaludo() }]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(true);
  const [saludoVisible, setSaludoVisible] = useState(true);

  const reducido =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [entradaLista, setEntradaLista] = useState(reducido);
  const [globoVisible, setGloboVisible] = useState(reducido);

  useEffect(() => {
    if (reducido) {
      setEntradaLista(true);
      setGloboVisible(true);
      return;
    }
    const raf = requestAnimationFrame(() => setEntradaLista(true));
    const tGlobo = window.setTimeout(() => setGloboVisible(true), 1200);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(tGlobo);
    };
  }, [reducido]);

  useEffect(() => {
    if (abierto) setSaludoVisible(false);
  }, [abierto]);

  const scrollAbajo = useCallback(() => {
    listaRef.current?.scrollTo({ top: listaRef.current.scrollHeight, behavior: reducido ? "auto" : "smooth" });
  }, [reducido]);

  useEffect(() => {
    scrollAbajo();
  }, [mensajes, escribiendo, scrollAbajo]);

  useEffect(() => {
    if (!abierto) return;
    const t = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(t);
  }, [abierto]);

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setAbierto(false);
        requestAnimationFrame(() => lanzadorRef.current?.focus());
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [abierto]);

  useEffect(
    () => () => {
      if (demoraRef.current) clearTimeout(demoraRef.current);
    },
    [],
  );

  const contestar = useCallback((fn: () => RespuestaTuBot, etiquetaUsuario?: string) => {
    if (etiquetaUsuario) {
      setMensajes((m) => [...m, { rol: "usuario", texto: etiquetaUsuario }]);
    }
    setMostrarSugerencias(false);
    setEscribiendo(true);
    const ms = 400 + Math.floor(Math.random() * 301);
    demoraRef.current = setTimeout(() => {
      const respuesta = fn();
      setMensajes((m) => [...m, { rol: "bot", respuesta }]);
      setMostrarSugerencias(respuesta.mostrarSugerencias ?? false);
      setEscribiendo(false);
    }, ms);
  }, []);

  const abrir = () => setAbierto(true);
  const cerrar = () => {
    setAbierto(false);
    requestAnimationFrame(() => lanzadorRef.current?.focus());
  };

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    const texto = borrador.trim();
    if (!texto || escribiendo) return;
    setBorrador("");
    contestar(() => responderTexto(texto), texto);
  };

  const sugerencia = (id: SugerenciaId, label: string) => {
    if (escribiendo) return;
    contestar(() => responderSugerencia(id), label);
  };

  // En el ingreso con clave fiscal (una sola tarea) el chat no tapa el formulario.
  if (pathname === "/ingresar") return null;

  return (
    <>
      {abierto ? (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby={tituloId}
          className={clsx(
            "fixed z-50 flex flex-col overflow-hidden bg-surface text-ink shadow-pop dark:ring-1 dark:ring-line",
            "animate-pop max-sm:inset-0 max-sm:pb-[env(safe-area-inset-bottom)]",
            "sm:right-[max(1rem,env(safe-area-inset-right))] sm:bottom-[calc(6rem+env(safe-area-inset-bottom))] sm:h-[32rem] sm:w-[23rem] sm:rounded-xl",
          )}
        >
          <header className="flex shrink-0 items-start gap-3 border-b border-line px-4 py-3">
            <div className="min-w-0 flex-1">
              <h2 id={tituloId} className="text-base font-semibold text-ink">
                TuBOT
              </h2>
              <p className="text-sm text-ink-2">Asistente virtual de Rentas</p>
              <p className="mt-1 text-sm text-ink-3">
                Demostración: responde sólo con la información publicada en este sitio.
              </p>
            </div>
            <button
              type="button"
              onClick={cerrar}
              aria-label="Cerrar TuBOT"
              className={clsx(
                "inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink coarse:size-11",
                FOCO_CON_RING,
              )}
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </header>

          <div
            ref={listaRef}
            aria-live="polite"
            className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-3"
          >
            {mensajes.map((m, i) => (
              <div
                key={i}
                className={clsx("flex", m.rol === "usuario" ? "justify-end" : "justify-start")}
              >
                {m.rol === "usuario" ? <BurbujaUsuario texto={m.texto} /> : <BurbujaBot respuesta={m.respuesta} />}
              </div>
            ))}
            {escribiendo ? (
              <div className="flex justify-start" aria-busy="true">
                <div className="rounded-xl rounded-bl-md border border-line bg-surface px-3.5 py-2.5 text-sm text-ink-3">
                  Escribiendo…
                </div>
              </div>
            ) : null}
          </div>

          {mostrarSugerencias && !escribiendo ? (
            <div className="shrink-0 border-t border-line px-4 py-2.5">
              <p className="mb-2 text-sm text-ink-3">Respuestas rápidas</p>
              <div className="flex gap-2 overflow-x-auto pb-0.5 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {SUGERENCIAS_RAPIDAS.map((s) => (
                  <ChipSugerencia key={s.id} onClick={() => sugerencia(s.id, s.label)}>
                    {s.label}
                  </ChipSugerencia>
                ))}
              </div>
            </div>
          ) : null}

          <form onSubmit={enviar} className="flex shrink-0 gap-2 border-t border-line p-3">
            <label className="sr-only" htmlFor="tubot-mensaje">
              Escribí tu consulta
            </label>
            <input
              ref={inputRef}
              id="tubot-mensaje"
              type="text"
              autoComplete="off"
              value={borrador}
              onChange={(e) => setBorrador(e.target.value)}
              placeholder="Escribí tu consulta…"
              className={clsx(
                "min-h-11 min-w-0 flex-1 rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink placeholder:text-ink-3 coarse:min-h-11",
                FOCO_CON_RING,
              )}
            />
            <button
              type="submit"
              disabled={!borrador.trim() || escribiendo}
              aria-label="Enviar mensaje"
              className={clsx(
                "inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand text-brand-ink transition-colors hover:bg-brand-hover disabled:opacity-50",
                FOCO_CON_RING,
              )}
            >
              <Send className="size-5" aria-hidden="true" />
            </button>
          </form>
        </div>
      ) : null}

      <div
        className={clsx(
          "fixed z-50 flex items-center gap-2",
          "bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]",
          abierto && "max-sm:hidden",
        )}
      >
        {saludoVisible && !abierto ? (
          <div
            className={clsx(
              "relative hidden min-[400px]:flex max-w-[min(16rem,calc(100vw-7rem))] items-center gap-0.5 rounded-xl bg-surface py-2 pl-3.5 pr-1 text-sm font-semibold text-ink shadow-pop",
              "after:pointer-events-none after:absolute after:top-1/2 after:-right-1.5 after:size-2.5 after:-translate-y-1/2 after:rotate-45 after:bg-surface after:content-['']",
              reducido
                ? "opacity-100"
                : clsx(
                    "transition-[transform,opacity] duration-[360ms] ease-[var(--tubot-ease)] motion-reduce:translate-x-0 motion-reduce:duration-[160ms]",
                    globoVisible ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0",
                  ),
            )}
            style={{ "--tubot-ease": EASE_OUT_QUINT } as CSSProperties}
          >
            <button
              type="button"
              onClick={abrir}
              className={clsx(
                "-my-1 min-w-0 flex-1 py-1 text-left text-pretty text-sm font-semibold text-ink coarse:-my-3 coarse:py-3",
                FOCO_CON_RING,
              )}
            >
              ¡Hola! ¿En qué te ayudo?
            </button>
            <button
              type="button"
              onClick={() => setSaludoVisible(false)}
              aria-label="Cerrar saludo"
              className={clsx(
                "inline-flex size-6 shrink-0 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink coarse:size-11",
                FOCO_CON_RING,
              )}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        ) : null}

        <button
          ref={lanzadorRef}
          type="button"
          onClick={abierto ? cerrar : abrir}
          aria-label={abierto ? "Cerrar TuBOT" : "Abrir TuBOT, asistente virtual"}
          aria-expanded={abierto}
          className={clsx(
            "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-transparent p-0 coarse:min-h-11 coarse:min-w-11",
            "transition-transform duration-[160ms] ease-out motion-reduce:transition-none",
            "[@media(hover:hover)]:hover:scale-[1.04]",
            reducido
              ? clsx(
                  "opacity-100 motion-reduce:transition-none",
                  !entradaLista && "opacity-0",
                  entradaLista && "opacity-100 transition-opacity duration-[160ms]",
                )
              : clsx(
                  "transition-[transform,opacity] delay-[600ms] duration-[520ms] ease-[var(--tubot-ease)] motion-reduce:translate-y-0 motion-reduce:delay-0 motion-reduce:duration-[160ms]",
                  entradaLista ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
                ),
            FOCO_CON_RING,
          )}
          style={{ "--tubot-ease": EASE_OUT_QUINT } as CSSProperties}
        >
          <img
            src={`${BASE}brand/tubot-72.png`}
            srcSet={`${BASE}brand/tubot-72.png 1x, ${BASE}brand/tubot-144.png 2x`}
            width={107}
            height={72}
            alt=""
            decoding="async"
            className="pointer-events-none h-14 w-auto select-none sm:h-16"
          />
        </button>
      </div>
    </>
  );
}
