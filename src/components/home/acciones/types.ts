import type { ReactNode } from "react";

/** Una de las cuatro acciones grandes del hero: un verbo y su ícono, nada más. */
export interface Accion {
  href: string;
  label: string;
  icon: ReactNode;
}
