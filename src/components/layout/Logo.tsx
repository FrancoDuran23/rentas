import clsx from "clsx";

const BASE = import.meta.env.BASE_URL;

/** Isologo oficial de Rentas Jujuy (imagen aportada, fondo transparente). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={`${BASE}brand/logo-rentas-96.png`}
      srcSet={`${BASE}brand/logo-rentas-96.png 1x, ${BASE}brand/logo-rentas-180.png 2x`}
      width={40}
      height={40}
      alt=""
      decoding="async"
      className={clsx("shrink-0 select-none", className)}
    />
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-3", className)}>
      <LogoMark className="size-10" />
      <span className="flex flex-col leading-tight">
        <span className="text-[1.05rem] font-bold whitespace-nowrap text-ink">Rentas Jujuy</span>
        <span className="hidden text-sm whitespace-nowrap text-ink-3 min-[420px]:block">
          Dirección Provincial de Rentas
        </span>
      </span>
    </span>
  );
}

/**
 * Logo de Gobierno de Jujuy (jujuy.gob.ar, sin el fondo blanco): azul marino
 * oficial #14304D en claro y blanco en oscuro, donde el azul no se lee.
 */
export function LogoGobierno({ className }: { className?: string }) {
  const img = "h-9 w-auto shrink-0 select-none";
  return (
    // El display lo decide quien lo usa (className): así "hidden md:inline-flex" no choca con un inline-flex fijo.
    <span className={clsx("items-center", className)}>
      <img
        src={`${BASE}brand/gobierno-jujuy-40.png`}
        srcSet={`${BASE}brand/gobierno-jujuy-40.png 1x, ${BASE}brand/gobierno-jujuy-80.png 2x`}
        width={73}
        height={40}
        alt="Gobierno de Jujuy"
        decoding="async"
        className={clsx(img, "dark:hidden")}
      />
      <img
        src={`${BASE}brand/gobierno-jujuy-blanco-40.png`}
        srcSet={`${BASE}brand/gobierno-jujuy-blanco-40.png 1x, ${BASE}brand/gobierno-jujuy-blanco-80.png 2x`}
        width={73}
        height={40}
        alt="Gobierno de Jujuy"
        decoding="async"
        className={clsx(img, "hidden dark:block")}
      />
    </span>
  );
}
