import type { User } from "../lib/types";
import { api, fallback } from "./index";

export async function fetchFriends(): Promise<User[]> {
    try {
        const response = await api.get<User[]>('/friends');
        return response.data;
    } catch (error) {
        return fallback([]);
    }
}

export async function addFriend(friendId: string): Promise<User> {
    try {
        const response = await api.post<User>(`/friends/add/${friendId}`, { friendId });
        return response.data;
    } catch (error) {
        console.error('Failed to add friend:', error);
        return fallback(null);
    }
}