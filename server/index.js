const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const aspirasiRoutes = require('./routes/aspirasi')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080'],
  credentials: true
}))
app.use(express.json())

// Routes
app.use('/api/aspirasi', aspirasiRoutes)

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aspirasi_db')
.then(() => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`API available at http://localhost:${PORT}/api`)
  })
})
.catch((error) => {
  console.error('Database connection error:', error)
  process.exit(1)
})

module.exports = app
