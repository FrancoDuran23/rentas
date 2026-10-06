import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Field } from "@base-ui/react/field";
import { Form } from "@base-ui/react/form";
import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { CircleAlert, Eye, EyeOff, Info } from "lucide-react";
import clsx from "clsx";
import { LINKS } from "../data/site";
import { CONTACTO } from "../data/contacto";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { LogoMark } from "../components/layout/Logo";
import { Breadcrumbs, SmartLink } from "../components/ui/primitives";

/*
 * Ingreso con Clave Fiscal: el formulario es la credencial (dirección elegida
 * por el usuario con impeccable; brief en .impeccable/surfaces). Componentes
 * de la lista de pick-ui-library: base-ui (Form, Field), Sonner y motion.
 *
 * SEGURIDAD: es una demostración publicada en un sitio estático. El formulario
 * no envía, no guarda y no registra nada de lo que se escribe: sin action, sin
 * fetch, sin almacenamiento y sin console. Al enviar sólo valida en memoria,
 * borra la clave y avisa que hay que ingresar en el portal oficial.
 */

const CUIT_DIGITOS = 11;

/** 20123456789 → 20-12345678-9, a medida que se escribe. */
function formatCuit(value: string) {
  const d = value.replace(/\D/g, "").slice(0, CUIT_DIGITOS);
  if (d.length <= 2) return d;
  if (d.length <= 10) return `${d.slice(0, 2)}-${d.slice(2)}`;
  return `${d.slice(0, 2)}-${d.slice(2, 10)}-${d.slice(10)}`;
}

function errorCuit(cuit: string) {
  const n = cuit.replace(/\D/g, "").length;
  if (n === 0) return "Escribí tu CUIT: son 11 números.";
  if (n < CUIT_DIGITOS) return `Faltan números: escribiste ${n} de 11.`;
  return null;
}

function errorClave(clave: string) {
  return clave ? null : "Escribí tu clave. Si no la recordás, tocá “¿La olvidaste?”.";
}

function MensajeError({ children }: { children: string }) {
  return (
    <Field.Error match className="mt-2 flex items-start gap-1.5 text-[0.95rem] font-semibold text-danger">
      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </Field.Error>
  );
}

/** Campo de la credencial: borde de tinta, foco amarillo del sistema. */
const campo =
  "w-full min-w-0 rounded-lg border-2 border-ink-3 bg-surface px-4 text-ink placeholder:text-ink-3 transition-colors hover:border-ink data-[invalid]:border-danger focus:shadow-none focus:outline-[3px] focus:outline-offset-0 focus:outline-focus";

