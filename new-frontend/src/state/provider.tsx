import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  clearAuthToken,
  fetchCurrentUser,
  fetchFeedPosts,
  fetchFriends,
  fetchGroupChats,
  fetchMapPins,
  fetchPremiumActivities,
  fetchProfile,
  fetchStandardActivities,
  getAuthToken,
  setAuthToken,
  signIn as requestSignIn,
  signUp as requestSignUp,
} from "../api";
import {
  feedPosts as fallbackFeedPosts,
  friends as fallbackFriends,
  groupChats as fallbackGroupChats,
  mapPins as fallbackMapPins,
  premiumActivities as fallbackPremiumActivities,
  profile as fallbackProfile,
  standardActivities as fallbackStandardActivities,
} from "../data/mockData";
import type {
  FeedPost,
  Friend,
  GroupChat,
  MapPin,
  PremiumActivity,
  Profile,
  StandardActivity,
} from "../lib/types";
import { AppStateContext } from "./context";
import type { AppState, AppTab } from "./types";

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<AppTab>("activities");
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showProfileFriends, setShowProfileFriends] = useState(false);
  const [premiumActivities, setPremiumActivities] = useState<PremiumActivity[]>(
    fallbackPremiumActivities,
  );
  const [standardActivities, setStandardActivities] = useState<
    StandardActivity[]
  >(fallbackStandardActivities);
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(fallbackFeedPosts);
  const [groupChats, setGroupChats] = useState<GroupChat[]>(fallbackGroupChats);
  const [friends, setFriends] = useState<Friend[]>(fallbackFriends);
  const [mapPins, setMapPins] = useState<MapPin[]>(fallbackMapPins);
  const [profile, setProfile] = useState<Profile>(fallbackProfile);
  const [authUser, setAuthUser] = useState<AppState["authUser"]>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(
    null,
  );
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [likedPostIds, setLikedPostIds] = useState<Record<number, boolean>>(
    {},
  );
  const [likedActivityIds, setLikedActivityIds] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    let ignore = false;

    async function restoreSession() {
      const token = getAuthToken();

      if (!token) {
        setIsAuthReady(true);
        return;
      }

      try {
        const { user } = await fetchCurrentUser();

        if (ignore) {
          return;
        }

        setAuthUser(user);
        setProfile(user);
        setAuthError(null);
      } catch {
        clearAuthToken();

        if (!ignore) {
          setAuthUser(null);
        }
      } finally {
        if (!ignore) {
          setIsAuthReady(true);
        }
      }
    }

    restoreSession();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadAppData() {
      if (!isAuthReady || !authUser) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const [
          nextPremiumActivities,
          nextStandardActivities,
          nextFeedPosts,
          nextGroupChats,
          nextFriends,
          nextMapPins,
          nextProfile,
        ] = await Promise.all([
          fetchPremiumActivities(),
          fetchStandardActivities(),
          fetchFeedPosts(),
          fetchGroupChats(),
          fetchFriends(),
          fetchMapPins(),
          fetchProfile(),
        ]);

        if (ignore) {
          return;
        }

        setPremiumActivities(nextPremiumActivities);
        setStandardActivities(nextStandardActivities);
        setFeedPosts(nextFeedPosts);
        setGroupChats(nextGroupChats);
        setFriends(nextFriends);
        setMapPins(nextMapPins);
        setProfile(nextProfile);
        setApiError(null);
      } catch (error) {
        if (!ignore) {
          setApiError(error instanceof Error ? error.message : "API unavailable");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadAppData();

    return () => {
      ignore = true;
    };
  }, [authUser, isAuthReady]);

  const appState = useMemo<AppState>(
    () => ({
      activeTab,
      apiError,
      authError,
      authUser,
      isAuthReady,
      isAuthenticated: Boolean(authUser),
      isLoading,
      showProfile,
      showMap,
      showProfileFriends,
      selectedActivityId,
      selectedGroupId,
      premiumActivities,
      standardActivities,
      feedPosts,
      groupChats,
      friends,
      mapPins,
      profile,
      likedPostIds,
      likedActivityIds,
      signIn: async (input) => {
        try {
          const { token, user } = await requestSignIn(input);

          setAuthToken(token);
          setAuthUser(user);
          setProfile(user);
          setAuthError(null);
          setActiveTab("activities");
          setShowProfile(false);
          setSelectedActivityId(null);
          setSelectedGroupId(null);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unable to sign in";
          setAuthError(message);
          throw new Error(message);
        }
      },
      signUp: async (input) => {
        try {
          const { token, user } = await requestSignUp(input);

          setAuthToken(token);
          setAuthUser(user);
          setProfile(user);
          setAuthError(null);
          setActiveTab("activities");
          setShowProfile(false);
          setSelectedActivityId(null);
          setSelectedGroupId(null);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unable to sign up";
          setAuthError(message);
          throw new Error(message);
        }
      },
      signOut: () => {
        clearAuthToken();
        setAuthUser(null);
        setAuthError(null);
        setProfile(fallbackProfile);
        setFriends(fallbackFriends);
        setActiveTab("activities");
        setShowProfile(false);
        setSelectedActivityId(null);
        setSelectedGroupId(null);
      },
      selectTab: (tab) => {
        setShowProfile(false);
        setSelectedActivityId(null);
        setSelectedGroupId(null);
        setActiveTab(tab);
      },
      openActivity: (activityId) => setSelectedActivityId(activityId),
      closeActivity: () => setSelectedActivityId(null),
      openGroup: (groupId) => setSelectedGroupId(groupId),
      closeGroup: () => setSelectedGroupId(null),
      openProfile: () => {
        setSelectedActivityId(null);
        setSelectedGroupId(null);
        setShowProfile(true);
      },
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
      apiError,
      authError,
      authUser,
      isAuthReady,
      isLoading,
      showProfile,
      showMap,
      showProfileFriends,
      selectedActivityId,
      selectedGroupId,
      premiumActivities,
      standardActivities,
      feedPosts,
      groupChats,
      friends,
      mapPins,
      profile,
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
