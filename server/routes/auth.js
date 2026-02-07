const express = require('express')
const fs = require('fs')
const path = require('path')
const router = express.Router()

// File path for storing admin credentials
const CREDENTIALS_FILE = path.join(__dirname, '../data/admin-credentials.json')

// Initialize credentials file if it doesn't exist
const initializeCredentials = () => {
  const dataDir = path.dirname(CREDENTIALS_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  
  if (!fs.existsSync(CREDENTIALS_FILE)) {
    const defaultCredentials = {
      username: 'admin',
      password: 'admin123'
    }
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(defaultCredentials, null, 2))
  }
}

// Read credentials from file
const readCredentials = () => {
  initializeCredentials()
  const data = fs.readFileSync(CREDENTIALS_FILE, 'utf8')
  return JSON.parse(data)
}

// Write credentials to file
const writeCredentials = (credentials) => {
  fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2))
}

// POST change password
router.post('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        error: 'Current password and new password are required' 
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: 'New password must be at least 6 characters' 
      })
    }

    // Read current credentials
    const adminCredentials = readCredentials()

    // Verify current password
    if (currentPassword !== adminCredentials.password) {
      return res.status(401).json({ 
        success: false, 
        error: 'Current password is incorrect' 
      })
    }

    // Update password
    adminCredentials.password = newPassword
    writeCredentials(adminCredentials)

    res.json({ 
      success: true, 
      message: 'Password changed successfully' 
    })

  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    })
  }
})

// POST login
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username and password are required' 
      })
    }

    const adminCredentials = readCredentials()

    if (username === adminCredentials.username && password === adminCredentials.password) {
      res.json({ 
        success: true,
        message: 'Login successful'
      })
    } else {
      res.status(401).json({ 
        success: false, 
        error: 'Invalid username or password' 
      })
    }

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    })
  }
})

// GET current admin info (for verification)
router.get('/profile', (req, res) => {
  const adminCredentials = readCredentials()
  res.json({
    username: adminCredentials.username,
    // Never return password in response
  })
})

module.exports = router
