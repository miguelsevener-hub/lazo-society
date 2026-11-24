import { notFound } from "next/navigation";
import { bodaPorSlug } from "@/lib/bodas";
import { Test } from "@/components/Test";

export const dynamic = "force-dynamic";

export default async function Pagina({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const boda = await bodaPorSlug(slug);
  if (!boda) notFound();
  return (
    <main className="hoja"><div className="marco">
      <Test modo="antes" slug={boda.slug} novios={boda.novios} />
    </div></main>
  );
}
