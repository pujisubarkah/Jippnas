// middleware/auth.js
export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn } = useAuth()

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/course', '/admin', '/user']

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    to.path.startsWith(route)
  )

  // If not logged in and trying to access protected routes
  if (!isLoggedIn.value && isProtectedRoute) {
    return navigateTo('/')
  }
})