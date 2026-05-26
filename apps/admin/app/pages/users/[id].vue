<template>
  <div>
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div class="text-xs text-slate-500">
          <NuxtLink to="/users" class="hover:underline">Users</NuxtLink>
          <span class="mx-1">/</span>
          <span>#{{ userId }}</span>
        </div>

        <h1 class="mt-1 text-2xl font-semibold tracking-tight">
          {{ user?.username || `User #${userId}` }}
        </h1>

        <div class="mt-2 flex flex-wrap items-center gap-2">
          <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-800">
            {{ user?.role || form.role || '-' }}
          </span>
          <span
            class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
            :class="form.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800'"
          >
            {{ form.is_active ? 'Active' : 'Suspended' }}
          </span>
          <span class="text-xs text-slate-500">
            {{ user?.email || '-' }}
          </span>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <NuxtLink
          to="/users"
          class="rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
        >
          Kembali
        </NuxtLink>

        <button
          type="button"
          class="rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 disabled:opacity-50"
          :disabled="pendingAction || pending"
          @click="toggleActive"
        >
          {{ pendingAction ? '...' : form.is_active ? 'Ban' : 'Unban' }}
        </button>

        <button
          type="button"
          class="rounded-md bg-white px-3 py-2 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-200 hover:bg-red-50 disabled:opacity-50"
          :disabled="pendingAction || pending"
          @click="remove"
        >
          {{ pendingAction ? '...' : 'Hapus' }}
        </button>
      </div>
    </div>

    <div v-if="loadError" class="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      Gagal memuat user: {{ loadErrorMessage }}
    </div>

    <div v-else class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <form class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-black/5" @submit.prevent="save">
          <div class="flex items-center justify-between gap-3">
            <div class="text-sm font-medium text-slate-900">Edit User</div>
            <div class="text-xs text-slate-500">ID: {{ userId }}</div>
          </div>

          <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="text-sm font-medium text-slate-700">First name</label>
              <input
                v-model="form.first_name"
                type="text"
                class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
            <div>
              <label class="text-sm font-medium text-slate-700">Last name</label>
              <input
                v-model="form.last_name"
                type="text"
                class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
            <div>
              <label class="text-sm font-medium text-slate-700">Email</label>
              <input
                v-model="form.email"
                type="email"
                class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
            <div>
              <label class="text-sm font-medium text-slate-700">Phone</label>
              <input
                v-model="form.phone"
                type="text"
                class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
            <div>
              <label class="text-sm font-medium text-slate-700">Username</label>
              <input
                v-model="form.username"
                type="text"
                class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
            <div>
              <label class="text-sm font-medium text-slate-700">Role</label>
              <input
                v-model="form.role"
                type="text"
                class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
          </div>

          <div class="mt-4 flex items-center gap-3">
            <label class="inline-flex items-center gap-2 text-sm text-slate-700">
              <input v-model="form.is_active" type="checkbox" class="h-4 w-4 rounded border-slate-300" />
              Active
            </label>

            <div class="ml-auto flex items-center gap-2">
              <button
                type="button"
                class="rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 disabled:opacity-50"
                :disabled="pendingAction"
                @click="resetForm"
              >
                Reset
              </button>
              <button
                type="submit"
                class="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                :disabled="pendingAction"
              >
                {{ pendingAction ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </div>

          <div v-if="saveMessage" class="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            {{ saveMessage }}
          </div>
          <div v-if="saveError" class="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {{ saveError }}
          </div>
        </form>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-black/5">
        <div class="text-sm font-medium text-slate-900">Info</div>
        <dl class="mt-4 space-y-3 text-sm">
          <div class="flex justify-between gap-3">
            <dt class="text-slate-600">Referral code</dt>
            <dd class="font-medium text-slate-900">{{ user?.referral_code || '-' }}</dd>
          </div>
          <div class="flex justify-between gap-3">
            <dt class="text-slate-600">Referral by</dt>
            <dd class="text-slate-900">{{ user?.referral_by ?? '-' }}</dd>
          </div>
          <div class="flex justify-between gap-3">
            <dt class="text-slate-600">Balance</dt>
            <dd class="font-medium text-slate-900">{{ formatMoney(user?.balance) }}</dd>
          </div>
          <div class="flex justify-between gap-3">
            <dt class="text-slate-600">Deposit</dt>
            <dd class="font-medium text-slate-900">{{ formatMoney(user?.balance_deposit) }}</dd>
          </div>
          <div class="flex justify-between gap-3">
            <dt class="text-slate-600">Created</dt>
            <dd class="text-slate-900">{{ user ? formatDate(user.created_at) : '-' }}</dd>
          </div>
          <div class="flex justify-between gap-3">
            <dt class="text-slate-600">Updated</dt>
            <dd class="text-slate-900">{{ user?.update_at ? formatDate(user.update_at) : '-' }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type AdminUser = {
  phone: string
  username: string
  email: string
  first_name: string
  last_name: string
  referral_by?: number | null
  referral_code: string
  balance?: number
  balance_deposit?: number
  id: number
  role: string
  is_active: boolean
  created_at: string
  update_at: string | null
}

const route = useRoute()
const api = useApi()

const userId = computed(() => Number(route.params.id))

const { data, pending, error, refresh } = await useAsyncData(
  () => `admin-user-${userId.value}`,
  () => api.get<AdminUser>(`/admin/users/${userId.value}`),
  { watch: [userId] }
)

const user = computed(() => data.value ?? null)
const loadError = computed(() => Boolean(error.value))
const loadErrorMessage = computed(() => {
  const e = error.value as any
  return e?.data?.detail?.[0]?.msg || e?.data?.detail || e?.statusMessage || e?.message || 'Unknown error'
})

const pendingAction = ref(false)
const saveMessage = ref('')
const saveError = ref('')

const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  username: '',
  is_active: true,
  role: ''
})

watch(
  user,
  (u) => {
    if (!u) return
    form.first_name = u.first_name || ''
    form.last_name = u.last_name || ''
    form.email = u.email || ''
    form.phone = u.phone || ''
    form.username = u.username || ''
    form.is_active = Boolean(u.is_active)
    form.role = u.role || ''
  },
  { immediate: true }
)

function resetForm() {
  const u = user.value
  if (!u) return
  saveMessage.value = ''
  saveError.value = ''
  form.first_name = u.first_name || ''
  form.last_name = u.last_name || ''
  form.email = u.email || ''
  form.phone = u.phone || ''
  form.username = u.username || ''
  form.is_active = Boolean(u.is_active)
  form.role = u.role || ''
}

async function save() {
  if (pendingAction.value) return
  pendingAction.value = true
  saveMessage.value = ''
  saveError.value = ''

  try {
    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      username: form.username,
      is_active: form.is_active,
      role: form.role
    }

    await api.patch<AdminUser>(`/admin/users/${userId.value}`, { body: payload })
    await refresh()
    saveMessage.value = 'Berhasil disimpan.'
  } catch (e: any) {
    saveError.value = e?.data?.detail?.[0]?.msg || e?.data?.detail || e?.statusMessage || e?.message || 'Gagal menyimpan'
  } finally {
    pendingAction.value = false
  }
}

