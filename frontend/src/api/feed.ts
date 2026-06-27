import { apiRequest } from "./client";
import type {
  CreateFeedCommentInput,
  CreateFeedCommentResponse,
  CreateFeedPostInput,
  FeedCommentsResponse,
  FeedLikeResponse,
  FeedPost,
} from "../lib/types";

export async function fetchFeedPosts() {
  return apiRequest<FeedPost[]>("/feed");
}

export async function createFeedPost(input: CreateFeedPostInput) {
  return apiRequest<FeedPost>("/feed", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function fetchFeedComments(postId: number) {
  return apiRequest<FeedCommentsResponse>(`/feed/${postId}/comments`);
}

export async function createFeedComment(
  postId: number,
  input: CreateFeedCommentInput,
) {
  return apiRequest<CreateFeedCommentResponse>(`/feed/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function likeFeedPost(postId: number) {
  return apiRequest<FeedLikeResponse>(`/feed/${postId}/likes`, {
    method: "POST",
  });
}

export async function unlikeFeedPost(postId: number) {
  return apiRequest<FeedLikeResponse>(`/feed/${postId}/likes`, {
    method: "DELETE",
  });
}
