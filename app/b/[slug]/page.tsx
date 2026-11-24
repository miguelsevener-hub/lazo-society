import Link from "next/link";
import { notFound } from "next/navigation";
import { bodaPorSlug, fechaLarga, diasHasta } from "@/lib/bodas";
import { Chapa } from "@/components/Chapa";
import { Marca } from "@/components/Marca";
import type { Animal } from "@/lib/test";

export const dynamic = "force-dynamic";
const FILA: Animal[] = ["caballo", "lince", "halcon", "ciervo", "lobo", "cisne"];

export default async function PaginaBoda({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const boda = await bodaPorSlug(slug);
  if (!boda) notFound();
  const faltan = diasHasta(boda.fecha);
  const abierto = diasHasta(boda.cierre_test) >= 0;
  return (
    <main className="hoja">
      <div className="marco boda-cabecera">
        <Marca className="marca-grande" />
        <h1 className="novios">{boda.novios}</h1>
        <p className="fecha">{fechaLarga(boda.fecha)}{boda.lugar ? `, ${boda.lugar}` : ""}{faltan > 0 ? `. Faltan ${faltan} días.` : "."}</p>
        <div className="fila-chapas" aria-hidden>
          {FILA.map((a) => <Chapa key={a} animal={a} tam="clamp(56px, 12vw, 104px)" />)}
        </div>
        <p className="boda-texto">Esto es para los solteros de la boda. Hacéis el test, vuestro animal se guarda en un sobre con vuestro nombre y lo abrís todos a la vez. Dentro está vuestra chapa y a quién buscar.</p>
        {abierto ? (
          <>
            <Link className="boton" href={`/b/${boda.slug}/test`}>Hacer el test</Link>
            <p className="suave" style={{ marginTop: 14, fontSize: ".95rem" }}>Abierto hasta el {fechaLarga(boda.cierre_test)}.</p>
          </>
        ) : (
          <>
            <p className="suave">El test previo ya está cerrado.</p>
            <Link className="boton" href={`/b/${boda.slug}/ahora`}>Estoy en la boda</Link>
          </>
        )}
        <p className="voz" style={{ marginTop: 48, fontSize: "1.3rem", color: "var(--medianoche)" }}>Esta boda es un experimento social con barra libre.</p>
      </div>
    </main>
  );
}
