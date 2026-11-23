"use server";
import { db } from "@/lib/supabase";
import { clasificar, espejo, CALIBRACION, type Animal } from "@/lib/test";
import { PREGUNTAS } from "@/lib/preguntas";

export type Modo = "antes" | "en_la_boda" | "publico";
export type EntradaTest = {
  modo: Modo; slug?: string; nombre: string; email: string;
  mayorEdad: boolean; aceptaJuego: boolean; aceptaSociety: boolean; respuestas: number[];
};
export type SalidaTest =
  | { ok: true; id: string; revelado: false }
  | { ok: true; id: string; revelado: true; animal: Animal; toque: Animal; espejo: Animal }
  | { ok: false; error: string };

export async function guardarTest(e: EntradaTest): Promise<SalidaTest> {
  try { return await guardar(e); } catch (err) { console.error(err); return { ok: false, error: "Ahora mismo no podemos guardar tests. Inténtalo en un rato." }; }
}

async function guardar(e: EntradaTest): Promise<SalidaTest> {
  if (!e.nombre.trim() || !/^\S+@\S+\.\S+$/.test(e.email)) return { ok: false, error: "Necesitamos tu nombre y un email válido." };
  if (!e.mayorEdad || !e.aceptaJuego) return { ok: false, error: "Para jugar hay que ser mayor de edad y aceptar las condiciones." };
  if (e.respuestas.length !== PREGUNTAS.length || e.respuestas.some((r, i) => !PREGUNTAS[i].o[r])) return { ok: false, error: "Faltan respuestas." };

  const supa = db();
  let bodaId: string | null = null;
  if (e.modo !== "publico") {
    const { data: boda } = await supa.from("bodas").select("id, cierre_test, estado").eq("slug", e.slug ?? "").maybeSingle();
    if (!boda || boda.estado === "cancelada") return { ok: false, error: "No encontramos esta boda." };
    if (e.modo === "antes" && new Date(boda.cierre_test) < new Date(new Date().toDateString()))
      return { ok: false, error: "El test previo ya está cerrado. Hazlo en la boda con el QR del cartel." };
    bodaId = boda.id;
  }

  const r = clasificar(e.respuestas);
  const { data, error } = await supa.from("solteros").insert({
    boda_id: bodaId, nombre: e.nombre.trim(), email: e.email.trim().toLowerCase(),
    mayor_edad: e.mayorEdad, acepta_juego: e.aceptaJuego, acepta_society: e.aceptaSociety,
    respuestas: e.respuestas, animal: r.animal, toque: r.toque, calibracion: CALIBRACION.version, origen: e.modo,
  }).select("id").single();
  if (error) {
    if (error.code === "23505") return { ok: false, error: "Ya hay un test con este email en esta boda." };
    console.error(error);
    return { ok: false, error: "No hemos podido guardar tu test. Inténtalo de nuevo." };
  }
  if (e.modo === "antes") return { ok: true, id: data.id, revelado: false };
  return { ok: true, id: data.id, revelado: true, animal: r.animal, toque: r.toque, espejo: espejo(r.animal) };
}

export async function guardarTeVes(id: string, valor: number) {
  if (!(valor >= 1 && valor <= 5)) return;
  await db().from("solteros").update({ te_ves: valor }).eq("id", id).is("te_ves", null);
}
