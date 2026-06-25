import { useCallback, type Dispatch, type SetStateAction } from "react";
import {
  fetchGroupMessages,
  joinGroup as requestJoinGroup,
  joinActivity as requestJoinActivity,
  sendGroupMessage as requestSendGroupMessage,
} from "../api";
import type { Activity, ChatMessage, GroupChat } from "../lib/types";
import type { AppTab } from "./types";
import { markRecentActivityId } from "./providerHelpers";

type Setter<T> = Dispatch<SetStateAction<T>>;

export function useGroupMessageActions({
  applyGroupUpdate,
  setApiError,
  setChatMessages,
}: {
  applyGroupUpdate: (group: GroupChat) => void;
  setApiError: Setter<string | null>;
  setChatMessages: Setter<Record<number, ChatMessage[]>>;
}) {
  const loadGroupMessages = useCallback(
    async (groupId: number) => {
      try {
        const messages = await fetchGroupMessages(groupId);

        setChatMessages((current) => ({
          ...current,
          [groupId]: messages,
        }));
        setApiError(null);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to load messages";
        setApiError(message);
        throw new Error(message);
      }
    },
    [setApiError, setChatMessages],
  );

  const sendGroupMessage = useCallback(
    async (groupId: number, body: string) => {
      try {
        const response = await requestSendGroupMessage(groupId, body);

        setChatMessages((current) => {
          const messages = current[groupId] ?? [];

          return {
            ...current,
            [groupId]: [
              ...messages.filter((message) => message.id !== response.message.id),
              response.message,
            ],
          };
        });
        applyGroupUpdate(response.group);
        setApiError(null);

        return response.message;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to send message";
        setApiError(message);
        throw new Error(message);
      }
    },
    [applyGroupUpdate, setApiError, setChatMessages],
  );

  return { loadGroupMessages, sendGroupMessage };
}

export function useJoinActivityAction({
  applyActivityUpdate,
  applyGroupUpdate,
  setActiveTab,
  setApiError,
  setJoinedActivityIds,
  setSelectedActivityId,
  setSelectedGroupId,
}: {
  applyActivityUpdate: (activity: Activity) => void;
  applyGroupUpdate: (group: GroupChat) => void;
  setActiveTab: Setter<AppTab>;
  setApiError: Setter<string | null>;
  setJoinedActivityIds: Setter<number[]>;
  setSelectedActivityId: Setter<number | null>;
  setSelectedGroupId: Setter<number | null>;
}) {
  return useCallback(
    async (activityId: number) => {
      try {
        const response = await requestJoinActivity(activityId);

        applyActivityUpdate(response.activity);
        applyGroupUpdate(response.group);
        setJoinedActivityIds((current) =>
          markRecentActivityId(current, activityId),
        );
        setActiveTab("chat");
        setSelectedActivityId(null);
        setSelectedGroupId(response.group.id);
        setApiError(null);

        return response.group;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to join activity";
        setApiError(message);
        throw new Error(message);
      }
    },
    [
      applyActivityUpdate,
      applyGroupUpdate,
      setActiveTab,
      setApiError,
      setJoinedActivityIds,
      setSelectedActivityId,
      setSelectedGroupId,
    ],
  );
}

export function useJoinGroupAction({
  applyGroupUpdate,
  setActiveTab,
  setApiError,
  setSelectedActivityId,
  setSelectedGroupId,
}: {
  applyGroupUpdate: (group: GroupChat) => void;
  setActiveTab: Setter<AppTab>;
  setApiError: Setter<string | null>;
  setSelectedActivityId: Setter<number | null>;
  setSelectedGroupId: Setter<number | null>;
}) {
  return useCallback(
    async (groupId: number) => {
      try {
        const response = await requestJoinGroup(groupId);

        applyGroupUpdate(response.group);
        setActiveTab("chat");
        setSelectedActivityId(null);
        setSelectedGroupId(response.group.id);
        setApiError(null);

        return response.group;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to join group";
        setApiError(message);
        throw new Error(message);
      }
    },
    [
      applyGroupUpdate,
      setActiveTab,
      setApiError,
      setSelectedActivityId,
      setSelectedGroupId,
    ],
  );
}
