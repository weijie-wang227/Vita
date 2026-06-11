import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string
  name: string
  membershipPlanId: Types.ObjectId
  credits: number
  avatarUrl: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
    },
    membershipPlanId: {
      type: Schema.Types.ObjectId,
      ref: 'Plan',
      default: null,
    },
    credits: {
      type: Number,
      default: 0,
    },
    avatarUrl: {
      type: String,
      default: null,
    }
  },
  { timestamps: true }
)

export const User = mongoose.model<IUser>('User', userSchema)
