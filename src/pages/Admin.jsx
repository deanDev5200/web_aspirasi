import { useState, useEffect, useCallback } from 'react'
import { useAspirasi } from '../context/AspirasiContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Admin = () => {
  const { aspirasi, deleteAspirasi, getAspirasiByDateRange } = useAspirasi()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [filteredAspirasi, setFilteredAspirasi] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilteredData, setDateFilteredData] = useState(null)

  // Memoize getAspirasiByDateRange to prevent infinite re-renders
  const handleDateFilter = useCallback(async () => {
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      
      try {
        const data = await getAspirasiByDateRange(start, end)
        setDateFilteredData(data)
      } catch (err) {
        console.error('Error fetching date range:', err)
        setDateFilteredData([])
      }
    } else {
      setDateFilteredData(null)
    }
  }, [startDate, endDate]) // Remove getAspirasiByDateRange from dependencies

  useEffect(() => {
    handleDateFilter()
  }, [handleDateFilter])

  useEffect(() => {
    let filtered = aspirasi

    if (startDate && endDate && dateFilteredData) {
      filtered = dateFilteredData
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.aspirasi.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    const sortedFiltered = [...filtered].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    setFilteredAspirasi(sortedFiltered)
  }, [aspirasi, startDate, endDate, searchTerm, dateFilteredData])

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus aspirasi ini?')) {
      deleteAspirasi(id)
    }
  }

  const clearFilters = () => {
    setStartDate('')
    setEndDate('')
    setSearchTerm('')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard Admin
            </h1>
            <p className="text-gray-600">
              Kelola dan review semua aspirasi yang masuk
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary"
          >
            Logout
          </button>
        </div>

        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dari Tanggal
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sampai Tanggal
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pencarian
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
                placeholder="Cari nama, kelas, atau aspirasi"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="btn-secondary w-full"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Menampilkan <span className="font-semibold">{filteredAspirasi.length}</span> aspirasi
          </div>
        </div>

        {filteredAspirasi.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada aspirasi</h3>
            <p className="text-gray-500">
              {startDate || endDate || searchTerm 
                ? 'Tidak ada aspirasi yang sesuai dengan filter yang dipilih'
                : 'Belum ada aspirasi yang masuk'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAspirasi.map((item) => (
              <div key={item.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.nama}</h3>
                        {item.kelas !== '-' && (
                          <p className="text-sm text-gray-600">Kelas: {item.kelas}</p>
                        )}
                      </div>
                      {item.nama === 'Anonim' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Anonim
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                      {formatDate(item.timestamp)}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap">{item.aspirasi}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="ml-4 text-red-600 hover:text-red-800 transition-colors"
                    title="Hapus aspirasi"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
