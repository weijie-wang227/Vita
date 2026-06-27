import { apiRequest } from "./client";
import type {
  ChatMessage,
  GroupChat,
  JoinGroupResponse,
  SendGroupMessageResponse,
} from "../lib/types";

export async function fetchGroupChats() {
  return apiRequest<GroupChat[]>("/groups");
}

export async function fetchGroupMessages(groupId: number) {
  return apiRequest<ChatMessage[]>(`/groups/${groupId}/messages`);
}

export async function sendGroupMessage(groupId: number, body: string) {
  return apiRequest<SendGroupMessageResponse>(`/groups/${groupId}/messages`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}

export async function joinGroup(groupId: number) {
  return apiRequest<JoinGroupResponse>(`/groups/${groupId}/join`, {
    method: "POST",
  });
}
