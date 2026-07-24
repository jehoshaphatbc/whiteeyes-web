<template>
  <div class="min-h-screen bg-void text-offwhite flex font-sans antialiased relative">
    <UiGrainOverlay />
    <AdminSidebar />
    <div class="flex-1 flex flex-col min-w-0 relative z-10">
      <AdminHeader />
      <main class="flex-1 p-6 md:p-10 overflow-y-auto">
        <div class="max-w-6xl mx-auto space-y-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
