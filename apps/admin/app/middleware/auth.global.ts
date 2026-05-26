export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login') return

  const { token, refreshToken, refreshAccessToken, user } = useAuth()

  if (!token.value && refreshToken.value) {
    const ok = await refreshAccessToken()
    if (!ok) return navigateTo('/login')
  }

  if (!token.value) return navigateTo('/login')

  const u = user.value as any
  const role = String(u?.role || '').toLowerCase()
  if (role && role !== 'admin') {
    return navigateTo('/login')
  }
})
