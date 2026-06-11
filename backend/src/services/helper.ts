import { IClass } from "../models/Class"
import { Friends } from "../models/Friends"
import { Signups } from "../models/Signups"
import { User } from "../models/User"

// Helper functions
export async function getFriendIdsForUser(userId: string): Promise<string[]> {
  const friendships = await Friends.find({
    $or: [{ userId }, { friendId: userId }],
  })

  return friendships.map((friendship) => {
    const friendshipUserId = friendship.userId.toString()
    const friendshipFriendId = friendship.friendId.toString()

    return friendshipUserId === userId
      ? friendshipFriendId
      : friendshipUserId
  })
}

export async function buildClassInfo(
  classItem: IClass,
  userId: string,
  friendIds: string[],
) {
  const classId = classItem._id.toString()
  const relevantUserIds = [userId, ...friendIds]

  const signups = await Signups.find({
    classId,
    userId: { $in: relevantUserIds },
  }).populate('userId', 'name bio avatarUrl')

  const bookedCount = await Signups.countDocuments({
    classId,
  })

  let bookedByMe = false
  const friendsGoing: unknown[] = []

  for (const signup of signups) {
    const populatedUser = signup.userId

    const signupUserId = populatedUser._id.toString()

    if (signupUserId === userId) {
      bookedByMe = true
    } else {
      friendsGoing.push(populatedUser)
    }
  }

  return {
    ...classItem.toObject(),
    id: classId,
    bookedCount,
    availableSlots: classItem.capacity - bookedCount,
    bookedByMe,
    friendsGoing,
  }
}