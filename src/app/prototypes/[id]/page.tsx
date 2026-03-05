import { notFound } from "next/navigation";
import { prototypes } from "@/data/prototypes";
import PrototypeContent from "@/components/prototypes/PrototypeContent";

export function generateStaticParams() {
  return prototypes.map((rec) => ({ id: String(rec.id) }));
}

export default async function PrototypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rec = prototypes.find((r) => r.id === Number(id));
  if (!rec) notFound();

  const prev = prototypes.find((r) => r.id === rec.id - 1);
  const next = prototypes.find((r) => r.id === rec.id + 1);

  return <PrototypeContent rec={rec} prev={prev} next={next} />;
}
