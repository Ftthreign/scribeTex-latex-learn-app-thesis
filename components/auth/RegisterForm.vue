<script setup lang="ts">
import { ref } from "vue";
import { IconUser, IconMail, IconLock, IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-vue";

const name = ref("");
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const isLoading = ref(false);

const handleRegister = async () => {
  isLoading.value = true;
  // TODO: Implement actual register logic with Supabase
  setTimeout(() => {
    isLoading.value = false;
  }, 1500);
};
</script>

<template>
  <form @submit.prevent="handleRegister" class="space-y-6">
    <div class="space-y-5">
      <!-- Full Name -->
      <div class="space-y-2">
        <label for="name" class="text-sm font-bold text-text-primary font-sans">
          Nama Lengkap
        </label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
            <IconUser class="size-5" />
          </div>
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Contoh: Fadhil Ar"
            class="w-full bg-surface-alt border border-border rounded-xl py-3.5 pl-12 pr-4 text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-sans"
            required
          />
        </div>
      </div>

      <!-- Email Input -->
      <div class="space-y-2">
        <label for="email" class="text-sm font-bold text-text-primary font-sans">
          Alamat Email
        </label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
            <IconMail class="size-5" />
          </div>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="nama@email.com"
            class="w-full bg-surface-alt border border-border rounded-xl py-3.5 pl-12 pr-4 text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-sans"
            required
          />
        </div>
      </div>

      <!-- Password Input -->
      <div class="space-y-2">
        <label for="password" class="text-sm font-bold text-text-primary font-sans">
          Kata Sandi
        </label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
            <IconLock class="size-5" />
          </div>
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Min. 8 Karakter"
            class="w-full bg-surface-alt border border-border rounded-xl py-3.5 pl-12 pr-12 text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-sans"
            required
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-text-primary transition-colors"
          >
            <IconEye v-if="!showPassword" class="size-5" />
            <IconEyeOff v-else class="size-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      :disabled="isLoading"
      class="btn-primary btn-lg w-full shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
    >
      <IconLoader2 v-if="isLoading" class="size-5 animate-spin" />
      <span>{{ isLoading ? 'Mendaftar...' : 'Buat Akun Sekarang' }}</span>
    </button>

    <!-- Login Link -->
    <p class="text-center text-sm font-sans text-text-secondary">
      Sudah punya akun?
      <NuxtLink to="/login" class="text-primary font-bold hover:underline">
        Masuk di Sini
      </NuxtLink>
    </p>

    <!-- Terms -->
    <p class="text-center text-[10px] text-text-muted font-sans leading-relaxed">
      Dengan mendaftar, Anda menyetujui <a href="#" class="underline">Ketentuan Layanan</a> dan <a href="#" class="underline">Kebijakan Privasi</a> ScribeTex.
    </p>
  </form>
</template>
