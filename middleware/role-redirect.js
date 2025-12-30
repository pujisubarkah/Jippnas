export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth()

  if (user.value?.role === 'admin' && to.path === '/dashboard') {
    return navigateTo('/admin/dashboard')
  }
})