import mongoose, { Schema } from 'mongoose'

const groupChatSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    groupId: { type: Schema.Types.ObjectId, required: true, ref: 'Group' },
    message: { type: String, required: true}
  },
    { timestamps: true }
)

export const GroupChat = mongoose.model('GroupChat', groupChatSchema)