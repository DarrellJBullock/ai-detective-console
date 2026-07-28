import { notFound } from "next/navigation";
import { GameShell } from "@/components/ui/GameShell";
import { CaseNav } from "@/components/case/CaseNav";
import { PageTransition } from "@/components/ui/PageTransition";
import { SuspectProfilePanel } from "@/components/suspects/SuspectProfilePanel";
import { getSuspectById, SUSPECTS } from "@/lib/game/suspects";

export function generateStaticParams() {
  return SUSPECTS.map((s) => ({ id: s.id }));
}

export default async function SuspectProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const suspect = getSuspectById(id);
  if (!suspect) notFound();

  return (
    <GameShell>
      <CaseNav />
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-8">
        <PageTransition>
          <SuspectProfilePanel suspect={suspect} />
        </PageTransition>
      </div>
    </GameShell>
  );
}
