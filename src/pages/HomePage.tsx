import { Hero } from "../components/home/Hero";
import { Carrusel } from "../components/home/Carrusel";
import { MediosDePago } from "../components/home/MediosDePago";
import { ProximosVencimientos } from "../components/home/Secciones";
import { useDocumentTitle } from "../lib/useDocumentTitle";

/**
 * Inicio: la tarea (hero), los avisos del sitio oficial (carrusel), las 3
 * próximas fechas y los medios de pago. "Más frecuentes" se sacó porque
 * repetía las acciones y el pie (usuario: "el más frecuente repite").
 */
export function HomePage() {
  useDocumentTitle();
  return (
    <>
      <Hero />
      <Carrusel />
      <ProximosVencimientos />
      <MediosDePago />
    </>
  );
}
