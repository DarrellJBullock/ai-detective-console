"use client";

interface StringConnection {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  key: string;
}

export function RedStringLayer({ connections }: { connections: StringConnection[] }) {
  if (connections.length === 0) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      aria-hidden
    >
      {connections.map((c) => {
        const midY = (c.y1 + c.y2) / 2;
        return (
          <path
            key={c.key}
            d={`M ${c.x1} ${c.y1} Q ${(c.x1 + c.x2) / 2} ${midY - 30}, ${c.x2} ${c.y2}`}
            className="red-string-path red-string-animate"
          />
        );
      })}
    </svg>
  );
}
