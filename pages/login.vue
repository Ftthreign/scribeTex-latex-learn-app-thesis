<script setup lang="ts">
import AuthLayout from "~/components/auth/AuthLayout.vue";
import LoginForm from "~/components/auth/LoginForm.vue";

definePageMeta({
  layout: false,
});

useHead({
  title: "Masuk ke ScribeTex | Platform Belajar LaTeX",
});
</script>

<template>
  <AuthLayout
    title="Selamat Datang Kembali"
    subtitle="Masuk untuk melanjutkan perjalanan belajar LaTeX Anda."
  >
    <LoginForm />
  </AuthLayout>
</template>
