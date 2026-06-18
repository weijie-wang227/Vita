export type MembershipPlan = {
  _id: string
  name: string
  description: string
  monthlyPrice: number
  creditsPerMonth: number
}

export type ClassItem = {
  _id: string
  title: string
  description: string
  imageUrl: string
  date: string
  time: string
  location: string
  instructor: string
  price: number
  capacity: number
  registered: number
}

export type ClassInfo = ClassItem & {
  friendsGoing: User[];
  bookedByMe: boolean;
}

export type User = {
  id: string
  name: string
  email: string
  bio: string
  avatarUrl: string
  currentPlan: MembershipPlan
  creditsRemaining: number
  friendIds: string[]
}

export type Booking = {
  id: string
  userId: string
  classId: string
  createdAt: string
}

export type Post = {
  title: string
  id: string
  user: User
  class: ClassItem
  description: string
  imageUrl: string
  createdAt: string
}

export type AnalyticsSummary = {
  totalUsers: number
  totalBookings: number
  popularClasses: Array<{ title: string; bookings: number }>
  planDistribution: Array<{ plan: string; count: number }>
  creditUsage: Array<{ month: string; creditsUsed: number }>
}
