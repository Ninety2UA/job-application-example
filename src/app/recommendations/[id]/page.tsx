import { notFound } from "next/navigation";
import { recommendations } from "@/data/recommendations";
import RecommendationContent from "@/components/recommendations/RecommendationContent";

export function generateStaticParams() {
  return recommendations.map((rec) => ({ id: String(rec.id) }));
}

export default async function RecommendationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rec = recommendations.find((r) => r.id === Number(id));
  if (!rec) notFound();

  const prev = recommendations.find((r) => r.id === rec.id - 1);
  const next = recommendations.find((r) => r.id === rec.id + 1);

  return <RecommendationContent rec={rec} prev={prev} next={next} />;
}
