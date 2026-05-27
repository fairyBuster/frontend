<template>
  <div>
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">Products</h1>
        <p class="mt-1 text-sm text-slate-600">Kelola product: list, filter, buat baru, edit, hapus.</p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <NuxtLink
          to="/products/new"
          class="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          New Product
        </NuxtLink>

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

    <div class="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-4">
      <div class="lg:col-span-2">
        <label class="text-xs font-medium text-slate-600">Search</label>
        <input
          v-model="searchLocal"
          type="text"
          class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
          placeholder="Cari nama / deskripsi..."
          @keydown.enter.prevent="applyFilters"
        />
      </div>

      <div>
        <label class="text-xs font-medium text-slate-600">Status</label>
        <select
          v-model="statusLocal"
          class="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
          @change="applyFilters"
        >
          <option value="">All</option>
          <option value="active">active</option>
          <option value="inactive">inactive</option>
        </select>
      </div>

      <div>
        <label class="text-xs font-medium text-slate-600">Type</label>
        <input
          v-model="typeLocal"
          type="text"
          class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
          placeholder="mis. vip, basic..."
          @keydown.enter.prevent="applyFilters"
        />
      </div>
    </div>

    <div class="mt-4 flex flex-wrap items-center gap-2">
      <button
        type="button"
        class="rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 disabled:opacity-50"
        :disabled="pending || page <= 1"
        @click="goPrev"
      >
        Prev
      </button>
      <button
        type="button"
        class="rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 disabled:opacity-50"
        :disabled="pending || page >= pages"
        @click="goNext"
      >
        Next
      </button>

      <div class="ml-auto flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <span>Page {{ page }} / {{ pages }}</span>
        <span class="hidden sm:inline">·</span>
        <span>Total {{ total }}</span>
        <span class="hidden sm:inline">·</span>
        <label class="text-sm text-slate-700">Size</label>
        <select
          v-model.number="sizeLocal"
          class="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
          @change="applyFilters"
        >
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </div>
    </div>

    <div v-if="error" class="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      Gagal memuat products: {{ errorMessage }}
    </div>

    <div class="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ring-1 ring-black/5">
      <div class="overflow-x-auto">
        <table class="min-w-[900px] w-full border-collapse text-left text-sm">
          <thead class="bg-slate-50 text-slate-700">
            <tr>
              <th class="px-4 py-3 font-medium">ID</th>
              <th class="px-4 py-3 font-medium">Name</th>
              <th class="px-4 py-3 font-medium">Type</th>
              <th class="px-4 py-3 font-medium">Status</th>
              <th class="px-4 py-3 font-medium">Price</th>
              <th class="px-4 py-3 font-medium">Stock</th>
              <th class="px-4 py-3 font-medium">Updated</th>
              <th class="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="pending">
              <td colspan="8" class="px-4 py-6 text-center text-slate-600">Loading...</td>
            </tr>
            <tr v-else-if="items.length === 0">
              <td colspan="8" class="px-4 py-6 text-center text-slate-600">Tidak ada data.</td>
            </tr>
            <tr
              v-for="p in items"
              :key="p.id"
              class="border-t border-slate-200 hover:bg-slate-50 odd:bg-white even:bg-slate-50/40"
            >
              <td class="px-4 py-3 font-medium text-slate-900">{{ p.id }}</td>
              <td class="px-4 py-3">
                <NuxtLink :to="`/products/${p.id}`" class="font-medium text-slate-900 hover:underline">
                  {{ p.name }}
                </NuxtLink>
                <div class="line-clamp-1 text-xs text-slate-500">{{ p.description || '-' }}</div>
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-800">
                  {{ p.type || '-' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                  :class="p.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800'"
                >
                  {{ p.status }}
                </span>
              </td>
              <td class="px-4 py-3">{{ p.price }}</td>
              <td class="px-4 py-3">{{ p.stock }}</td>
              <td class="px-4 py-3 text-slate-600">{{ formatDate(p.updated_at || p.created_at) }}</td>
              <td class="px-4 py-3">
                <div class="flex justify-end gap-2">
                  <NuxtLink
                    :to="`/products/${p.id}`"
                    class="rounded-md bg-white px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
                  >
                    Detail
                  </NuxtLink>
                  <button
                    type="button"
                    class="rounded-md bg-white px-3 py-1.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-200 hover:bg-red-50 disabled:opacity-50"
                    :disabled="actionPendingId === p.id"
                    @click="deleteProduct(p)"
                  >
                    {{ actionPendingId === p.id ? '...' : 'Hapus' }}
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
type Product = {
  id: number
  name: string
  type: string
  description: string
  price: string | number
  image: unknown[]
  status: string
  stock: number
  purchase_limit: number
  duration: number
  claim_reset: string
  profit_type: string
  profit_method: string
  profit_rate: string | number
  balance_source: string
  specific: Record<string, unknown>
  created_at: string
  updated_at: string
}

type ProductsResponse = {
  items: Product[]
  total: number
  page: number
  size: number
  pages: number
}

const route = useRoute()
const api = useApi()

const page = computed(() => {
  const raw = Number(route.query.page ?? 1)
  const n = Number.isFinite(raw) && raw >= 1 ? Math.floor(raw) : 1
  return Math.min(Math.max(n, 1), 999999)
})

const size = computed(() => {
  const raw = Number(route.query.size ?? 10)
  const n = Number.isFinite(raw) && raw >= 1 ? Math.floor(raw) : 10
  return Math.min(Math.max(n, 1), 100)
})

const status = computed(() => String(route.query.status ?? '').trim())
const type = computed(() => String(route.query.type ?? '').trim())
const search = computed(() => String(route.query.search ?? '').trim())

const statusLocal = ref(status.value)
const typeLocal = ref(type.value)
const searchLocal = ref(search.value)
const sizeLocal = ref(size.value)

watch([status, type, search, size], ([s, t, q, z]) => {
  statusLocal.value = s
  typeLocal.value = t
  searchLocal.value = q
  sizeLocal.value = z
})

async function applyFilters() {
  const nextQuery: Record<string, string> = {
    page: '1',
    size: String(sizeLocal.value)
  }

  if (statusLocal.value) nextQuery.status = statusLocal.value
  if (typeLocal.value) nextQuery.type = typeLocal.value
  if (searchLocal.value) nextQuery.search = searchLocal.value

  await navigateTo({ path: route.path, query: nextQuery })
}

const { data, pending, error, refresh } = await useAsyncData(
  () => `admin-products-${page.value}-${size.value}-${status.value}-${type.value}-${search.value}`,
  () =>
    api.get<ProductsResponse>('/admin/products', {
      query: {
        page: page.value,
        size: size.value,
        ...(status.value ? { status: status.value } : {}),
        ...(type.value ? { type: type.value } : {}),
        ...(search.value ? { search: search.value } : {})
      }
    }),
  { watch: [page, size, status, type, search] }
)

const items = computed(() => data.value?.items ?? [])
const total = computed(() => data.value?.total ?? 0)
const pages = computed(() => Math.max(1, data.value?.pages ?? 1))

const errorMessage = computed(() => {
  const e = error.value as any
  return e?.data?.detail?.[0]?.msg || e?.data?.detail || e?.statusMessage || e?.message || 'Unknown error'
})

async function goPrev() {
  await navigateTo({ path: route.path, query: { ...route.query, page: String(Math.max(1, page.value - 1)), size: String(size.value) } })
}

async function goNext() {
  await navigateTo({ path: route.path, query: { ...route.query, page: String(page.value + 1), size: String(size.value) } })
}

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString()
}

const actionPendingId = ref<number | null>(null)

async function deleteProduct(p: Product) {
  if (actionPendingId.value) return
  const ok = window.confirm(`Hapus product #${p.id} (${p.name})?`)
  if (!ok) return

  actionPendingId.value = p.id
  try {
    await api.del<string>(`/admin/products/${p.id}`)
    await refresh()
  } catch (e: any) {
    window.alert(e?.data?.detail?.[0]?.msg || e?.data?.detail || e?.statusMessage || e?.message || 'Gagal')
  } finally {
    actionPendingId.value = null
  }
}
</script>
