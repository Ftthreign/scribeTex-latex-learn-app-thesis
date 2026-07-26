<template>
  <div class="space-y-6 animate-pulse font-body">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="space-y-2">
        <div class="h-8 w-64 bg-border/40 rounded-xl"></div>
        <div class="h-4 w-96 bg-border/30 rounded-md"></div>
      </div>
      <div class="h-10 w-40 bg-border/40 rounded-xl"></div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div v-for="i in 4" :key="i" class="h-14 bg-surface border border-border rounded-2xl"></div>
    </div>

    <div class="flex flex-col sm:flex-row gap-4 justify-between items-center">
      <div class="h-10 w-full sm:w-80 bg-surface border border-border rounded-xl"></div>
      <div class="h-10 w-40 bg-border/40 rounded-xl"></div>
    </div>

    <div class="bg-surface border border-border rounded-2xl p-6 space-y-4">
      <div v-for="i in 5" :key="i" class="h-16 bg-surface-alt rounded-xl"></div>
    </div>
  </div>
</template>
