<template>
  <div>
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div class="text-xs text-slate-500">
          <NuxtLink to="/products" class="hover:underline">Products</NuxtLink>
          <span class="mx-1">/</span>
          <span>#{{ productId }}</span>
        </div>

        <h1 class="mt-1 text-2xl font-semibold tracking-tight">
          {{ product?.name || `Product #${productId}` }}
        </h1>

        <div class="mt-2 flex flex-wrap items-center gap-2">
          <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-800">
            {{ product?.type || form.type || '-' }}
          </span>
          <span
            class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
            :class="form.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800'"
          >
            {{ form.status }}
          </span>
          <span class="text-xs text-slate-500">
            Stock: {{ form.stock }}
          </span>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <NuxtLink
          to="/products"
          class="rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
        >
          Kembali
        </NuxtLink>
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
      Gagal memuat product: {{ loadErrorMessage }}
    </div>

    <div v-else class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <form class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-black/5" @submit.prevent="save">
          <div class="flex items-center justify-between gap-3">
            <div class="text-sm font-medium text-slate-900">Edit Product</div>
            <div class="text-xs text-slate-500">ID: {{ productId }}</div>
          </div>

          <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label class="text-sm font-medium text-slate-700">Name</label>
              <input
                v-model="form.name"
                type="text"
                class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div>
              <label class="text-sm font-medium text-slate-700">Type</label>
              <input
                v-model="form.type"
                type="text"
                class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div>
              <label class="text-sm font-medium text-slate-700">Status</label>
              <select
                v-model="form.status"
                class="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
            </div>

            <div class="sm:col-span-2">
              <label class="text-sm font-medium text-slate-700">Description</label>
              <textarea
                v-model="form.description"
                rows="3"
                class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div>
              <label class="text-sm font-medium text-slate-700">Price</label>
              <input
                v-model="form.price"
                type="text"
                class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div>
              <label class="text-sm font-medium text-slate-700">Stock</label>
              <input
                v-model.number="form.stock"
                type="number"
                min="0"
                class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div>
              <label class="text-sm font-medium text-slate-700">Purchase limit</label>
              <input
                v-model.number="form.purchase_limit"
                type="number"
                min="0"
                class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div>
              <label class="text-sm font-medium text-slate-700">Duration</label>
              <input
                v-model.number="form.duration"
                type="number"
                min="0"
                class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div>
              <label class="text-sm font-medium text-slate-700">Claim reset</label>
              <select
                v-model="form.claim_reset"
                class="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              >
                <option value="midnight">midnight</option>
                <option value="purchase">purchase</option>
              </select>
            </div>

            <div>
              <label class="text-sm font-medium text-slate-700">Profit type</label>
              <select
                v-model="form.profit_type"
                class="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              >
                <option value="fixed">fixed</option>
                <option value="percentage">percentage</option>
              </select>
            </div>

            <div>
              <label class="text-sm font-medium text-slate-700">Profit method</label>
              <select
                v-model="form.profit_method"
                class="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              >
                <option value="manual">manual</option>
                <option value="auto">auto</option>
              </select>
            </div>

            <div>
              <label class="text-sm font-medium text-slate-700">Profit rate</label>
              <input
                v-model="form.profit_rate"
                type="text"
                class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div>
              <label class="text-sm font-medium text-slate-700">Balance source</label>
              <select
                v-model="form.balance_source"
                class="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              >
                <option value="balance">balance</option>
                <option value="balance_deposit">balance_deposit</option>
              </select>
            </div>

            <div class="sm:col-span-2">
              <label class="text-sm font-medium text-slate-700">Image</label>
              <input
                type="file"
                accept="image/*"
                class="mt-1 block w-full text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-800"
                @change="onFilesSelected"
              />
              <div v-if="pendingUploads > 0" class="mt-2 text-xs text-slate-600">Uploading...</div>
              <div v-if="image" class="mt-3">
                <div
                  class="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3"
                >
                  <div class="h-12 w-12 overflow-hidden rounded-md bg-slate-100">
                    <img :src="toImageUrl(image)" alt="" class="h-full w-full object-cover" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="truncate text-xs font-medium text-slate-900">{{ image }}</div>
                  </div>
                  <button
                    type="button"
                    class="rounded-md bg-white px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-200 hover:bg-red-50"
                    @click="removeImage"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <div class="sm:col-span-2">
              <label class="text-sm font-medium text-slate-700">Specific</label>
              <textarea
                v-model="specificText"
                rows="5"
                class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-xs outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                :placeholder="specificPlaceholder"
              />
            </div>
          </div>

          <details class="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <summary class="cursor-pointer text-sm font-medium text-slate-900">Rabat</summary>
            <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="text-sm font-medium text-slate-700">purchase_rabat_l1</label>
                <input v-model="form.purchase_rabat_l1" type="text" class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10" />
              </div>
              <div>
                <label class="text-sm font-medium text-slate-700">profit_rabat_l1</label>
                <input v-model="form.profit_rabat_l1" type="text" class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10" />
              </div>
              <div>
                <label class="text-sm font-medium text-slate-700">purchase_rabat_l2</label>
                <input v-model="form.purchase_rabat_l2" type="text" class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10" />
              </div>
              <div>
                <label class="text-sm font-medium text-slate-700">profit_rabat_l2</label>
                <input v-model="form.profit_rabat_l2" type="text" class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10" />
              </div>
              <div>
                <label class="text-sm font-medium text-slate-700">purchase_rabat_l3</label>
                <input v-model="form.purchase_rabat_l3" type="text" class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10" />
              </div>
              <div>
                <label class="text-sm font-medium text-slate-700">profit_rabat_l3</label>
                <input v-model="form.profit_rabat_l3" type="text" class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10" />
              </div>
              <div>
                <label class="text-sm font-medium text-slate-700">purchase_rabat_l4</label>
                <input v-model="form.purchase_rabat_l4" type="text" class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10" />
              </div>
              <div>
                <label class="text-sm font-medium text-slate-700">profit_rabat_l4</label>
                <input v-model="form.profit_rabat_l4" type="text" class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10" />
              </div>
              <div>
                <label class="text-sm font-medium text-slate-700">purchase_rabat_l5</label>
                <input v-model="form.purchase_rabat_l5" type="text" class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10" />
              </div>
              <div>
                <label class="text-sm font-medium text-slate-700">profit_rabat_l5</label>
                <input v-model="form.profit_rabat_l5" type="text" class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10" />
              </div>
            </div>
          </details>

          <div class="mt-4 flex items-center gap-2">
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
              class="ml-auto rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
              :disabled="pendingAction"
            >
              {{ pendingAction ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>

          <div v-if="saveMessage" class="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            {{ saveMessage }}
          </div>
          <div v-if="saveError" class="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {{ saveError }}
          </div>
        </form>
      </div>

      <div class="space-y-6">
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div class="text-sm font-medium text-slate-900">Info</div>
          <dl class="mt-4 space-y-3 text-sm">
            <div class="flex justify-between gap-3">
              <dt class="text-slate-600">Created</dt>
              <dd class="text-slate-900">{{ product ? formatDate(product.created_at) : '-' }}</dd>
            </div>
            <div class="flex justify-between gap-3">
              <dt class="text-slate-600">Updated</dt>
              <dd class="text-slate-900">{{ product?.updated_at ? formatDate(product.updated_at) : '-' }}</dd>
            </div>
          </dl>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div class="text-sm font-medium text-slate-900">Raw</div>
          <pre class="mt-3 max-h-72 overflow-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-800">{{ rawJson }}</pre>
        </div>
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
  image: unknown
  status: string
  stock: number
  purchase_limit: number
  duration: number
  claim_reset: string
  profit_type: string
  profit_method: string
  profit_rate: string | number
  balance_source: string
  purchase_rabat_l1: string | number
  purchase_rabat_l2: string | number
  purchase_rabat_l3: string | number
  purchase_rabat_l4: string | number
  purchase_rabat_l5: string | number
  profit_rabat_l1: string | number
  profit_rabat_l2: string | number
  profit_rabat_l3: string | number
  profit_rabat_l4: string | number
  profit_rabat_l5: string | number
  specific: Record<string, unknown>
  created_at: string
  updated_at: string
}

const route = useRoute()
const api = useApi()
const config = useRuntimeConfig()

const productId = computed(() => Number(route.params.id))

const { data, pending, error, refresh } = await useAsyncData(
  () => `admin-product-${productId.value}`,
  () => api.get<Product>(`/admin/products/${productId.value}`),
  { watch: [productId] }
)

const product = computed(() => data.value ?? null)
const rawJson = computed(() => (product.value ? JSON.stringify(product.value, null, 2) : ''))

const loadError = computed(() => Boolean(error.value))
const loadErrorMessage = computed(() => {
  const e = error.value as any
  return e?.data?.detail?.[0]?.msg || e?.data?.detail || e?.statusMessage || e?.message || 'Unknown error'
})

const pendingAction = ref(false)
const saveMessage = ref('')
const saveError = ref('')
const pendingUploads = ref(0)

const form = reactive({
  name: '',
  type: '',
  description: '',
  price: '',
  image: null as unknown,
  status: 'active',
  stock: 0,
  purchase_limit: 0,
  duration: 0,
  claim_reset: 'midnight',
  profit_type: 'fixed',
  profit_method: 'manual',
  profit_rate: '',
  balance_source: 'balance_deposit',
  purchase_rabat_l1: '0',
  purchase_rabat_l2: '0',
  purchase_rabat_l3: '0',
  purchase_rabat_l4: '0',
  purchase_rabat_l5: '0',
  profit_rabat_l1: '0',
  profit_rabat_l2: '0',
  profit_rabat_l3: '0',
  profit_rabat_l4: '0',
  profit_rabat_l5: '0',
  specific: {} as Record<string, unknown>
})

const image = ref('')
const specificText = ref('{}')
const specificPlaceholder = `Contoh JSON (boleh diubah / dihapus):
{
  "label": "Paket VIP",
  "benefits": ["Bonus harian", "Prioritas support"],
  "rules": {
    "min_purchase": 1,
    "max_purchase": 3
  },
  "notes": "Isi sesuai kebutuhan produk ini"
}`

watch(
  product,
  (p) => {
    if (!p) return
    form.name = p.name || ''
    form.type = p.type || ''
    form.description = p.description || ''
    form.price = String(p.price ?? '')
    form.image = p.image ?? null
    form.status = p.status || 'active'
    form.stock = Number(p.stock) || 0
    form.purchase_limit = Number(p.purchase_limit) || 0
    form.duration = Number(p.duration) || 0
    form.claim_reset = p.claim_reset || 'midnight'
    form.profit_type = p.profit_type || 'fixed'
    form.profit_method = p.profit_method || 'manual'
    form.profit_rate = String(p.profit_rate ?? '')
    form.balance_source = p.balance_source || 'balance_deposit'
    form.purchase_rabat_l1 = String((p as any).purchase_rabat_l1 ?? '0')
    form.purchase_rabat_l2 = String((p as any).purchase_rabat_l2 ?? '0')
    form.purchase_rabat_l3 = String((p as any).purchase_rabat_l3 ?? '0')
    form.purchase_rabat_l4 = String((p as any).purchase_rabat_l4 ?? '0')
    form.purchase_rabat_l5 = String((p as any).purchase_rabat_l5 ?? '0')
    form.profit_rabat_l1 = String((p as any).profit_rabat_l1 ?? '0')
    form.profit_rabat_l2 = String((p as any).profit_rabat_l2 ?? '0')
    form.profit_rabat_l3 = String((p as any).profit_rabat_l3 ?? '0')
    form.profit_rabat_l4 = String((p as any).profit_rabat_l4 ?? '0')
    form.profit_rabat_l5 = String((p as any).profit_rabat_l5 ?? '0')
    form.specific = p.specific || {}
    if (typeof p.image === 'string') image.value = p.image
    else if (Array.isArray(p.image) && typeof p.image[0] === 'string') image.value = p.image[0]
    else image.value = ''
    specificText.value = JSON.stringify(form.specific, null, 2)
  },
  { immediate: true }
)

function resetForm() {
  const p = product.value
  if (!p) return
  saveMessage.value = ''
  saveError.value = ''
  form.name = p.name || ''
  form.type = p.type || ''
  form.description = p.description || ''
  form.price = String(p.price ?? '')
  form.image = p.image ?? null
  form.status = p.status || 'active'
  form.stock = Number(p.stock) || 0
  form.purchase_limit = Number(p.purchase_limit) || 0
  form.duration = Number(p.duration) || 0
  form.claim_reset = p.claim_reset || 'midnight'
  form.profit_type = p.profit_type || 'fixed'
  form.profit_method = p.profit_method || 'manual'
  form.profit_rate = String(p.profit_rate ?? '')
  form.balance_source = p.balance_source || 'balance_deposit'
  form.purchase_rabat_l1 = String((p as any).purchase_rabat_l1 ?? '0')
  form.purchase_rabat_l2 = String((p as any).purchase_rabat_l2 ?? '0')
  form.purchase_rabat_l3 = String((p as any).purchase_rabat_l3 ?? '0')
  form.purchase_rabat_l4 = String((p as any).purchase_rabat_l4 ?? '0')
  form.purchase_rabat_l5 = String((p as any).purchase_rabat_l5 ?? '0')
  form.profit_rabat_l1 = String((p as any).profit_rabat_l1 ?? '0')
  form.profit_rabat_l2 = String((p as any).profit_rabat_l2 ?? '0')
  form.profit_rabat_l3 = String((p as any).profit_rabat_l3 ?? '0')
  form.profit_rabat_l4 = String((p as any).profit_rabat_l4 ?? '0')
  form.profit_rabat_l5 = String((p as any).profit_rabat_l5 ?? '0')
  form.specific = p.specific || {}
  if (typeof p.image === 'string') image.value = p.image
  else if (Array.isArray(p.image) && typeof p.image[0] === 'string') image.value = p.image[0]
  else image.value = ''
  specificText.value = JSON.stringify(form.specific, null, 2)
}

function toImageUrl(p: string) {
  const base = String(config.public.apiBase || '').replace(/\/$/, '')
  const path = p.replace(/^\//, '')
  if (/^https?:\/\//i.test(p)) return p
  return base ? `${base}/${path}` : `/${path}`
}

function removeImage() {
  image.value = ''
}

function parseSpecific(input: string) {
  const s = input.trim()
  if (!s) return {}
  const v = JSON.parse(s)
  if (v && typeof v === 'object' && !Array.isArray(v)) return v as Record<string, unknown>
  return {}
}

function normalizeDecimal(value: string) {
  const s = value.trim()
  if (!s) return '0'
  return s
}

async function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return await api.request<{ path: string }>('/admin/upload-image', { method: 'POST', body: formData })
}

async function onFilesSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files || [])
  input.value = ''
  if (!files.length) return

  saveMessage.value = ''
  saveError.value = ''
  pendingUploads.value += 1
  try {
    const res = await uploadImage(files[0])
    if (res?.path) image.value = res.path
  } catch (err: any) {
    saveError.value =
      err?.data?.detail?.[0]?.msg || err?.data?.detail || err?.statusMessage || err?.message || 'Gagal upload image'
  } finally {
    pendingUploads.value -= 1
  }
}