export function IngresarPage() {
  useDocumentTitle("Ingresar con Clave Fiscal");
  const reducido = useReducedMotion();
  const sacudir = useAnimationControls();

  const [cuit, setCuit] = useState("");
  const [clave, setClave] = useState("");
  const [verClave, setVerClave] = useState(false);
  // Los errores aparecen recién al enviar y después se recalculan al escribir.
  const [intentado, setIntentado] = useState(false);
  const cuitRef = useRef<HTMLInputElement>(null);
  const claveRef = useRef<HTMLInputElement>(null);

  const errCuit = intentado ? errorCuit(cuit) : null;
  const errClave = intentado ? errorClave(clave) : null;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    // No se envía nada: ni navegación, ni request, ni almacenamiento.
    e.preventDefault();
    setIntentado(true);
    const ec = errorCuit(cuit);
    const ek = errorClave(clave);
    if (ec || ek) {
      (ec ? cuitRef : claveRef).current?.focus();
      if (!reducido) void sacudir.start({ x: [0, -6, 6, -4, 4, 0], transition: { duration: 0.32, ease: "easeOut" } });
      return;
    }
    // Datos válidos: se descarta la clave y se avisa que es una demostración.
    setClave("");
    setVerClave(false);
    setIntentado(false);
    toast("Demostración: no se envió nada", {
      description: "Para entrar a tu cuenta, usá el portal oficial de Clave Fiscal.",
      action: { label: "Ir al portal", onClick: () => window.open(LINKS.login, "_blank", "noopener,noreferrer") },
      duration: 8000,
    });
  };

  return (
    <section aria-labelledby="ingresar-titulo" className="relative isolate overflow-hidden bg-surface-2">
      <div className="veil veil-band -z-10" aria-hidden="true" />
      <div className="container-page pt-6 pb-14 sm:pt-8 sm:pb-20">
        <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Ingresar con Clave Fiscal" }]} />

        <motion.div
          className="mx-auto mt-6 w-full max-w-md sm:mt-10"
          initial={reducido ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.12 }}
        >
          <motion.div
            animate={sacudir}
            className="overflow-hidden rounded-xl border border-line bg-surface"
          >
            {/* Cabecera de la credencial: la marca y qué credencial es. */}
            <div className="flex items-center gap-3 border-b border-line px-5 py-4 sm:px-7">
              <LogoMark className="size-10" />
              <p className="text-lg font-bold text-ink">Clave Fiscal</p>
            </div>

            <div className="px-5 pt-6 pb-6 sm:px-7 sm:pt-7">
              <h1 id="ingresar-titulo" className="text-2xl font-bold text-ink sm:text-[1.75rem]">
                Ingresá a tu cuenta
              </h1>

              <Form noValidate onSubmit={onSubmit} aria-label="Ingresar con Clave Fiscal" className="mt-6 grid gap-5">
                <Field.Root name="cuit" invalid={!!errCuit}>
                  <Field.Label className="block font-semibold text-ink">CUIT</Field.Label>
                  <Field.Description className="mt-0.5 text-sm text-ink-3">
                    11 números, por ejemplo <span className="whitespace-nowrap tabular">20-12345678-9</span>. Los guiones se ponen solos.
                  </Field.Description>
                  <Field.Control
                    ref={cuitRef}
                    inputMode="numeric"
                    autoComplete="off"
                    spellCheck={false}
                    value={cuit}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCuit(formatCuit(e.target.value))}
                    className={clsx(campo, "mt-2 h-15 text-2xl font-semibold tracking-wide tabular")}
                  />
                  {errCuit ? <MensajeError>{errCuit}</MensajeError> : null}
                </Field.Root>

                <Field.Root name="clave" invalid={!!errClave}>
                  <div className="flex items-baseline justify-between gap-3">
                    <Field.Label className="font-semibold text-ink">Clave</Field.Label>
                    <SmartLink to={LINKS.login} className="link hit text-sm font-semibold">
                      ¿La olvidaste?
                    </SmartLink>
                  </div>
                  <div className="relative mt-2">
                    <Field.Control
                      ref={claveRef}
                      type={verClave ? "text" : "password"}
                      autoComplete="new-password"
                      spellCheck={false}
                      value={clave}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setClave(e.target.value)}
                      className={clsx(campo, "h-13 pr-14 text-lg")}
                    />
                    <button
                      type="button"
                      onClick={() => setVerClave((v) => !v)}
                      aria-pressed={verClave}
                      aria-label="Mostrar la clave"
                      className="absolute inset-y-0 right-1 my-auto grid size-11 place-items-center rounded-md text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
                    >
                      {verClave ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
                    </button>
                  </div>
                  {errClave ? <MensajeError>{errClave}</MensajeError> : null}
                </Field.Root>

                <button
                  type="submit"
                  className="mt-1 inline-flex h-13 w-full items-center justify-center rounded-lg bg-brand text-lg font-semibold text-brand-ink transition-[background-color,transform] duration-150 ease-out hover:bg-brand-hover active:scale-[0.98] motion-reduce:active:scale-100"
                >
                  Ingresar
                </button>
              </Form>

              {/* Aviso permanente: es una demostración; el ingreso real es en el portal oficial. */}
              <p className="mt-5 flex items-start gap-2 border-t border-line pt-4 text-sm text-pretty text-ink-2">
                <Info className="mt-0.5 size-4 shrink-0 text-ink-3" aria-hidden="true" />
                <span>
                  Demostración del rediseño: no ingreses tu clave real.{" "}
                  <SmartLink to={LINKS.login} className="link hit font-semibold whitespace-nowrap">
                    Ir al portal oficial
                  </SmartLink>
                </span>
              </p>
            </div>
          </motion.div>

          {/* Lo secundario, chico y debajo de la credencial. */}
          <div className="mt-6 grid gap-3 text-center text-[0.95rem] text-ink-2 coarse:gap-6">
            <p>
              ¿Primera vez?{" "}
              <SmartLink to={LINKS.login} className="link hit font-semibold">
                Pedí tu clave
              </SmartLink>
            </p>
            <p>
              Sin clave:{" "}
              <SmartLink to={LINKS.inmobiliarioSinClave} className="link hit">
                Pagar Inmobiliario
              </SmartLink>{" "}
              ·{" "}
              <SmartLink to={LINKS.serviciosSinClave} className="link hit">
                Constancias
              </SmartLink>
            </p>
            <p>
              Ayuda:{" "}
              <a href={CONTACTO.telefono.href} className="link hit tabular">
                {CONTACTO.telefono.valor}
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
