import { ref, computed, onMounted } from "vue";

export interface AppNotification {
  id: string;
  type: "module" | "article" | "exercise" | "ai";
  title: string;
  message: string;
  timestamp: string;
  link: string;
  isRead: boolean;
  created_at?: string;
}

const notifications = ref<AppNotification[]>([]);
const isLoaded = ref<boolean>(false);

export function useNotifications() {
  const readIds = ref<Set<string>>(new Set());

  // Memuat ID notifikasi yang sudah dibaca dari localStorage
  function loadReadState() {
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem("scribe_notifications_read");
        if (stored) {
          readIds.value = new Set(JSON.parse(stored));
        }
      } catch (err) {
        console.warn("[useNotifications] Error loading read state:", err);
      }
    }
  }

  // Menyimpan ID notifikasi yang sudah dibaca ke localStorage
  function saveReadState() {
    if (import.meta.client) {
      try {
        localStorage.setItem(
          "scribe_notifications_read",
          JSON.stringify(Array.from(readIds.value)),
        );
      } catch (err) {
        console.warn("[useNotifications] Error saving read state:", err);
      }
    }
  }

  // Menghasilkan daftar notifikasi cerdas berdasarkan data aplikasi
  async function fetchNotifications() {
    loadReadState();

    try {
      const generatedNotifs: AppNotification[] = [];

      // 1. Ambil artikel panduan akademik terbaru
      try {
        const resArticles = await $fetch<{ statusCode: number; data: any[] }>("/api/articles");
        if (resArticles?.data && resArticles.data.length > 0) {
          const latestArticle = resArticles.data[0];
          generatedNotifs.push({
            id: `article-${latestArticle.id}`,
            type: "article",
            title: "Artikel Panduan Baru",
            message: `Artikel "${latestArticle.title}" telah tersedia di Katalog Panduan.`,
            timestamp: new Date(latestArticle.created_at || Date.now()).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
            }),
            link: `/student/panduan/${latestArticle.id}`,
            isRead: readIds.value.has(`article-${latestArticle.id}`),
          });
        }
      } catch (err) {
        console.warn("[useNotifications] Fetch articles skipped:", err);
      }

      // 2. Ambil modul & progres belajar mahasiswa
      try {
        const resDashboard = await $fetch<{ statusCode: number; data: any }>("/api/student/dashboard");
        if (resDashboard?.data?.activeModule) {
          const activeMod = resDashboard.data.activeModule;
          generatedNotifs.push({
            id: `module-${activeMod.id}`,
            type: "module",
            title: "Lanjutkan Modul",
            message: `Modul ${activeMod.sort_order}: "${activeMod.title}" siap dipelajari (${activeMod.progress_percent || 0}% selesai).`,
            timestamp: "Hari ini",
            link: `/student/modules/${activeMod.id}`,
            isRead: readIds.value.has(`module-${activeMod.id}`),
          });
        }
      } catch (err) {
        console.warn("[useNotifications] Fetch dashboard skipped:", err);
      }

      // 3. Notifikasi rekomendasi AI Pembimbing & Kurikulum
      generatedNotifs.push({
        id: "ai-recommendation-1",
        type: "ai",
        title: "Pembimbing AI ScribeTex",
        message: "Manfaatkan Pembimbing AI Gemini untuk menganalisis galat kompilasi LaTeX Anda.",
        timestamp: "Sistem",
        link: "/student/sandbox",
        isRead: readIds.value.has("ai-recommendation-1"),
      });

      generatedNotifs.push({
        id: "unila-template-notice",
        type: "exercise",
        title: "Template Skripsi Unila 2020",
        message: "Format preamble skripsi Unila (Times New Roman, margin 4-3-3-3) telah disinkronkan.",
        timestamp: "Terbaru",
        link: "/student/sandbox",
        isRead: readIds.value.has("unila-template-notice"),
      });

      notifications.value = generatedNotifs;
      isLoaded.value = true;
    } catch (err) {
      console.error("[useNotifications] Failed to compute notifications:", err);
    }
  }

  // Menandai 1 notifikasi sebagai sudah dibaca
  function markAsRead(id: string) {
    readIds.value.add(id);
    saveReadState();

    const notif = notifications.value.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
    }
  }

  // Menandai seluruh notifikasi sebagai sudah dibaca
  function markAllAsRead() {
    notifications.value.forEach((n) => {
      readIds.value.add(n.id);
      n.isRead = true;
    });
    saveReadState();
  }

  const unreadCount = computed(() => {
    return notifications.value.filter((n) => !n.isRead).length;
  });

  onMounted(() => {
    if (!isLoaded.value) {
      fetchNotifications();
    }
  });

  return {
    notifications,
    unreadCount,
    isLoaded,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
}
