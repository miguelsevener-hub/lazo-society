import type { Metadata } from "next";
import { Test } from "@/components/Test";
export const metadata: Metadata = { title: "Descubre tu animal" };
export default function TestPublico() {
  return (
    <main className="hoja"><div className="marco"><Test modo="publico" /></div></main>
  );
}
