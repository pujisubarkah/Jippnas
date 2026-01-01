// composables/useAuth.js
export const useAuth = () => {
  // Reactive state for authentication using useState for global persistence
  const isLoggedIn = useState('isLoggedIn', () => false)
  const user = useState('user', () => null)

  // Login function
  const login = (userData) => {
    console.log('🔐 useAuth.login called with:', userData)
    isLoggedIn.value = true
    user.value = userData
    // In real app, save to localStorage or cookie
    if (process.client) {
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('isLoggedIn', 'true')
      console.log('💾 Saved to localStorage:', localStorage.getItem('user'))
    }
  }

  // Logout function
  const logout = () => {
    isLoggedIn.value = false
    user.value = null
    if (process.client) {
      localStorage.removeItem('user')
      localStorage.removeItem('isLoggedIn')
    }
    checkAuth(); // Force state update for SWR-like behavior
  }

  // Check if user is logged in on app load
  const checkAuth = () => {
    if (process.client) {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
      const userData = localStorage.getItem('user')

      console.log('🔍 checkAuth - loggedIn:', loggedIn)
      console.log('🔍 checkAuth - userData:', userData)

      if (loggedIn && userData) {
        isLoggedIn.value = true
        user.value = JSON.parse(userData)
        console.log('✅ checkAuth - user.value set to:', user.value)
      }
    }
  }

  // Initialize auth state
  if (process.client) {
    checkAuth()
  }

  return {
    isLoggedIn,
    user,
    login,
    logout,
    checkAuth
  }
}