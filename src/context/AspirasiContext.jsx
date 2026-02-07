import React, { createContext, useContext, useState, useEffect } from 'react'

const AspirasiContext = createContext()

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const useAspirasi = () => {
  const context = useContext(AspirasiContext)
  if (!context) {
    throw new Error('useAspirasi must be used within an AspirasiProvider')
  }
  return context
}

export const AspirasiProvider = ({ children }) => {
  const [aspirasi, setAspirasi] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all aspirasi
  const fetchAspirasi = async (params = {}) => {
    try {
      setLoading(true)
      const queryString = new URLSearchParams(params).toString()
      const url = `${API_BASE_URL}/aspirasi${queryString ? `?${queryString}` : ''}`
      
      console.log('Fetching from:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Response error:', errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
      
      const data = await response.json()
      setAspirasi(data.data || [])
      setError(null)
      return data
    } catch (err) {
      setError(err.message)
      console.error('Error fetching aspirasi:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchAspirasi()
  }, [])

  const addAspirasi = async (newAspirasi) => {
    try {
      const response = await fetch(`${API_BASE_URL}/aspirasi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAspirasi),
      })

      if (!response.ok) {
        throw new Error('Failed to add aspirasi')
      }

      const savedAspirasi = await response.json()
      setAspirasi(prev => [savedAspirasi, ...prev])
      return savedAspirasi
    } catch (err) {
      setError(err.message)
      console.error('Error adding aspirasi:', err)
      throw err
    }
  }

  const deleteAspirasi = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/aspirasi/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete aspirasi')
      }

      setAspirasi(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      setError(err.message)
      console.error('Error deleting aspirasi:', err)
      throw err
    }
  }

  const updateAspirasiStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/aspirasi/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error('Failed to update aspirasi status')
      }

      const updatedAspirasi = await response.json()
      setAspirasi(prev => 
        prev.map(item => item.id === id ? updatedAspirasi : item)
      )
      return updatedAspirasi
    } catch (err) {
      setError(err.message)
      console.error('Error updating aspirasi status:', err)
      throw err
    }
  }

  const getAspirasiByDateRange = async (startDate, endDate) => {
    const params = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }
    const result = await fetchAspirasi(params)
    return result?.data || []
  }

  const searchAspirasi = async (searchTerm) => {
    const result = await fetchAspirasi({ search: searchTerm })
    return result?.data || []
  }

  const getStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/aspirasi/stats/overview`)
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }
      return await response.json()
    } catch (err) {
      console.error('Error fetching stats:', err)
      return null
    }
  }

  const value = {
    aspirasi,
    loading,
    error,
    addAspirasi,
    deleteAspirasi,
    updateAspirasiStatus,
    getAspirasiByDateRange,
    searchAspirasi,
    getStats,
    fetchAspirasi,
    refetch: () => fetchAspirasi()
  }

  return (
    <AspirasiContext.Provider value={value}>
      {children}
    </AspirasiContext.Provider>
  )
}
