import clsx from "clsx";
import { LINKS } from "../../data/site";
import { FOCO_CON_RING } from "../ui/Button";
import { ArrowLink, SectionHeader, SmartLink } from "../ui/primitives";

const BASE = import.meta.env.BASE_URL;

const MEDIOS = [
  { nombre: "Click de Pago", archivo: "click-de-pago.png", href: "https://rentasjujuy.gob.ar/pago-clic/" },
  { nombre: "Pago Mis Cuentas", archivo: "pago-mis-cuentas.png", href: "https://rentasjujuy.gob.ar/pago-mis-cuentas/" },
  { nombre: "Interbanking", archivo: "interbanking.png", href: "https://rentasjujuy.gob.ar/inter-banking/" },
  { nombre: "Visa", archivo: "visa.png", href: "https://rentasjujuy.gob.ar/visa-2/" },
  { nombre: "Mercado Pago", archivo: "mercado-pago.png", href: "https://rentasjujuy.gob.ar/mercado-pago/" },
  { nombre: "Pago Fácil", archivo: "pago-facil.png", href: "https://rentasjujuy.gob.ar/pago-facil/" },
] as const;

const CIRCULO = clsx(
  // text fijo oscuro: el círculo es blanco en los dos temas (también el texto para lectores de pantalla).
  "hit flex size-24 items-center justify-center rounded-full bg-white text-[#0b0f19] no-underline sm:size-28",
  "transition-[transform,box-shadow] duration-[160ms] ease-out",
  "[@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:ring-1 [@media(hover:hover)]:hover:ring-line-strong",
  "motion-reduce:transform-none motion-reduce:[@media(hover:hover)]:hover:translate-y-0",
  "active:scale-[0.97] motion-reduce:active:scale-100",
  FOCO_CON_RING,
);

export function MediosDePago() {
  return (
    <section aria-labelledby="medios-pago-titulo" className="border-y border-line bg-surface-2">
      <div className="container-page py-12 sm:py-14">
        <SectionHeader id="medios-pago-titulo" title="Medios de pago" />
        <ul
          className="mx-auto mt-8 grid max-w-xl grid-cols-3 justify-items-center gap-6 sm:max-w-none lg:mt-10 lg:max-w-5xl lg:grid-cols-6 lg:gap-8"
          aria-label="Medios de pago digitales"
        >
          {MEDIOS.map((m) => (
            <li key={m.archivo}>
              <SmartLink to={m.href} className={CIRCULO} aria-label={m.nombre}>
                <img
                  src={`${BASE}brand/pagos/${m.archivo}`}
                  alt={m.nombre}
                  width={160}
                  height={160}
                  decoding="async"
                  className="size-[72%] object-contain"
                />
              </SmartLink>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center lg:mt-10">
          <ArrowLink to={LINKS.mediosDePago}>Medios y lugares de pago</ArrowLink>
        </p>
      </div>
    </section>
  );
}
