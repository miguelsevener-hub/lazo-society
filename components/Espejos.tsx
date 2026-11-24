"use client";
import { useState } from "react";
import { Chapa } from "./Chapa";
import { ANIMALES, espejo, type Animal } from "@/lib/test";

const ORDEN: Animal[] = ["caballo", "halcon", "lobo", "lince", "ciervo", "cisne"];

export function Espejos() {
  const [elegido, setElegido] = useState<Animal | null>(null);
  const par = elegido ? espejo(elegido) : null;
  return (
    <div className="espejos">
      <ul className="espejos-rejilla">
        {ORDEN.map((a) => {
          const estado = !elegido ? "" : a === elegido ? "es-elegido" : a === par ? "es-espejo" : "es-apagado";
          return (
            <li key={a} className={`espejo ${estado}`}>
              <Chapa animal={a} tam="clamp(96px, 20vw, 184px)" viva onClick={() => setElegido(a === elegido ? null : a)}
                etiqueta={`${ANIMALES[a].nombre}: ver a quién busca`} />
              <h3>{ANIMALES[a].nombre}</h3>
              <p>{ANIMALES[a].esencia}</p>
            </li>
          );
        })}
      </ul>
      <p className="espejos-frase" aria-live="polite">
        {elegido && par
          ? <>El {ANIMALES[elegido].nombre} busca a un {ANIMALES[par].nombre}. <span className="suave">Lo mismo, a otro ritmo.</span></>
          : <span className="suave">Toca una chapa para ver a quién busca.</span>}
      </p>
    </div>
  );
}
