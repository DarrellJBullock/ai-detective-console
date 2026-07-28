import { GameShell } from "@/components/ui/GameShell";
import { CaseNav } from "@/components/case/CaseNav";
import { EvidenceInventory } from "@/components/evidence/EvidenceInventory";
import { PageTransition } from "@/components/ui/PageTransition";

export default function EvidencePage() {
  return (
    <GameShell>
      <CaseNav />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8">
        <PageTransition>
          <h1 className="font-display mb-2 text-2xl text-paper sm:text-3xl">Evidence Room</h1>
          <p className="mb-6 text-sm text-fog">
            The complete case file. Evidence unlocks as you investigate related suspects.
          </p>
          <EvidenceInventory />
        </PageTransition>
      </div>
    </GameShell>
  );
}
