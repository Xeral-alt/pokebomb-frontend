type Props = {
  label: string;
  value: string | number;
};

export function Stat({
  label,
  value,
}: Props) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.05] pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-zinc-600">
        {label}
      </span>

      <span className="font-mono text-xs font-bold text-zinc-300">
        {value}
      </span>
    </div>
  );
}