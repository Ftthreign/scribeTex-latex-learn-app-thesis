<script setup lang="ts">
import { onMounted } from 'vue'
import { IconCode, IconBook, IconArrowRight } from '@tabler/icons-vue'
import { useExercise } from '~/composables/useExercise'

definePageMeta({ layout: 'default' })
useHead({ title: 'Katalog Latihan Interaktif LaTeX | ScribeTex' })

const router = useRouter()
const { exercisesList, loading, error, fetchExercises } = useExercise()

onMounted(async () => {
  await fetchExercises()
})

const goToExercise = (id: number) => {
  router.push(`/student/exercises/${id}`)
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8 space-y-8">
    <!-- Header Halaman -->
    <div class="space-y-2">
      <h1 class="text-2xl lg:text-3xl font-bold text-(--color-text-primary)">
        Katalog Latihan Interaktif LaTeX
      </h1>
      <p class="text-xs lg:text-sm text-(--color-text-muted) max-w-2xl leading-relaxed">
        Ruang praktik 16 Latihan Interaktif berbasis CodeMirror 6 dengan pratinjau live render KaTeX instan yang dirancang untuk menguji pemahaman sintaks Anda di setiap bab materi.
      </p>
    </div>

    <!-- State Loading -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="h-44 rounded-xl bg-border/40 animate-pulse"></div>
    </div>

    <!-- State Error -->
    <div v-else-if="error" class="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
      <strong>Gagal memuat daftar latihan:</strong> {{ error }}
    </div>

    <!-- State Empty -->
    <div v-else-if="exercisesList.length === 0" class="text-center py-16 text-(--color-text-muted) space-y-3">
      <p class="text-sm">Belum ada latihan yang tersedia. Pastikan database sudah di-seed.</p>
      <code class="text-xs bg-(--color-surface-alt) px-3 py-1 rounded">bun run seed</code>
    </div>

    <!-- Grid Katalog Latihan Interaktif -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="ex in exercisesList"
        :key="ex.id"
        @click="goToExercise(ex.id)"
        class="group border border-border rounded-xl bg-(--color-surface) p-6 hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
        style="box-shadow: var(--shadow-card)"
      >
        <div class="space-y-4">
          <!-- Modul & Lesson Tag -->
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary border border-primary/20">
              Modul {{ ex.module_sort_order }}
            </span>
            <span class="flex items-center gap-1 text-xs text-(--color-text-muted)">
              <IconBook class="size-3.5" />
              Latihan #{{ ex.id }}
            </span>
          </div>

          <!-- Lesson Title & Instruction Snippet -->
          <div>
            <h3 class="text-base font-bold text-(--color-text-primary) group-hover:text-primary transition-colors line-clamp-1">
              {{ ex.lesson_title }}
            </h3>
            <p class="text-xs text-(--color-text-muted) mt-2 line-clamp-2 leading-relaxed">
              {{ ex.instruction }}
            </p>
          </div>
        </div>

        <!-- Action Link -->
        <div class="pt-4 mt-4 border-t border-border/50 flex items-center justify-between">
          <span class="text-xs font-semibold text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <IconCode class="size-3.5" />
            Mulai Latihan Kode
            <IconArrowRight class="size-3.5" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
