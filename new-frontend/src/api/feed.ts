import { apiRequest } from "./client";
import type { CreateFeedPostInput, FeedPost } from "../lib/types";

export async function fetchFeedPosts() {
  return apiRequest<FeedPost[]>("/feed");
}

export async function createFeedPost(input: CreateFeedPostInput) {
  return apiRequest<FeedPost>("/feed", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
