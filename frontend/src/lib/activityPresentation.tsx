import {
  Activity as ActivityIcon,
  Brain,
  Lightbulb,
  Users,
} from "lucide-react";
import type { VitaCategory } from "./types";

export const vitaCategories: VitaCategory[] = [
  "physical",
  "social",
  "cognitive",
  "creative",
];

export const vitaCategoryColor: Record<VitaCategory, string> = {
  physical: "#4bd178",
  social: "#f4b950",
  cognitive: "#dc4aa7",
  creative: "#6577ff",
};

export const vitaCategoryLabel: Record<VitaCategory, string> = {
  physical: "Physical",
  social: "Social",
  cognitive: "Cognitive",
  creative: "Creative",
};

export function categoryIcon(category: VitaCategory, size = 14) {
  const iconProps = { size, strokeWidth: 2 };

  switch (category) {
    case "physical":
      return <ActivityIcon {...iconProps} />;
    case "social":
      return <Users {...iconProps} />;
    case "cognitive":
      return <Lightbulb {...iconProps} />;
    case "creative":
      return <Brain {...iconProps} />;
    default:
      return <Users {...iconProps} />;
  }
}

export function categoriesForActivity(categories: VitaCategory[] | undefined) {
  return categories?.length ? categories : ["social"];
}

export function primaryActivityCategory(categories: VitaCategory[] | undefined) {
  return categoriesForActivity(categories)[0] ?? "social";
}

export function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}

export function formatCredits(credits: number) {
  return `${credits} credits`;
}
