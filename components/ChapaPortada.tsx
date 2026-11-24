"use client";
import { useEffect, useState } from "react";
import { Chapa } from "./Chapa";
import { ANIMALES, espejo, type Animal } from "@/lib/test";

const ORDEN: Animal[] = ["caballo", "lince", "halcon", "ciervo", "lobo", "cisne"];

export function ChapaPortada() {
  const [i, setI] = useState(0);
  const [girada, setGirada] = useState(false);
  const [quieto, setQuieto] = useState(false);
  const animal = ORDEN[i];

  useEffect(() => {
    setQuieto(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  function siguiente() {
    if (quieto) { setI((i + 1) % ORDEN.length); return; }
    setGirada(true);
    window.setTimeout(() => { setI((v) => (v + 1) % ORDEN.length); setGirada(false); }, 420);
  }

  return (
    <div className="portada-chapa">
      <Chapa animal={animal} tam="min(72vw, 46vh, 500px)" viva balanceo girada={girada} onClick={siguiente}
        etiqueta={`Chapa del ${ANIMALES[animal].nombre}. Toca para ver otra.`} />
      <p className="portada-pie" aria-live="polite">
        <span className="voz">Club {ANIMALES[animal].nombre}.</span> Busca a un {ANIMALES[espejo(animal)].nombre}.
      </p>
    </div>
  );
}
