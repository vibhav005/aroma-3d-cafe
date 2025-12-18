import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

type Props = {
  page: number;
  pageCount: number;
  onPrev: () => void;
  onNext: () => void;
  onPage: (p: number) => void;
};

const range = (page: number, total: number) => {
  // returns something like: [1, '...', 4, 5, 6, '...', total]
  const out: (number | "...")[] = [];
  const push = (v: number | "...") => out.push(v);

  if (total <= 7) {
    for (let i = 1; i <= total; i++) push(i);
    return out;
  }

  push(1);

  const left = Math.max(2, page - 1);
  const right = Math.min(total - 1, page + 1);

  if (left > 2) push("...");

  for (let i = left; i <= right; i++) push(i);

  if (right < total - 1) push("...");

  push(total);
  return out;
};

const Pagination: React.FC<Props> = ({ page, pageCount, onPrev, onNext, onPage }) => {
  const items = range(page, pageCount);

  return (
    <div className="mt-10 flex items-center justify-center">
      <div className="inline-flex items-center gap-2 rounded-2xl bg-background/60 border border-white/10 shadow-sm px-3 py-2 backdrop-blur-md">
        <button
          onClick={onPrev}
          disabled={page <= 1}
          className="h-10 w-10 grid place-items-center rounded-xl bg-background/40 border border-white/10 text-foreground/80 hover:bg-background/70 disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-1">
          {items.map((it, idx) =>
            it === "..." ? (
              <span key={`dots-${idx}`} className="px-2 text-foreground/50">
                …
              </span>
            ) : (
              <button
                key={it}
                onClick={() => onPage(it)}
                aria-current={it === page ? "page" : undefined}
                className={`h-10 min-w-10 px-3 rounded-xl border transition font-medium ${
                  it === page
                    ? "bg-coffee-medium text-cream border-coffee-medium shadow-sm"
                    : "bg-background/40 border-white/10 text-foreground/80 hover:bg-coffee-light/20"
                }`}
              >
                {it}
              </button>
            )
          )}
        </div>

        <button
          onClick={onNext}
          disabled={page >= pageCount}
          className="h-10 w-10 grid place-items-center rounded-xl bg-background/40 border border-white/10 text-foreground/80 hover:bg-background/70 disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
