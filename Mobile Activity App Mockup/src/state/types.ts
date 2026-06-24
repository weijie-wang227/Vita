export type AppTab = "activities" | "feed" | "chat";

export type AppState = {
  activeTab: AppTab;
  showProfile: boolean;
  showMap: boolean;
  showProfileFriends: boolean;
  likedPostIds: Record<number, boolean>;
  likedActivityIds: Record<number, boolean>;
  selectTab: (tab: AppTab) => void;
  openProfile: () => void;
  closeProfile: () => void;
  setShowMap: (showMap: boolean) => void;
  setShowProfileFriends: (showFriends: boolean) => void;
  togglePostLike: (postId: number) => void;
  toggleActivityLike: (activityId: number) => void;
};
