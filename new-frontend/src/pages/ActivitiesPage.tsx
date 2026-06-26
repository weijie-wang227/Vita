import { useEffect, useRef, useState } from "react";
import type { TouchEvent } from "react";
import {
  CalendarCheck,
  ChevronDown,
  Maximize2,
  Minimize2,
  Navigation,
  Plus,
  Search,
  Star,
} from "lucide-react";
import { ActivityMap } from "../components/ActivityMap";
import { BaseSearchBar } from "../components/BaseSearchBar";
import { PremiumCard, StandardRow } from "../components/ActivityCards";
import { CreateActivityModal } from "../components/CreateActivityModal";
import { FloatingActionButton } from "../components/FloatingActionButton";
import type { Activity } from "../lib/types";
import { useAppState } from "../state";

function searchableActivityText(activity: Activity) {
  return [
    activity.title,
    activity.host,
    activity.date,
    activity.time,
    activity.location,
    activity.price,
    // activity.rating,
    activity.categories.join(" "),
    activity.joiningFriends
      .map((friend) => `${friend.name} ${friend.handle}`)
      .join(" "),
    "tags" in activity ? activity.tags.join(" ") : "",
  ]
    .join(" ")
    .toLowerCase();
}

export function ActivitiesPage() {
  const {
    joinedActivityIds,
    premiumActivities,
    profile,
    setShowMap,
    showMap,
    standardActivities,
  } = useAppState();
  const startY = useRef<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [createActivityOpen, setCreateActivityOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [showAllUpcomingActivities, setShowAllUpcomingActivities] =
    useState(false);
  const activeSearchQuery = debouncedSearchQuery.toLowerCase();
  const activityMatchesSearch = (activity: Activity) =>
    searchableActivityText(activity).includes(activeSearchQuery);
  const filteredPremiumActivities = activeSearchQuery
    ? premiumActivities.filter(activityMatchesSearch)
    : premiumActivities;
  const filteredStandardActivities = activeSearchQuery
    ? standardActivities.filter(activityMatchesSearch)
    : standardActivities;
  const filteredActivities = [
    ...filteredPremiumActivities,
    ...filteredStandardActivities,
  ];
  const joinedActivityOrder = new Map(
    joinedActivityIds.map((activityId, index) => [activityId, index]),
  );
  const upcomingActivities = filteredActivities
    .filter((activity) =>
      activity.joiningFriends.some((friend) => friend.handle === profile.handle),
    )
    .sort((firstActivity, secondActivity) => {
      const firstOrder =
        joinedActivityOrder.get(firstActivity.id) ?? Number.POSITIVE_INFINITY;
      const secondOrder =
        joinedActivityOrder.get(secondActivity.id) ?? Number.POSITIVE_INFINITY;

      if (firstOrder === secondOrder) {
        return 0;
      }

      return firstOrder - secondOrder;
    });
  const visibleUpcomingActivities = showAllUpcomingActivities
    ? upcomingActivities
    : upcomingActivities.slice(0, 3);
  const canExpandUpcomingActivities = upcomingActivities.length > 3;
  const hasSearchResults =
    filteredPremiumActivities.length > 0 || filteredStandardActivities.length > 0;

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  const handleOpenSearch = () => {
    if (showMap) {
      setShowMap(false);
    }

    setSearchOpen(true);
  };

  const handleClearSearch = () => {
    setSearchOpen(false);
  };

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
            onClick={handleOpenSearch}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
            aria-label="Search activities"
          >
            <Search
              size={19}
              strokeWidth={2.4}
              className="text-muted-foreground"
            />
          </button>
        </div>
      </div>

      {!showMap && (searchOpen || searchQuery) && (
        <div className="px-4 pb-3">
          <BaseSearchBar
            value={searchQuery}
            onValueChange={setSearchQuery}
            onDebouncedQueryChange={setDebouncedSearchQuery}
            inputRef={searchInputRef}
            placeholder="Search activities"
            ariaLabel="Search activities"
            clearable
            clearAriaLabel="Clear activity search"
            onClear={handleClearSearch}
          />
        </div>
      )}

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
          {filteredPremiumActivities.length > 0 && (
            <>
              <div className="px-4 mb-2">
                <div className="flex items-center gap-2">
                  <Star size={11} fill="var(--brand-yellow)" stroke="none" />
                  <span
                    className="text-[11px] font-bold tracking-wider"
                    style={{ color: "var(--brand-yellow)" }}
                  >
                    PREMIUM EXPERIENCES
                  </span>
                </div>
              </div>
              <div className="flex gap-3 px-4 pb-4 overflow-x-auto scrollbar-minimal">
                {filteredPremiumActivities.map((activity) => (
                  <PremiumCard key={activity.id} activity={activity} />
                ))}
              </div>
            </>
          )}
          {upcomingActivities.length > 0 && (
            <div className="px-4 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <CalendarCheck size={12} className="text-accent" />
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Upcoming Activities
                </span>
                <div className="flex-1 h-px bg-border" />
                {canExpandUpcomingActivities && (
                  <button
                    onClick={() =>
                      setShowAllUpcomingActivities((current) => !current)
                    }
                    className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={
                      showAllUpcomingActivities
                        ? "Show fewer upcoming activities"
                        : "Show all upcoming activities"
                    }
                  >
                    {showAllUpcomingActivities ? (
                      <Minimize2 size={13} />
                    ) : (
                      <Maximize2 size={13} />
                    )}
                  </button>
                )}
              </div>
              {visibleUpcomingActivities.map((activity) => (
                <StandardRow key={activity.id} activity={activity} />
              ))}
            </div>
          )}
          {filteredStandardActivities.length > 0 && (
            <div className="px-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  All Activities
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>
              {filteredStandardActivities.map((activity) => (
                <StandardRow key={activity.id} activity={activity} />
              ))}
            </div>
          )}
          {activeSearchQuery && !hasSearchResults && (
            <div className="flex min-h-40 items-center justify-center px-8 text-center">
              <p className="text-sm text-muted-foreground">
                No activities match your search.
              </p>
            </div>
          )}
          <div className="h-6" />
        </div>
      )}

      {!showMap && (
        <FloatingActionButton
          onClick={() => setCreateActivityOpen(true)}
          aria-label="Add activity"
        >
          <Plus size={22} color="var(--accent-foreground)" strokeWidth={2.5} />
        </FloatingActionButton>
      )}

      <CreateActivityModal
        open={createActivityOpen}
        onClose={() => setCreateActivityOpen(false)}
      />
    </div>
  );
}
