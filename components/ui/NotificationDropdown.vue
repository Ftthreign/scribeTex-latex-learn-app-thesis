<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import {
  IconBell,
  IconBook,
  IconFileText,
  IconAward,
  IconRobot,
  IconCheck,
  IconChevronRight,
  IconX,
} from "@tabler/icons-vue";
import {
  useNotifications,
  type AppNotification,
} from "~/composables/useNotifications";

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const router = useRouter();
const dropdownRef = ref<HTMLElement | null>(null);
const { notifications, unreadCount, markAsRead, markAllAsRead } =
  useNotifications();

const handleSelectNotif = (notif: AppNotification) => {
  markAsRead(notif.id);
  emit("close");
  if (notif.link) {
    router.push(notif.link);
  }
};

const getNotifIcon = (type: AppNotification["type"]) => {
  switch (type) {
    case "module":
      return {
        icon: IconBook,
        colorClass:
          "bg-[var(--color-primary-light)] text-[var(--color-primary)] border-[var(--color-primary)]/20",
      };
    case "article":
      return {
        icon: IconFileText,
        colorClass:
          "bg-[var(--color-success-light)] text-[var(--color-success)] border-[var(--color-success)]/20",
      };
    case "exercise":
      return {
        icon: IconAward,
        colorClass:
          "bg-[var(--color-warning-light)] text-[var(--color-warning)] border-[var(--color-warning)]/20",
      };
    case "ai":
      return {
        icon: IconRobot,
        colorClass:
          "bg-[var(--color-ai-light)] text-[var(--color-ai-primary)] border-[var(--color-ai-primary)]/20",
      };
    default:
      return {
        icon: IconBell,
        colorClass:
          "bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] border-[var(--color-border)]",
      };
  }
};

// Outside click handler
const handleClickOutside = (event: MouseEvent) => {
  if (
    props.isOpen &&
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target as Node)
  ) {
    emit("close");
  }
};

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform opacity-0 scale-95 -translate-y-2"
      enter-to-class="transform opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform opacity-100 scale-100 translate-y-0"
      leave-to-class="transform opacity-0 scale-95 -translate-y-2"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-80 sm:w-96 bg-(--color-surface) border border-border rounded-(--radius-xl) shadow-2xl z-50 overflow-hidden font-body flex flex-col max-h-120"
      >
        <!-- Header Popover -->
        <div
          class="p-4 bg-surface-alt/80 border-b border-border flex items-center justify-between shrink-0 font-sans"
        >
          <div class="flex items-center gap-2">
            <h3
              class="text-sm font-bold text-(--color-text-primary) font-display tracking-tight"
            >
              Pemberitahuan
            </h3>
            <span
              v-if="unreadCount > 0"
              class="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-primary-light text-primary border border-primary/20"
            >
              {{ unreadCount }} Baru
            </span>
          </div>

          <div class="flex items-center gap-1">
            <button
              v-if="unreadCount > 0"
              @click="markAllAsRead"
              class="text-[11px] font-bold text-primary hover:underline cursor-pointer px-2 py-1 rounded-md hover:bg-primary-light transition-colors"
            >
              Tandai Semua Dibaca
            </button>
            <button
              @click="emit('close')"
              class="p-1 rounded-lg text-(--color-text-muted) hover:text-(--color-text-primary) hover:bg-(--color-surface) transition-colors cursor-pointer"
            >
              <IconX class="size-4" />
            </button>
          </div>
        </div>

        <!-- Notification List -->
        <div class="flex-1 overflow-y-auto divide-y divide-border/60">
          <template v-if="notifications.length > 0">
            <div
              v-for="item in notifications"
              :key="item.id"
              @click="handleSelectNotif(item)"
              :class="[
                'p-3.5 flex items-start gap-3 transition-colors cursor-pointer group hover:bg-surface-alt/60 relative',
                !item.isRead ? 'bg-primary-light/20' : '',
              ]"
            >
              <!-- Icon Container -->
              <div
                :class="[
                  'size-9 rounded-md border flex items-center justify-center shrink-0 mt-0.5 shadow-2xs',
                  getNotifIcon(item.type).colorClass,
                ]"
              >
                <component
                  :is="getNotifIcon(item.type).icon"
                  class="size-4.5"
                />
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0 space-y-1 pr-2">
                <div class="flex items-center justify-between gap-1">
                  <h4
                    :class="[
                      'text-xs font-bold font-display line-clamp-1',
                      !item.isRead
                        ? 'text-primary'
                        : 'text-(--color-text-primary)',
                    ]"
                  >
                    {{ item.title }}
                  </h4>
                  <span
                    class="text-[10px] text-(--color-text-muted) font-mono shrink-0"
                  >
                    {{ item.timestamp }}
                  </span>
                </div>
                <p
                  class="text-[11px] text-text-secondary leading-relaxed line-clamp-2 font-sans"
                >
                  {{ item.message }}
                </p>
              </div>

              <!-- Unread Indicator Dot -->
              <div
                v-if="!item.isRead"
                class="size-2 rounded-full bg-primary shrink-0 self-center"
              ></div>
              <IconChevronRight
                v-else
                class="size-4 text-(--color-text-muted) group-hover:text-(--color-text-primary) group-hover:translate-x-0.5 transition-all shrink-0 self-center opacity-0 group-hover:opacity-100"
              />
            </div>
          </template>

          <!-- Empty State -->
          <div v-else class="p-8 text-center space-y-2 font-sans">
            <IconBell
              class="size-8 mx-auto text-(--color-text-muted) opacity-30"
            />
            <p class="text-xs font-bold text-(--color-text-primary)">
              Belum Ada Pemberitahuan
            </p>
            <p class="text-[11px] text-(--color-text-muted) max-w-xs mx-auto">
              Aktivitas dan pembaruan materi Anda akan muncul di sini.
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
