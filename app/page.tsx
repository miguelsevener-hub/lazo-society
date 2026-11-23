import Link from "next/link";
import { Animales } from "@/components/Animales";
import { PACKS, euros } from "@/lib/precio";

export default function Portada() {
  return (
    <main>
      <section className="contenedor" style={{ padding: "96px 24px 72px", textAlign: "center" }}>
        <h1 className="marca">Lazo Society</h1>
        <p className="voz" style={{ fontSize: "1.6rem", marginTop: 8 }}>Wear your type™</p>
        <p className="serifa" style={{ maxWidth: 520, margin: "32px auto" }}>
          Recuperamos el arte de los encuentros reales. Sin pantallas, sin prisas y con una copa en la mano.
          Un juego para los solteros de tu boda: seis animales, una chapa y ninguna app.
        </p>
        <Link className="boton" href="/pedir">Lazo para mi boda</Link>
        <p style={{ marginTop: 16 }}><Link href="/test">O descubre tu animal →</Link></p>
      </section>

      <section className="seccion">
        <div className="contenedor">
          <h2>Cómo funciona</h2>
          <ol className="pasos">
            <li><div><strong>Pedís Lazo.</strong> En dos minutos, con el número de invitados y poco más. Se crea la página de vuestra boda.</div></li>
            <li><div><strong>Los solteros hacen el test.</strong> Diecisiete preguntas. Su animal queda guardado en secreto.</div></li>
            <li><div><strong>En la boda, cada uno abre su sobre.</strong> Dentro, su chapa y a quién buscar. Lo demás lo pone la barra libre.</div></li>
          </ol>
          <p className="voz" style={{ marginTop: 28, fontSize: "1.25rem" }}>Si pasa algo, diremos que fue el destino. Si no, al menos tienes una chapa bonita.</p>
        </div>
      </section>

      <section className="seccion">
        <div className="ancho">
          <h2>Seis animales. Dos preguntas: cómo amas y qué buscas.</h2>
          <Animales />
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor">
          <h2>Un precio por boda</h2>
          <table className="packs">
            <thead><tr><th>Pack</th><th>Solteros</th><th>Precio</th></tr></thead>
            <tbody>
              {PACKS.map((p, i) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.hasta === null ? `Más de ${PACKS[i - 1].hasta}` : i === 0 ? `Hasta ${p.hasta}` : `${PACKS[i - 1].hasta! + 1}–${p.hasta}`}</td>
                  <td>{p.desde ? "Desde " : ""}{euros(p.precio)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginTop: 14, color: "var(--suave)" }}>Todo incluido: página y test, sobres con nombre, chapas, cesta de chapas sueltas, cartel y envío.</p>
          <p style={{ marginTop: 24 }}><Link className="boton" href="/pedir">Calcular mi pack</Link></p>
        </div>
      </section>
    </main>
  );
}
