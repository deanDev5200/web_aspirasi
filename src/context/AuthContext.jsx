import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

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

  const login = (username, password) => {
    // Default credentials: admin/admin123
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true)
      localStorage.setItem('isAdminAuthenticated', 'true')
      return { success: true }
    }
    return { success: false, error: 'Username atau password salah' }
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('isAdminAuthenticated')
  }

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
