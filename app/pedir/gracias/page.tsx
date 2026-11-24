import Link from "next/link";
export default async function Gracias({ searchParams }: { searchParams: Promise<{ boda?: string }> }) {
  const { boda } = await searchParams;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/b/${boda}`;
  return (
    <main className="hoja">
      <div className="marco columna">
        <h1>Hecho. Ya sois parte del club.</h1>
        <p className="entrada">Os escribimos en menos de 24 horas para confirmar. Esta es la página de vuestra boda: compartidla en el grupo de solteros.</p>
        <p className="resumen-pack" style={{ wordBreak: "break-all", fontSize: "1.1rem" }}>{url}</p>
        {boda && <p><Link className="boton" href={`/b/${boda}`}>Ver la página de la boda</Link></p>}
      </div>
    </main>
  );
}
