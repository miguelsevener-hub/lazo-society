import Link from "next/link";
import { ChapaPortada } from "@/components/ChapaPortada";
import { Espejos } from "@/components/Espejos";
import { Chapa } from "@/components/Chapa";
import { PACKS, euros } from "@/lib/precio";

function rango(i: number) {
  const p = PACKS[i];
  if (i === 0) return `hasta ${p.hasta} solteros`;
  if (p.hasta === null) return `más de ${PACKS[i - 1].hasta} solteros`;
  return `de ${PACKS[i - 1].hasta! + 1} a ${p.hasta} solteros`;
}

export default function Portada() {
  return (
    <main>
      <section className="portada">
        <div className="portada-interior marco">
          <ChapaPortada />
          <h1 className="lema">Wear your type<sup>™</sup></h1>
          <p className="bajada">Un juego para los solteros de tu boda. Seis animales, una chapa y ninguna app.</p>
          <div className="portada-acciones">
            <Link className="boton" href="/pedir">Lazo para mi boda</Link>
            <Link className="enlace" href="/test">Descubrir mi animal</Link>
          </div>
        </div>
      </section>

      <section className="bloque manifiesto">
        <div className="marco">
          <p>Recuperamos el arte de los encuentros reales.</p>
          <p>Sin pantallas, sin prisas y con una copa en la mano.</p>
          <p className="voz">Si pasa algo, diremos que fue el destino. Si no, al menos tienes una chapa bonita.</p>
        </div>
      </section>

      <section className="bloque">
        <div className="marco">
          <h2 className="titular">Seis animales. Cada uno busca a otro.</h2>
          <Espejos />
        </div>
      </section>

      <section className="bloque">
        <div className="marco">
          <h2 className="titular">Cómo funciona</h2>
          <ol className="pasos">
            <li><div><h3>Pedís Lazo</h3><p>En dos minutos, con el número de invitados y poco más. Se crea la página de vuestra boda.</p></div></li>
            <li><div><h3>Los solteros hacen el test</h3><p>Diecisiete preguntas. Su animal queda guardado en secreto, en un sobre con su nombre.</p></div></li>
            <li><div><h3>En la boda, todos abren su sobre a la vez</h3><p>Dentro está su chapa y a quién buscar. Lo demás lo pone la barra libre.</p></div></li>
          </ol>
          <p className="remate voz">Esta boda es un experimento social con barra libre.</p>
        </div>
      </section>

      <section className="bloque">
        <div className="marco"><div className="columna">
          <h2 className="titular">Un precio por boda</h2>
          <ul className="packs">
            {PACKS.map((p, i) => (
              <li key={p.id}>
                <span className="nombre">{p.nombre}</span>
                <span className="solteros">{rango(i)}</span>
                <span className="precio">{p.desde ? "desde " : ""}{euros(p.precio)}</span>
              </li>
            ))}
          </ul>
          <p className="packs-nota">Todo incluido: la página de la boda, el test, los sobres con nombre, las chapas, la cesta de chapas sueltas, el cartel y el envío.</p>
        </div></div>
      </section>

      <section className="bloque cierre-final">
        <div className="marco">
          <div className="cesta" aria-hidden>
            {(["lobo", "ciervo", "caballo", "cisne", "halcon", "lince"] as const).map((a) => <Chapa key={a} animal={a} tam="clamp(84px, 13vw, 132px)" viva />)}
          </div>
          <p className="lema">¿Os casáis?</p>
          <Link className="boton" href="/pedir">Calcular mi pack</Link>
        </div>
      </section>
    </main>
  );
}
