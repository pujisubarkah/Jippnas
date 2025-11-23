// composables/useAuth.js
export const useAuth = () => {
  // Reactive state for authentication
  const isLoggedIn = ref(false)
  const user = ref(null)

  // Login function
  const login = (userData) => {
    isLoggedIn.value = true
    user.value = userData
    // In real app, save to localStorage or cookie
    if (process.client) {
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('isLoggedIn', 'true')
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

      if (loggedIn && userData) {
        isLoggedIn.value = true
        user.value = JSON.parse(userData)
      }
    }
  }

  // Initialize auth state
  if (process.client) {
    checkAuth()
  }

  return {
    isLoggedIn: readonly(isLoggedIn),
    user: readonly(user),
    login,
    logout,
    checkAuth
  }
}