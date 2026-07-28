import { GameShell } from "@/components/ui/GameShell";
import { CaseNav } from "@/components/case/CaseNav";
import { PageTransition } from "@/components/ui/PageTransition";
import { TimelineBoard } from "@/components/timeline/TimelineBoard";

export default function TimelinePage() {
  return (
    <GameShell>
      <CaseNav />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8">
        <PageTransition>
          <h1 className="font-display mb-2 text-2xl text-paper sm:text-3xl">Timeline Reconstruction</h1>
          <p className="mb-6 text-sm text-fog">
            Contested moments turn green once you catch the contradiction that proves them.
          </p>
          <TimelineBoard />
        </PageTransition>
      </div>
    </GameShell>
  );
}
