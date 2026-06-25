import type {
  Activity,
  CreateActivityInput,
  CreateFeedPostInput,
  FeedPost,
  GroupChat,
  MapPin,
  PremiumActivity,
  Profile,
  StandardActivity,
} from "../lib/types";

function nextLocalId(items: { id: number }[]) {
  return Math.max(0, ...items.map((item) => item.id)) + 1;
}

function formatLocalDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatLocalTime(value: string) {
  const match = value.match(/^(\d{2}):(\d{2})$/);

  if (!match) {
    return value;
  }

  const hour = Number(match[1]);
  const minutes = match[2];
  const displayHour = hour % 12 || 12;
  const suffix = hour < 12 ? "AM" : "PM";

  return `${displayHour}:${minutes} ${suffix}`;
}

export function createLocalActivity(
  input: CreateActivityInput,
  host: Profile,
  activities: StandardActivity[],
  premiumActivities: PremiumActivity[],
  mapPins: MapPin[],
) {
  const activityId = nextLocalId([...premiumActivities, ...activities]);
  const mapPinId = nextLocalId(mapPins);
  const activity: StandardActivity = {
    id: activityId,
    title: input.title,
    host: host.name,
    date: formatLocalDate(input.date),
    time: formatLocalTime(input.time),
    location: input.location,
    durationMinutes: input.durationMinutes,
    spots: input.spots,
    price: input.price,
    rating: 5,
    categories: input.categories,
    joiningFriends: [
      {
        id: 0,
        name: host.name,
        handle: host.handle,
        avatar: host.avatar,
        mutual: 0,
        joined: [],
      },
    ],
  };
  const mapPin: MapPin = {
    id: mapPinId,
    activityId,
    latitude: input.latitude,
    longitude: input.longitude,
    x: 0,
    y: 0,
    label: input.title,
    categories: input.categories,
  };

  return { activity, mapPin };
}

export function createLocalFeedPost(
  input: CreateFeedPostInput,
  profile: Profile,
  posts: FeedPost[],
  groups: GroupChat[],
): FeedPost {
  const group = input.groupId
    ? groups.find((item) => item.id === input.groupId)
    : undefined;

  return {
    id: nextLocalId(posts),
    user: profile.name,
    handle: profile.handle,
    avatar: profile.avatar,
    time: "Just now",
    caption: input.caption,
    image: input.image,
    likes: 0,
    comments: 0,
    activity: group?.name,
    durationMinutes: undefined,
    categories: [],
    group: group
      ? {
          id: group.id,
          name: group.name,
          avatar: group.avatar,
          members: group.members,
        }
      : undefined,
  };
}

export function replaceActivity<T extends Activity>(items: T[], activity: T) {
  return items.map((item) => (item.id === activity.id ? activity : item));
}

export function activityIdsJoinedByProfile(
  activities: Activity[],
  profileHandle: string,
) {
  return activities
    .filter((activity) =>
      activity.joiningFriends.some((friend) => friend.handle === profileHandle),
    )
    .map((activity) => activity.id);
}

export function markRecentActivityId(activityIds: number[], activityId: number) {
  return [activityId, ...activityIds.filter((id) => id !== activityId)];
}

export function upsertGroup(items: GroupChat[], group: GroupChat) {
  const existing = items.some((item) => item.id === group.id);

  if (!existing) {
    return [group, ...items];
  }

  return items.map((item) => (item.id === group.id ? group : item));
}
