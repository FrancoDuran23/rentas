import { ArrowUpRight } from "lucide-react";
import { RENTAS_CON_VOS } from "../../data/contacto";
import { ButtonLink } from "../ui/Button";
import { Disclosure, SectionHeader } from "../ui/primitives";

export function RentasConVos() {
  return (
    <section aria-labelledby="rentas-con-vos-titulo" className="border-y border-line bg-surface-2">
      <div className="container-page py-12 sm:py-14">
        <SectionHeader
          id="rentas-con-vos-titulo"
          title={RENTAS_CON_VOS.titulo}
          action={
            <ButtonLink to={RENTAS_CON_VOS.href} variant="secondary">
              Ver programa
              <ArrowUpRight aria-hidden="true" />
            </ButtonLink>
          }
        />
        <div className="mt-4 max-w-2xl">
          <Disclosure summary="Qué es Rentas con Vos">
            <p>{RENTAS_CON_VOS.descripcion}</p>
          </Disclosure>
        </div>
      </div>
    </section>
  );
}
