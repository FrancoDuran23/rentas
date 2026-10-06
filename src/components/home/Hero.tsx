import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { CreditCard, FileSearch, House, LockKeyhole, Search } from "lucide-react";
import { ShaderCanvas } from "../../gpu/ShaderCanvas";
import { LINKS } from "../../data/site";
import { PORTAL } from "../../data/contacto";
import { useResolvedTheme } from "../../lib/theme";
import { AccionesHero } from "./acciones/AccionesHero";
import type { Accion } from "./acciones/types";

/** Las cuatro acciones del inicio oficial, en verbo. "Consultar" son los servicios sin clave fiscal. */
const ACCIONES: Accion[] = [
  { href: LINKS.pagar, label: "Pagar", icon: <CreditCard aria-hidden="true" /> },
  { href: LINKS.serviciosSinClave, label: "Consultar", icon: <FileSearch aria-hidden="true" /> },
  { href: PORTAL.clave.href, label: "Clave fiscal", icon: <LockKeyhole aria-hidden="true" /> },
  { href: LINKS.inmobiliarioSinClave, label: "Pagar Inmobiliario", icon: <House aria-hidden="true" /> },
];

/**
 * Colores del velo vgpu por tema (sRGB 0..1): el celeste de los arcos del
 * isologo. Sobre la luz sólo hay tinta (título y etiqueta) y piezas con
 * fondo propio (buscador y acciones), así que puede ser intensa.
 */
const LUZ = {
  light: { top: [1, 1, 1], bottom: [0.93, 0.965, 0.99], glow: [0.55, 0.78, 0.94], amount: 0.9 },
  dark: { top: [0.051, 0.067, 0.09], bottom: [0.063, 0.09, 0.13], glow: [0.13, 0.31, 0.48], amount: 0.85 },
} as const;

export function Hero() {
  const navigate = useNavigate();
  const theme = useResolvedTheme();
  const [q, setQ] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/tramites?q=${encodeURIComponent(q.trim())}` : "/tramites");
  };

  return (
    <section aria-labelledby="hero-titulo" className="relative isolate overflow-hidden border-b border-line bg-bg">
      <ShaderCanvas
        shader="luz"
        interactive
        uniforms={LUZ[theme]}
        className="absolute inset-0 -z-10"
        fallback={
          <div className="relative h-full w-full bg-bg">
            <div className="veil veil-hero" />
          </div>
        }
      />

      <div className="container-page py-12 sm:py-16 lg:py-20 [@media(max-height:480px)]:py-6">
        <h1 id="hero-titulo" className="text-[2.25rem] font-bold text-ink sm:text-5xl [@media(max-height:480px)]:text-4xl">
          ¿Qué necesitás hacer?
        </h1>

        <form role="search" onSubmit={submit} className="mt-8 max-w-2xl [@media(max-height:480px)]:mt-4" aria-label="Buscar trámites">
          <label htmlFor="hero-buscar" className="mb-2 block font-semibold text-ink">
            Buscar un trámite
          </label>
          <div className="flex">
            <input
              id="hero-buscar"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Por ejemplo: libre deuda"
              autoComplete="off"
              className="h-13 min-w-0 flex-1 rounded-l-lg border-2 border-r-0 border-ink bg-surface px-4 text-base text-ink placeholder:text-ink-3 focus:shadow-none focus:outline-[3px] focus:outline-offset-0 focus:outline-focus"
            />
            <button
              type="submit"
              className="inline-flex h-13 items-center gap-2 rounded-r-lg bg-brand px-5 font-semibold text-brand-ink transition-colors hover:bg-brand-hover"
            >
              <Search className="size-5" aria-hidden="true" />
              <span className="max-sm:sr-only">Buscar</span>
            </button>
          </div>
        </form>

        <AccionesHero acciones={ACCIONES} />
      </div>
    </section>
  );
}
