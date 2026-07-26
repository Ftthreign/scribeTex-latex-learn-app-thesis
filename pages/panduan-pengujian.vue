<script setup lang="ts">
import { ref } from "vue";
import {
  IconCopy,
  IconCheck,
  IconArrowLeft,
  IconArrowRight,
  IconShield,
  IconUser,
  IconBook,
  IconCode,
  IconSparkles,
  IconChartBar,
  IconDatabase,
  IconFileText,
  IconDeviceDesktop,
} from "@tabler/icons-vue";

definePageMeta({
  layout: false,
  auth: false,
});
useHead({ title: "Panduan Pengetesan Aplikasi Evaluator | ScribeTex" });

const router = useRouter();

const copiedField = ref<string | null>(null);

function copyToClipboard(text: string, fieldId: string) {
  navigator.clipboard.writeText(text);
  copiedField.value = fieldId;
  setTimeout(() => {
    copiedField.value = null;
  }, 2000);
}

const activeRoleTab = ref<"student" | "admin">("student");
</script>

<template>
  <div class="min-h-screen bg-background text-(--color-text-primary) font-body selection:bg-primary-light selection:text-primary">
    <!-- Top Bar Header -->
    <header class="border-b border-border bg-surface/90 backdrop-blur-md sticky top-0 z-40">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between font-sans">
        <div class="flex items-center gap-3">
          <NuxtLink to="/" class="flex items-center gap-2">
            <span class="font-bold text-lg text-primary font-display tracking-tight">ScribeTex</span>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-light text-primary border border-primary/20 uppercase tracking-wider">
              Evaluator Guide
            </span>
          </NuxtLink>
        </div>

        <div class="flex items-center gap-3">
          <NuxtLink to="/" class="flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors">
            <IconArrowLeft class="size-4" />
            <span>Halaman Utama</span>
          </NuxtLink>
          <NuxtLink to="/login" class="btn-primary btn-sm gap-1.5 rounded-xl font-bold">
            <span>Masuk Aplikasi</span>
            <IconArrowRight class="size-3.5" />
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Content Container -->
    <main class="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <!-- Title & Hero Section -->
      <section class="text-center space-y-3 max-w-3xl mx-auto font-sans">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-bold border border-primary/20">
          <IconDeviceDesktop class="size-4" />
          <span>Panduan Pengujian Mandiri Evaluator Skripsi</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold text-text-primary font-display tracking-tight leading-tight">
          Panduan Pengetesan Aplikasi Pembelajaran LaTeX ScribeTex
        </h1>
        <p class="text-sm text-text-secondary leading-relaxed">
          Dokumen panduan ini dirancang untuk memudahkan dosen penguji / evaluator dalam melakukan pengujian fungsionalitas sistem secara mandiri, terstruktur, dan komprehensif.
        </p>
      </section>

      <!-- Section Kredensial Akun Pengujian Demo -->
      <section class="space-y-4">
        <div class="flex items-center gap-2 font-sans">
          <IconShield class="size-5 text-primary" />
          <h2 class="text-lg font-bold text-text-primary font-display">
            Kredensial Akun Pengujian Demo
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
          <!-- Student Account Card -->
          <div class="bg-surface border border-border rounded-2xl p-5 space-y-4 shadow-xs relative overflow-hidden">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold text-sm">
                  <IconUser class="size-5" />
                </div>
                <div>
                  <h3 class="font-bold text-text-primary text-sm font-display">
                    Akun Pengujian Mahasiswa (Student)
                  </h3>
                  <p class="text-[11px] text-text-muted">Akses seluruh fitur kurikulum, latihan interaktif, & AI</p>
                </div>
              </div>
              <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase">
                Peran Student
              </span>
            </div>

            <div class="space-y-2 bg-surface-alt/70 p-3.5 rounded-xl border border-border text-xs font-mono">
              <div class="flex items-center justify-between">
                <span class="text-text-muted">Surel (Email):</span>
                <div class="flex items-center gap-1.5 font-bold text-text-primary">
                  <span>fadhil@test.com</span>
                  <button
                    type="button"
                    @click="copyToClipboard('fadhil@test.com', 'student-email')"
                    class="p-1 hover:bg-surface rounded text-primary transition-all cursor-pointer"
                    title="Salin Surel"
                  >
                    <IconCheck v-if="copiedField === 'student-email'" class="size-3.5 text-emerald-600" />
                    <IconCopy v-else class="size-3.5" />
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between pt-1 border-t border-border/50">
                <span class="text-text-muted">Kata Sandi (Password):</span>
                <div class="flex items-center gap-1.5 font-bold text-text-primary">
                  <span>password123</span>
                  <button
                    type="button"
                    @click="copyToClipboard('password123', 'student-pass')"
                    class="p-1 hover:bg-surface rounded text-primary transition-all cursor-pointer"
                    title="Salin Kata Sandi"
                  >
                    <IconCheck v-if="copiedField === 'student-pass'" class="size-3.5 text-emerald-600" />
                    <IconCopy v-else class="size-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <NuxtLink to="/login" class="btn-secondary btn-sm w-full font-bold rounded-xl justify-center">
              <span>Masuk Sebagai Student</span>
            </NuxtLink>
          </div>

          <!-- Admin Account Card -->
          <div class="bg-surface border border-border rounded-2xl p-5 space-y-4 shadow-xs relative overflow-hidden">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-sm">
                  <IconShield class="size-5" />
                </div>
                <div>
                  <h3 class="font-bold text-text-primary text-sm font-display">
                    Akun Pengujian Administrator (Admin)
                  </h3>
                  <p class="text-[11px] text-text-muted">Akses dasbor monitoring, progress siswa, & CMS</p>
                </div>
              </div>
              <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20 uppercase">
                Peran Admin
              </span>
            </div>

            <div class="space-y-2 bg-surface-alt/70 p-3.5 rounded-xl border border-border text-xs font-mono">
              <div class="flex items-center justify-between">
                <span class="text-text-muted">Surel (Email):</span>
                <div class="flex items-center gap-1.5 font-bold text-text-primary">
                  <span>test-admin@admin.com</span>
                  <button
                    type="button"
                    @click="copyToClipboard('test-admin@admin.com', 'admin-email')"
                    class="p-1 hover:bg-surface rounded text-primary transition-all cursor-pointer"
                    title="Salin Surel"
                  >
                    <IconCheck v-if="copiedField === 'admin-email'" class="size-3.5 text-emerald-600" />
                    <IconCopy v-else class="size-3.5" />
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between pt-1 border-t border-border/50">
                <span class="text-text-muted">Kata Sandi (Password):</span>
                <div class="flex items-center gap-1.5 font-bold text-text-primary">
                  <span>password123</span>
                  <button
                    type="button"
                    @click="copyToClipboard('password123', 'admin-pass')"
                    class="p-1 hover:bg-surface rounded text-primary transition-all cursor-pointer"
                    title="Salin Kata Sandi"
                  >
                    <IconCheck v-if="copiedField === 'admin-pass'" class="size-3.5 text-emerald-600" />
                    <IconCopy v-else class="size-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <NuxtLink to="/login" class="btn-secondary btn-sm w-full font-bold rounded-xl justify-center">
              <span>Masuk Sebagai Admin</span>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Section Skenario Pengujian Aplikasi -->
      <section class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4 font-sans">
          <div>
            <h2 class="text-xl font-bold text-text-primary font-display">
              Alur Skenario Pengujian Aplikasi
            </h2>
            <p class="text-xs text-text-muted mt-0.5">
              Pilih peran pengguna di bawah untuk melihat rincian alur pengujian fitur.
            </p>
          </div>

          <!-- Role Selector Tabs -->
          <div class="flex items-center bg-surface-alt rounded-xl border border-border p-1 text-xs">
            <button
              type="button"
              @click="activeRoleTab = 'student'"
              :class="[
                'px-4 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5',
                activeRoleTab === 'student'
                  ? 'bg-surface text-primary shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              ]"
            >
              <IconUser class="size-4" />
              <span>Skenario Student (6 Tahap)</span>
            </button>

            <button
              type="button"
              @click="activeRoleTab = 'admin'"
              :class="[
                'px-4 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5',
                activeRoleTab === 'admin'
                  ? 'bg-surface text-primary shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              ]"
            >
              <IconShield class="size-4" />
              <span>Skenario Admin (3 Tahap)</span>
            </button>
          </div>
        </div>

        <!-- Student Testing Steps (6 Steps) -->
        <div v-if="activeRoleTab === 'student'" class="space-y-4 font-sans">
          <!-- Step 1 -->
          <div class="bg-surface border border-border rounded-2xl p-5 space-y-2 shadow-xs">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg bg-primary-light text-primary font-bold text-xs flex items-center justify-center shrink-0">1</span>
              <h3 class="font-bold text-text-primary text-base font-display">
                Tahap 1: Autentikasi & Masuk Akun Mahasiswa
              </h3>
            </div>
            <p class="text-xs text-text-secondary leading-relaxed pl-8">
              Buka rute <NuxtLink to="/login" class="text-primary hover:underline font-mono">/login</NuxtLink>, kemudian masukkan surel <code class="bg-surface-alt px-1.5 py-0.5 rounded text-primary">fadhil@test.com</code> dan kata sandi <code class="bg-surface-alt px-1.5 py-0.5 rounded text-primary">password123</code>. Sistem akan memverifikasi peran RBAC dan mengarahkan peramban secara otomatis ke Dasbor Mahasiswa.
            </p>
          </div>

          <!-- Step 2 -->
          <div class="bg-surface border border-border rounded-2xl p-5 space-y-2 shadow-xs">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg bg-primary-light text-primary font-bold text-xs flex items-center justify-center shrink-0">2</span>
              <h3 class="font-bold text-text-primary text-base font-display">
                Tahap 2: Dasbor Pembelajaran & Monitoring Progres Mandiri
              </h3>
            </div>
            <p class="text-xs text-text-secondary leading-relaxed pl-8">
              Di halaman dasbor mahasiswa (<NuxtLink to="/student/dashboard" class="text-primary hover:underline font-mono">/student/dashboard</NuxtLink>), amati ringkasan statistik capaian pembelajaran, persentase kurikulum yang sudah diselesaikan, serta kartu <em class="font-semibold">Lanjutkan Belajar</em> yang menampilkan modul aktif.
            </p>
          </div>

          <!-- Step 3 -->
          <div class="bg-surface border border-border rounded-2xl p-5 space-y-2 shadow-xs">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg bg-primary-light text-primary font-bold text-xs flex items-center justify-center shrink-0">3</span>
              <h3 class="font-bold text-text-primary text-base font-display">
                Tahap 3: Pembelajaran Kurikulum & Live Render Rumus KaTeX
              </h3>
            </div>
            <p class="text-xs text-text-secondary leading-relaxed pl-8">
              Buka Katalog Modul (<NuxtLink to="/student/modules" class="text-primary hover:underline font-mono">/student/modules</NuxtLink>), pilih modul (contoh: <em class="font-semibold">Modul 3: Rumus Matematika</em>), lalu buka bab pembelajaran. Amati keakuratan rendering notasi matematika LaTeX (rumus pecahan, akar, integral, matriks) yang diproses secara instan oleh <em class="font-semibold font-mono">KaTeX Engine</em>.
            </p>
          </div>

          <!-- Step 4 -->
          <div class="bg-surface border border-border rounded-2xl p-5 space-y-2 shadow-xs">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg bg-primary-light text-primary font-bold text-xs flex items-center justify-center shrink-0">4</span>
              <h3 class="font-bold text-text-primary text-base font-display">
                Tahap 4: Workspace Latihan Interaktif & Live PDF Compile Docker
              </h3>
            </div>
            <div class="text-xs text-text-secondary leading-relaxed pl-8 space-y-2">
              <p>
                Buka Katalog Latihan (<NuxtLink to="/student/exercises" class="text-primary hover:underline font-mono">/student/exercises</NuxtLink>) dan pilih salah satu latihan. Di halaman workspace latihan:
              </p>
              <ul class="list-disc pl-5 space-y-1">
                <li>Sunting kode LaTeX di editor <strong>CodeMirror 6</strong> (terdapat nomor baris, tab indent, & sTeX syntax highlighting).</li>
                <li>Tekan tombol <strong>"Cek Hasil / Kompilasi PDF"</strong>: Kode dikirim ke kontainer Docker TeXLive terisolasi dan menghasilkan dokumen PDF secara real-time.</li>
                <li>Tekan tombol <strong>"Kirim Jawaban"</strong>: Sistem memverifikasi kesesuaian jawaban dengan kunci solusi resmi. Jika 100% tepat, materi tuntas dan bab berikutnya terbuka.</li>
              </ul>
            </div>
          </div>

          <!-- Step 5 -->
          <div class="bg-surface border border-border rounded-2xl p-5 space-y-2 shadow-xs">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg bg-primary-light text-primary font-bold text-xs flex items-center justify-center shrink-0">5</span>
              <h3 class="font-bold text-text-primary text-base font-display">
                Tahap 5: Konsultasi Pembimbing AI ScribeTex (Google Gemini 1.5 Flash)
              </h3>
            </div>
            <p class="text-xs text-text-secondary leading-relaxed pl-8">
              Pada workspace latihan, tekan tombol pembimbing AI di sudut kanan bawah. Ketikkan pertanyaan atau tekan tombol <em class="font-semibold">Tanya AI Saat Error</em>. AI ScribeTex akan menganalisis konteks sintaks LaTeX Anda dan memberikan petunjuk perbaikan interaktif tanpa membocorkan jawaban langsung.
            </p>
          </div>

          <!-- Step 6 -->
          <div class="bg-surface border border-border rounded-2xl p-5 space-y-2 shadow-xs">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg bg-primary-light text-primary font-bold text-xs flex items-center justify-center shrink-0">6</span>
              <h3 class="font-bold text-text-primary text-base font-display">
                Tahap 6: Panduan Regulasi Tata Tulis Ilmiah Unila
              </h3>
            </div>
            <p class="text-xs text-text-secondary leading-relaxed pl-8">
              Buka Katalog Panduan (<NuxtLink to="/student/panduan" class="text-primary hover:underline font-mono">/student/panduan</NuxtLink>) dan baca artikel regulasi penulisan skripsi/karya ilmiah Universitas Lampung dengan tata letak akademik full-width yang bersih.
            </p>
          </div>
        </div>

        <!-- Admin Testing Steps (3 Steps) -->
        <div v-else class="space-y-4 font-sans">
          <!-- Admin Step 1 -->
          <div class="bg-surface border border-border rounded-2xl p-5 space-y-2 shadow-xs">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-600 font-bold text-xs flex items-center justify-center shrink-0">1</span>
              <h3 class="font-bold text-text-primary text-base font-display">
                Tahap 1: Autentikasi Admin & Monitoring Dashboard Analytics
              </h3>
            </div>
            <p class="text-xs text-text-secondary leading-relaxed pl-8">
              Masuk dengan surel <code class="bg-surface-alt px-1.5 py-0.5 rounded text-purple-600">test-admin@admin.com</code> dan kata sandi <code class="bg-surface-alt px-1.5 py-0.5 rounded text-purple-600">password123</code>. Di halaman Dasbor Admin (<NuxtLink to="/admin/dashboard" class="text-primary hover:underline font-mono">/admin/dashboard</NuxtLink>), amati metrik pengguna aktif, statistik eksekusi PDF Docker, serta grafik interaktif <em class="font-semibold">ApexCharts</em>.
            </p>
          </div>

          <!-- Admin Step 2 -->
          <div class="bg-surface border border-border rounded-2xl p-5 space-y-2 shadow-xs">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-600 font-bold text-xs flex items-center justify-center shrink-0">2</span>
              <h3 class="font-bold text-text-primary text-base font-display">
                Tahap 2: Monitoring Progres Pembelajaran Mahasiswa
              </h3>
            </div>
            <p class="text-xs text-text-secondary leading-relaxed pl-8">
              Buka Halaman Progress Siswa (<NuxtLink to="/admin/users" class="text-primary hover:underline font-mono">/admin/users</NuxtLink>). Amati daftar tabel mahasiswa, filter pencarian, serta klik tombol detail untuk melihat statistik persentase progres kurikulum, jumlah konsultasi AI, dan frekuensi kompilasi PDF mahasiswa secara individual.
            </p>
          </div>

          <!-- Admin Step 3 -->
          <div class="bg-surface border border-border rounded-2xl p-5 space-y-2 shadow-xs">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-600 font-bold text-xs flex items-center justify-center shrink-0">3</span>
              <h3 class="font-bold text-text-primary text-base font-display">
                Tahap 3: Manajemen Konten Kurikulum (CRUD & WYSIWYG Editor)
              </h3>
            </div>
            <div class="text-xs text-text-secondary leading-relaxed pl-8 space-y-2">
              <p>
                Buka Halaman Manajemen Konten (<NuxtLink to="/admin/content" class="text-primary hover:underline font-mono">/admin/content</NuxtLink>) untuk mengelola Modul, Lesson, Exercise, dan Article:
              </p>
              <ul class="list-disc pl-5 space-y-1">
                <li><strong>Editor Lesson</strong>: Menggunakan Editor WYSIWYG 3 Mode (Editor, Split, Preview) dengan action bar formatting cepat (H1, H2, Bold, Italic, Code, Block).</li>
                <li><strong>Editor Exercise</strong>: Menggunakan CodeMirror LaTeX editor untuk Starter Code vs Solution Code, serta tombol <strong>"Uji Kompilasi PDF"</strong> langsung via Docker TeXLive.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer CTA Section -->
      <section class="bg-surface border border-border rounded-2xl p-6 sm:p-8 text-center space-y-4 font-sans shadow-xs">
        <h3 class="text-xl font-bold text-text-primary font-display">
          Siap Melakukan Pengujian Aplikasi?
        </h3>
        <p class="text-xs text-text-secondary max-w-xl mx-auto leading-relaxed">
          Silakan klik tombol di bawah untuk membuka halaman login dan memulai pengujian sesuai skenario di atas.
        </p>
        <div class="flex items-center justify-center gap-3 pt-2">
          <NuxtLink to="/login" class="btn-primary btn-md gap-2 font-bold rounded-xl">
            <span>Buka Halaman Login</span>
            <IconArrowRight class="size-4" />
          </NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>
