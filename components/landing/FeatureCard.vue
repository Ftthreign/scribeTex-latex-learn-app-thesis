<template>
  <div class="group relative p-8 rounded-[2.5rem] bg-secondary/50 border border-border hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
    <div 
      class="size-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500"
      :class="[colorClass || 'bg-primary/10 text-primary']"
    >
      <slot name="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>
      </slot>
    </div>
    
    <h3 class="text-2xl font-bold mb-4">{{ title }}</h3>
    <p class="text-muted-foreground leading-relaxed">
      {{ description }}
    </p>

    <!-- Decoration -->
    <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  colorClass?: string
}>()
</script>
