import { ArrowRight, ArrowUpRight } from "lucide-react";
import { isExternal } from "../../ui/Button";
import { SmartLink } from "../../ui/primitives";
import type { Accion } from "./types";

/**
 * Las cuatro acciones del inicio, con la fuerza que el sistema ya tiene
 * (impeccable `bolder`: amplificar lo propio, un solo gesto): el verbo a
 * escala de título, el ícono grande y el celeste suave de la marca como
 * fondo. El gesto: con puntero o al enfocar, la tarjeta entera pasa al azul
 * de Rentas con texto blanco y la flecha avanza; al presionar, se hunde.
 */
export function AccionesHero({ acciones }: { acciones: Accion[] }) {
  return (
    <nav aria-label="Acciones principales" className="mt-8 sm:mt-10">
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {acciones.map((a) => {
          const Flecha = isExternal(a.href) ? ArrowUpRight : ArrowRight;
          return (
            <li key={a.label} className="flex">
              <SmartLink
                to={a.href}
                className="group flex min-h-36 w-full flex-col justify-between gap-6 rounded-xl bg-brand-soft p-4 text-ink no-underline transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.97] motion-reduce:transition-colors motion-reduce:active:scale-100 sm:min-h-44 sm:p-6 [@media(hover:hover)]:hover:bg-brand [@media(hover:hover)]:hover:text-brand-ink"
              >
                <span className="flex items-start justify-between text-brand transition-colors duration-150 [@media(hover:hover)]:group-hover:text-brand-ink [&>svg:first-child]:size-9 sm:[&>svg:first-child]:size-11">
                  {a.icon}
                  <Flecha
                    className="size-5 transition-transform duration-150 ease-out motion-reduce:transition-none [@media(hover:hover)]:group-hover:translate-x-0.5 [@media(hover:hover)]:group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </span>
                <span className="text-xl leading-[1.1] font-bold tracking-[-0.015em] text-balance sm:text-2xl xl:text-[1.75rem]">
                  {a.label}
                </span>
              </SmartLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
