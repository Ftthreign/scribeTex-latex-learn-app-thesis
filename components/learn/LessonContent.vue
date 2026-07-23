<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import type { LessonDetail } from "~/composables/useModules";
import KatexRenderer from "./KatexRenderer.vue";
import LessonHeader from "./LessonHeader.vue";
import LessonNavigation from "./LessonNavigation.vue";
import LessonExerciseBanner from "./LessonExerciseBanner.vue";
import LessonTocSidebar, { type TocEntry } from "./LessonTocSidebar.vue";

const props = defineProps<{ lesson: LessonDetail }>();

const emit = defineEmits<{
  (e: "navigate", lessonId: number): void;
  (e: "start-exercise", exerciseId: number): void;
}>();

const readProgress = ref(0);
const contentRef = ref<HTMLElement | null>(null);
const isMarkedCompleted = ref(false);
let scrollContainer: HTMLElement | null = null;

const getScrollContainer = (): HTMLElement | null => {
  let el = contentRef.value?.parentElement;
  while (el) {
    const overflow = getComputedStyle(el).overflowY;
    if (overflow === "auto" || overflow === "scroll") return el;
    el = el.parentElement;
  }
  return null;
};

const updateProgress = () => {
  const container = scrollContainer;
  if (!contentRef.value || !container) return;
  const containerScrollable = container.scrollHeight - container.clientHeight;
  if (containerScrollable <= 0) {
    readProgress.value = 100;
    return;
  }
  readProgress.value = Math.min(
    100,
    Math.round((container.scrollTop / containerScrollable) * 100),
  );
};

const markLessonCompleted = async () => {
  if (isMarkedCompleted.value || !props.lesson?.id) return;
  isMarkedCompleted.value = true;
  try {
    await $fetch("/api/student/progress", {
      method: "POST",
      body: { lesson_id: props.lesson.id, is_completed: true },
    });
  } catch (e) {
    console.error("[LessonContent] Gagal memperbarui user_progress:", e);
  }
};

watch(readProgress, (val) => {
  if (val >= 90) markLessonCompleted();
});

const tocEntries = ref<TocEntry[]>([]);
const activeHeadingId = ref("");

const buildToc = async () => {
  await nextTick();
  if (!contentRef.value) return;
  const headings = contentRef.value.querySelectorAll("h1,h2,h3,h4");
  const entries: TocEntry[] = [];
  headings.forEach((el) => {
    const heading = el as HTMLElement;
    if (!heading.id) {
      heading.id =
        heading.textContent
          ?.trim()
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .slice(0, 60) || `heading-${entries.length}`;
    }
    entries.push({
      id: heading.id,
      text: heading.textContent?.trim() || "",
      level: Number(heading.tagName[1]),
      isActive: false,
    });
  });
  tocEntries.value = entries;
};

const highlightActiveHeading = () => {
  const container = scrollContainer;
  if (!contentRef.value || !container) return;
  const headings = contentRef.value.querySelectorAll("h1,h2,h3,h4");
  const containerTop = container.getBoundingClientRect().top;
  let activeId = "";
  headings.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top - containerTop <= 120) {
      activeId = (el as HTMLElement).id;
    }
  });
  activeHeadingId.value = activeId;
};

const scrollToHeading = (id: string) => {
  const el = document.getElementById(id);
  const container = scrollContainer;
  if (el && container) {
    const elTop = el.getBoundingClientRect().top;
    const containerTop = container.getBoundingClientRect().top;
    container.scrollBy({ top: elTop - containerTop - 100, behavior: "smooth" });
  }
};

const onScroll = () => {
  updateProgress();
  highlightActiveHeading();
};

onMounted(async () => {
  await nextTick();
  scrollContainer = getScrollContainer();
  if (scrollContainer) {
    scrollContainer.addEventListener("scroll", onScroll, { passive: true });
  }
  await buildToc();
  updateProgress();
});

onUnmounted(() => {
  if (scrollContainer) {
    scrollContainer.removeEventListener("scroll", onScroll);
    scrollContainer = null;
  }
});

watch(
  () => props.lesson,
  async () => {
    readProgress.value = 0;
    isMarkedCompleted.value = false;
    activeHeadingId.value = "";
    if (!scrollContainer) {
      await nextTick();
      scrollContainer = getScrollContainer();
      if (scrollContainer) {
        scrollContainer.addEventListener("scroll", onScroll, { passive: true });
      }
    }
    await buildToc();
    updateProgress();
  },
);

// Computed style kelas status
const progressBarClass = computed(() =>
  readProgress.value >= 100 ? "bg-(--color-success)" : "bg-primary",
);

const progressStatusText = computed(() => {
  if (readProgress.value >= 100) return "Selesai dibaca ✓";
  if (readProgress.value > 0) return `${readProgress.value}% dibaca`;
  return "Mulai membaca";
});

const progressTextClass = computed(() =>
  readProgress.value >= 100
    ? "text-(--color-success)"
    : "text-(--color-text-muted)",
);
</script>

<template>
  <div class="relative">
    <div class="flex gap-6 xl:gap-8 items-start w-full">
      <article ref="contentRef" class="flex-1 min-w-0 space-y-8">
        <LessonHeader
          :moduleTitle="lesson.module?.title"
          :lessonTitle="lesson.title"
          :readProgress="readProgress"
          :progressBarClass="progressBarClass"
          :progressStatusText="progressStatusText"
          :progressTextClass="progressTextClass"
        />

        <div
          class="bg-(--color-surface) border border-border rounded-xl p-4 sm:p-6 lg:p-10 shadow-sm"
          style="box-shadow: var(--shadow-card)"
        >
          <KatexRenderer :content="lesson.content" :isMarkdown="true" />
        </div>

        <LessonExerciseBanner
          :exercises="lesson.exercises"
          @start-exercise="emit('start-exercise', $event)"
        />

        <LessonNavigation
          :prevLesson="lesson.prev_lesson"
          :nextLesson="lesson.next_lesson"
          @navigate="emit('navigate', $event)"
        />
      </article>

      <LessonTocSidebar
        :tocEntries="tocEntries"
        :activeHeadingId="activeHeadingId"
        :readProgress="readProgress"
        :progressBarClass="progressBarClass"
        :progressTextClass="progressTextClass"
        @select-heading="scrollToHeading"
      />
    </div>
  </div>
</template>
