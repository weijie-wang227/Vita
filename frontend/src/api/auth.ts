import { apiRequest } from "./client";
import type {
  AuthResponse,
  AuthUser,
  SignInInput,
  SignUpInput,
} from "../lib/types";

export async function signIn(input: SignInInput) {
  return apiRequest<AuthResponse>("/auth/signin", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function signUp(input: SignUpInput) {
  return apiRequest<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function fetchCurrentUser() {
  return apiRequest<{ user: AuthUser }>("/auth/me");
}
