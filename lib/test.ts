import { PREGUNTAS } from "./preguntas";

export type Animal = "caballo" | "halcon" | "lobo" | "lince" | "ciervo" | "cisne";
export type Ancla = "L" | "C" | "P";

export const ANIMALES: Record<Animal, { nombre: string; plural: string; energia: "fuego" | "calma"; ancla: Ancla; esencia: string }> = {
  caballo: { nombre: "Caballo", plural: "Caballos", energia: "fuego", ancla: "L", esencia: "Libre, intenso, en marcha. Ama con el acelerador y sin riendas." },
  halcon: { nombre: "Halcón", plural: "Halcones", energia: "fuego", ancla: "C", esencia: "Foco, ambición, verdad. Quiere a alguien que vuele a su altura." },
  lobo: { nombre: "Lobo", plural: "Lobos", energia: "fuego", ancla: "P", esencia: "Leal, protector, fuego. Ama en manada y, si confía, va con todo." },
  lince: { nombre: "Lince", plural: "Linces", energia: "calma", ancla: "L", esencia: "Ingenio y misterio. Se muestra por fascículos y nunca aburre." },
  ciervo: { nombre: "Ciervo", plural: "Ciervos", energia: "calma", ancla: "C", esencia: "Constante, atento, firme. Construye a diario, con detalles que no se ven." },
  cisne: { nombre: "Cisne", plural: "Cisnes", energia: "calma", ancla: "P", esencia: "Profundo, fiel, sereno. Busca un amor que dure y un refugio de dos." },
};

const CELDAS: Animal[][] = [
  ["caballo", "halcon", "lobo"], // fuego: L, C, P
  ["lince", "ciervo", "cisne"], // calma: L, C, P
];

/** Pesos por pregunta (rompen empates; se recalibran con datos reales). */
export const PESOS = [1.0, 1.13, 0.94, 1.07, 0.89, 1.04, 0.97, 1.1, 1.02, 0.91, 1.11, 0.96, 1.06, 0.93, 1.08, 0.98, 1.15];

/**
 * Calibración. Punto de partida: simulación neutral (5.000 tests).
 * Recalibrar con `calibrar()` tras el piloto y cada 1.000 tests reales.
 */
export const CALIBRACION = {
  version: "2026-11-23-sim-neutral",
  umbralEnergia: 0.195,
  ajusteFuego: [-2.083, -1.841, 0] as [number, number, number],
  ajusteCalma: [-2.178, -2.158, 0] as [number, number, number],
};

const IDX_Q1 = 0, IDX_ULTIMA = 16, IDX_CUMPLIDO = 10;

export function puntuar(respuestas: number[]) {
  if (respuestas.length !== PREGUNTAS.length) throw new Error("Faltan respuestas");
  let E = 0; const A = [0, 0, 0];
  respuestas.forEach((r, i) => {
    const o = PREGUNTAS[i].o[r];
    if (!o) throw new Error(`Respuesta no válida en la pregunta ${i + 1}`);
    const w = PESOS[i];
    E += w * o.e; A[0] += w * o.l; A[1] += w * o.c; A[2] += w * o.p;
  });
  return { E, A };
}

const anclaDe = (o: { l: number; c: number; p: number }) => [o.l, o.c, o.p].indexOf(Math.max(o.l, o.c, o.p));

export function clasificar(respuestas: number[], cal = CALIBRACION) {
  const { E, A } = puntuar(respuestas);
  const q1 = PREGUNTAS[IDX_Q1].o[respuestas[IDX_Q1]].e;
  const fuego = E > cal.umbralEnergia || (E === cal.umbralEnergia && q1 > 0);
  const off = fuego ? cal.ajusteFuego : cal.ajusteCalma;
  const adj = A.map((v, i) => v - off[i]);
  const max = Math.max(...adj);
  const empatados = adj.map((v, i) => (v === max ? i : -1)).filter((i) => i >= 0);
  let a = empatados[0];
  if (empatados.length > 1) {
    const u = anclaDe(PREGUNTAS[IDX_ULTIMA].o[respuestas[IDX_ULTIMA]]);
    const c = anclaDe(PREGUNTAS[IDX_CUMPLIDO].o[respuestas[IDX_CUMPLIDO]]);
    a = empatados.includes(u) ? u : empatados.includes(c) ? c : empatados[0];
  }
  const fila = fuego ? 0 : 1;
  const animal = CELDAS[fila][a];
  // El toque: vecino en el eje más cercano a la frontera
  const orden = [...adj].map((v, i) => ({ v, i })).sort((x, y) => y.v - x.v);
  const margenAncla = (orden[0].v - orden[1].v) / 4;
  const margenEnergia = Math.abs(E - cal.umbralEnergia) / 6;
  const toque = margenEnergia < margenAncla ? CELDAS[1 - fila][a] : CELDAS[fila][orden[1].i];
  return { animal, toque, energia: E, ancla: A };
}

/** Pareja estrella: misma ancla, otra energía. Simétrica. */
export function espejo(a: Animal): Animal {
  const { energia, ancla } = ANIMALES[a];
  const col = ["L", "C", "P"].indexOf(ancla);
  return CELDAS[energia === "fuego" ? 1 : 0][col];
}
export function afines(a: Animal): Animal[] {
  const { energia } = ANIMALES[a];
  return CELDAS[energia === "fuego" ? 0 : 1].filter((x) => x !== a);
}

/** Recalibra con respuestas reales: devuelve una nueva CALIBRACION. */
export function calibrar(todas: number[][]) {
  const pts = todas.map(puntuar);
  const Es = pts.map((p) => p.E).sort((a, b) => a - b);
  const umbral = Es[Math.floor(Es.length / 2)];
  const ajustar = (grupo: number[][]) => {
    const off = [0, 0, 0];
    for (let it = 0; it < 400; it++) {
      const cuenta = [0, 0, 0];
      grupo.forEach((A) => { const adj = A.map((v, i) => v - off[i]); cuenta[adj.indexOf(Math.max(...adj))]++; });
      for (let i = 0; i < 3; i++) off[i] += 0.6 * Math.log(Math.max(cuenta[i] / grupo.length, 1e-3) * 3);
      const p = off[2]; for (let i = 0; i < 3; i++) off[i] -= p;
    }
    return off.map((x) => Math.round(x * 1000) / 1000) as [number, number, number];
  };
  const fuego = pts.filter((p) => p.E > umbral).map((p) => p.A);
  const calma = pts.filter((p) => p.E <= umbral).map((p) => p.A);
  return { version: new Date().toISOString().slice(0, 10) + "-real-" + todas.length, umbralEnergia: umbral, ajusteFuego: ajustar(fuego), ajusteCalma: ajustar(calma) };
}
