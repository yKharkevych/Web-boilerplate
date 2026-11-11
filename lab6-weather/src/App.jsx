import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import './App.css'
import LoginPage from './pages/LoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'

function isAuthenticated() {
    return document.cookie
        .split('; ')
        .some(cookie => cookie === 'isLoggedIn=true')
}

function ProtectedRoute({children}) {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />
    }

    return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
