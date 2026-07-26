<template>
  <div class="space-y-8 animate-pulse font-body">
    <!-- Module Header Skeleton -->
    <div
      class="bg-(--color-surface) border border-border rounded-(--radius-xl) p-6 lg:p-8 space-y-4"
    >
      <div class="flex items-center gap-2">
        <div class="h-6 w-24 bg-border/50 rounded-full"></div>
        <div class="h-4 w-28 bg-border/30 rounded-md"></div>
      </div>
      <div class="h-8 w-2/3 bg-border/60 rounded-xl"></div>
      <div class="h-4 w-full bg-border/30 rounded-md"></div>
      <div class="h-4 w-4/5 bg-border/30 rounded-md"></div>
    </div>

    <!-- Lessons List Skeleton -->
    <div class="space-y-4">
      <div class="h-6 w-44 bg-border/50 rounded-md"></div>
      <div class="space-y-3">
        <div
          v-for="i in 4"
          :key="i"
          class="h-20 bg-(--color-surface) border border-border rounded-(--radius-lg) p-4 flex items-center justify-between"
        >
          <div class="flex items-center gap-4 flex-1">
            <div
              class="w-9 h-9 rounded-lg bg-border/40 shrink-0"
            ></div>
            <div class="space-y-2 flex-1">
              <div
                class="h-4 w-1/2 bg-border/60 rounded-md"
              ></div>
              <div
                class="h-3 w-1/3 bg-border/30 rounded-md"
              ></div>
            </div>
          </div>
          <div class="h-4 w-20 bg-border/40 rounded-md"></div>
        </div>
      </div>
    </div>
  </div>
</template>
