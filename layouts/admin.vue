<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased">
    <AdminSidebar />
    <div class="flex-1 flex flex-col min-w-0">
      <AdminHeader />
      <main class="flex-1 p-6 md:p-10 overflow-y-auto">
        <div class="max-w-5xl mx-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
