"use client";

import { useState } from "react";
import { GameButton } from "@/components/ui/GameButton";

export function QuestionInput({
  onAsk,
  disabled,
}: {
  onAsk: (text: string) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAsk(trimmed);
    setText("");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex gap-2"
    >
      <label htmlFor="custom-question" className="sr-only">
        Ask a custom question
      </label>
      <input
        id="custom-question"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a custom question..."
        disabled={disabled}
        className="console-focus panel min-w-0 flex-1 rounded-sm px-3 py-2 text-sm text-paper placeholder:text-fog"
      />
      <GameButton type="submit" size="sm" disabled={disabled || !text.trim()}>
        Ask
      </GameButton>
    </form>
  );
}
