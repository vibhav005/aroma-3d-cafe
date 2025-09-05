import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

/** -------- Config -------- */
const NOTES = [
  "Chocolatey",
  "Nutty",
  "Caramel",
  "Fruity",
  "Citrus",
  "Floral",
  "Spicy",
  "Smoky",
] as const;

type Note = typeof NOTES[number];

const PAIRINGS: Record<Note, string[]> = {
  Chocolatey: ["Brownie", "Dark Choc Cookie", "Mocha"],
  Nutty: ["Almond Croissant", "Hazelnut Biscotti", "Praline"],
  Caramel: ["Salted Caramel Tart", "Crème Brûlée", "Caramel Latte"],
  Fruity: ["Berry Danish", "Peach Galette", "Cold Brew"],
  Citrus: ["Lemon Tart", "Orange Pound Cake", "Yuzu Cheesecake"],
  Floral: ["Honey Cake", "Lavender Shortbread", "Jasmine Tea"],
  Spicy: ["Chai Latte", "Ginger Snap", "Cinnamon Roll"],
  Smoky: ["Espresso", "Affogato", "Roasted Almonds"],
};

const STORAGE_KEY = "flavor-explorer.notes";

/** -------- Utils -------- */
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
const toRad = (deg: number) => (deg * Math.PI) / 180;

function donutSectorPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startDeg: number,
  endDeg: number
) {
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  const s = toRad(startDeg);
  const e = toRad(endDeg);
  const x0 = cx + rOuter * Math.cos(s);
  const y0 = cy + rOuter * Math.sin(s);
  const x1 = cx + rOuter * Math.cos(e);
  const y1 = cy + rOuter * Math.sin(e);
  const x2 = cx + rInner * Math.cos(e);
  const y2 = cy + rInner * Math.sin(e);
  const x3 = cx + rInner * Math.cos(s);
  const y3 = cy + rInner * Math.sin(s);

  return [
    `M ${x0} ${y0}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x1} ${y1}`,
    `L ${x2} ${y2}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${x3} ${y3}`,
    "Z",
  ].join(" ");
}

function useLocalNotes() {
  const [notes, setNotes] = React.useState<Note[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Note[];
      return parsed.filter((n): n is Note => NOTES.includes(n as Note));
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {}
  }, [notes]);

  return [notes, setNotes] as const;
}

/** -------- Component -------- */
interface FlavorExplorerProps {
  className?: string;
  onApplyToMenu?: (notes: Note[]) => void; // optional: hook into your menu filtering
}

