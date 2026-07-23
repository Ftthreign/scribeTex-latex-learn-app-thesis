import { ref, computed } from "vue";

export interface ArticleItem {
  id: number;
  category: string;
  readTime: string;
  title: string;
  imageUrl: string;
}

export interface AssignmentItem {
  id: number;
  course: string;
  title: string;
  deadline: string;
  deadlineLabel: string;
  icon: string;
}

export function useStudentDashboard() {
  const { user, userProfile } = useAuth();

  const studentName = computed(() => {
    const fullName =
      userProfile.value?.name ||
      user.value?.user_metadata?.full_name ||
      user.value?.email?.split("@")[0] ||
      "Mahasiswa";
    return fullName;
  });

  const stats = computed(() => [
    {
      label: "Modules Completed",
      value: "5/8",
      badge: "+2 This Week",
      icon: "menu_book",
    },
    { label: "Exercises Done", value: "32", icon: "task_alt" },
    { label: "Average Grade", value: "89%", icon: "school" },
    { label: "AI Chat Sessions", value: "12", icon: "smart_toy" },
  ]);

  const activeModule = ref({
    number: 4,
    total: 8,
    title: "Modul 4 — Bibliografi & Sitasi Modern",
    description:
      "Pelajari cara mengelola referensi menggunakan BibTeX dan teknik sitasi otomatis sesuai standar jurnal internasional terkemuka.",
    progress: 75,
    badge: "PROSES",
    imageUrl:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80",
  });

  const assignments = ref<AssignmentItem[]>([
    {
      id: 1,
      course: "Metodologi Penelitian I",
      title: "Draft Pendahuluan & Hipotesis",
      deadline: "Besok",
      deadlineLabel: "DEADLINE",
      icon: "science",
    },
    {
      id: 2,
      course: "Analisis Data Lanjutan",
      title: "Validasi Model Statistik",
      deadline: "3 Hari",
      deadlineLabel: "DEADLINE",
      icon: "calculate",
    },
  ]);

  const articles = ref<ArticleItem[]>([
    {
      id: 1,
      category: "Tips Akademik",
      readTime: "5 MIN READ",
      title: "5 Trik Mengatur Waktu untuk Mahasiswa Akhir",
      imageUrl: "",
    },
    {
      id: 2,
      category: "LaTeX Guide",
      readTime: "9 MIN READ",
      title: "Mastering Complex Mathematical Formulas in ScribeTex",
      imageUrl: "",
    },
    {
      id: 3,
      category: "AI Insights",
      readTime: "12 MIN READ",
      title: "Cara Optimal Menggunakan AI untuk Penelitian Akademik",
      imageUrl: "",
    },
  ]);

  const resumeModule = () => {
    const router = useRouter();
    router.push(`/student/modules/${activeModule.value.number}`);
  };

  return {
    studentName,
    stats,
    activeModule,
    assignments,
    articles,
    resumeModule,
  };
}
