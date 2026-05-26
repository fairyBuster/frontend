<template>
  <div>
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">Users</h1>
        <p class="mt-1 text-sm text-slate-600">Kelola user: detail, edit, ban/unban, hapus.</p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <div class="relative">
          <input
            v-model="q"
            type="text"
            class="w-64 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            placeholder="Cari (username/email/phone)..."
          />
        </div>

        <div class="flex items-center gap-2">
          <label class="text-sm text-slate-700">Limit</label>
          <select
            v-model.number="limitLocal"
            class="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
          >
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>

        <button
          type="button"
          class="rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 disabled:opacity-50"
          :disabled="pending"
          @click="refresh"
        >
          Refresh
        </button>
      </div>
    </div>

    <div class="mt-4 flex flex-wrap items-center gap-2">
      <button
        type="button"
        class="rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 disabled:opacity-50"
        :disabled="pending || skip === 0"
        @click="goPrev"
      >
        Prev
      </button>
      <button
        type="button"
        class="rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 disabled:opacity-50"
        :disabled="pending || users.length < limit"
        @click="goNext"
      >
        Next
      </button>

      <div class="ml-auto text-sm text-slate-600">
        Menampilkan {{ filteredUsers.length }} dari {{ users.length }} (skip={{ skip }}, limit={{ limit }})
      </div>
    </div>

    <div v-if="error" class="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      Gagal memuat users: {{ errorMessage }}
    </div>

    <div class="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ring-1 ring-black/5">
      <div class="overflow-x-auto">
        <table class="min-w-[860px] w-full border-collapse text-left text-sm">
          <thead class="bg-slate-50 text-slate-700">
          <tr>
            <th class="px-4 py-3 font-medium">ID</th>
            <th class="px-4 py-3 font-medium">Username</th>
            <th class="px-4 py-3 font-medium">Email</th>
            <th class="px-4 py-3 font-medium">Phone</th>
            <th class="px-4 py-3 font-medium">Role</th>
            <th class="px-4 py-3 font-medium">Active</th>
            <th class="px-4 py-3 font-medium">Created</th>
            <th class="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="pending">
            <td colspan="8" class="px-4 py-6 text-center text-slate-600">Loading...</td>
          </tr>
          <tr v-else-if="filteredUsers.length === 0">
            <td colspan="8" class="px-4 py-6 text-center text-slate-600">Tidak ada data.</td>
          </tr>
          <tr
            v-for="u in filteredUsers"
            :key="u.id"
            class="border-t border-slate-200 hover:bg-slate-50 odd:bg-white even:bg-slate-50/40"
          >
            <td class="px-4 py-3 font-medium text-slate-900">{{ u.id }}</td>
            <td class="px-4 py-3">
              <NuxtLink :to="`/users/${u.id}`" class="font-medium text-slate-900 hover:underline">
                {{ u.username }}
              </NuxtLink>
              <div class="text-xs text-slate-500">{{ u.first_name }} {{ u.last_name }}</div>
            </td>
            <td class="px-4 py-3">{{ u.email }}</td>
            <td class="px-4 py-3">{{ u.phone }}</td>
            <td class="px-4 py-3">
              <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-800">
                {{ u.role }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span
                class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                :class="u.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800'"
              >
                {{ u.is_active ? 'Active' : 'Suspended' }}
              </span>
            </td>
            <td class="px-4 py-3 text-slate-600">{{ formatDate(u.created_at) }}</td>
            <td class="px-4 py-3">
              <div class="flex justify-end gap-2">
                <NuxtLink
                  :to="`/users/${u.id}`"
                  class="rounded-md bg-white px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
                >
                  Detail
                </NuxtLink>
                <button
                  type="button"
                  class="rounded-md bg-white px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 disabled:opacity-50"
                  :disabled="actionPendingId === u.id"
                  @click="toggleActive(u)"
                >
                  {{ actionPendingId === u.id ? '...' : u.is_active ? 'Ban' : 'Unban' }}
                </button>
                <button
                  type="button"
                  class="rounded-md bg-white px-3 py-1.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-200 hover:bg-red-50 disabled:opacity-50"
                  :disabled="actionPendingId === u.id"
                  @click="deleteUser(u)"
                >
                  {{ actionPendingId === u.id ? '...' : 'Hapus' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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

const skip = computed(() => {
  const raw = Number(route.query.skip ?? 0)
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 0
})

const limit = computed(() => {
  const raw = Number(route.query.limit ?? 100)
  const n = Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 100
  return Math.min(Math.max(n, 1), 500)
})

const limitLocal = ref(limit.value)
watch(limit, (v) => {
  limitLocal.value = v
})

watch(limitLocal, async (v) => {
  if (!Number.isFinite(v) || v <= 0) return
  await navigateTo({
    path: route.path,
    query: { ...route.query, skip: String(skip.value), limit: String(v) }
  })
})

const { data, pending, error, refresh } = await useAsyncData(
  'admin-users',
  () =>
    api.get<AdminUser[]>('/admin/users', {
      query: { skip: skip.value, limit: limit.value }
    }),
  { watch: [skip, limit] }
)

const users = computed(() => data.value ?? [])

const q = ref('')
const filteredUsers = computed(() => {
  const term = q.value.trim().toLowerCase()
  if (!term) return users.value
  return users.value.filter((u) => {
    const hay = `${u.username} ${u.email} ${u.phone} ${u.first_name} ${u.last_name} ${u.role}`.toLowerCase()
    return hay.includes(term)
  })
})

const errorMessage = computed(() => {
  const e = error.value as any
  return e?.data?.detail?.[0]?.msg || e?.statusMessage || e?.message || 'Unknown error'
})

function goPrev() {
  const nextSkip = Math.max(0, skip.value - limit.value)
  return navigateTo({ path: route.path, query: { ...route.query, skip: String(nextSkip), limit: String(limit.value) } })
}

function goNext() {
  const nextSkip = skip.value + limit.value
  return navigateTo({ path: route.path, query: { ...route.query, skip: String(nextSkip), limit: String(limit.value) } })
}

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString()
}

const actionPendingId = ref<number | null>(null)

async function toggleActive(u: AdminUser) {
  if (actionPendingId.value) return
  const ok = window.confirm(`${u.is_active ? 'Suspend' : 'Aktifkan'} user #${u.id}?`)
  if (!ok) return

  actionPendingId.value = u.id
  try {
    await api.patch<AdminUser>(`/admin/users/${u.id}/toggle-active`)
    await refresh()
  } catch (e: any) {
    window.alert(e?.data?.detail?.[0]?.msg || e?.data?.detail || e?.statusMessage || e?.message || 'Gagal')
  } finally {
    actionPendingId.value = null
  }
}

async function deleteUser(u: AdminUser) {
  if (actionPendingId.value) return
  const ok = window.confirm(`Hapus user #${u.id} (${u.username})?`)
  if (!ok) return

  actionPendingId.value = u.id
  try {
    await api.del<AdminUser>(`/admin/users/${u.id}`)
    await refresh()
  } catch (e: any) {
    window.alert(e?.data?.detail?.[0]?.msg || e?.data?.detail || e?.statusMessage || e?.message || 'Gagal')
  } finally {
    actionPendingId.value = null
  }
}
</script>
