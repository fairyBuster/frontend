export function useAuth() {
  const token = useCookie<string | null>('admin_token', {
    sameSite: 'lax',
    path: '/'
  })

  const refreshToken = useCookie<string | null>('admin_refresh_token', {
    sameSite: 'lax',
    path: '/'
  })

  const tokenType = useCookie<string | null>('admin_token_type', {
    sameSite: 'lax',
    path: '/'
  })

  const userRaw = useCookie<string | null>('admin_user', {
    sameSite: 'lax',
    path: '/'
  })

  const isLoggedIn = computed(() => Boolean(token.value))

  const user = computed<Record<string, unknown> | null>(() => {
    if (!userRaw.value) return null
    try {
      return JSON.parse(userRaw.value) as Record<string, unknown>
    } catch {
      return null
    }
  })

  function loginWithToken(nextToken: string) {
    token.value = nextToken.trim()
    tokenType.value = 'Bearer'
  }

  function loginWithResponse(payload: {
    access_token: string
    refresh_token?: string
    token_type?: string
    user?: unknown
  }) {
    token.value = payload.access_token
    refreshToken.value = payload.refresh_token || refreshToken.value
    const t = (payload.token_type || 'bearer').trim()
    tokenType.value = t ? `${t.slice(0, 1).toUpperCase()}${t.slice(1)}` : 'Bearer'
    userRaw.value = payload.user ? JSON.stringify(payload.user) : null
  }

  async function refreshAccessToken() {
    if (!refreshToken.value) return false
    const config = useRuntimeConfig()

    try {
      const res = await $fetch<{ access_token: string; refresh_token: string; token_type: string }>('/auth/refresh', {
        baseURL: config.public.apiBase,
        method: 'POST',
        body: { refresh_token: refreshToken.value }
      })

      token.value = res.access_token
      refreshToken.value = res.refresh_token
      const t = (res.token_type || 'bearer').trim()
      tokenType.value = t ? `${t.slice(0, 1).toUpperCase()}${t.slice(1)}` : 'Bearer'
      return true
    } catch {
      return false
    }
  }

  function logout() {
    token.value = null
    refreshToken.value = null
    tokenType.value = null
    userRaw.value = null
    return navigateTo('/login')
  }

  return {
    token,
    refreshToken,
    tokenType,
    user,
    isLoggedIn,
    loginWithToken,
    loginWithResponse,
    refreshAccessToken,
    logout
  }
}
