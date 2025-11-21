// middleware/auth.js
export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn } = useAuth()

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/materi']

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    to.path.startsWith(route) && (to.path.includes('/learn') || to.path === '/dashboard')
  )

  // If not logged in and trying to access protected routes
  if (!isLoggedIn.value && isProtectedRoute) {
    return navigateTo('/')
  }
})