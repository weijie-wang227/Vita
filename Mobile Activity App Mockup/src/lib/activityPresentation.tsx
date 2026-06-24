import {
  Bike,
  Camera,
  Flower2,
  Mountain,
  Music,
  Shield,
  Users,
  UtensilsCrossed,
  Waves,
} from "lucide-react";
import type { ActivityType } from "./types";

export const activityTypeColor: Record<ActivityType, string> = {
  wellness: "#4ade80",
  food: "#fb923c",
  photo: "#facc15",
  hiking: "#38bdf8",
  chess: "#e879f9",
  fishing: "#60a5fa",
  social: "#f87171",
  bike: "#a78bfa",
};

export function activityTypeIcon(type: ActivityType, size = 14) {
  const iconProps = { size, strokeWidth: 2 };

  switch (type) {
    case "wellness":
      return <Flower2 {...iconProps} />;
    case "food":
      return <UtensilsCrossed {...iconProps} />;
    case "photo":
      return <Camera {...iconProps} />;
    case "hiking":
      return <Mountain {...iconProps} />;
    case "chess":
      return <Shield {...iconProps} />;
    case "fishing":
      return <Waves {...iconProps} />;
    case "social":
      return <Music {...iconProps} />;
    case "bike":
      return <Bike {...iconProps} />;
    default:
      return <Users {...iconProps} />;
  }
}
