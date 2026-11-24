"use client";
import { useActionState, useState } from "react";
import { crearBoda, type EstadoPedido } from "./actions";
import { estimarSolteros, packPara, euros } from "@/lib/precio";

export function Formulario() {
  const [estado, enviar, enviando] = useActionState<EstadoPedido, FormData>(crearBoda, {});
  const [invitados, setInvitados] = useState(150);
  const [edad, setEdad] = useState(32);
  const [amigos, setAmigos] = useState(60);
  const [solteros, setSolteros] = useState("");
  const estimados = estimarSolteros(invitados, edad, amigos / 100);
  const cuenta = solteros ? Number(solteros) : estimados;
  const pack = packPara(cuenta);

  return (
    <form action={enviar}>
      <input className="oculto" name="web" tabIndex={-1} autoComplete="off" aria-hidden />
      <label htmlFor="novios">Los novios</label>
      <input id="novios" name="novios" placeholder="Leyre y Álex" required />
      <label htmlFor="fecha">Fecha de la boda</label>
      <input id="fecha" name="fecha" type="date" required />
      <label htmlFor="lugar">Dónde (opcional)</label>
      <input id="lugar" name="lugar" placeholder="Finca, ciudad" />
      <label htmlFor="email">Email de contacto</label>
      <input id="email" name="email" type="email" required />

      <label htmlFor="invitados">Invitados: {invitados}</label>
      <input id="invitados" name="invitados" type="range" min={20} max={400} step={5} value={invitados} onChange={(e) => setInvitados(Number(e.target.value))} />
      <label htmlFor="edad">Edad de los novios (aprox.): {edad}</label>
      <input id="edad" name="edad" type="range" min={20} max={60} value={edad} onChange={(e) => setEdad(Number(e.target.value))} />
      <label htmlFor="amigos">Parte de la lista que son amigos: {amigos} %</label>
      <input id="amigos" name="amigos" type="range" min={0} max={100} step={5} value={amigos} onChange={(e) => setAmigos(Number(e.target.value))} />
      <label htmlFor="solteros">¿Sabéis cuántos solteros habrá? (opcional)</label>
      <input id="solteros" name="solteros" type="number" min={1} max={500} value={solteros} onChange={(e) => setSolteros(e.target.value)} placeholder={`Calculamos unos ${estimados}`} />
      <label htmlFor="codigo">Código de vuestro wedding planner (opcional)</label>
      <input id="codigo" name="codigo" />

      <div className="resumen-pack" aria-live="polite">
        <p className="suave" style={{ margin: 0 }}>{solteros ? "Con" : "Calculamos unos"} {cuenta} solteros</p>
        <p className="grande">Pack {pack.nombre}, {pack.desde ? "desde " : ""}{euros(pack.precio)}</p>
        <p className="suave" style={{ margin: 0, fontSize: "0.95rem" }}>Precio cerrado. Si al final hay algún soltero más, la cesta de chapas sueltas lo cubre.</p>
      </div>
      {estado.error && <p className="error" style={{ marginTop: 16 }}>{estado.error}</p>}
      <p style={{ marginTop: 24 }}><button className="boton" disabled={enviando}>{enviando ? "Enviando…" : "Pedir Lazo"}</button></p>
      <p className="suave" style={{ fontSize: "0.92rem" }}>Todavía no cobramos online: os escribimos para confirmar el pedido.</p>
    </form>
  );
}
