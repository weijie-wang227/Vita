import mongoose, { Schema, Document } from 'mongoose'

const signupSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    classId: { type: Schema.Types.ObjectId, required: true, ref: 'Class' },
  },
    { timestamps: true }
)

signupSchema.index({ userId: 1, classId: 1 }, { unique: true });
export const Signups = mongoose.model('Signups', signupSchema)