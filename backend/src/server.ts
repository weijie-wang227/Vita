import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './db'
import { router } from './routes/index'

dotenv.config()

const app = express()
const port = process.env.PORT ? Number(process.env.PORT) : 4000

app.use(cors())
app.use(express.json())

// Auth routes
app.use('/api', router)

async function startServer() {
  try {
    await connectDB()
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      (`Vita backend running on http://localhost:${port}`)
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()