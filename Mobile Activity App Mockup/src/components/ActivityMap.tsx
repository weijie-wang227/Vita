import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { mapPins } from "../data/mockData";
import {
  activityTypeColor,
  activityTypeIcon,
} from "../lib/activityPresentation";
import type { ActivityType } from "../lib/types";

const legendTypes: ActivityType[] = [
  "wellness",
  "food",
  "photo",
  "hiking",
  "chess",
  "fishing",
];

export function ActivityMap({ onClose }: { onClose: () => void }) {
  const [activePin, setActivePin] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Nearby Activities
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Singapore / {mapPins.length} activities near you
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-1 text-accent text-xs font-medium"
        >
          <ChevronDown size={14} />
          List
        </button>
      </div>

      <div className="flex-1 relative overflow-hidden bg-secondary mx-3 rounded-2xl">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="mapbg" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#2a2a2d" />
              <stop offset="100%" stopColor="#1a1a1c" />
            </radialGradient>
          </defs>
          <rect width="100" height="100" fill="url(#mapbg)" />
          <path
            d="M5 50 Q25 47 50 50 Q75 53 95 50"
            stroke="#333336"
            strokeWidth="1.8"
            fill="none"
          />
          <path
            d="M50 5 Q47 30 50 55 Q53 75 50 95"
            stroke="#333336"
            strokeWidth="1.8"
            fill="none"
          />
          <path
            d="M20 30 Q40 28 60 32 Q78 36 88 28"
            stroke="#2e2e31"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M12 68 Q32 65 55 70 Q72 74 90 68"
            stroke="#2e2e31"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M30 15 Q38 35 42 50 Q46 65 38 82"
            stroke="#2e2e31"
            strokeWidth="0.8"
            fill="none"
          />
          <path
            d="M60 15 Q64 32 62 50 Q60 65 66 80"
            stroke="#2e2e31"
            strokeWidth="0.8"
            fill="none"
          />
          <rect x="0" y="82" width="100" height="18" fill="#1e2d3d" opacity="0.9" />
          <rect x="0" y="0" width="8" height="50" fill="#1e2d3d" opacity="0.4" />
          <ellipse cx="35" cy="25" rx="12" ry="8" fill="#1e2d1e" opacity="0.7" />
          <ellipse cx="70" cy="62" rx="14" ry="7" fill="#1e2d1e" opacity="0.5" />
        </svg>

        {mapPins.map((pin) => (
          <button
            key={pin.id}
            onClick={() => setActivePin(activePin === pin.id ? null : pin.id)}
            className="absolute transform -translate-x-1/2 -translate-y-full"
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            aria-label={pin.label}
          >
            <div className="relative flex flex-col items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform"
                style={{
                  backgroundColor: pin.premium ? "#c9993a" : "#252527",
                  border: pin.premium
                    ? "1.5px solid #e8b84b"
                    : `1.5px solid ${activityTypeColor[pin.type]}`,
                  color: pin.premium ? "#0e0e0f" : activityTypeColor[pin.type],
                  transform: activePin === pin.id ? "scale(1.25)" : "scale(1)",
                }}
              >
                {activityTypeIcon(pin.type, 14)}
              </div>
              <div
                className="w-1 h-1.5 rounded-b-full"
                style={{
                  backgroundColor: pin.premium
                    ? "#c9993a"
                    : activityTypeColor[pin.type],
                }}
              />
              {activePin === pin.id && (
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-card text-foreground text-[10px] font-semibold px-2 py-1 rounded-lg whitespace-nowrap shadow-xl border border-border z-10">
                  {pin.label}
                </div>
              )}
            </div>
          </button>
        ))}

        <div
          className="absolute"
          style={{
            left: "47%",
            top: "48%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
          <div className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping" />
        </div>
      </div>

      <div className="px-4 py-3 flex gap-3 overflow-x-auto scrollbar-minimal">
        {legendTypes.map((type) => (
          <div key={type} className="flex items-center gap-1.5 flex-shrink-0">
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: `${activityTypeColor[type]}22`,
                color: activityTypeColor[type],
              }}
            >
              {activityTypeIcon(type, 9)}
            </div>
            <span className="text-[10px] text-muted-foreground capitalize">
              {type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
