import { GameShell } from "@/components/ui/GameShell";
import { CaseNav } from "@/components/case/CaseNav";
import { CaseBriefingPanel } from "@/components/case/CaseBriefingPanel";
import { PageTransition } from "@/components/ui/PageTransition";

export default function BriefingPage() {
  return (
    <GameShell>
      <CaseNav />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8">
        <PageTransition>
          <h1 className="font-display mb-6 text-2xl text-paper sm:text-3xl">Case Briefing</h1>
          <CaseBriefingPanel />
        </PageTransition>
      </div>
    </GameShell>
  );
}
