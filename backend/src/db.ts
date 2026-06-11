import mongoose from 'mongoose'

export async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI

    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set')
    }

    await mongoose.connect(mongoUri)

    console.log('Mongoose connected to MongoDB!')
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    process.exit(1)
  }
}