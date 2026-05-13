<script setup lang="ts">
import { ref } from "vue";
import { IconMail, IconLock, IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-vue";

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  // TODO: Implement actual login logic with Supabase
  setTimeout(() => {
    isLoading.value = false;
  }, 1500);
};
</script>

<template>
  <form @submit.prevent="handleLogin" class="space-y-6">
    <div class="space-y-5">
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
        <div class="flex items-center justify-between">
          <label for="password" class="text-sm font-bold text-text-primary font-sans">
            Kata Sandi
          </label>
          <a href="#" class="text-xs font-bold text-primary hover:underline">Lupa Sandi?</a>
        </div>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
            <IconLock class="size-5" />
          </div>
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
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
      <span>{{ isLoading ? 'Memproses...' : 'Masuk ke Platform' }}</span>
    </button>

    <!-- Social Login Divider -->
    <div class="relative py-4">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-border"></div>
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-surface px-4 text-text-muted font-bold tracking-widest">Atau masuk dengan</span>
      </div>
    </div>

    <!-- Google Login -->
    <button
      type="button"
      class="btn-secondary btn-lg w-full gap-3 bg-surface hover:bg-surface-alt transition-colors"
    >
      <img src="https://www.svgrepo.com/show/355037/google.svg" class="size-5" alt="Google" />
      <span>Google</span>
    </button>

    <!-- Register Link -->
    <p class="text-center text-sm font-sans text-text-secondary">
      Belum punya akun?
      <NuxtLink to="/register" class="text-primary font-bold hover:underline">
        Daftar Sekarang
      </NuxtLink>
    </p>
  </form>
</template>
