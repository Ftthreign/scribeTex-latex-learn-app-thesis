<template>
  <div class="space-y-6 animate-pulse font-body">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="space-y-2">
        <div class="h-8 w-64 bg-border/40 rounded-xl"></div>
        <div class="h-4 w-96 bg-border/30 rounded-md"></div>
      </div>
      <div class="h-10 w-40 bg-border/40 rounded-xl"></div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="i in 4"
        :key="i"
        class="h-32 bg-surface border border-border rounded-(--radius-lg) p-5 space-y-3"
      >
        <div class="flex justify-between items-center">
          <div class="h-4 w-24 bg-border/40 rounded-md"></div>
          <div class="w-11 h-11 rounded-xl bg-border/30"></div>
        </div>
        <div class="h-8 w-20 bg-border/60 rounded-lg"></div>
        <div class="h-3 w-16 bg-border/30 rounded-md"></div>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row gap-4 justify-between items-center">
      <div class="h-10 w-full sm:w-80 bg-surface border border-border rounded-xl"></div>
      <div class="flex gap-2 w-full sm:w-auto">
        <div class="h-9 w-36 bg-surface border border-border rounded-xl"></div>
        <div class="h-9 w-36 bg-surface border border-border rounded-xl"></div>
      </div>
    </div>

    <div class="bg-surface border border-border rounded-2xl p-6 space-y-4">
      <div v-for="i in 5" :key="i" class="h-14 bg-surface-alt rounded-xl"></div>
    </div>
  </div>
</template>
