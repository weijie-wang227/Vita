import { apiRequest } from "./client";
import type { PremiumActivity, StandardActivity } from "../lib/types";

export async function fetchPremiumActivities() {
  return apiRequest<PremiumActivity[]>("/activities/premium");
}

export async function fetchStandardActivities() {
  return apiRequest<StandardActivity[]>("/activities");
}
