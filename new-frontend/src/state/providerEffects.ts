import { useEffect, type Dispatch, type SetStateAction } from "react";
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
} from "../api";
import type {
  AuthUser,
  Activity,
  FeedPost,
  Friend,
  GroupChat,
  MapPin,
  PremiumActivity,
  Profile,
  StandardActivity,
} from "../lib/types";
import { activityIdsJoinedByProfile } from "./providerHelpers";

type Setter<T> = Dispatch<SetStateAction<T>>;

export function useRestoreSession({
  setAuthError,
  setAuthUser,
  setIsAuthReady,
  setProfile,
}: {
  setAuthError: Setter<string | null>;
  setAuthUser: Setter<AuthUser | null>;
  setIsAuthReady: Setter<boolean>;
  setProfile: Setter<Profile>;
}) {
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
      } catch (error) {
        console.error("Unable to restore session", error);
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
  }, [setAuthError, setAuthUser, setIsAuthReady, setProfile]);
}

export function useLoadAppData({
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
}: {
  authUser: AuthUser | null;
  isAuthReady: boolean;
  setApiError: Setter<string | null>;
  setFeedPosts: Setter<FeedPost[]>;
  setFriends: Setter<Friend[]>;
  setGroupChats: Setter<GroupChat[]>;
  setIsLoading: Setter<boolean>;
  setMapPins: Setter<MapPin[]>;
  setPremiumActivities: Setter<PremiumActivity[]>;
  setJoinedActivityIds: Setter<number[]>;
  setProfile: Setter<Profile>;
  setStandardActivities: Setter<StandardActivity[]>;
}) {
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
        setJoinedActivityIds(
          activityIdsJoinedByProfile(
            [
              ...nextPremiumActivities,
              ...nextStandardActivities,
            ] as Activity[],
            nextProfile.handle,
          ),
        );
        setFeedPosts(nextFeedPosts);
        setGroupChats(nextGroupChats);
        setFriends(nextFriends);
        setMapPins(nextMapPins);
        setProfile(nextProfile);
        setApiError(null);
      } catch (error) {
        if (!ignore) {
          console.error("Unable to load app data", error);
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
  }, [
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
  ]);
}
