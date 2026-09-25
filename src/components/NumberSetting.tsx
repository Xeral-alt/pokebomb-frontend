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
        value={value}
        onChange={(event) =>
          onChange(
            Number(
              event.target.value,
            ),
          )
        }
        className="w-full rounded-lg border border-white/[0.07] bg-[#0b0f12] px-3 py-2 text-sm font-bold text-zinc-300 outline-none focus:border-cyan-400/30"
      />
    </label>
  );
}