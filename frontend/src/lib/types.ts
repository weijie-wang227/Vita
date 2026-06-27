export type VitaCategory = "physical" | "social" | "cognitive" | "creative";

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
  date: string;
  time: string;
  location: string;
  durationMinutes: number;
  spots: number;
  price: string;
  rating: number;
  categories: VitaCategory[];
  joiningFriends: Friend[];
};

export type PremiumActivity = ActivityBase & {
  cover: string;
  tags: string[];
};

export type StandardActivity = ActivityBase;

export type Activity = PremiumActivity | StandardActivity;

export type CreateActivityInput = {
  title: string;
  date: string;
  time: string;
  location: string;
  latitude: number;
  longitude: number;
  durationMinutes: number;
  spots: number;
  price: string;
  categories: VitaCategory[];
  groupId?: number;
};

export type CreateActivityResponse = {
  activity: StandardActivity;
  mapPin: MapPin;
  group: GroupChat;
};

export type FeedPost = {
  id: number;
  user: string;
  handle: string;
  avatar: string;
  time: string;
  caption: string;
  image?: string;
  likes: number;
  likesCount: number;
  likedByMe: boolean;
  comments: number;
  activity?: string;
  durationMinutes?: number;
  categories: VitaCategory[];
  group?: FeedPostGroupReference;
};

export type FeedComment = {
  id: string;
  postId: number;
  user: string;
  handle: string;
  avatar: string;
  body: string;
  time: string;
  createdAt: string;
};

export type FeedPostGroupReference = {
  id: number;
  name: string;
  avatar: string;
  members: number;
};

export type GroupMember = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  isAdmin: boolean;
};

export type CreateFeedPostInput = {
  caption: string;
  image?: string;
  groupId?: number;
};

export type CreateFeedCommentInput = {
  body: string;
};

export type FeedCommentsResponse = {
  comments: FeedComment[];
  commentCount: number;
};

export type CreateFeedCommentResponse = {
  comment: FeedComment;
  commentCount: number;
};

export type FeedLikeResponse = {
  postId: number;
  likes: number;
  likesCount: number;
  likedByMe: boolean;
};

export type GroupChat = {
  id: number;
  name: string;
  members: number;
  memberList?: GroupMember[];
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isAdmin: boolean;
};

export type ChatActivityInvite = {
  activity: {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    durationMinutes: number;
    price: string;
    categories: VitaCategory[];
  };
  joiningFriends: Friend[];
};

export type ChatMessage = {
  id: string;
  groupId: number;
  type: "text" | "activity_invite";
  sender: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    isAdmin: boolean;
  };
  body: string;
  time: string;
  createdAt: string;
  activityInvite?: ChatActivityInvite;
};

export type JoinActivityResponse = {
  activity: Activity;
  group: GroupChat;
};

export type SendGroupMessageResponse = {
  message: ChatMessage;
  group: GroupChat;
};

export type JoinGroupResponse = {
  group: GroupChat;
};

export type MapPin = {
  id: number;
  activityId: number;
  latitude: number;
  longitude: number;
  x: number;
  y: number;
  label: string;
  premium?: boolean;
  categories?: VitaCategory[];
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

export type AuthUser = Profile & {
  id: string;
  email: string;
};

export type SignInInput = {
  email: string;
  password: string;
};

export type SignUpInput = SignInInput & {
  name: string;
  handle?: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};
