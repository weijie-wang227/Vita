import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IGroup extends Document {
  title: string
  admin: Types.ObjectId
  description: string
  joined: number
  imageUrl: string
}

const groupSchema = new Schema<IGroup>(
  {
    title: { type: String, required: true},
    admin: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    description: { type: String, required: true},
    joined: { type: Number, required: true, default: 1},
    imageUrl: { type: String, required: true},
  },
  { timestamps: true }
)

export const Group = mongoose.model<IGroup>('Group', groupSchema)