const FlavorExplorer: React.FC<FlavorExplorerProps> = ({ className, onApplyToMenu }) => {
  const [selected, setSelected] = useLocalNotes();

  const toggle = (n: Note) =>
    setSelected((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]
    );

  const clear = () => setSelected([]);

  const suggestions = React.useMemo(() => {
    const set = new Set<string>();
    selected.forEach((n) => PAIRINGS[n].forEach((p) => set.add(p)));
    return Array.from(set).slice(0, 6);
  }, [selected]);

  // donut geometry
  const W = 300;
  const H = 300;
  const CX = 150;
  const CY = 150;
  const R_OUT = 120;
  const R_IN = 70;
  const SLICE = 360 / NOTES.length;

  return (
    <section
      className={cn(
        "w-full bg-cream text-coffee-rich rounded-2xl border border-coffee-rich/15 shadow-soft p-5 md:p-6",
        "backdrop-blur-xl",
        className
      )}
      aria-labelledby="flavor-explorer-title"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 id="flavor-explorer-title" className="text-xl md:text-2xl font-display font-semibold">
            Flavor Explorer
          </h3>
          <p className="text-sm text-coffee-rich/70">
            Tap slices to select tasting notes. Save your vibe & pair like a pro.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clear}
            className="px-3 py-2 rounded-full text-sm border border-coffee-rich/20 bg-white/80 hover:bg-coffee-rich/10"
            aria-label="Clear selected notes"
          >
            Clear
          </button>
          {onApplyToMenu && (
            <button
              onClick={() => onApplyToMenu(selected)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold bg-coffee-medium text-cream hover:bg-coffee-rich shadow-warm"
            >
              Apply to Menu <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Wheel + legend */}
      <div className="grid md:grid-cols-2 gap-6 items-center">
        {/* Wheel */}
        <div className="relative mx-auto">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            width={W}
            height={H}
            className="drop-shadow-sm"
            aria-label="Flavor wheel"
          >
            {/* soft background */}
            <defs>
              <radialGradient id="bg-grad" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.6)" />
              </radialGradient>
            </defs>
            <circle cx={CX} cy={CY} r={R_OUT + 6} fill="url(#bg-grad)" />

            {/* slices */}
            {NOTES.map((n, i) => {
              const start = -90 + i * SLICE;
              const end = start + SLICE - 2; // tiny gap between slices
              const d = donutSectorPath(CX, CY, R_OUT, R_IN, start, end);
              const active = selected.includes(n);

              return (
                <motion.g
                  key={n}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => toggle(n)}
                  className="cursor-pointer"
                  role="button"
                  aria-pressed={active}
                  aria-label={`Toggle ${n}`}
                >
                  <path
                    d={d}
                    fill={active ? "rgba(136,107,71,0.22)" : "rgba(136,107,71,0.08)"} // coffee-ish
                    stroke="rgba(136,107,71,0.25)"
                    strokeWidth={1.5}
                  />
                  {/* label */}
                  <text
                    x={CX}
                    y={CY}
                    fill="#4b3b2a"
                    fontSize="12"
                    fontWeight={600}
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`translate(${(R_OUT + R_IN) / 2 * Math.cos(toRad((start + end) / 2))}, ${(R_OUT + R_IN) / 2 * Math.sin(toRad((start + end) / 2))})`}
                  >
                    {n}
                  </text>
                </motion.g>
              );
            })}

            {/* center chip */}
            <g>
              <circle cx={CX} cy={CY} r={R_IN - 12} fill="rgba(136,107,71,0.06)" />
              <circle
                cx={CX}
                cy={CY}
                r={R_IN - 12}
                fill="none"
                stroke="rgba(136,107,71,0.25)"
                strokeDasharray="4 6"
              />
              <text x={CX} y={CY - 6} textAnchor="middle" fill="#4b3b2a" fontSize="12">
                Selected notes
              </text>
              <text x={CX} y={CY + 16} textAnchor="middle" fill="#4b3b2a" fontSize="18" fontWeight={700}>
                {selected.length || "—"}
              </text>
            </g>
          </svg>
        </div>

        {/* Selections & pairings */}
        <div>
          {/* Selected chips */}
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Your notes</div>
            <div className="flex flex-wrap gap-2">
              {selected.length === 0 ? (
                <span className="text-coffee-rich/60 text-sm">No notes yet—try Chocolatey or Fruity?</span>
              ) : (
                selected.map((n) => (
                  <button
                    key={n}
                    onClick={() => toggle(n)}
                    className="px-3 py-1.5 rounded-full text-sm border border-coffee-rich/20 bg-white/80 hover:bg-coffee-rich/10"
                  >
                    {n} ✕
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Pairing suggestions */}
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Suggested pairings</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.length === 0 ? (
                <span className="text-coffee-rich/60 text-sm">Pick a note to see pairings.</span>
              ) : (
                suggestions.map((p) => (
                  <span
                    key={p}
                    className="px-3 py-1.5 rounded-full text-sm bg-coffee-medium/10 text-coffee-rich border border-coffee-rich/15"
                  >
                    {p}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Tiny tip */}
          <p className="text-xs text-coffee-rich/70">
            Pro tip: save these notes; we’ll keep them for your next visit on this device.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FlavorExplorer;
