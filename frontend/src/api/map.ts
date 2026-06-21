import type { Activity } from '../lib/types'
import { api, fallback } from './index'

export async function fetchActivities(): Promise<Activity[]> {
  try {
    const response = await api.get<Activity[]>('/activity')
    return response.data
  } catch {
    return fallback([])
  }
}

export async function createActivity(data: {title: string, 
  type: string,
  date: string,
  time: string,
  imageUrl: string,
  lat: number,
  lng: number,
  sourceId: string}): Promise<Activity> {
  try {
    const response = await api.post<Activity>('/activity/add', data)
    return response.data
  } catch {
    return fallback([])
  }
}