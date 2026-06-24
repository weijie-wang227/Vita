import { useRef } from "react";
import type { TouchEvent } from "react";
import { ChevronDown, Navigation, Plus, Search, Star } from "lucide-react";
import { ActivityMap } from "../components/ActivityMap";
import { PremiumCard, StandardRow } from "../components/ActivityCards";
import { useAppState } from "../state";

export function ActivitiesPage() {
  const { premiumActivities, setShowMap, showMap, standardActivities } =
    useAppState();
  const startY = useRef<number | null>(null);

  const handleTouchStart = (event: TouchEvent) => {
    startY.current = event.touches[0].clientY;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    if (startY.current === null) {
      return;
    }

    if (startY.current - event.changedTouches[0].clientY < -50) {
      setShowMap(true);
    }

    startY.current = null;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Activities</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Singapore</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMap(!showMap)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              showMap
                ? "bg-accent text-accent-foreground"
                : "bg-secondary text-muted-foreground"
            }`}
            aria-label={showMap ? "Show activity list" : "Show map"}
          >
            <Navigation size={15} />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
            aria-label="Search activities"
          >
            <Search size={15} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {!showMap && (
        <button
          onClick={() => setShowMap(true)}
          className="flex flex-col items-center gap-0.5 pb-1 opacity-40"
        >
          <span className="text-[10px] text-muted-foreground">
            Pull for map
          </span>
          <ChevronDown size={11} className="text-muted-foreground" />
        </button>
      )}

      {showMap ? (
        <div
          className="flex-1 overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <ActivityMap onClose={() => setShowMap(false)} />
        </div>
      ) : (
        <div
          className="flex-1 overflow-y-auto scrollbar-minimal"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="px-4 mb-2">
            <div className="flex items-center gap-2">
              <Star size={11} fill="#c9993a" stroke="none" />
              <span
                className="text-[11px] font-bold tracking-wider"
                style={{ color: "#c9993a" }}
              >
                PREMIUM EXPERIENCES
              </span>
            </div>
          </div>
          <div className="flex gap-3 px-4 pb-4 overflow-x-auto scrollbar-minimal">
            {premiumActivities.map((activity) => (
              <PremiumCard key={activity.id} activity={activity} />
            ))}
          </div>
          <div className="px-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                All Activities
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>
            {standardActivities.map((activity) => (
              <StandardRow key={activity.id} activity={activity} />
            ))}
          </div>
          <div className="h-6" />
        </div>
      )}

      {!showMap && (
        <button
          className="absolute bottom-20 right-5 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl z-20 active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg, #e8b84b, #c9993a)" }}
          aria-label="Add activity"
        >
          <Plus size={22} color="#0e0e0f" strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
