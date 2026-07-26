<script setup lang="ts">
import { ref } from "vue";
import {
  IconMail,
  IconLock,
  IconEye,
  IconEyeOff,
  IconAlertCircle,
} from "@tabler/icons-vue";

import { ROUTES } from "~/constants/route";
import { UserRole } from "~/constants/role";

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const errorMsg = ref("");

const { login, isLoading } = useAuth();

const handleLogin = async () => {
  errorMsg.value = "";
  try {
    await login(email.value, password.value);
    const { role } = useAuth();
    if (role.value === UserRole.ADMIN) {
      navigateTo(ROUTES.admin.dashboard);
    } else {
      navigateTo(ROUTES.student.dashboard);
    }
  } catch (err: any) {
    console.error("Login error:", err);
    errorMsg.value =
      err.message ||
      "Gagal masuk. Silakan periksa kembali email dan kata sandi Anda.";
  }
};
</script>

<template>
  <form @submit.prevent="handleLogin" class="space-y-6">
    <!-- Alert Error -->
    <div
      v-if="errorMsg"
      class="bg-error-light border border-error text-error text-sm rounded-xl p-4 flex items-start gap-2.5 font-sans"
    >
      <IconAlertCircle class="size-5" />
      <span>{{ errorMsg }}</span>
    </div>

    <div class="space-y-5">
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
        placeholder="••••••••"
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
      Masuk ke Platform
    </UiButton>

    <!-- Social Login Divider -->
    <!-- <div class="relative py-2">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-border"></div>
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-surface px-4 text-text-muted font-bold tracking-widest"
          >Atau masuk dengan</span
        >
      </div>
    </div> -->

    <!-- Google Login (Mock) -->
    <!-- <button
      type="button"
      class="btn-secondary btn-lg w-full gap-3 bg-surface hover:bg-surface-alt transition-colors"
      :disabled="isLoading"
    >
      <img
        src="https://www.svgrepo.com/show/355037/google.svg"
        class="size-5"
        alt="Google"
      />
      <span>Google</span>
    </button> -->

    <!-- Register Link -->
    <p class="text-center text-sm font-sans text-text-secondary">
      Belum punya akun?
      <NuxtLink
        :to="ROUTES.register"
        class="text-primary font-bold hover:underline"
      >
        Daftar Sekarang
      </NuxtLink>
    </p>
  </form>
</template>
