import { Base, Bases } from "@/lib/game-state";

const SPOTS: Record<Base, string> = {
  2: "left-1/2 top-0 -translate-x-1/2",
  3: "left-0 top-1/2 -translate-y-1/2",
  1: "right-0 top-1/2 -translate-y-1/2",
};

/** Who's on which base. Tapping a runner opens the plays for them. */
export default function BaseDiamond({
  bases,
  nameFor,
  onRunnerTap,
  emptyLabel,
}: {
  bases: Bases;
  nameFor: (id: string) => string;
  onRunnerTap?: (id: string) => void;
  emptyLabel?: string;
}) {
  return (
    <div className="relative mx-auto h-28 w-full max-w-xs" aria-label="Bases">
      <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-gray-300 dark:border-gray-600" />
      {([3, 2, 1] as Base[]).map((base) => {
        const id = bases[base];
        const label = id ? nameFor(id) : "";
        const style = `absolute ${SPOTS[base]} flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold`;
        if (!id) {
          return (
            <span key={base} className={`${style} border-gray-200 text-gray-300 dark:border-gray-700 dark:text-gray-600`}>
              {base === 1 ? "1B" : base === 2 ? "2B" : "3B"}
            </span>
          );
        }
        return onRunnerTap ? (
          <button
            key={base}
            type="button"
            onClick={() => onRunnerTap(id)}
            className={`${style} border-yellow-500 bg-yellow-100 text-yellow-900 dark:bg-yellow-500/20 dark:text-yellow-200`}
          >
            <span className="max-w-20 truncate">{label}</span>
          </button>
        ) : (
          <span key={base} className={`${style} border-yellow-500 bg-yellow-100 text-yellow-900 dark:bg-yellow-500/20 dark:text-yellow-200`}>
            <span className="max-w-20 truncate">{label}</span>
          </span>
        );
      })}
      {emptyLabel && !bases[1] && !bases[2] && !bases[3] && (
        <span className="absolute inset-x-0 bottom-0 text-center text-xs text-gray-400">{emptyLabel}</span>
      )}
    </div>
  );
}
