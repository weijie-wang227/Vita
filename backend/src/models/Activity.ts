import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IActivity extends Document {
  title: string
  type: string
  date: string
  time: string
  imageUrl: string
  lat: number
  lng: number
  sourceId: string
}

const activitySchema = new Schema<IActivity>(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    imageUrl: { type: String },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    sourceId: {type: String, required: true}
  },
  { timestamps: true }
)

export const Activity = mongoose.model<IActivity>('Activity', activitySchema)
