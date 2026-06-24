import {
  Calendar,
  ChevronLeft,
  Clock,
  Heart,
  MapPin,
  Share2,
  Star,
  Users,
} from "lucide-react";
import { FriendAvatars } from "../components/FriendAvatars";
import {
  activityTypeColor,
  activityTypeIcon,
} from "../lib/activityPresentation";
import type { Activity, PremiumActivity } from "../lib/types";
import { useAppState } from "../state";

function isPremiumActivity(activity: Activity): activity is PremiumActivity {
  return "cover" in activity && "tags" in activity;
}

function getActivityById(
  activities: Activity[],
  activityId: number | null,
): Activity | null {
  if (activityId === null) {
    return null;
  }

  return activities.find((activity) => activity.id === activityId) ?? null;
}

export function ActivityDetailPage() {
  const {
    closeActivity,
    likedActivityIds,
    premiumActivities,
    selectedActivityId,
    standardActivities,
    toggleActivityLike,
  } = useAppState();
  const activities: Activity[] = [...premiumActivities, ...standardActivities];
  const activity = getActivityById(activities, selectedActivityId);

  if (!activity) {
    return null;
  }

  const liked = Boolean(likedActivityIds[activity.id]);
  const isPremium = isPremiumActivity(activity);

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex items-center gap-3 px-4 pt-5 pb-3">
        <button
          onClick={closeActivity}
          className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
          aria-label="Back to activities"
        >
          <ChevronLeft size={17} className="text-foreground" />
        </button>
        <h2 className="text-base font-semibold text-foreground flex-1 truncate">
          Activity
        </h2>
        <button
          className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
          aria-label="Share activity"
        >
          <Share2 size={14} className="text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-minimal">
        {isPremium ? (
          <div className="relative mx-4 h-52 overflow-hidden rounded-2xl bg-secondary">
            <img
              src={activity.cover}
              alt={activity.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 backdrop-blur-sm">
              <Star size={10} fill="#c9993a" stroke="none" />
              <span className="text-[10px] font-bold text-accent">Premium</span>
            </div>
          </div>
        ) : (
          <div className="mx-4 flex h-32 items-center justify-center rounded-2xl bg-secondary">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{
                backgroundColor: `${activityTypeColor[activity.type]}22`,
                color: activityTypeColor[activity.type],
              }}
            >
              {activityTypeIcon(activity.type, 30)}
            </div>
          </div>
        )}

        <div className="px-4 pt-4">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold leading-tight text-foreground">
                {activity.title}
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Hosted by {activity.host}
              </p>
            </div>
            <button
              onClick={() => toggleActivityLike(activity.id)}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0"
              aria-label={liked ? "Unlike activity" : "Like activity"}
            >
              <Heart
                size={17}
                fill={liked ? "#f87171" : "none"}
                stroke={liked ? "#f87171" : "#8a8880"}
              />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-card p-3 border border-border">
              <Calendar size={14} className="mb-2 text-accent" />
              <p className="text-[10px] text-muted-foreground">Date</p>
              <p className="text-xs font-semibold text-foreground">
                {activity.date}
              </p>
            </div>
            <div className="rounded-xl bg-card p-3 border border-border">
              <Clock size={14} className="mb-2 text-accent" />
              <p className="text-[10px] text-muted-foreground">Time</p>
              <p className="text-xs font-semibold text-foreground">
                {activity.time}
              </p>
            </div>
            <div className="rounded-xl bg-card p-3 border border-border">
              <MapPin size={14} className="mb-2 text-accent" />
              <p className="text-[10px] text-muted-foreground">Place</p>
              <p className="text-xs font-semibold text-foreground">
                {activity.location}
              </p>
            </div>
            <div className="rounded-xl bg-card p-3 border border-border">
              <Users size={14} className="mb-2 text-accent" />
              <p className="text-[10px] text-muted-foreground">Spots</p>
              <p className="text-xs font-semibold text-foreground">
                {activity.spots} open / {activity.price}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-card p-4 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Friends joining
                </p>
                <FriendAvatars friends={activity.joiningFriends} max={5} />
              </div>
              <div className="flex items-center gap-1">
                <Star size={12} fill="#c9993a" stroke="none" />
                <span className="text-sm font-bold text-foreground">
                  {activity.rating}
                </span>
              </div>
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
              A small-group activity for meeting nearby friends and enjoying
              Singapore at an easy pace.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-background px-4 py-3">
        <button className="w-full rounded-xl bg-accent py-3 text-sm font-bold text-accent-foreground active:scale-[0.99] transition-transform">
          Join activity
        </button>
      </div>
    </div>
  );
}
