<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { IconArrowLeft, IconBook, IconArrowRight } from '@tabler/icons-vue'
import { useModules } from '~/composables/useModules'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const { currentModule, loading, error, fetchModuleById } = useModules()

const loadModuleData = async (id: number) => {
  if (!isNaN(id)) {
    const mod = await fetchModuleById(id)
    if (mod) {
      useHead({ title: `${mod.title} | ScribeTex` })
    }
  }
}

onMounted(async () => {
  await loadModuleData(Number(route.params.id))
})

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await loadModuleData(Number(newId))
    }
  }
)
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8 space-y-8">
    <!-- Tombol Kembali -->
    <button
      @click="router.push('/student/modules')"
      class="flex items-center gap-2 text-xs font-semibold text-primary hover:underline cursor-pointer"
    >
      <IconArrowLeft class="size-4" />
      Kembali ke Katalog Modul
    </button>

    <!-- State Loading -->
    <div v-if="loading" class="space-y-4">
      <div class="h-8 w-1/2 bg-border/40 rounded-lg animate-pulse"></div>
      <div class="h-24 bg-border/40 rounded-xl animate-pulse"></div>
    </div>

    <!-- State Error -->
    <div v-else-if="error" class="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
      {{ error }}
    </div>

    <!-- Detail Modul & Daftar Lesson -->
    <div v-else-if="currentModule" class="space-y-8">
      <!-- Header Modul -->
      <div class="bg-(--color-surface) border border-border rounded-xl p-6 lg:p-8 space-y-4">
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
            Modul {{ currentModule.sort_order }}
          </span>
          <span class="text-xs text-(--color-text-muted) flex items-center gap-1">
            <IconBook class="size-3.5" />
            {{ currentModule.lessons?.length || 0 }} Bab Materi
          </span>
        </div>

        <h1 class="text-2xl lg:text-3xl font-bold text-(--color-text-primary)">
          {{ currentModule.title }}
        </h1>
        <p class="text-xs lg:text-sm text-(--color-text-muted) leading-relaxed">
          {{ currentModule.description }}
        </p>
      </div>

      <!-- Daftar Bab Materi (Lessons) -->
      <div class="space-y-4">
        <h3 class="text-base font-bold text-(--color-text-primary)">
          Daftar Bab Pembelajaran
        </h3>

        <div class="space-y-3">
          <NuxtLink
            v-for="(lesson, idx) in currentModule.lessons"
            :key="lesson.id"
            :to="`/student/modules/lesson/${lesson.id}`"
            class="group border border-border rounded-xl bg-(--color-surface) p-4 lg:p-5 hover:border-primary/50 hover:shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-between"
          >
            <div class="flex items-center gap-4">
              <div class="w-9 h-9 rounded-lg bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                {{ idx + 1 }}
              </div>

              <div>
                <h4 class="text-sm font-bold text-(--color-text-primary) group-hover:text-primary transition-colors">
                  {{ lesson.title }}
                </h4>
                <p class="text-xs text-(--color-text-muted) mt-0.5">
                  Bab {{ lesson.sort_order }} dari Modul {{ currentModule.sort_order }}
                </p>
              </div>
            </div>

            <span class="text-xs font-semibold text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Buka Materi
              <IconArrowRight class="size-4" />
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
