import type {
  ChatMessage,
  AuthUser,
  CreateActivityInput,
  CreateFeedCommentInput,
  CreateFeedPostInput,
  FeedComment,
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
  friendInviteFeedback: string | null;
  friendInviteFriend: Friend | null;
  showProfile: boolean;
  showMap: boolean;
  showProfileFriends: boolean;
  showSettings: boolean;
  selectedActivityId: number | null;
  selectedGroupId: number | null;
  premiumActivities: PremiumActivity[];
  standardActivities: StandardActivity[];
  feedPosts: FeedPost[];
  feedComments: Record<number, FeedComment[]>;
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
  loadFeedComments: (postId: number) => Promise<FeedComment[]>;
  createFeedComment: (
    postId: number,
    input: CreateFeedCommentInput,
  ) => Promise<FeedComment>;
  addFriend: (friendId: string) => Promise<Friend>;
  clearFriendInvite: () => void;
  clearFriendInviteResult: () => void;
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
  openSettings: () => void;
  closeSettings: () => void;
  setShowMap: (showMap: boolean) => void;
  setShowProfileFriends: (showFriends: boolean) => void;
  togglePostLike: (postId: number) => Promise<void>;
  toggleActivityLike: (activityId: number) => void;
};
