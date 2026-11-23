import Link from "next/link";
import { notFound } from "next/navigation";
import { bodaPorSlug, fechaLarga, diasHasta } from "@/lib/bodas";

export const dynamic = "force-dynamic";

export default async function PaginaBoda({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const boda = await bodaPorSlug(slug);
  if (!boda) notFound();
  const faltan = diasHasta(boda.fecha);
  const abierto = diasHasta(boda.cierre_test) >= 0;
  return (
    <main className="contenedor" style={{ padding: "96px 24px", textAlign: "center" }}>
      <p className="marca">Lazo Society</p>
      <h1 className="voz" style={{ fontSize: "clamp(2.4rem, 7vw, 3.6rem)", color: "var(--medianoche)" }}>{boda.novios}</h1>
      <p>{fechaLarga(boda.fecha)}{boda.lugar ? ` · ${boda.lugar}` : ""}</p>
      {faltan > 0 && <p className="serifa">Faltan {faltan} días.</p>}
      <div className="tarjeta" style={{ margin: "40px 0", textAlign: "left" }}>
        <p><strong>Esto es para los solteros de la boda.</strong> Hacéis el test, vuestro animal se guarda en un sobre con vuestro nombre y lo abrís todos a la vez en la boda. Dentro está vuestra chapa y a quién buscar.</p>
        <p className="voz" style={{ fontSize: "1.15rem", margin: 0 }}>Esta boda es un experimento social con barra libre.</p>
      </div>
      {abierto ? (
        <>
          <Link className="boton" href={`/b/${boda.slug}/test`}>Hacer el test</Link>
          <p style={{ marginTop: 12, color: "var(--suave)", fontSize: "0.9rem" }}>Abierto hasta el {fechaLarga(boda.cierre_test)}.</p>
        </>
      ) : (
        <>
          <p>El test previo ya está cerrado.</p>
          <Link className="boton" href={`/b/${boda.slug}/ahora`}>Estoy en la boda</Link>
        </>
      )}
    </main>
  );
}
