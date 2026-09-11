import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import memoryRoutes from './routes/memory'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Database Connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nexus'
    await mongoose.connect(mongoUri)
    console.log('✓ MongoDB connected')
  } catch (error) {
    console.error('✗ MongoDB connection error:', error)
    process.exit(1)
  }
}

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'NEXUS Server is running' })
})

// Memory System Routes
app.use('/api/memory', memoryRoutes)

// Error handling
app.use((err: any, req: Request, res: Response) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

// Start server
const startServer = async () => {
  await connectDB()
  app.listen(port, () => {
    console.log(`✓ NEXUS Server running at http://localhost:${port}`)
    console.log(`✓ API available at http://localhost:${port}/api`)
    console.log('✓ Memory System Active - Infinite Memory Architecture Ready')
  })
}

startServer()
