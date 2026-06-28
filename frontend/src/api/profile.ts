import { apiRequest } from "./client";
import type {
  Friend,
  HandleAvailability,
  Profile,
  UpdateProfileInput,
} from "../lib/types";

export async function fetchProfile() {
  return apiRequest<Profile>("/profile");
}

export async function checkHandleAvailability(handle: string) {
  return apiRequest<HandleAvailability>(
    `/profile/handle-availability?handle=${encodeURIComponent(handle)}`,
  );
}

export async function updateProfile(input: UpdateProfileInput) {
  return apiRequest<Profile>("/profile", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function fetchFriends() {
  return apiRequest<Friend[]>("/friends");
}

export async function addFriend(friendId: string) {
  return apiRequest<Friend>(`/friends/add/${encodeURIComponent(friendId)}`, {
    method: "POST",
  });
}
