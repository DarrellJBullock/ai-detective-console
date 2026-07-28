import { GameShell } from "@/components/ui/GameShell";
import { CaseNav } from "@/components/case/CaseNav";
import { CaseProgress } from "@/components/case/CaseProgress";
import { OrionPanel } from "@/components/case/OrionPanel";
import { EvidenceBoard } from "@/components/board/EvidenceBoard";
import { PageTransition } from "@/components/ui/PageTransition";

export default function BoardPage() {
  return (
    <GameShell>
      <CaseNav />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8">
        <PageTransition>
          <h1 className="font-display mb-2 text-2xl text-paper sm:text-3xl">Case Board</h1>
          <p className="mb-6 text-sm text-fog">
            Investigate suspects, review the timeline, and inspect the evidence file. Connections
            appear once contradictions are caught.
          </p>

          <div className="mb-8">
            <CaseProgress />
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <EvidenceBoard />
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <OrionPanel variant="summary" />
            </aside>
          </div>
        </PageTransition>
      </div>
    </GameShell>
  );
}
