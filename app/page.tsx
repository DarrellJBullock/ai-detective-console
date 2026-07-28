import { GameShell } from "@/components/ui/GameShell";
import { RainyCityBackground } from "@/components/home/RainyCityBackground";
import { MainMenu } from "@/components/home/MainMenu";
import { ContinueCard } from "@/components/home/ContinueCard";
import { SaveIndicator } from "@/components/ui/SaveIndicator";
import { CASE_META } from "@/lib/game/caseData";

export default function Home() {
  return (
    <GameShell scanlines={false} className="items-center justify-center overflow-hidden">
      <RainyCityBackground />

      <div className="relative z-10 flex w-full max-w-5xl flex-1 flex-col justify-between gap-10 px-6 py-12 sm:px-12">
        <header>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-signal">
            AI Detective: Console Edition
          </p>
          <h1 className="font-display mt-3 text-4xl leading-none text-paper sm:text-6xl">
            {CASE_META.title}
          </h1>
          <p className="mt-3 max-w-md text-sm text-fog">{CASE_META.premise}</p>
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
