import { useState, type KeyboardEvent } from "react";

type Props = {
  label: string;
  value: number;

  onChange: (value: number) => void;

  min?: number;
  max?: number;
  suffix?: string;
};

export function NumberSetting({
  label,
  value,
  onChange,
  min,
  max,
  suffix,
}: Props) {
  const [draft, setDraft] = useState("");

  const [editing, setEditing] = useState(false);

  const displayValue = editing ? draft : String(value);

  function clampValue(nextValue: number) {
    let safeValue = Math.floor(nextValue);

    if (min !== undefined) {
      safeValue = Math.max(min, safeValue);
    }

    if (max !== undefined) {
      safeValue = Math.min(max, safeValue);
    }

    return safeValue;
  }

  function commitDraft() {
    const nextValue = Number(displayValue);

    if (!Number.isFinite(nextValue)) {
      setDraft(String(value));

      return;
    }

    const safeValue = clampValue(nextValue);

    setDraft(String(safeValue));

    if (safeValue !== value) {
      onChange(safeValue);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    }

    if (event.key === "Escape") {
      setDraft(String(value));
      event.currentTarget.blur();
    }
  }

  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-500">
          {label}
        </span>

        {suffix && (
          <span className="font-mono text-[10px] uppercase text-zinc-700">
            {suffix}
          </span>
        )}
      </div>

      <input
        type="number"
        min={min}
        max={max}
        value={displayValue}
        onFocus={() => {
          setDraft(String(value));
          setEditing(true);
        }}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => {
          setEditing(false);
          commitDraft();
        }}
        onKeyDown={handleKeyDown}
        className="w-full rounded-lg border border-white/[0.07] bg-[#0b0f12] px-3 py-2 text-sm font-bold text-zinc-300 outline-none focus:border-cyan-400/30"
      />
    </label>
  );
}
