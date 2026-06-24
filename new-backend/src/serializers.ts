type ActivityType =
  | "wellness"
  | "food"
  | "photo"
  | "hiking"
  | "chess"
  | "fishing"
  | "social"
  | "bike";

type AnyDoc = Record<string, any>;

function asObject(doc: AnyDoc) {
  return typeof doc.toObject === "function" ? doc.toObject() : doc;
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
    lastMessage: item.lastMessage,
    time: item.time,
    unread: item.unread,
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
    type: item.type as ActivityType,
    date: item.date,
    time: item.time,
    location: item.location,
    spots: item.spots,
    price: item.price,
    rating: item.rating,
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
    type: item.type as ActivityType,
    label: item.label,
    premium: item.premium,
  };
}

export function serializeFeedPost(post: AnyDoc) {
  const item = asObject(post);
  const user = asObject(item.user);
  const activity = asObject(item.activity);

  return {
    id: item.mockId,
    user: user.name,
    handle: user.handle,
    avatar: user.avatarUrl,
    time: item.time,
    caption: item.caption,
    image: item.image,
    likes: item.likes,
    comments: item.comments,
    activity: activity.title,
  };
}
