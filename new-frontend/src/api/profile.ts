import { apiRequest } from "./client";
import type { Friend, Profile } from "../lib/types";

export async function fetchProfile() {
  return apiRequest<Profile>("/profile");
}

export async function fetchFriends() {
  return apiRequest<Friend[]>("/friends");
}
