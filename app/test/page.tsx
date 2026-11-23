import type { Metadata } from "next";
import { Test } from "@/components/Test";
export const metadata: Metadata = { title: "Descubre tu animal" };
export default function TestPublico() {
  return (
    <main className="contenedor" style={{ padding: "64px 24px" }}>
      <p className="marca">Lazo Society</p>
      <Test modo="publico" />
    </main>
  );
}
