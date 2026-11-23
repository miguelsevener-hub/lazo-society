export type Pack = { id: string; nombre: string; hasta: number | null; precio: number; desde?: boolean };

export const PACKS: Pack[] = [
  { id: "intimo", nombre: "Íntimo", hasta: 15, precio: 390 },
  { id: "club", nombre: "Club", hasta: 35, precio: 590 },
  { id: "gran-club", nombre: "Gran Club", hasta: 60, precio: 790 },
  { id: "sin-limite", nombre: "Sin límite", hasta: null, precio: 990, desde: true },
];

/** Solteros entre los amigos según la edad de los novios (hipótesis: se recalibra con bodas reales). */
export function solterosEntreAmigos(edadNovios: number) {
  if (edadNovios < 30) return 0.5;
  if (edadNovios < 35) return 0.4;
  if (edadNovios < 40) return 0.3;
  return 0.2;
}
export const SOLTEROS_FAMILIA = 0.1;

export function estimarSolteros(invitados: number, edadNovios: number, parteAmigos: number) {
  const f = Math.min(Math.max(parteAmigos, 0), 1);
  return Math.round(invitados * (f * solterosEntreAmigos(edadNovios) + (1 - f) * SOLTEROS_FAMILIA));
}

export function packPara(solteros: number): Pack {
  return PACKS.find((p) => p.hasta === null || solteros <= p.hasta)!;
}

export const euros = (n: number) => `${n.toLocaleString("es-ES")} €`;
