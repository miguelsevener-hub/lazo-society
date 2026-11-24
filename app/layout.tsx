import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "@fontsource/sorts-mill-goudy/400.css";
import "@fontsource/sorts-mill-goudy/400-italic.css";
import { Marca } from "@/components/Marca";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://lazosociety.com"),
  title: { default: "Lazo Society · Wear your type™", template: "%s · Lazo Society" },
  description: "Un juego para los solteros de tu boda. Seis animales, una chapa y ninguna app.",
  openGraph: { title: "Lazo Society", description: "Wear your type™", type: "website", locale: "es_ES", images: ["/chapas/caballo.webp"] },
};
export const viewport: Viewport = { themeColor: "#ffffff" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="barra-sup">
          <div className="marco">
            <Link href="/" aria-label="Lazo Society, inicio"><Marca /></Link>
            <Link href="/pedir" className="boton boton-linea boton-pequeno">Lazo para mi boda</Link>
          </div>
        </header>
        {children}
        <footer className="pie">
          <div className="marco">
            <span><Marca /> <span className="voz">Wear your type™</span></span>
            <span>Inspirado en la psicología de los vínculos. No es un test clínico.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
