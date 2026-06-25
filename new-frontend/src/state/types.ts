import type {
  ChatMessage,
  AuthUser,
  CreateActivityInput,
  CreateFeedPostInput,
  FeedPost,
  Friend,
  GroupChat,
  MapPin,
  PremiumActivity,
  Profile,
  SignInInput,
  SignUpInput,
  StandardActivity,
} from "../lib/types";

export type AppTab = "activities" | "feed" | "chat" | "profile";

export type AppState = {
  activeTab: AppTab;
  apiError: string | null;
  authError: string | null;
  authUser: AuthUser | null;
  isAuthReady: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  showProfile: boolean;
  showMap: boolean;
  showProfileFriends: boolean;
  selectedActivityId: number | null;
  selectedGroupId: number | null;
  premiumActivities: PremiumActivity[];
  standardActivities: StandardActivity[];
  feedPosts: FeedPost[];
  groupChats: GroupChat[];
  chatMessages: Record<number, ChatMessage[]>;
  friends: Friend[];
  mapPins: MapPin[];
  profile: Profile;
  joinedActivityIds: number[];
  likedPostIds: Record<number, boolean>;
  likedActivityIds: Record<number, boolean>;
  signIn: (input: SignInInput) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  createActivity: (input: CreateActivityInput) => Promise<StandardActivity>;
  createFeedPost: (input: CreateFeedPostInput) => Promise<FeedPost>;
  joinActivity: (activityId: number) => Promise<GroupChat>;
  joinGroup: (groupId: number) => Promise<GroupChat>;
  loadGroupMessages: (groupId: number) => Promise<void>;
  sendGroupMessage: (groupId: number, body: string) => Promise<ChatMessage>;
  signOut: () => void;
  selectTab: (tab: AppTab) => void;
  openActivity: (activityId: number) => void;
  closeActivity: () => void;
  openGroup: (groupId: number) => void;
  closeGroup: () => void;
  openProfile: () => void;
  closeProfile: () => void;
  setShowMap: (showMap: boolean) => void;
  setShowProfileFriends: (showFriends: boolean) => void;
  togglePostLike: (postId: number) => void;
  toggleActivityLike: (activityId: number) => void;
};
