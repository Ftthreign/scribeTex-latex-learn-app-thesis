<template>
  <div class="space-y-8 animate-pulse font-body">
    <!-- Header Skeleton -->
    <div class="space-y-2">
      <div class="h-8 w-64 bg-border/50 rounded-xl"></div>
      <div class="h-4 w-96 bg-border/30 rounded-md"></div>
    </div>

    <!-- Stats Cards Skeleton Grid (4 cards) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="i in 4"
        :key="i"
        class="h-28 bg-(--color-surface) border border-border rounded-(--radius-lg) p-5 space-y-3"
      >
        <div class="flex justify-between items-center">
          <div class="h-4 w-20 bg-border/40 rounded-md"></div>
          <div class="w-8 h-8 rounded-xl bg-border/30"></div>
        </div>
        <div class="h-7 w-16 bg-border/60 rounded-lg"></div>
      </div>
    </div>

    <!-- Main Content Area Skeleton -->
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Left Main Column Skeleton -->
      <div class="flex-1 min-w-0 space-y-8">
        <!-- Active Module / Continue Learning Banner Skeleton -->
        <div
          class="h-52 bg-(--color-surface) border border-border rounded-(--radius-lg) p-6 space-y-4"
        >
          <div class="flex justify-between">
            <div class="h-4 w-32 bg-border/50 rounded-md"></div>
            <div class="h-4 w-16 bg-border/40 rounded-md"></div>
          </div>
          <div class="h-6 w-3/4 bg-border/60 rounded-lg"></div>
          <div class="h-4 w-full bg-border/30 rounded-md"></div>
          <div class="h-10 w-40 bg-border/50 rounded-xl"></div>
        </div>

        <!-- Pending Assignments Skeleton -->
        <div class="space-y-3">
          <div class="h-5 w-44 bg-border/50 rounded-md"></div>
          <div class="space-y-2.5">
            <div
              v-for="i in 2"
              :key="i"
              class="h-20 bg-(--color-surface) border border-border rounded-(--radius-lg) p-4 flex items-center gap-4"
            >
              <div
                class="w-10 h-10 rounded-xl bg-border/40 shrink-0"
              ></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 w-3/4 bg-border/50 rounded-md"></div>
                <div class="h-3 w-1/2 bg-border/30 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar Column Skeleton (Article Guides) -->
      <div class="w-full lg:w-80 shrink-0 space-y-4">
        <div class="h-5 w-36 bg-border/50 rounded-md"></div>
        <div
          class="bg-(--color-surface) border border-border rounded-(--radius-lg) p-4 space-y-4"
        >
          <div
            v-for="i in 3"
            :key="i"
            class="space-y-2 pb-3 border-b border-border/50 last:border-0 last:pb-0"
          >
            <div class="h-3 w-20 bg-border/40 rounded-md"></div>
            <div class="h-4 w-full bg-border/60 rounded-md"></div>
            <div class="h-3 w-16 bg-border/30 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
