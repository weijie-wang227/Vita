import { apiRequest } from "./client";
import type { FeedPost } from "../lib/types";

export async function fetchFeedPosts() {
  return apiRequest<FeedPost[]>("/feed");
}
