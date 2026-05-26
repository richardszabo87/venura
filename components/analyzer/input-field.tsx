type InputFieldProps = {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
};

export function InputField({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
}: InputFieldProps) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/70">
        {label}
      </span>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#74C69D]">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className={`w-full rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm text-white outline-none transition focus:border-[#74C69D] focus:ring-2 focus:ring-[#74C69D]/30 ${
            prefix ? "pl-7" : "pl-3"
          } ${suffix ? "pr-9" : "pr-3"}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/50">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

export function MetricCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: "positive" | "negative";
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-white/60">
        {label}
      </p>
      <p
        className={`mt-2 text-2xl font-bold tabular-nums tracking-tight ${
          highlight === "positive"
            ? "text-[#74C69D]"
            : highlight === "negative"
              ? "text-red-400"
              : "text-white"
        }`}
      >
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-white/50">{sub}</p>}
    </div>
  );
}
