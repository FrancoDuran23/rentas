import { Outlet, ScrollRestoration } from "react-router";
import { Toaster } from "sonner";
import { useResolvedTheme } from "../../lib/theme";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { TuBot } from "../chat/TuBot";

export function Layout() {
  const theme = useResolvedTheme();
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      {/* Destino del enlace "Saltar al contenido": recibe el foco sin marco alrededor de toda la página. */}
      <main id="contenido" tabIndex={-1} className="flex-1 outline-none focus-visible:shadow-none">
        <Outlet />
      </main>
      <SiteFooter />
      <TuBot />
      {/* Avisos (Sonner, de la lista de pick-ui-library): con los tokens del sitio y su tema. */}
      <Toaster
        theme={theme}
        position="bottom-center"
        toastOptions={{
          classNames: {
            toast: "!rounded-xl !border !border-line !bg-surface !text-ink !shadow-pop !font-sans",
            title: "!font-semibold !text-[0.95rem]",
            description: "!text-ink-2 !text-sm",
            actionButton: "!h-9 !rounded-lg !bg-brand !px-3 !text-brand-ink !font-semibold coarse:!h-11",
          },
        }}
      />
      <ScrollRestoration />
    </div>
  );
}
