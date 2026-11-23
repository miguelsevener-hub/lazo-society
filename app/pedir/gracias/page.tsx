import Link from "next/link";
export default async function Gracias({ searchParams }: { searchParams: Promise<{ boda?: string }> }) {
  const { boda } = await searchParams;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/b/${boda}`;
  return (
    <main className="contenedor" style={{ padding: "96px 24px", textAlign: "center" }}>
      <h2>Hecho. Ya sois parte del club.</h2>
      <p className="serifa">Os escribimos en menos de 24 horas para confirmar. Esta es la página de vuestra boda: compartidla en el grupo de solteros.</p>
      <p className="tarjeta" style={{ wordBreak: "break-all" }}>{url}</p>
      {boda && <p><Link className="boton" href={`/b/${boda}`}>Ver la página</Link></p>}
    </main>
  );
}
