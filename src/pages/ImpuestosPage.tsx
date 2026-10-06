import { ArrowUpRight } from "lucide-react";
import { IMPUESTOS } from "../data/impuestos";
import { LINKS } from "../data/site";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { Notice, PageIntro, SmartLink } from "../components/ui/primitives";
import { ButtonLink } from "../components/ui/Button";
import { ImpuestosIndice } from "../components/impuestos/ImpuestosIndice";
import { Orientacion } from "../components/impuestos/Orientacion";

export function ImpuestosPage() {
  useDocumentTitle("Impuestos");

  return (
    <>
      <PageIntro title="Impuestos provinciales" breadcrumbs={[{ label: "Impuestos" }]}>
        <Orientacion className="max-w-2xl" />
      </PageIntro>

      <div className="container-page py-10 sm:py-14">
        {IMPUESTOS.length ? (
          <ImpuestosIndice />
        ) : (
          <div className="border-t border-line pt-6">
            <p className="text-lg font-semibold text-ink">Todavía no hay impuestos cargados.</p>
            <p className="mt-1 text-ink-3">Mientras tanto, podés buscar lo que necesitás en la guía de trámites.</p>
            <ButtonLink to="/tramites" variant="secondary" className="mt-5">
              Ir a trámites
            </ButtonLink>
          </div>
        )}

        {/* El Impuesto Automotor no es provincial: lo administra cada municipio. */}
        <Notice tone="info" title="La patente del auto o la moto es municipal" className="mt-8 max-w-3xl">
          <p>
            Se paga en el municipio del vehículo.{" "}
            <SmartLink to={LINKS.automotorCapital} className="link font-semibold whitespace-nowrap">
              Vehículos de la Capital
              <ArrowUpRight className="ml-0.5 inline size-4 align-[-2px]" aria-hidden="true" />
            </SmartLink>
          </p>
        </Notice>
      </div>
    </>
  );
}
