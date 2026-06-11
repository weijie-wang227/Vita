import type { ClassInfo } from '../lib/types'
import { api, fallback } from './index'


export async function fetchClasses(): Promise<ClassInfo[]> {
  try {
    const response = await api.get<ClassInfo[]>('/classes')
    return response.data
  } catch {
    return fallback([])
  }
}

export async function fetchClassById(classId: string) {
  try {
    const response = await api.get<ClassInfo>(`/classes/${classId}`)
    return response.data
  } catch {
    return fallback(null)
  }
}

export async function bookClass(classId: string) {
  try {
    await api.post(`/classes/${classId}/book`)
    return true
  } catch {
    return false
  }
}

export async function cancelClassBooking(classId: string) {
  try {
    await api.post(`/classes/${classId}/cancel`)
    return true
  } catch {
    return false
  }
}