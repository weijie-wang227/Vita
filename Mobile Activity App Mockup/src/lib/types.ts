export type ActivityType =
  | "wellness"
  | "food"
  | "photo"
  | "hiking"
  | "chess"
  | "fishing"
  | "social"
  | "bike";

export type Friend = {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  mutual: number;
  joined: string[];
};

type ActivityBase = {
  id: number;
  title: string;
  host: string;
  type: ActivityType;
  date: string;
  time: string;
  location: string;
  spots: number;
  price: string;
  rating: number;
  joiningFriends: Friend[];
};

export type PremiumActivity = ActivityBase & {
  cover: string;
  tags: string[];
};

export type StandardActivity = ActivityBase;

export type Activity = PremiumActivity | StandardActivity;

export type FeedPost = {
  id: number;
  user: string;
  handle: string;
  avatar: string;
  time: string;
  caption: string;
  image: string;
  likes: number;
  comments: number;
  activity: string;
};

export type GroupChat = {
  id: number;
  name: string;
  members: number;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
};

export type MapPin = {
  id: number;
  x: number;
  y: number;
  type: ActivityType;
  label: string;
  premium?: boolean;
};

export type ProfileStat = {
  label: string;
  value: string;
};

export type Profile = {
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  stats: ProfileStat[];
};
