"use server";
import { redirect } from "next/navigation";
import { db } from "@/lib/supabase";
import { estimarSolteros, packPara } from "@/lib/precio";
import { slugify } from "@/lib/slug";

export type EstadoPedido = { error?: string };

export async function crearBoda(_: EstadoPedido, form: FormData): Promise<EstadoPedido> {
  if (form.get("web")) return { error: "No se pudo enviar." }; // trampa para bots
  const novios = String(form.get("novios") ?? "").trim();
  const fecha = String(form.get("fecha") ?? "");
  const email = String(form.get("email") ?? "").trim();
  const invitados = Number(form.get("invitados"));
  const edad = Number(form.get("edad"));
  const amigos = Number(form.get("amigos")) / 100;
  const declarados = form.get("solteros") ? Number(form.get("solteros")) : null;
  const codigo = String(form.get("codigo") ?? "").trim().toUpperCase() || null;

  if (!novios || !fecha || !/^\S+@\S+\.\S+$/.test(email)) return { error: "Faltan los nombres, la fecha o un email válido." };
  if (!(invitados >= 10) || !(edad >= 18) || !(amigos >= 0 && amigos <= 1)) return { error: "Revisa los números." };
  const dias = (Date.parse(fecha) - Date.now()) / 864e5;
  if (dias < 21) return { error: "Necesitamos al menos tres semanas antes de la boda para producir el kit." };

  const estimados = estimarSolteros(invitados, edad, amigos);
  const pack = packPara(declarados ?? estimados);
  const base = `${slugify(novios)}-${fecha.slice(0, 4)}`;

  let supa;
  try { supa = db(); } catch { return { error: "El sistema de pedidos no está configurado todavía." }; }
  let slug = base;
  for (let i = 0; i < 5; i++) {
    const { error } = await supa.from("bodas").insert({
      slug, novios, fecha, email_contacto: email,
      lugar: String(form.get("lugar") ?? "") || null,
      telefono: String(form.get("telefono") ?? "") || null,
      invitados, edad_novios: edad, parte_amigos: amigos,
      solteros_estimados: estimados, solteros_declarados: declarados,
      pack: pack.id, precio: pack.precio, codigo_socio: codigo,
    });
    if (!error) redirect(`/pedir/gracias?boda=${slug}`);
    if (error.code === "23505") { slug = `${base}-${Math.random().toString(36).slice(2, 6)}`; continue; }
    if (error.code === "23503") return { error: "Ese código de socio no existe." };
    console.error(error);
    return { error: "No hemos podido guardar el pedido. Inténtalo de nuevo en un momento." };
  }
  return { error: "No hemos podido crear la página de la boda." };
}
