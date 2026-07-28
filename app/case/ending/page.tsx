import { GameShell } from "@/components/ui/GameShell";
import { CaseNav } from "@/components/case/CaseNav";
import { PageTransition } from "@/components/ui/PageTransition";
import { EndingResult } from "@/components/ending/EndingResult";

export default function EndingPage() {
  return (
    <GameShell>
      <CaseNav />
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-8">
        <PageTransition>
          <EndingResult />
        </PageTransition>
      </div>
    </GameShell>
  );
}
