import type { Metadata } from "next";
import { Formulario } from "./Formulario";
export const metadata: Metadata = { title: "Lazo para mi boda" };
export default function Pedir() {
  return (
    <main className="contenedor" style={{ padding: "72px 24px" }}>
      <h2>Lazo para vuestra boda</h2>
      <p className="serifa">Dos minutos. Al terminar tendréis la página de vuestra boda y el enlace para los solteros.</p>
      <Formulario />
    </main>
  );
}
