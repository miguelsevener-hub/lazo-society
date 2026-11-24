import Link from "next/link";
export default function NoEncontrado() {
  return (
    <main className="hoja">
      <div className="marco columna">
        <h1>Aquí no hay nadie.</h1>
        <p className="entrada">Puede que el enlace esté mal escrito. Pídeselo de nuevo a los novios.</p>
        <Link className="boton boton-linea" href="/">Ir a la portada</Link>
      </div>
    </main>
  );
}
