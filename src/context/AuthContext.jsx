import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const authStatus = localStorage.getItem('isAdminAuthenticated')
    setIsAuthenticated(authStatus === 'true')
    setIsLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Login failed')
      }

      const data = await response.json()
      if (data.success) {
        setIsAuthenticated(true)
        localStorage.setItem('isAdminAuthenticated', 'true')
      }
      
      return data
    } catch (err) {
      console.error('Login error:', err)
      throw err
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('isAdminAuthenticated')
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to change password')
      }

      const data = await response.json()
      return data
    } catch (err) {
      console.error('Error changing password:', err)
      throw err
    }
  }

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    changePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
