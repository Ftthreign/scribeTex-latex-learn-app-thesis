<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  IconUser,
  IconLock,
  IconCheck,
  IconAlertCircle,
  IconDeviceFloppy,
} from "@tabler/icons-vue";

const { user, userProfile, updateProfile, isLoading } = useAuth();

const name = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const successMessage = ref("");
const errorMessage = ref("");

onMounted(() => {
  name.value =
    userProfile.value?.name ||
    user.value?.user_metadata?.full_name ||
    user.value?.email?.split("@")[0] ||
    "";
});

const handleSubmit = async () => {
  successMessage.value = "";
  errorMessage.value = "";

  if (!name.value.trim()) {
    errorMessage.value = "Nama lengkap tidak boleh kosong.";
    return;
  }

  if (newPassword.value) {
    if (newPassword.value.length < 6) {
      errorMessage.value = "Kata sandi baru minimal 6 karakter.";
      return;
    }
    if (newPassword.value !== confirmPassword.value) {
      errorMessage.value = "Konfirmasi kata sandi tidak cocok.";
      return;
    }
  }

  try {
    await updateProfile({
      name: name.value.trim(),
      password: newPassword.value || undefined,
    });

    successMessage.value = "Profil berhasil diperbarui!";
    newPassword.value = "";
    confirmPassword.value = "";
  } catch (err: unknown) {
    const errorObj = err as {
      data?: { statusMessage?: string };
      message?: string;
    };
    errorMessage.value =
      errorObj.data?.statusMessage ||
      errorObj.message ||
      "Gagal memperbarui profil.";
  }
};
</script>

<template>
  <div
    class="bg-(--color-surface) border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-(--shadow-card) font-sans"
  >
    <div class="space-y-1">
      <h2 class="text-lg font-bold font-display text-(--color-text-primary)">
        Edit Informasi Profil
      </h2>
      <p class="text-xs text-text-secondary">
        Perbarui nama lengkap dan kredensial kata sandi akun Anda.
      </p>
    </div>

    <!-- Feedback Alerts -->
    <div
      v-if="successMessage"
      class="flex items-center gap-3 p-4 rounded-xl bg-success-light border border-success/20 text-success text-xs font-semibold"
    >
      <IconCheck class="size-5 shrink-0" />
      <span>{{ successMessage }}</span>
    </div>

    <div
      v-if="errorMessage"
      class="flex items-center gap-3 p-4 rounded-xl bg-error-light border border-(--color-error)/20 text-(--color-error) text-xs font-semibold"
    >
      <IconAlertCircle class="size-5 shrink-0" />
      <span>{{ errorMessage }}</span>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Full Name -->
      <div class="space-y-1.5">
        <label class="block text-xs font-bold text-(--color-text-primary)">
          Nama Lengkap
        </label>
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-(--color-text-muted)"
          >
            <IconUser class="size-4" />
          </div>
          <input
            v-model="name"
            type="text"
            required
            placeholder="Masukkan nama lengkap Anda"
            class="w-full pl-10 pr-4 py-2.5 bg-surface-alt border border-border rounded-xl text-xs text-(--color-text-primary) focus:outline-none focus:border-primary focus:bg-(--color-surface) transition-all"
          />
        </div>
      </div>

      <!-- Email (Read-only) -->
      <div class="space-y-1.5">
        <label class="block text-xs font-bold text-(--color-text-primary)">
          Alamat Email (Statis)
        </label>
        <input
          :value="user?.email"
          disabled
          type="email"
          class="w-full px-4 py-2.5 bg-surface-alt/60 border border-border rounded-xl text-xs text-(--color-text-muted) cursor-not-allowed"
        />
      </div>

      <div class="pt-2 border-t border-border space-y-4">
        <p class="text-xs font-bold text-(--color-text-primary)">
          Ubah Kata Sandi (Opsional)
        </p>

        <!-- New Password -->
        <div class="space-y-1.5">
          <label class="block text-[11px] font-semibold text-text-secondary">
            Kata Sandi Baru
          </label>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-(--color-text-muted)"
            >
              <IconLock class="size-4" />
            </div>
            <input
              v-model="newPassword"
              type="password"
              placeholder="Kosongkan jika tidak ingin mengubah"
              class="w-full pl-10 pr-4 py-2.5 bg-surface-alt border border-border rounded-xl text-xs text-(--color-text-primary) focus:outline-none focus:border-primary focus:bg-(--color-surface) transition-all"
            />
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="space-y-1.5">
          <label class="block text-[11px] font-semibold text-text-secondary">
            Konfirmasi Kata Sandi Baru
          </label>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-(--color-text-muted)"
            >
              <IconLock class="size-4" />
            </div>
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="Masukkan ulang kata sandi baru"
              class="w-full pl-10 pr-4 py-2.5 bg-surface-alt border border-border rounded-xl text-xs text-(--color-text-primary) focus:outline-none focus:border-primary focus:bg-(--color-surface) transition-all"
            />
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="pt-3 flex justify-end">
        <button
          type="submit"
          :disabled="isLoading"
          class="btn-primary btn-md gap-2 font-semibold shadow-sm cursor-pointer disabled:opacity-50"
        >
          <IconDeviceFloppy class="size-4" />
          {{ isLoading ? "Menyimpan..." : "Simpan Perubahan" }}
        </button>
      </div>
    </form>
  </div>
</template>
