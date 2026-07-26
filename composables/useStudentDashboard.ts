import { ref, computed, onMounted } from 'vue'

export interface ArticleItem {
  id: number
  category: string
  readTime: string
  title: string
  imageUrl?: string
}

export interface AssignmentItem {
  id: number
  course: string
  title: string
  deadline: string
  deadlineLabel: string
  icon: string
  exercise_id?: number
  lesson_id?: number
}

interface DashboardStats {
  label: string
  value: string | number
  badge?: string
  icon: string
}

interface ActiveModuleData {
  id: number
  number: number
  total: number
  title: string
  description: string
  progress: number
  next_lesson_id: number | null
  badge: string
}

export interface AnalyticsData {
  compilationHealth: {
    total: number
    success: number
    error: number
    successRate: number
  }
  weeklyActivity: Array<{
    day: string
    compilations: number
    completedLessons: number
  }>
  moduleBreakdown: Array<{
    id: number
    sortOrder: number
    title: string
    completed: number
    total: number
    percentage: number
  }>
}

interface DashboardApiResponse {
  stats: {
    modules_completed: string
    lessons_completed: number
    total_lessons: number
    ai_chat_sessions: number
  }
  activeModule: Omit<ActiveModuleData, 'badge'> | null
  analytics?: AnalyticsData
  assignments: AssignmentItem[]
  articles: ArticleItem[]
}

export function useStudentDashboard() {
  const { user, userProfile } = useAuth()
  const router = useRouter()

  const isLoading = ref(true)
  const apiData = ref<DashboardApiResponse | null>(null)

  const studentName = computed(() => {
    return (
      userProfile.value?.name ||
      user.value?.user_metadata?.full_name ||
      user.value?.email?.split('@')[0] ||
      'Mahasiswa'
    )
  })

  // Stats mengambil dari API
  const stats = computed<DashboardStats[]>(() => {
    if (!apiData.value) {
      return [
        { label: 'Modul Selesai', value: '—', icon: 'menu_book' },
        { label: 'Materi Dipelajari', value: '—', icon: 'task_alt' },
        { label: 'Total Materi', value: '—', icon: 'school' },
        { label: 'Sesi AI Chat', value: '—', icon: 'smart_toy' },
      ]
    }
    const s = apiData.value.stats
    return [
      {
        label: 'Modul Selesai',
        value: s.modules_completed,
        badge: 'Kurikulum',
        icon: 'menu_book',
      },
      { label: 'Materi Dipelajari', value: s.lessons_completed, icon: 'task_alt' },
      { label: 'Total Materi', value: s.total_lessons, icon: 'school' },
      { label: 'Sesi AI Chat', value: s.ai_chat_sessions, icon: 'smart_toy' },
    ]
  })

  // Modul aktif dari API
  const activeModule = computed<ActiveModuleData | null>(() => {
    const mod = apiData.value?.activeModule
    if (!mod) return null
    return {
      ...mod,
      badge: mod.progress >= 100 ? 'SELESAI' : mod.progress > 0 ? 'PROSES' : 'MULAI',
    }
  })

  // Artikel dari API (bukan mock)
  const articles = computed<ArticleItem[]>(() => {
    return apiData.value?.articles || []
  })

  // Assignments dari API (latihan/materi belum diselesaikan)
  const assignments = computed<AssignmentItem[]>(() => {
    return apiData.value?.assignments || []
  })

  // Analytics data dari API
  const analytics = computed<AnalyticsData | null>(() => {
    return apiData.value?.analytics || null
  })

  const fetchDashboardData = async () => {
    isLoading.value = true
    try {
      const response = await $fetch<{ statusCode: number; data: DashboardApiResponse }>(
        '/api/student/dashboard'
      )
      apiData.value = response.data
    } catch (e) {
      console.error('[useStudentDashboard] Gagal mengambil data dashboard:', e)
    } finally {
      isLoading.value = false
    }
  }

  const resumeModule = () => {
    const mod = activeModule.value
    if (!mod) return
    // Navigasi ke lesson berikutnya yang belum selesai, atau ke halaman modul
    if (mod.next_lesson_id) {
      router.push(`/student/modules/lesson/${mod.next_lesson_id}`)
    } else {
      router.push(`/student/modules/${mod.id}`)
    }
  }

  onMounted(() => {
    fetchDashboardData()
  })

  return {
    studentName,
    stats,
    activeModule,
    analytics,
    assignments,
    articles,
    isLoading,
    resumeModule,
    fetchDashboardData,
  }
}
