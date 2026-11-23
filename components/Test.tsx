"use client";
import { useMemo, useState } from "react";
import { PREGUNTAS } from "@/lib/preguntas";
import { ANIMALES } from "@/lib/test";
import { guardarTest, guardarTeVes, type Modo, type SalidaTest } from "@/lib/acciones";

// Orden de presentación: energía y ancla intercaladas para que no se note el patrón
const ORDEN = [0, 8, 1, 9, 2, 10, 3, 11, 4, 12, 5, 13, 6, 14, 7, 15, 16];

export function Test({ modo, slug, novios }: { modo: Modo; slug?: string; novios?: string }) {
  const [fase, setFase] = useState<"datos" | "test" | "enviando" | "fin">("datos");
  const [datos, setDatos] = useState({ nombre: "", email: "", mayorEdad: false, aceptaJuego: false, aceptaSociety: false });
  const [paso, setPaso] = useState(0);
  const [resp, setResp] = useState<number[]>(Array(PREGUNTAS.length).fill(-1));
  const [salida, setSalida] = useState<SalidaTest | null>(null);
  const [teVes, setTeVes] = useState<number | null>(null);
  const qi = ORDEN[paso];
  const q = PREGUNTAS[qi];
  const opciones = useMemo(() => q.o.map((o, i) => ({ o, i })), [q]);

  async function elegir(i: number) {
    const nuevas = [...resp]; nuevas[qi] = i; setResp(nuevas);
    if (paso < ORDEN.length - 1) { setPaso(paso + 1); return; }
    setFase("enviando");
    const s = await guardarTest({ modo, slug, ...datos, respuestas: nuevas });
    setSalida(s); setFase("fin");
  }

  if (fase === "datos") {
    const listo = datos.nombre.trim() && /^\S+@\S+\.\S+$/.test(datos.email) && datos.mayorEdad && datos.aceptaJuego;
    return (
      <div>
        {novios && <p className="voz" style={{ fontSize: "1.3rem" }}>Boda de {novios}</p>}
        <h2>Diecisiete preguntas. Unos tres minutos.</h2>
        <label htmlFor="n">Tu nombre (el que irá en el sobre)</label>
        <input id="n" value={datos.nombre} onChange={(e) => setDatos({ ...datos, nombre: e.target.value })} />
        <label htmlFor="m">Tu email</label>
        <input id="m" type="email" value={datos.email} onChange={(e) => setDatos({ ...datos, email: e.target.value })} />
        <label className="check"><input type="checkbox" checked={datos.mayorEdad} onChange={(e) => setDatos({ ...datos, mayorEdad: e.target.checked })} />Tengo 18 años o más.</label>
        <label className="check"><input type="checkbox" checked={datos.aceptaJuego} onChange={(e) => setDatos({ ...datos, aceptaJuego: e.target.checked })} />Acepto que Lazo Society guarde mis respuestas para jugar{modo === "publico" ? "" : " en esta boda"}.</label>
        <label className="check"><input type="checkbox" checked={datos.aceptaSociety} onChange={(e) => setDatos({ ...datos, aceptaSociety: e.target.checked })} />Quiero unirme a la Society: la carta y los eventos (opcional).</label>
        <p style={{ marginTop: 24 }}><button className="boton" disabled={!listo} onClick={() => setFase("test")}>Empezar</button></p>
      </div>
    );
  }

  if (fase === "test") {
    return (
      <div>
        <div className="barra"><span style={{ width: `${(paso / ORDEN.length) * 100}%` }} /></div>
        <p style={{ color: "var(--suave)", fontSize: "0.85rem" }}>{paso + 1} / {ORDEN.length}</p>
        <h2 style={{ fontSize: "1.5rem" }}>{q.q}</h2>
        {opciones.map(({ o, i }) => (
          <button key={i} className="opcion" onClick={() => elegir(i)}>{o.t}</button>
        ))}
        {paso > 0 && <button className="boton boton-sec" style={{ marginTop: 12 }} onClick={() => setPaso(paso - 1)}>Atrás</button>}
      </div>
    );
  }

  if (fase === "enviando" || !salida) return <p className="serifa">Leyendo tus respuestas…</p>;

  if (!salida.ok) return (
    <div><p className="error">{salida.error}</p><button className="boton boton-sec" onClick={() => setFase("datos")}>Volver</button></div>
  );

  if (!salida.revelado) return (
    <div style={{ textAlign: "center" }}>
      <h2>Tu animal te espera en la boda.</h2>
      <p className="serifa">Está guardado en un sobre con tu nombre. Lo abriréis todos a la vez.</p>
      <p className="voz" style={{ fontSize: "1.25rem" }}>Hasta entonces, ni una pista.</p>
    </div>
  );

  const a = ANIMALES[salida.animal], esp = ANIMALES[salida.espejo], toque = ANIMALES[salida.toque];
  return (
    <div style={{ textAlign: "center" }}>
      <img src={`/animales/${salida.animal}.png`} alt={a.nombre} style={{ width: 220, maxWidth: "70%" }} />
      <h1 className="marca" style={{ fontSize: "2.6rem" }}>Club {a.nombre}</h1>
      <p className="serifa">{a.esencia}</p>
      <p>Con un toque de {toque.nombre}.</p>
      <div className="tarjeta" style={{ margin: "24px 0" }}>
        <p style={{ margin: 0, color: "var(--suave)" }}>Tu espejo</p>
        <p style={{ margin: 0, fontSize: "1.6rem", color: "var(--medianoche)" }}>Busca a un {esp.nombre}</p>
      </div>
      {modo === "en_la_boda" && <p className="aviso">Coge tu chapa de {a.nombre} de la cesta y póntela.</p>}
      <div style={{ marginTop: 24 }}>
        <p>¿Te ves?</p>
        {[1, 2, 3, 4, 5].map((v) => (
          <button key={v} className={`boton ${teVes === v ? "" : "boton-sec"}`} style={{ margin: 4, padding: "8px 16px" }}
            disabled={teVes !== null} onClick={() => { setTeVes(v); guardarTeVes(salida.id, v); }}>{v}</button>
        ))}
      </div>
    </div>
  );
}
