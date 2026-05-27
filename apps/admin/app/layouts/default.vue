<template>
  <div class="min-h-dvh bg-slate-50 text-slate-900">
    <div class="mx-auto grid min-h-dvh max-w-7xl grid-cols-1 lg:grid-cols-[17rem_1fr]">
      <aside class="hidden border-r border-slate-200 bg-white lg:block">
        <div class="sticky top-0 flex h-dvh flex-col p-4">
          <div class="flex items-center justify-between">
            <NuxtLink to="/users" class="text-lg font-semibold tracking-tight">Admin Panel</NuxtLink>
          </div>

          <nav class="mt-6 space-y-1 text-sm">
            <NuxtLink
              to="/users"
              class="group flex items-center justify-between rounded-md px-3 py-2 hover:bg-slate-100"
              active-class="bg-slate-100 font-medium"
            >
              <span>Users</span>
              <span class="text-xs text-slate-500 group-[.router-link-active]:text-slate-700">/admin/users</span>
            </NuxtLink>
            <NuxtLink
              to="/products"
              class="group flex items-center justify-between rounded-md px-3 py-2 hover:bg-slate-100"
              active-class="bg-slate-100 font-medium"
            >
              <span>Products</span>
              <span class="text-xs text-slate-500 group-[.router-link-active]:text-slate-700">/admin/products</span>
            </NuxtLink>
          </nav>

          <div class="mt-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <div class="truncate text-sm font-medium text-slate-900">{{ displayName }}</div>
                <div class="truncate text-xs text-slate-600">{{ secondary }}</div>
              </div>
              <button
                type="button"
                class="shrink-0 rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
                @click="logout"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main class="min-w-0 p-4 sm:p-6">
        <div class="mb-6 flex items-center justify-between gap-3 lg:hidden">
          <div>
            <div class="text-sm font-semibold text-slate-900">Admin Panel</div>
            <div class="text-xs text-slate-600">{{ displayName }}</div>
          </div>
          <button
            type="button"
            class="rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
            @click="logout"
          >
            Logout
          </button>
        </div>

        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const { logout, user } = useAuth()

const displayName = computed(() => {
  const u = user.value as any
  return u?.username || u?.first_name || u?.phone || 'Admin'
})

const secondary = computed(() => {
  const u = user.value as any
  return u?.email || u?.phone || ''
})
</script>
