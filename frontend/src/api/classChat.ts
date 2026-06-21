import type { ChatMessage } from '../lib/types'
import { api, fallback } from './index'

export async function fetchClassChat(classId: string): Promise<ChatMessage[]> {
  try {
    const response = await api.get<ChatMessage[]>(`/classes/${classId}/chat`)
    return response.data
  } catch {
    return fallback([])
  }
}

export async function postClassMessage(
  classId: string,
  message: string
): Promise<ChatMessage> {
  try {
    const response = await api.post<ChatMessage>(
      `/classes/${classId}/message`,
      { message }
    );

    return response.data;
  } catch {
    return fallback([]);
  }
}