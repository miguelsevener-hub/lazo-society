"use client";
import { useMemo, useState } from "react";
import { PREGUNTAS } from "@/lib/preguntas";
import { ANIMALES } from "@/lib/test";
import { guardarTest, guardarTeVes, type Modo, type SalidaTest } from "@/lib/acciones";
import { Chapa } from "./Chapa";

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
      <div className="test">
        {novios && <p className="voz" style={{ fontSize: "1.4rem", color: "var(--medianoche)" }}>Boda de {novios}</p>}
        <h1 className="pregunta">Diecisiete preguntas. Unos tres minutos.</h1>
        <label htmlFor="n">Tu nombre (el que irá en el sobre)</label>
        <input id="n" value={datos.nombre} onChange={(e) => setDatos({ ...datos, nombre: e.target.value })} />
        <label htmlFor="m">Tu email</label>
        <input id="m" type="email" value={datos.email} onChange={(e) => setDatos({ ...datos, email: e.target.value })} />
        <label className="check"><input type="checkbox" checked={datos.mayorEdad} onChange={(e) => setDatos({ ...datos, mayorEdad: e.target.checked })} />Tengo 18 años o más.</label>
        <label className="check"><input type="checkbox" checked={datos.aceptaJuego} onChange={(e) => setDatos({ ...datos, aceptaJuego: e.target.checked })} />Acepto que Lazo Society guarde mis respuestas para jugar{modo === "publico" ? "" : " en esta boda"}.</label>
        <label className="check"><input type="checkbox" checked={datos.aceptaSociety} onChange={(e) => setDatos({ ...datos, aceptaSociety: e.target.checked })} />Quiero unirme a la Society: la carta y los eventos (opcional).</label>
        <p style={{ marginTop: 32 }}><button className="boton" disabled={!listo} onClick={() => setFase("test")}>Empezar el test</button></p>
      </div>
    );
  }

  if (fase === "test") {
    return (
      <div className="test">
        <div className="progreso"><span style={{ width: `${(paso / ORDEN.length) * 100}%` }} /></div>
        <p className="contador">{paso + 1} de {ORDEN.length}</p>
        <h2 className="pregunta" key={qi}>{q.q}</h2>
        {opciones.map(({ o, i }) => (
          <button key={`${qi}-${i}`} className="opcion" onClick={() => elegir(i)}>{o.t}</button>
        ))}
        {paso > 0 && <button className="atras" onClick={() => setPaso(paso - 1)}>Volver a la anterior</button>}
      </div>
    );
  }

  if (fase === "enviando" || !salida) return <p className="pregunta">Leyendo tus respuestas…</p>;

  if (!salida.ok) return (
    <div className="test"><p className="error">{salida.error}</p><button className="boton boton-linea" onClick={() => setFase("datos")}>Revisar mis datos</button></div>
  );

  if (!salida.revelado) return (
    <div className="revelado">
      <div className="sobre" aria-hidden><span className="nombre-sobre">{datos.nombre}</span><span className="sello">L.S</span></div>
      <h1 className="club" style={{ marginTop: 0 }}>Tu animal te espera en la boda</h1>
      <p className="esencia">Está guardado en un sobre con tu nombre. Lo abriréis todos a la vez.</p>
      <p className="busca voz">Hasta entonces, ni una pista.</p>
    </div>
  );

  const a = ANIMALES[salida.animal], esp = ANIMALES[salida.espejo], toque = ANIMALES[salida.toque];
  return (
    <div className="revelado">
      <div className="entrada-chapa"><Chapa animal={salida.animal} tam="min(72vw, 360px)" viva /></div>
      <h1 className="club">Club {a.nombre}</h1>
      <p className="esencia">{a.esencia} Con un toque de {toque.nombre}.</p>
      <p className="busca">Busca a un <strong>{esp.nombre}</strong>.</p>
      {modo === "en_la_boda" && <p className="aviso">Coge tu chapa de {a.nombre} de la cesta y póntela.</p>}
      <div className="te-ves">
        <p style={{ margin: 0 }}>¿Te ves? Del 1 al 5.</p>
        <div className="botones">
          {[1, 2, 3, 4, 5].map((v) => (
            <button key={v} aria-pressed={teVes === v} disabled={teVes !== null}
              onClick={() => { setTeVes(v); guardarTeVes(salida.id, v); }}>{v}</button>
          ))}
        </div>
        {teVes !== null && <p style={{ marginTop: 12 }}>Gracias. Así afinamos el test.</p>}
      </div>
    </div>
  );
}
