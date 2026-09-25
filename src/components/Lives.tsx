type Props = {
  count: number;
};

export function Lives({ count }: Props) {
  return (
    <span className="font-mono text-xs tracking-widest text-rose-300">
      {"♥".repeat(Math.max(0, count))}
    </span>
  );
}