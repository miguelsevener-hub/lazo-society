"use client";
import { useRef, type CSSProperties } from "react";
import { ANIMALES, type Animal } from "@/lib/test";

type Props = {
  animal: Animal;
  /** Diámetro CSS, p. ej. "min(68vw, 58vh)" */
  tam?: string;
  /** Se inclina siguiendo el puntero */
  viva?: boolean;
  /** Muestra el reverso (para girarla) */
  girada?: boolean;
  /** Animación de balanceo en reposo */
  balanceo?: boolean;
  className?: string;
  onClick?: () => void;
  etiqueta?: string;
};

/** Chapa de esmalte: anverso con la escena, aro metálico, reflejo que sigue al puntero y reverso grabado. */
export function Chapa({ animal, tam = "220px", viva = false, girada = false, balanceo = false, className = "", onClick, etiqueta }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function mover(e: React.PointerEvent) {
    if (!viva || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.setProperty("--ry", `${x * 26}deg`);
    ref.current.style.setProperty("--rx", `${-y * 26}deg`);
    ref.current.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    ref.current.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  }
  function soltar() {
    if (!ref.current) return;
    ref.current.style.setProperty("--rx", "0deg");
    ref.current.style.setProperty("--ry", "0deg");
    ref.current.style.setProperty("--mx", "30%");
    ref.current.style.setProperty("--my", "25%");
  }

  const nombre = ANIMALES[animal].nombre;
  const Tag = onClick ? "button" : "div";

  return (
    <div
      ref={ref}
      className={`chapa ${viva ? "chapa-viva" : ""} ${balanceo ? "chapa-balanceo" : ""} ${className}`}
      style={{ "--tam": tam } as CSSProperties}
      onPointerMove={mover}
      onPointerLeave={soltar}
    >
      <Tag className="chapa-cuerpo" onClick={onClick} aria-label={etiqueta ?? `Chapa del ${nombre}`} type={onClick ? "button" : undefined}>
        <span className={`chapa-giro ${girada ? "es-girada" : ""}`}>
          <span className="chapa-cara chapa-anverso">
            <img src={`/chapas/${animal}.webp`} alt="" draggable={false} />
            <span className="chapa-brillo" />
          </span>
          <span className="chapa-cara chapa-reverso" aria-hidden>
            <svg viewBox="0 0 200 200">
              <defs>
                <path id={`aro-${animal}`} d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
              </defs>
              <text className="grabado">
                <textPath href={`#aro-${animal}`} startOffset="0">LAZO SOCIETY ✦ WEAR YOUR TYPE ✦ LAZO SOCIETY ✦ WEAR YOUR TYPE ✦</textPath>
              </text>
              <circle cx="100" cy="100" r="22" className="cierre" />
              <rect x="40" y="96" width="120" height="8" rx="4" className="aguja" />
              <text x="100" y="150" textAnchor="middle" className="grabado-club">Club {nombre}</text>
            </svg>
          </span>
        </span>
      </Tag>
      <span className="chapa-sombra" aria-hidden />
    </div>
  );
}
