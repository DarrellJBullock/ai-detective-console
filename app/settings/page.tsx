import Link from "next/link";
import { GameShell } from "@/components/ui/GameShell";
import { PageTransition } from "@/components/ui/PageTransition";
import { SettingsPanel } from "@/components/ui/SettingsPanel";

export default function SettingsPage() {
  return (
    <GameShell>
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-8">
        <PageTransition>
          <Link href="/" className="console-focus font-mono mb-6 inline-block text-xs text-fog hover:text-red-string">
            &larr; Back to Menu
          </Link>
          <h1 className="font-display mb-6 text-2xl text-paper sm:text-3xl">Settings</h1>
          <SettingsPanel />
        </PageTransition>
      </div>
    </GameShell>
  );
}
