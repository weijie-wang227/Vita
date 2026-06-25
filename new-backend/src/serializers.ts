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

export function serializeFriend(friendship: AnyDoc) {
  const item = asObject(friendship);
  const friend = asObject(item.friendId);

  return {
    id: friend.mockId,
    name: friend.name,
    handle: friend.handle,
    avatar: friend.avatarUrl,
    mutual: item.mutual,
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

export function serializeChat(chat: AnyDoc) {
  const item = asObject(chat);

  return {
    id: item.mockId,
    name: item.name,
    members: item.members?.length || 0,
    avatar: item.avatar,
    lastMessage: item.lastMessage ?? "",
    time: item.time ?? "",
    unread: item.unread ?? 0,
  };
}

export function serializeChatMessage(
  message: AnyDoc,
  adminUserIds = new Set<string>(),
) {
  const item = asObject(message);
  const chat = asObject(item.chat ?? {});
  const sender = asObject(item.sender ?? {});
  const createdAt = toIsoString(item.createdAt ?? item.updatedAt);
  const senderId = String(sender._id ?? "");

  return {
    id: String(item._id),
    groupId: chat.mockId,
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
      mutual: 0,
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
    price: item.price,
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
    mutual: 0,
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

export function serializeFeedPost(post: AnyDoc) {
  const item = asObject(post);
  const user = asObject(item.user);
  const activity = item.activity ? asObject(item.activity) : null;
  const group = item.group ? asObject(item.group) : null;

  return {
    id: item.mockId,
    user: user.name,
    handle: user.handle,
    avatar: user.avatarUrl,
    time: item.time,
    caption: item.caption,
    image: item.image || undefined,
    likes: item.likes,
    comments: item.comments,
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
