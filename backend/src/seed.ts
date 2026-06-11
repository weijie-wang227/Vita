import dotenv from 'dotenv'
import { connectDB } from './db'
import { Class } from './models/Class'
import { Plan } from './models/Plan'

dotenv.config()

const seedData = async () => {
  try {
    await connectDB()

    // Clear existing data
    await Class.deleteMany({})
    await Plan.deleteMany({})

    // Seed classes
    const classesData = [
      {
        id: 'c1',
        title: 'Sunrise Yoga Flow',
        instructor: 'Ava Green',
        date: '2025-06-03',
        time: '07:00 AM',
        duration: '55 min',
        location: 'Studio A',
        difficulty: 'Beginner',
        description: 'Flow through slow stretches, breathing exercises, and gentle transitions to awaken the body.',
        capacity: 22,
        registered: 14,
        price: 20,
      },
      {
        id: 'c2',
        title: 'Hot Pilates',
        instructor: 'Leo Carter',
        date: '2025-06-03',
        time: '12:30 PM',
        duration: '50 min',
        location: 'Studio B',
        difficulty: 'Intermediate',
        description: 'Core strengthening and dynamic movement in a heated studio environment.',
        capacity: 18,
        registered: 16,
        price: 24,
      },
    ]

    await Class.insertMany(classesData)
    console.log('Classes seeded successfully')

    // Seed plans
    const plansData = [
      {
        name: 'Starter',
        price: 35,
        sessionsPerMonth: 4,
        perks: ['Class booking credits', 'Wellness newsletter'],
      },
      {
        name: 'Unlimited',
        price: 129,
        sessionsPerMonth: 999,
        perks: ['Unlimited classes', 'Priority booking', 'Guest access'],
      },
    ]

    await Plan.insertMany(plansData)
    console.log('Plans seeded successfully')

    console.log('Database seeded!')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedData()
