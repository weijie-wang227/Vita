import type { GroupInfo } from '../lib/types'
import { api, fallback } from './index'

export async function fetchGroups(): Promise<GroupInfo[]> {
  try {
    const response = await api.get<GroupInfo[]>('/groups')
    return response.data
  } catch {
    return fallback([])
  }
}

export async function fetchGroupById(groupId: string): Promise<GroupInfo> {
  try {
    const response = await api.get<GroupInfo>(`/groups/${groupId}`)
    return response.data
  } catch {
    return fallback(null)
  }
}

export async function createGroup(data: {title: string, imageUrl: string, description: string}): Promise<GroupInfo> {
  try {
    const response = await api.post<GroupInfo>('/groups/create', data)
    return response.data
  } catch {
    return fallback([])
  }
}

export async function joinGroup(groupId: string) {
  try {
    await api.post(`/groups/${groupId}/join`)
    return true
  } catch {
    return false
  }
}

export async function cancelGroupBooking(groupId: string) {
  try {
    await api.post(`/groups/${groupId}/cancel`)
    return true
  } catch {
    return false
  }
}