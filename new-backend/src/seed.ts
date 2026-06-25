import "./env.js";
import mongoose, { Types } from "mongoose";
import { connectDB, disconnectDB } from "./db.js";
import {
  feedPosts,
  friends,
  groupChats,
  mapPins,
  premiumActivities,
  profile,
  standardActivities,
} from "./data.js";
import {
  AdminModel,
  ActivityJoinModel,
  ActivityModel,
  ChatMessageModel,
  ChatModel,
  FeedPostModel,
  FriendshipModel,
  MapPinModel,
  UserModel,
} from "./models/MockupData.js";
import type { ActivitySeed, PremiumActivitySeed } from "./data.js";

const legacyCollections = [
  "premiumActivities",
  "standardActivities",
  "profiles",
  "friends",
  "groupChats",
];

const allActivities: ActivitySeed[] = [...premiumActivities, ...standardActivities];

function slugEmail(handle: string) {
  return `${handle.replace(/^@/, "")}@vita.local`;
}

function isPremiumActivity(
  activity: ActivitySeed,
): activity is PremiumActivitySeed {
  return "cover" in activity;
}

function uniqueObjectIds(ids: Types.ObjectId[]) {
  const seen = new Set<string>();

  return ids.filter((id) => {
    const key = String(id);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

async function dropLegacyCollections() {
  const collections = await mongoose.connection.db?.listCollections().toArray();
  const existingCollections = new Set(collections?.map((item) => item.name));

  await Promise.all(
    legacyCollections
      .filter((collection) => existingCollections.has(collection))
      .map((collection) => mongoose.connection.db?.dropCollection(collection)),
  );
}

async function seed() {
  try {
    const connected = await connectDB();

    if (!connected) {
      throw new Error("MONGODB_URI is required to seed the vida database.");
    }

    await dropLegacyCollections();

    await Promise.all([
      UserModel.deleteMany(),
      FriendshipModel.deleteMany(),
      ChatModel.deleteMany(),
      AdminModel.deleteMany(),
      ChatMessageModel.deleteMany(),
      ActivityModel.deleteMany(),
      ActivityJoinModel.deleteMany(),
      MapPinModel.deleteMany(),
      FeedPostModel.deleteMany(),
    ]);

    const linda = await UserModel.create({
      mockId: 0,
      name: profile.name,
      handle: profile.handle,
      email: slugEmail(profile.handle),
      avatarUrl: profile.avatar,
      bio: profile.bio,
      stats: profile.stats,
    });

    const userByMockId = new Map<number, Types.ObjectId>([[0, linda._id]]);
    const userByName = new Map<string, Types.ObjectId>([[profile.name, linda._id]]);
    const userByHandle = new Map<string, Types.ObjectId>([
      [profile.handle, linda._id],
    ]);

    for (const friend of friends) {
      const existingUserId = userByHandle.get(friend.handle);

      if (existingUserId) {
        userByMockId.set(friend.id, existingUserId);
        userByName.set(friend.name, existingUserId);
        continue;
      }

      const user = await UserModel.create({
        mockId: friend.id,
        name: friend.name,
        handle: friend.handle,
        email: slugEmail(friend.handle),
        avatarUrl: friend.avatar,
      });

      userByMockId.set(friend.id, user._id);
      userByName.set(friend.name, user._id);
      userByHandle.set(friend.handle, user._id);
    }

    for (const friend of friends) {
      const friendId = userByMockId.get(friend.id);

      if (!friendId) {
        continue;
      }

      if (String(friendId) === String(linda._id)) {
        continue;
      }

      await FriendshipModel.create([
        {
          userId: linda._id,
          friendId,
          mutual: friend.mutual,
          joined: friend.joined,
        },
        {
          userId: friendId,
          friendId: linda._id,
          mutual: friend.mutual,
          joined: friend.joined,
        },
      ]);
    }

    const chatByMockId = new Map<number, Types.ObjectId>();

    for (const chat of groupChats) {
      const chatMembers = uniqueObjectIds([
        linda._id,
        ...friends
          .slice(0, 5)
          .map((friend) => userByMockId.get(friend.id))
          .filter((id): id is Types.ObjectId => Boolean(id)),
      ]);
      const savedChat = await ChatModel.create({
        mockId: chat.id,
        name: chat.name,
        avatar: chat.avatar,
        members: chatMembers,
        lastMessage: chat.lastMessage,
        time: chat.time,
        unread: chat.unread,
      });
      await AdminModel.create({
        user: linda._id,
        group: savedChat._id,
      });

      chatByMockId.set(chat.id, savedChat._id);
    }

    const activityByMockId = new Map<number, Types.ObjectId>();

    for (const activity of allActivities) {
      const matchingChat =
        groupChats.find((chat) =>
          chat.name.toLowerCase().includes(activity.title.toLowerCase()),
        ) ??
        groupChats.find((chat) =>
          activity.title.toLowerCase().includes(chat.name.toLowerCase()),
        ) ??
        groupChats[0];
      const chatId = chatByMockId.get(matchingChat.id);
      const host =
        userByName.get(activity.host) ??
        userByName.get(activity.joiningFriends[0]?.name ?? "") ??
        linda._id;
      const joiningFriends = activity.joiningFriends
        .map((friend) => userByMockId.get(friend.id))
        .filter((id): id is Types.ObjectId => Boolean(id));
      const savedActivity = await ActivityModel.create({
        mockId: activity.id,
        title: activity.title,
        host,
        date: activity.date,
        time: activity.time,
        location: activity.location,
        durationMinutes: activity.durationMinutes,
        spots: activity.spots,
        price: activity.price,
        rating: activity.rating,
        categories: activity.categories,
        chat: chatId,
        isPremium: isPremiumActivity(activity),
        cover: isPremiumActivity(activity) ? activity.cover : undefined,
        tags: isPremiumActivity(activity) ? activity.tags : [],
      });

      activityByMockId.set(activity.id, savedActivity._id);

      const activityJoinRows = uniqueObjectIds(joiningFriends).map((userId) => ({
        userId,
        activityId: savedActivity._id,
      }));

      if (activityJoinRows.length > 0) {
        await ActivityJoinModel.create(activityJoinRows);
      }
    }

    for (const pin of mapPins) {
      const activityId = activityByMockId.get(pin.activityId);

      if (!activityId) {
        continue;
      }

      await MapPinModel.create({
        mockId: pin.id,
        activity: activityId,
        latitude: pin.latitude,
        longitude: pin.longitude,
        label: pin.label,
        premium: pin.premium,
      });
    }

    for (const post of feedPosts) {
      const user = userByHandle.get(post.handle) ?? linda._id;
      const activity =
        allActivities.find((item) => item.title === post.activity) ??
        allActivities[0];
      const activityId = activityByMockId.get(activity.id);

      if (!activityId) {
        continue;
      }

      await FeedPostModel.create({
        mockId: post.id,
        user,
        activity: activityId,
        time: post.time,
        caption: post.caption,
        image: post.image,
        likes: post.likes,
        comments: post.comments,
      });
    }

    console.log("Seeded relational vida database.");
  } catch (error) {
    console.error("Failed to seed database:", error);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
}

seed();
