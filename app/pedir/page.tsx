import type { Metadata } from "next";
import { Formulario } from "./Formulario";
export const metadata: Metadata = { title: "Lazo para mi boda" };
export default function Pedir() {
  return (
    <main className="hoja">
      <div className="marco columna">
        <h1>Lazo para vuestra boda</h1>
        <p className="entrada">Dos minutos. Al terminar tendréis la página de vuestra boda y el enlace para los solteros.</p>
        <Formulario />
      </div>
    </main>
  );
}