async function toggleActive() {
  if (pendingAction.value) return
  const u = user.value
  if (!u) return
  const ok = window.confirm(`${form.is_active ? 'Suspend' : 'Aktifkan'} user #${u.id}?`)
  if (!ok) return

  pendingAction.value = true
  saveMessage.value = ''
  saveError.value = ''
  try {
    await api.patch<AdminUser>(`/admin/users/${u.id}/toggle-active`)
    await refresh()
  } catch (e: any) {
    saveError.value = e?.data?.detail?.[0]?.msg || e?.data?.detail || e?.statusMessage || e?.message || 'Gagal'
  } finally {
    pendingAction.value = false
  }
}

async function remove() {
  if (pendingAction.value) return
  const u = user.value
  if (!u) return
  const ok = window.confirm(`Hapus user #${u.id} (${u.username})?`)
  if (!ok) return

  pendingAction.value = true
  saveMessage.value = ''
  saveError.value = ''
  try {
    await api.del<AdminUser>(`/admin/users/${u.id}`)
    await navigateTo('/users')
  } catch (e: any) {
    saveError.value = e?.data?.detail?.[0]?.msg || e?.data?.detail || e?.statusMessage || e?.message || 'Gagal'
  } finally {
    pendingAction.value = false
  }
}

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString()
}

function formatMoney(value: number | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '-'
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(value)
}
</script>
