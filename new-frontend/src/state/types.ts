import type {
  AuthUser,
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

export type AppTab = "activities" | "feed" | "chat";

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
  friends: Friend[];
  mapPins: MapPin[];
  profile: Profile;
  likedPostIds: Record<number, boolean>;
  likedActivityIds: Record<number, boolean>;
  signIn: (input: SignInInput) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
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
