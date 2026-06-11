import type { MembershipPlan} from '../lib/types'
import { api, fallback } from './index'

export async function fetchPlans(): Promise<{ plans: MembershipPlan[] }> {
  try {
    const response = await api.get<MembershipPlan[]>('/plans')
    return { plans: response.data }
  } catch {
    return fallback([])
  }
}

export async function subscribe(planId: string) {
  try {
    await api.put(`/plans/${planId}/subscribe`)
    return true
  } catch {
    return false
  }
}