import { apiRequest } from "./client";
import type { GroupChat } from "../lib/types";

export async function fetchGroupChats() {
  return apiRequest<GroupChat[]>("/groups");
}
