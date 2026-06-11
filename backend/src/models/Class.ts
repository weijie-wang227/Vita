import mongoose, { Schema, Document } from 'mongoose'

export interface IClass extends Document {
  title: string
  instructor: string
  date: string
  time: string
  duration: string
  location: string
  difficulty: string
  description: string
  capacity: number
  registered: number
  price: number
  imageUrl: string
}

const classSchema = new Schema<IClass>(
  {
    title: { type: String, required: true },
    instructor: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: String, required: true },
    location: { type: String, required: true },
    difficulty: { type: String, required: true },
    description: { type: String, required: true },
    capacity: { type: Number, required: true },
    registered: { type: Number, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String}
  },
  { timestamps: true }
)

export const Class = mongoose.model<IClass>('Class', classSchema)
