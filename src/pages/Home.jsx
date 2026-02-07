import { useState } from 'react'
import { useAspirasi } from '../context/AspirasiContext'

const Home = () => {
  const { addAspirasi } = useAspirasi()
  const [formData, setFormData] = useState({
    nama: '',
    kelas: '',
    aspirasi: '',
    isAnonymous: false
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.aspirasi.trim()) {
      alert('Aspirasi tidak boleh kosong')
      return
    }

    const submissionData = {
      ...formData,
      nama: formData.isAnonymous ? 'Anonim' : formData.nama,
      kelas: formData.isAnonymous ? '-' : formData.kelas
    }

    addAspirasi(submissionData)
    setIsSubmitted(true)
    
    setTimeout(() => {
      setFormData({
        nama: '',
        kelas: '',
        aspirasi: '',
        isAnonymous: false
      })
      setIsSubmitted(false)
    }, 3000)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="card text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Terima Kasih!</h2>
            <p className="text-gray-600">Aspirasi Anda telah berhasil dikirim.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Portal Aspirasi
          </h1>
          <p className="text-lg text-gray-600">
            Sampaikan aspirasi Anda untuk kemajuan bersama
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className="input-field"
                placeholder="Masukkan nama lengkap"
                disabled={formData.isAnonymous}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kelas
              </label>
              <input
                type="text"
                name="kelas"
                value={formData.kelas}
                onChange={handleChange}
                className="input-field"
                placeholder="Contoh: XI TJKT 1"
                disabled={formData.isAnonymous}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aspirasi *
              </label>
              <textarea
                name="aspirasi"
                value={formData.aspirasi}
                onChange={handleChange}
                rows="6"
                className="input-field resize-none"
                placeholder="Tuliskan aspirasi, saran, atau masukan Anda di sini..."
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isAnonymous"
                id="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isAnonymous" className="ml-2 block text-sm text-gray-700">
                Saya ingin mengirim aspirasi secara anonim
              </label>
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
            >
              Kirim Aspirasi
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Setiap aspirasi Anda penting untuk kami</p>
        </div>
      </div>
    </div>
  )
}

export default Home
