import { ANIMALES, type Animal } from "@/lib/test";

const ORDEN: Animal[] = ["caballo", "halcon", "lobo", "lince", "ciervo", "cisne"];

export function Animales() {
  return (
    <div className="rejilla">
      {ORDEN.map((a) => (
        <div key={a} className="tarjeta animal">
          <img src={`/animales/${a}.png`} alt={ANIMALES[a].nombre} />
          <h3>{ANIMALES[a].nombre}</h3>
          <p>{ANIMALES[a].esencia}</p>
        </div>
      ))}
    </div>
  );
}
