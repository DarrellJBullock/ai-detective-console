import { notFound } from "next/navigation";
import { GameShell } from "@/components/ui/GameShell";
import { CaseNav } from "@/components/case/CaseNav";
import { PageTransition } from "@/components/ui/PageTransition";
import { InterrogationRoom } from "@/components/interrogation/InterrogationRoom";
import { getSuspectById, SUSPECTS } from "@/lib/game/suspects";

export function generateStaticParams() {
  return SUSPECTS.map((s) => ({ suspectId: s.id }));
}

export default async function InterrogatePage({
  params,
}: {
  params: Promise<{ suspectId: string }>;
}) {
  const { suspectId } = await params;
  const suspect = getSuspectById(suspectId);
  if (!suspect) notFound();

  return (
    <GameShell>
      <CaseNav />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8">
        <PageTransition>
          <InterrogationRoom suspect={suspect} />
        </PageTransition>
      </div>
    </GameShell>
  );
}
