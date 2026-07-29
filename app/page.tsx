import { GameShell } from "@/components/ui/GameShell";
import { RainyCityBackground } from "@/components/home/RainyCityBackground";
import { MainMenu } from "@/components/home/MainMenu";
import { ContinueCard } from "@/components/home/ContinueCard";
import { SaveIndicator } from "@/components/ui/SaveIndicator";
import { CASE_LIST } from "@/lib/game/cases";

export default function Home() {
  return (
    <GameShell scanlines={false} className="items-center justify-center overflow-hidden">
      <RainyCityBackground />

      <div className="relative z-10 flex w-full max-w-5xl flex-1 flex-col justify-between gap-10 px-6 py-12 sm:px-12">
        <header>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-signal">
            Detective console online
          </p>
          <h1 className="font-display mt-3 text-4xl leading-none text-paper sm:text-6xl">
            AI Detective: Console Edition
          </h1>
          <p className="mt-3 max-w-md text-sm text-fog">
            {CASE_LIST.length} case file{CASE_LIST.length === 1 ? "" : "s"} open for investigation. Interview
            suspects, catch contradictions, reconstruct the timeline, and accuse the killer.
          </p>
        </header>

        <div className="grid gap-10 sm:grid-cols-[1fr_auto] sm:items-end">
          <MainMenu />
          <ContinueCard />
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-steel pt-4">
          <SaveIndicator />
          <p className="font-mono text-[11px] text-fog">
            &uarr;&darr; navigate &middot; Enter select &middot; Gamepad supported (experimental)
          </p>
        </footer>
      </div>
    </GameShell>
  );
}
