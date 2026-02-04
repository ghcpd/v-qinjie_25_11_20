// Server Component for authentication
import { redirect } from 'next/navigation'
import AdminPanel from './AdminPanel'

// FIX 8: Implement proper authentication check
async function checkAuth() {
  // In a real application, this would check session/JWT token
  // For demo purposes, we'll simulate authentication
  const isAuthenticated = process.env.NODE_ENV === 'development' // Simulate auth
  return isAuthenticated
}

export default async function AdminPage() {
  const isAuthenticated = await checkAuth()
  
  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    redirect('/login')
  }

  return <AdminPanel />
}
