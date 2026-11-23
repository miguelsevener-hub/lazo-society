import type { Metadata } from "next";
import "@fontsource-variable/jost";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://lazosociety.com"),
  title: { default: "Lazo Society · Wear your type™", template: "%s · Lazo Society" },
  description: "Un juego para los solteros de tu boda. Seis animales, una chapa y ninguna app.",
  openGraph: { title: "Lazo Society", description: "Wear your type™", type: "website", locale: "es_ES" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <footer className="pie">
          <span className="marca">Lazo Society</span> · <span className="voz">Wear your type™</span>
          <br />Inspirado en la psicología de los vínculos. No es un test clínico.
        </footer>
      </body>
    </html>
  );
}
