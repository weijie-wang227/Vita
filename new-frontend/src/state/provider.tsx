import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  clearAuthToken,
  createActivity as requestCreateActivity,
  createFeedPost as requestCreateFeedPost,
  setAuthToken,
  signIn as requestSignIn,
  signUp as requestSignUp,
} from "../api";
import {
  feedPosts as fallbackFeedPosts,
  friends as fallbackFriends,
  mapPins as fallbackMapPins,
  premiumActivities as fallbackPremiumActivities,
  profile as fallbackProfile,
  standardActivities as fallbackStandardActivities,
} from "../data/mockData";
import type {
  Activity,
  ChatMessage,
  FeedPost,
  Friend,
  GroupChat,
  MapPin,
  PremiumActivity,
  Profile,
  StandardActivity,
} from "../lib/types";
import { AppStateContext } from "./context";
import {
  useGroupMessageActions,
  useJoinActivityAction,
  useJoinGroupAction,
} from "./providerActions";
import { useLoadAppData, useRestoreSession } from "./providerEffects";
import {
  activityIdsJoinedByProfile,
  createLocalActivity,
  createLocalFeedPost,
  markRecentActivityId,
  replaceActivity,
  upsertGroup,
} from "./providerHelpers";
import type { AppState, AppTab } from "./types";

const fallbackJoinedActivityIds = activityIdsJoinedByProfile(
  [...fallbackPremiumActivities, ...fallbackStandardActivities],
  fallbackProfile.handle,
);

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
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);
  const [chatMessages, setChatMessages] = useState<
    Record<number, ChatMessage[]>
  >({});
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
  const [joinedActivityIds, setJoinedActivityIds] = useState<number[]>(
    fallbackJoinedActivityIds,
  );

  useRestoreSession({
    setAuthError,
    setAuthUser,
    setIsAuthReady,
    setProfile,
  });

  useLoadAppData({
    authUser,
    isAuthReady,
    setApiError,
    setFeedPosts,
    setFriends,
    setGroupChats,
    setIsLoading,
    setMapPins,
    setPremiumActivities,
    setJoinedActivityIds,
    setProfile,
    setStandardActivities,
  });

  const applyActivityUpdate = useCallback((activity: Activity) => {
    if ("cover" in activity) {
      setPremiumActivities((current) => replaceActivity(current, activity));
      return;
    }

    setStandardActivities((current) => replaceActivity(current, activity));
  }, []);

  const applyGroupUpdate = useCallback((group: GroupChat) => {
    setGroupChats((current) => upsertGroup(current, group));
  }, []);

  const { loadGroupMessages, sendGroupMessage } = useGroupMessageActions({
    applyGroupUpdate,
    setApiError,
    setChatMessages,
  });

  const joinActivity = useJoinActivityAction({
    applyActivityUpdate,
    applyGroupUpdate,
    setActiveTab,
    setApiError,
    setJoinedActivityIds,
    setSelectedActivityId,
    setSelectedGroupId,
  });

  const joinGroup = useJoinGroupAction({
    applyGroupUpdate,
    setActiveTab,
    setApiError,
    setSelectedActivityId,
    setSelectedGroupId,
  });

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
      chatMessages,
      friends,
      mapPins,
      profile,
      joinedActivityIds,
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
          setJoinedActivityIds([]);
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
          setJoinedActivityIds([]);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unable to sign up";
          setAuthError(message);
          throw new Error(message);
        }
      },
      createActivity: async (input) => {
        try {
          const { activity, group, mapPin } = await requestCreateActivity(input);

          setStandardActivities((current) => [...current, activity]);
          setMapPins((current) => [...current, mapPin]);
          setJoinedActivityIds((current) =>
            markRecentActivityId(current, activity.id),
          );
          applyGroupUpdate(group);
          setShowMap(false);
          setApiError(null);

          return activity;
        } catch (error) {
          // TODO: Remove this local-only fallback once MongoDB writes are reliable again.
          const { activity, mapPin } = createLocalActivity(
            input,
            profile,
            standardActivities,
            premiumActivities,
            mapPins,
          );

          setStandardActivities((current) => [...current, activity]);
          setMapPins((current) => [...current, mapPin]);
          setJoinedActivityIds((current) =>
            markRecentActivityId(current, activity.id),
          );
          setShowMap(false);
          setApiError(
            error instanceof Error
              ? `${error.message} Created a temporary local activity instead.`
              : "Created a temporary local activity instead.",
          );

          return activity;
        }
      },
      createFeedPost: async (input) => {
        try {
          const post = await requestCreateFeedPost(input);

          setFeedPosts((current) => [
            post,
            ...current.filter((item) => item.id !== post.id),
          ]);
          setApiError(null);

          return post;
        } catch (error) {
          const post = createLocalFeedPost(input, profile, feedPosts, groupChats);

          setFeedPosts((current) => [post, ...current]);
          setApiError(
            error instanceof Error
              ? `${error.message} Created a temporary local post instead.`
              : "Created a temporary local post instead.",
          );

          return post;
        }
      },
      joinActivity,
      joinGroup,
      loadGroupMessages,
      sendGroupMessage,
      signOut: () => {
        clearAuthToken();
        setAuthUser(null);
        setAuthError(null);
        setProfile(fallbackProfile);
        setFriends(fallbackFriends);
        setGroupChats([]);
        setChatMessages({});
        setJoinedActivityIds(fallbackJoinedActivityIds);
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
        setShowProfile(false);
        setActiveTab("profile");
      },
      closeProfile: () => {
        setShowProfile(false);
        setActiveTab("activities");
      },
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
      chatMessages,
      friends,
      mapPins,
      profile,
      joinedActivityIds,
      likedPostIds,
      likedActivityIds,
      applyGroupUpdate,
      joinActivity,
      joinGroup,
      loadGroupMessages,
      sendGroupMessage,
    ],
  );

  return (
    <AppStateContext.Provider value={appState}>
      {children}
    </AppStateContext.Provider>
  );
}
