<script setup lang="ts">
import { ref } from "vue";
import {
  IconUser,
  IconMail,
  IconLock,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-vue";

import { ROUTES } from "~/constants/route";

const name = ref("");
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const errorMsg = ref("");
const showSuccessModal = ref(false);

const { register, isLoading } = useAuth();

const handleRegister = async () => {
  errorMsg.value = "";
  try {
    await register(email.value, password.value, name.value);
    showSuccessModal.value = true;
  } catch (err: any) {
    console.error("Registration error:", err);
    const rawMessage =
      err.data?.statusMessage ||
      err.statusMessage ||
      err.message ||
      "";
    errorMsg.value =
      rawMessage.replace(/^\[.*?\]\s*".*?":\s*\d+\s*/, "") ||
      "Gagal mendaftar. Silakan coba lagi dengan data yang valid.";
  }
};

const navigateToLogin = () => {
  showSuccessModal.value = false;
  navigateTo(ROUTES.login);
};
</script>

<template>
  <form @submit.prevent="handleRegister" class="space-y-6">
    <!-- Alert Error -->
    <div
      v-if="errorMsg"
      class="bg-error-light border border-error text-error text-sm rounded-xl p-4 flex items-start gap-2.5 font-sans"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="size-5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <span>{{ errorMsg }}</span>
    </div>

    <div class="space-y-5">
      <!-- Full Name -->
      <UiInput
        id="name"
        v-model="name"
        type="text"
        label="Nama Lengkap"
        placeholder="Contoh: Fadhil Ar"
        :disabled="isLoading"
        required
      >
        <template #icon>
          <IconUser class="size-5" />
        </template>
      </UiInput>

      <!-- Email Input -->
      <UiInput
        id="email"
        v-model="email"
        type="email"
        label="Alamat Email"
        placeholder="nama@email.com"
        :disabled="isLoading"
        required
      >
        <template #icon>
          <IconMail class="size-5" />
        </template>
      </UiInput>

      <!-- Password Input -->
      <UiInput
        id="password"
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        label="Kata Sandi"
        placeholder="Min. 8 Karakter"
        :disabled="isLoading"
        required
      >
        <template #icon>
          <IconLock class="size-5" />
        </template>
        <template #right>
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          >
            <IconEye v-if="!showPassword" class="size-5" />
            <IconEyeOff v-else class="size-5" />
          </button>
        </template>
      </UiInput>
    </div>

    <!-- Submit Button -->
    <UiButton
      type="submit"
      variant="primary"
      size="lg"
      class="w-full shadow-lg shadow-primary/20"
      :loading="isLoading"
    >
      Buat Akun Sekarang
    </UiButton>

    <!-- Login Link -->
    <p class="text-center text-sm font-sans text-text-secondary">
      Sudah punya akun?
      <NuxtLink
        :to="ROUTES.login"
        class="text-primary font-bold hover:underline"
      >
        Masuk di Sini
      </NuxtLink>
    </p>

    <!-- Terms -->
    <p
      class="text-center text-[10px] text-text-muted font-sans leading-relaxed"
    >
      Dengan mendaftar, Anda menyetujui
      <a href="#" class="underline">Ketentuan Layanan</a> dan
      <a href="#" class="underline">Kebijakan Privasi</a> ScribeTex.
    </p>
  </form>

  <!-- Success Modal -->
  <UiModal
    :isOpen="showSuccessModal"
    title="Pendaftaran Berhasil"
    @close="navigateToLogin"
  >
    <p class="text-sm text-text-secondary font-sans">
      Akun Anda telah berhasil dibuat. Silakan masuk menggunakan alamat email
      dan kata sandi yang telah Anda daftarkan.
    </p>
    <template #footer>
      <button
        @click="navigateToLogin"
        class="btn-primary btn-md cursor-pointer"
      >
        OK, Masuk Sekarang
      </button>
    </template>
  </UiModal>
</template>
