import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AppStateContext } from "./context";
import type { AppState, AppTab } from "./types";

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<AppTab>("activities");
  const [showProfile, setShowProfile] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showProfileFriends, setShowProfileFriends] = useState(false);
  const [likedPostIds, setLikedPostIds] = useState<Record<number, boolean>>(
    {},
  );
  const [likedActivityIds, setLikedActivityIds] = useState<
    Record<number, boolean>
  >({});

  const appState = useMemo<AppState>(
    () => ({
      activeTab,
      showProfile,
      showMap,
      showProfileFriends,
      likedPostIds,
      likedActivityIds,
      selectTab: (tab) => {
        setShowProfile(false);
        setActiveTab(tab);
      },
      openProfile: () => setShowProfile(true),
      closeProfile: () => setShowProfile(false),
      setShowMap,
      setShowProfileFriends,
      togglePostLike: (postId) =>
        setLikedPostIds((current) => ({
          ...current,
          [postId]: !current[postId],
        })),
      toggleActivityLike: (activityId) =>
        setLikedActivityIds((current) => ({
          ...current,
          [activityId]: !current[activityId],
        })),
    }),
    [
      activeTab,
      showProfile,
      showMap,
      showProfileFriends,
      likedPostIds,
      likedActivityIds,
    ],
  );

  return (
    <AppStateContext.Provider value={appState}>
      {children}
    </AppStateContext.Provider>
  );
}
