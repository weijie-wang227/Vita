import type { ChatPreview } from "./chatPreviews.js";

type VitaCategory = "physical" | "social" | "cognitive" | "creative";

type AnyDoc = Record<string, any>;

function asObject(doc: AnyDoc) {
  return typeof doc.toObject === "function" ? doc.toObject() : doc;
}

function toIsoString(value: unknown) {
  const date = value instanceof Date ? value : new Date(String(value ?? ""));

  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function formatChatTime(value: unknown) {
  const date = new Date(toIsoString(value));

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatRelativeTime(value: unknown) {
  const date = new Date(toIsoString(value));
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function getActivityCredits(activity: AnyDoc) {
  const item = asObject(activity ?? {});
  const credits = Number(item.credits);

  if (Number.isFinite(credits)) {
    return credits;
  }

  const price = Number(item.price);

  if (Number.isFinite(price)) {
    return price;
  }

  if (typeof item.price === "string") {
    const match = item.price.match(/\d+(?:\.\d+)?/);

    if (match) {
      return Number(match[0]);
    }
  }

  return 0;
}

export function serializeFriend(friendship: AnyDoc) {
  const item = asObject(friendship);
  const friend = asObject(item.friendId);

  return {
    id: friend.mockId,
    name: friend.name,
    handle: friend.handle,
    avatar: friend.avatarUrl,
    joined: item.joined ?? [],
  };
}

export function serializeProfile(user: AnyDoc) {
  const item = asObject(user);

  return {
    name: item.name,
    handle: item.handle,
    avatar: item.avatarUrl,
    bio: item.bio ?? "",
    stats: item.stats ?? [],
  };
}

export function serializeAuthUser(user: AnyDoc) {
  const item = asObject(user);

  return {
    id: String(item._id ?? item.mockId),
    email: item.email,
    ...serializeProfile(item),
  };
}

export function serializeChat(
  chat: AnyDoc,
  preview?: ChatPreview,
  isAdmin = false,
  adminUserIds = new Set<string>(),
) {
  const item = asObject(chat);
  const members = Array.isArray(item.members)
    ? item.members.map((member: unknown) =>
        serializeChatMember(member, adminUserIds),
      )
    : [];

  return {
    id: item.mockId,
    name: item.name,
    members: item.members?.length || 0,
    memberList: members,
    avatar: item.avatar,
    lastMessage: preview?.lastMessage ?? item.lastMessage ?? "",
    time: preview?.time ?? item.time ?? "",
    unread: item.unread ?? 0,
    isAdmin,
  };
}

function serializeChatMember(
  memberValue: unknown,
  adminUserIds = new Set<string>(),
) {
  const member =
    typeof memberValue === "object" && memberValue !== null
      ? asObject(memberValue as AnyDoc)
      : {};
  const id = String(member._id ?? memberValue ?? "");

  return {
    id,
    name: member.name ?? "Unknown user",
    handle: member.handle ?? "",
    avatar: member.avatarUrl ?? "",
    isAdmin: adminUserIds.has(id),
  };
}

export function serializeChatMessage(
  message: AnyDoc,
  adminUserIds = new Set<string>(),
  joiningUsersByActivityId = new Map<string, AnyDoc[]>(),
) {
  const item = asObject(message);
  const chat = asObject(item.chat ?? {});
  const sender = asObject(item.sender ?? {});
  const messageType = item.type === "activity_invite" ? item.type : "text";
  const activity = item.activity ? asObject(item.activity) : null;
  const createdAt = toIsoString(item.createdAt ?? item.updatedAt);
  const senderId = String(sender._id ?? "");
  const activityId = activity ? String(activity._id ?? "") : "";
  const joiningFriends = activityId
    ? (joiningUsersByActivityId.get(activityId) ?? []).map(serializeActivityJoinUser)
    : [];

  return {
    id: String(item._id),
    groupId: chat.mockId,
    type: messageType,
    sender: {
      id: senderId,
      name: sender.name ?? "Unknown user",
      handle: sender.handle ?? "",
      avatar: sender.avatarUrl ?? "",
      isAdmin: adminUserIds.has(senderId),
    },
    body: item.body,
    time: formatChatTime(createdAt),
    createdAt,
    activityInvite:
      messageType === "activity_invite" && activity
        ? {
            activity: {
              id: activity.mockId,
              title: activity.title,
              date: activity.date,
              time: activity.time,
              location: activity.location,
              durationMinutes: activity.durationMinutes,
              credits: getActivityCredits(activity),
              categories: (activity.categories ?? []) as VitaCategory[],
            },
            joiningFriends,
          }
        : undefined,
  };
}

export function serializeActivity(activity: AnyDoc, joiningUsers: AnyDoc[] = []) {
  const item = asObject(activity);
  const host = asObject(item.host);
  const joiningFriends = joiningUsers.map((user: AnyDoc) => {
    const friend = asObject(user);

    return {
      id: friend.mockId,
      name: friend.name,
      handle: friend.handle,
      avatar: friend.avatarUrl,
      joined: [],
    };
  });
  const baseActivity = {
    id: item.mockId,
    title: item.title,
    host: host?.name ?? item.hostName ?? "Unknown host",
    date: item.date,
    time: item.time,
    location: item.location,
    durationMinutes: item.durationMinutes,
    spots: item.spots,
    credits: getActivityCredits(item),
    rating: item.rating,
    categories: (item.categories ?? []) as VitaCategory[],
    joiningFriends,
  };

  if (!item.isPremium) {
    return baseActivity;
  }

  return {
    ...baseActivity,
    cover: item.cover,
    tags: item.tags ?? [],
  };
}

export function serializeActivityJoinUser(user: AnyDoc) {
  const friend = asObject(user);

  return {
    id: friend.mockId,
    name: friend.name,
    handle: friend.handle,
    avatar: friend.avatarUrl,
    joined: [],
  };
}

export function serializeMapPin(pin: AnyDoc) {
  const item = asObject(pin);
  const activity = asObject(item.activity);

  return {
    id: item.mockId,
    activityId: activity.mockId,
    latitude: item.latitude,
    longitude: item.longitude,
    x: 0,
    y: 0,
    label: item.label,
    premium: item.premium,
    categories: (activity.categories ?? []) as VitaCategory[],
  };
}

type FeedPostMetrics =
  | number
  | {
      commentCount?: number;
      likeCount?: number;
      likedByCurrentUser?: boolean;
    };

export function serializeFeedPost(post: AnyDoc, metricsValue?: FeedPostMetrics) {
  const item = asObject(post);
  const user = asObject(item.user);
  const activity = item.activity ? asObject(item.activity) : null;
  const group = item.group ? asObject(item.group) : null;
  const metrics =
    typeof metricsValue === "number" ? { commentCount: metricsValue } : metricsValue;
  const likeCount = metrics?.likeCount ?? item.likesCount ?? 0;

  return {
    id: item.mockId,
    user: user.name,
    handle: user.handle,
    avatar: user.avatarUrl,
    time: item.time,
    caption: item.caption,
    image: item.image || undefined,
    likesCount: likeCount,
    likedByMe: metrics?.likedByCurrentUser ?? false,
    comments: metrics?.commentCount ?? item.comments,
    activity: activity?.title ?? group?.name,
    durationMinutes: activity?.durationMinutes,
    categories: (activity?.categories ?? []) as VitaCategory[],
    group: group
      ? {
          id: group.mockId,
          name: group.name,
          avatar: group.avatar,
          members: group.members?.length || 0,
        }
      : undefined,
  };
}

export function serializeComment(comment: AnyDoc) {
  const item = asObject(comment);
  const post = asObject(item.post ?? {});
  const user = asObject(item.user ?? {});
  const createdAt = toIsoString(item.createdAt ?? item.updatedAt);

  return {
    id: String(item._id),
    postId: post.mockId,
    user: user.name ?? "Unknown user",
    handle: user.handle ?? "",
    avatar: user.avatarUrl ?? "",
    body: item.body,
    time: formatRelativeTime(createdAt),
    createdAt,
  };
}
