import Link from "next/link";
export default function NoEncontrado() {
  return (
    <main className="contenedor" style={{ padding: "120px 24px", textAlign: "center" }}>
      <h2>Aquí no hay nadie.</h2>
      <p className="serifa">Puede que el enlace esté mal escrito.</p>
      <Link className="boton boton-sec" href="/">Volver</Link>
    </main>
  );
}
