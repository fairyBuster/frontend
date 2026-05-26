type ApiFetchOptions = Omit<Parameters<typeof $fetch>[1], 'baseURL'>

export function useApi() {
  const config = useRuntimeConfig()
  const { token, tokenType, refreshAccessToken } = useAuth()

  function getStatus(e: any) {
    return e?.statusCode ?? e?.status ?? e?.response?.status
  }

  async function request<T>(path: string, options: ApiFetchOptions = {}, retried = false) {
    const headers = { ...(options.headers as Record<string, string> | undefined) }

    if (token.value) {
      const scheme = tokenType.value || 'Bearer'
      headers.Authorization = `${scheme} ${token.value}`
    }

    try {
      return await $fetch<T>(path, {
        ...options,
        baseURL: config.public.apiBase,
        headers
      })
    } catch (e: any) {
      if (!retried && getStatus(e) === 401) {
        const ok = await refreshAccessToken()
        if (ok) {
          return await request<T>(path, options, true)
        }
      }
      throw e
    }
  }

  function get<T>(path: string, options: Omit<ApiFetchOptions, 'method'> = {}) {
    return request<T>(path, { ...options, method: 'GET' })
  }

  function patch<T>(path: string, options: Omit<ApiFetchOptions, 'method'> = {}) {
    return request<T>(path, { ...options, method: 'PATCH' })
  }

  function del<T>(path: string, options: Omit<ApiFetchOptions, 'method'> = {}) {
    return request<T>(path, { ...options, method: 'DELETE' })
  }

  return { request, get, patch, del }
}
