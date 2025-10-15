import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import AppLayout from './layouts/AppLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AppointmentDetail from './pages/AppointmentDetail'
import DoctorManagement from './pages/DoctorManagement'
import DocumentReview from './pages/DocumentReview'
import Insights from './pages/Insights'
import Broadcast from './components/Broadcast'
import Profile from './pages/Profile'
import Patients from './pages/Patients'
import NotificationCenter from './pages/NotificationCenter'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  if (!user.loggedIn) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function App() {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isLoggedIn = user.loggedIn

  return (
    <>
      <Toaster 
        position="top-right" 
        expand={true}
        richColors
        closeButton
        duration={5000}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />
        } />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="appointment/:id" element={<AppointmentDetail />} />
          <Route path="doctor-management" element={<DoctorManagement />} />
          <Route path="document-review" element={<DocumentReview />} />
          <Route path="insights" element={<Insights />} />
          <Route path="broadcast" element={<Broadcast />} />
          <Route path="notifications" element={<NotificationCenter />} />
          <Route path="profile" element={<Profile />} />
          <Route path="patients" element={<Patients />} />
        </Route>

        {/* Catch all route - redirect to login if not logged in, otherwise dashboard */}
        <Route path="*" element={
          <Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />
        } />
      </Routes>
    </>
  )
}

export default App
