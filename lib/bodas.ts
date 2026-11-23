import "server-only";
import { db, hayBaseDeDatos } from "@/lib/supabase";

export type Boda = { id: string; slug: string; novios: string; fecha: string; lugar: string | null; cierre_test: string; estado: string };

export async function bodaPorSlug(slug: string): Promise<Boda | null> {
  if (!hayBaseDeDatos()) return null;
  const { data } = await db().from("bodas").select("id, slug, novios, fecha, lugar, cierre_test, estado").eq("slug", slug).maybeSingle();
  return data && data.estado !== "cancelada" ? (data as Boda) : null;
}

export const fechaLarga = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
export const diasHasta = (iso: string) => Math.ceil((Date.parse(iso + "T00:00:00") - Date.now()) / 864e5);
