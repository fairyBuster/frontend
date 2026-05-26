<template>
  <div class="mx-auto flex min-h-dvh max-w-md items-center px-4 py-10">
    <div class="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
          A
        </div>
        <div>
          <h1 class="text-xl font-semibold leading-tight">Login Admin</h1>
          <p class="mt-0.5 text-sm text-slate-600">Masukkan nomor HP dan password.</p>
        </div>
      </div>

      <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
        <div>
          <label class="text-sm font-medium text-slate-700">Phone</label>
          <input
            v-model="phone"
            type="text"
            autocomplete="username"
            class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-0 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            placeholder="08xxxxxxxxxx"
            required
          />
        </div>

        <div>
          <label class="text-sm font-medium text-slate-700">Password</label>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-0 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            placeholder="••••••••"
            required
          />
        </div>

        <div v-if="errorMessage" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="w-full rounded-md bg-slate-900 px-3 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          :disabled="pending"
        >
          {{ pending ? 'Memproses...' : 'Masuk' }}
        </button>

        <div class="pt-2 text-center text-xs text-slate-500">
          Pastikan NUXT_PUBLIC_API_BASE sudah sesuai.
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'blank'
})

type LoginResponse = {
  access_token: string
  refresh_token: string
  token_type: string
  user: {
    phone: string
    username: string
    email: string
    first_name: string
    last_name: string
    referral_by: number
    referral_code: string
    balance: number
    balance_deposit: number
    id: number
    role: string
    is_active: boolean
    created_at: string
    referral_user: unknown
    update_at: string | null
  }
}

const api = useApi()
const phone = ref('')
const password = ref('')
const pending = ref(false)
const errorMessage = ref('')

const { isLoggedIn, loginWithResponse } = useAuth()

onMounted(() => {
  if (isLoggedIn.value) navigateTo('/users')
})

async function onSubmit() {
  if (pending.value) return
  pending.value = true
  errorMessage.value = ''

  try {
    const res = await api.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: {
        phone: phone.value,
        password: password.value
      }
    })

    loginWithResponse(res)
    await navigateTo('/users')
  } catch (e: any) {
    errorMessage.value = e?.data?.detail?.[0]?.msg || e?.data?.detail || e?.statusMessage || e?.message || 'Login gagal'
  } finally {
    pending.value = false
  }
}
</script>
