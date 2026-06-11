import type { Post} from '../lib/types'
import { api, fallback } from './index'

export async function fetchPosts() {
  try {
    const response = await api.get<Post[]>('/feed')
    return response.data
  } catch {
    return fallback([])
  }
}

export async function createPost(data: {title: string, imageUrl: string, description: string, classId: string}) {
  try {
    const response = await api.post<Post>('/feed/post', data)
    return response.data
  } catch {
    return fallback([])
  }
}
