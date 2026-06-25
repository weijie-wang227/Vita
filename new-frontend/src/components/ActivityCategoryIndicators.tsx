import { Clock } from "lucide-react";
import {
  categoryIcon,
  formatDuration,
  vitaCategoryColor,
  vitaCategoryLabel,
} from "../lib/activityPresentation";
import type { VitaCategory } from "../lib/types";

type ActivityCategoryIndicatorsProps = {
  categories: VitaCategory[];
  durationMinutes?: number;
  variant?: "dots" | "pills";
};

function uniqueCategories(categories: VitaCategory[]) {
  return categories.filter(
    (category, index) => categories.indexOf(category) === index,
  );
}

export function ActivityCategoryIndicators({
  categories,
  durationMinutes,
  variant = "dots",
}: ActivityCategoryIndicatorsProps) {
  const visibleCategories = uniqueCategories(categories);

  if (variant === "pills") {
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        {visibleCategories.map((category) => {
          const color = vitaCategoryColor[category];

          return (
            <span
              key={category}
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold"
              style={{
                backgroundColor: `${color}22`,
                color,
              }}
            >
              {categoryIcon(category, 11)}
              {vitaCategoryLabel[category]}
            </span>
          );
        })}
        {typeof durationMinutes === "number" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-muted-foreground">
            <Clock size={11} />
            {formatDuration(durationMinutes)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center -space-x-1">
        {visibleCategories.map((category) => {
          const color = vitaCategoryColor[category];

          return (
            <span
              key={category}
              className="flex h-5 w-5 items-center justify-center rounded-full border border-card"
              title={vitaCategoryLabel[category]}
              style={{
                backgroundColor: color,
                color: "var(--accent-foreground)",
              }}
            >
              {categoryIcon(category, 10)}
            </span>
          );
        })}
      </div>
      {typeof durationMinutes === "number" && (
        <span className="text-[10px] font-medium text-muted-foreground">
          {formatDuration(durationMinutes)}
        </span>
      )}
    </div>
  );
}
