import mongoose, { Schema, Document } from 'mongoose'

export interface IPlan extends Document {
  name: string
  price: number
  sessionsPerMonth: number
  perks: string[]
}

const planSchema = new Schema<IPlan>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    sessionsPerMonth: { type: Number, required: true },
    perks: [{ type: String }],
  },
  { timestamps: true }
)

export const Plan = mongoose.model<IPlan>('Plan', planSchema)
