import { apiRequest } from "./client";
import type { Friend, Profile } from "../lib/types";

export async function fetchProfile() {
  return apiRequest<Profile>("/profile");
}

export async function fetchFriends() {
  return apiRequest<Friend[]>("/friends");
}

export async function addFriend(friendId: string) {
  return apiRequest<Friend>(`/friends/add/${encodeURIComponent(friendId)}`, {
    method: "POST",
  });
}
