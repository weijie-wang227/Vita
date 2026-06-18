import type { User } from '../lib/types'
import { api } from './index'
import axios from 'axios'

export interface AuthResponse {
  token: string
  user: User
  message: string
}
type RegisterResult =
  | {
      success: true;
      token: string;
      user: User;
    }
  | {
      success: false;
      message: string;
    };

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<RegisterResult> {
  try {
    const response = await api.post<AuthResponse>("/auth/register", data);

    const token = response.data.token;

    if (token) {
      localStorage.setItem("vita-auth-token", token);
    }

    return {
      success: true,
      token,
      user: {
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        bio: "New wellness explorer",
        avatarUrl:
          "https://pub-9934b5033d7946dfafc6a2032d8db9d2.r2.dev/posts/blank-profile-picture-973460_640.png",
        currentPlan: response.data.user.currentPlan,
        creditsRemaining: response.data.user.creditsRemaining,
        friendIds: [],
      },
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to register account.",
      };
    }

    return {
      success: false,
      message: "Failed to register account.",
    };
  }
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ token: string; user: User } | null> {
  try {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    })
    if (response.data.token) {
      localStorage.setItem('vita-auth-token', response.data.token)
    }
    
    return {
      token: response.data.token,
      user: {
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        bio: 'Wellness explorer',
        avatarUrl:
          response.data.user.avatarUrl ?? "https://pub-9934b5033d7946dfafc6a2032d8db9d2.r2.dev/posts/blank-profile-picture-973460_640.png",
        currentPlan: response.data.user.currentPlan,
        creditsRemaining: response.data.user.creditsRemaining,
        friendIds: response.data.user.friendIds,
      },
    }
  } catch (error) {
    console.error('Login error:', error)
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await api.get<User>('/auth/me')
    return response.data
  } catch {
    return null
  }
}
