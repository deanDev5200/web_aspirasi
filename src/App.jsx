import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Admin from './pages/Admin'
import Login from './pages/Login'
import ChangePassword from './pages/ChangePassword'
import ProtectedRoute from './components/ProtectedRoute'
import { AspirasiProvider } from './context/AspirasiContext'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <AspirasiProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/change-password" element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </AspirasiProvider>
    </AuthProvider>
  )
}

export default App
