import mongoose, { Schema, Document } from 'mongoose'

const chatSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    classId: { type: Schema.Types.ObjectId, required: true, ref: 'Class' },
    message: { type: String, required: true}
  },
    { timestamps: true }
)

export const Chat = mongoose.model('Chat', chatSchema)