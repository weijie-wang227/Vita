import mongoose, { Schema, Types } from "mongoose";

export type UserDocument = {
  _id: Types.ObjectId;
  mockId: number;
  name: string;
  handle: string;
  email: string;
  avatarUrl: string;
  passwordHash?: string;
  passwordSalt?: string;
  bio?: string;
  stats?: { label: string; value: string }[];
};

const userSchema = new Schema<UserDocument>(
  {
    mockId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    handle: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    avatarUrl: { type: String, required: true },
    passwordHash: { type: String, select: false },
    passwordSalt: { type: String, select: false },
    bio: { type: String },
    stats: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
  },
  { timestamps: true },
);

const friendshipSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    friendId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    mutual: { type: Number, required: true, default: 0 },
    joined: [{ type: String, required: true }],
  },
  { timestamps: true },
);
friendshipSchema.index({ userId: 1, friendId: 1 }, { unique: true });

const chatSchema = new Schema(
  {
    mockId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    lastMessage: { type: String, required: true },
    time: { type: String, required: true },
    unread: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

const activitySchema = new Schema(
  {
    mockId: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    host: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    type: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    spots: { type: Number, required: true },
    price: { type: String, required: true },
    rating: { type: Number, required: true },
    chat: { type: Schema.Types.ObjectId, required: true, ref: "Chat" },
    isPremium: { type: Boolean, required: true, default: false },
    cover: { type: String },
    tags: [{ type: String }],
  },
  { timestamps: true },
);

const activityJoinSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    activityId: { type: Schema.Types.ObjectId, required: true, ref: "Activity" },
  },
  { timestamps: true },
);
activityJoinSchema.index({ userId: 1, activityId: 1 }, { unique: true });

const mapPinSchema = new Schema(
  {
    mockId: { type: Number, required: true, unique: true },
    activity: { type: Schema.Types.ObjectId, required: true, ref: "Activity" },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    type: { type: String, required: true },
    label: { type: String, required: true },
    premium: { type: Boolean },
  },
  { timestamps: true },
);

const feedPostSchema = new Schema(
  {
    mockId: { type: Number, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    activity: { type: Schema.Types.ObjectId, required: true, ref: "Activity" },
    time: { type: String, required: true },
    caption: { type: String, required: true },
    image: { type: String, required: true },
    likes: { type: Number, required: true, default: 0 },
    comments: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model<any>("User", userSchema, "users");
export const FriendshipModel = mongoose.model(
  "Friendship",
  friendshipSchema,
  "friendships",
);
export const ChatModel = mongoose.model<any>("Chat", chatSchema, "chats");
export const ActivityModel = mongoose.model<any>(
  "Activity",
  activitySchema,
  "activities",
);
export const ActivityJoinModel = mongoose.model<any>(
  "ActivityJoin",
  activityJoinSchema,
  "activityJoins",
);
export const MapPinModel = mongoose.model<any>("MapPin", mapPinSchema, "mapPins");
export const FeedPostModel = mongoose.model<any>(
  "FeedPost",
  feedPostSchema,
  "feedPosts",
);