async function save() {
  if (pendingAction.value) return
  pendingAction.value = true
  saveMessage.value = ''
  saveError.value = ''

  try {
    const payload = {
      name: form.name,
      type: form.type,
      description: form.description,
      price: normalizeDecimal(form.price),
      image: image.value,
      status: form.status,
      stock: Number(form.stock) || 0,
      purchase_limit: Number(form.purchase_limit) || 0,
      duration: Number(form.duration) || 0,
      claim_reset: form.claim_reset,
      profit_type: form.profit_type,
      profit_method: form.profit_method,
      profit_rate: normalizeDecimal(form.profit_rate),
      balance_source: form.balance_source,
      specific: parseSpecific(specificText.value),
      purchase_rabat_l1: normalizeDecimal(String(form.purchase_rabat_l1)),
      purchase_rabat_l2: normalizeDecimal(String(form.purchase_rabat_l2)),
      purchase_rabat_l3: normalizeDecimal(String(form.purchase_rabat_l3)),
      purchase_rabat_l4: normalizeDecimal(String(form.purchase_rabat_l4)),
      purchase_rabat_l5: normalizeDecimal(String(form.purchase_rabat_l5)),
      profit_rabat_l1: normalizeDecimal(String(form.profit_rabat_l1)),
      profit_rabat_l2: normalizeDecimal(String(form.profit_rabat_l2)),
      profit_rabat_l3: normalizeDecimal(String(form.profit_rabat_l3)),
      profit_rabat_l4: normalizeDecimal(String(form.profit_rabat_l4)),
      profit_rabat_l5: normalizeDecimal(String(form.profit_rabat_l5))
    }

    await api.patch<Product>(`/admin/products/${productId.value}`, { body: payload })
    await refresh()
    saveMessage.value = 'Berhasil disimpan.'
  } catch (e: any) {
    saveError.value = e?.data?.detail?.[0]?.msg || e?.data?.detail || e?.statusMessage || e?.message || 'Gagal menyimpan'
  } finally {
    pendingAction.value = false
  }
}

async function remove() {
  if (pendingAction.value) return
  const p = product.value
  if (!p) return
  const ok = window.confirm(`Hapus product #${p.id} (${p.name})?`)
  if (!ok) return

  pendingAction.value = true
  saveMessage.value = ''
  saveError.value = ''
  try {
    await api.del<string>(`/admin/products/${p.id}`)
    await navigateTo('/products')
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
</script>
