import mongoose, { Schema } from 'mongoose'

const joinSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    groupId: { type: Schema.Types.ObjectId, required: true, ref: 'Group' },
  },
    { timestamps: true }
)

joinSchema.index({ userId: 1, groupId: 1 }, { unique: true });
export const Joins = mongoose.model('Joins', joinSchema)