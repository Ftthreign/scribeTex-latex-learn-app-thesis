<template>
  <div class="space-y-8 animate-pulse font-body">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div class="space-y-2 flex-1">
        <div class="h-9 w-80 md:w-96 bg-border/50 rounded-xl"></div>
        <div class="h-4 w-full md:w-3/4 bg-border/30 rounded-md"></div>
        <div class="h-4 w-2/3 bg-border/30 rounded-md"></div>
      </div>
      <div
        class="h-20 w-full md:w-72 bg-(--color-surface) border border-border rounded-(--radius-lg) p-4 shrink-0"
      ></div>
    </div>

    <!-- Grid Skeleton 6 Module Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="i in 6"
        :key="i"
        class="h-60 bg-(--color-surface) border border-border rounded-(--radius-lg) p-6 flex flex-col justify-between"
      >
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <div class="h-5 w-20 bg-border/50 rounded-full"></div>
            <div class="h-4 w-16 bg-border/40 rounded-full"></div>
          </div>
          <div class="h-6 w-3/4 bg-border/60 rounded-lg"></div>
          <div class="h-4 w-full bg-border/30 rounded-md"></div>
        </div>
        <div class="h-3 w-full bg-border/40 rounded-full"></div>
      </div>
    </div>
  </div>
</template>
