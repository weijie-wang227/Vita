import type { ChatMessage } from '../lib/types'
import { api, fallback } from './index'

export async function fetchGroupChat(groupId: string): Promise<ChatMessage[]> {
  try {
    const response = await api.get<ChatMessage[]>(`/groups/${groupId}/chat`)
    return response.data
  } catch {
    return fallback([])
  }
}

export async function postGroupMessage(
  groupId: string,
  message: string
): Promise<ChatMessage> {
  try {
    const response = await api.post<ChatMessage>(
      `/groups/${groupId}/message`,
      { message }
    );

    return response.data;
  } catch {
    return fallback([]);
  }
}