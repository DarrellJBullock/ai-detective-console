import Link from "next/link";
import { GameShell } from "@/components/ui/GameShell";
import { PageTransition } from "@/components/ui/PageTransition";
import { CaseSelectGrid } from "@/components/case/CaseSelectGrid";

export default function CaseFilesPage() {
  return (
    <GameShell>
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-8">
        <PageTransition>
          <Link href="/" className="console-focus font-mono mb-6 inline-block text-xs text-fog hover:text-red-string">
            &larr; Back to Menu
          </Link>
          <h1 className="font-display mb-2 text-2xl text-paper sm:text-3xl">Case Files</h1>
          <p className="mb-8 text-sm text-fog">
            Choose a case to open. Starting a new case replaces your current save.
          </p>
          <CaseSelectGrid />
        </PageTransition>
      </div>
    </GameShell>
  );
}
