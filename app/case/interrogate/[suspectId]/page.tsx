import { GameShell } from "@/components/ui/GameShell";
import { CaseNav } from "@/components/case/CaseNav";
import { PageTransition } from "@/components/ui/PageTransition";
import { InterrogationRoom } from "@/components/interrogation/InterrogationRoom";

export default async function InterrogatePage({
  params,
}: {
  params: Promise<{ suspectId: string }>;
}) {
  const { suspectId } = await params;

  return (
    <GameShell>
      <CaseNav />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8">
        <PageTransition>
          <InterrogationRoom suspectId={suspectId} />
        </PageTransition>
      </div>
    </GameShell>
  );
}
