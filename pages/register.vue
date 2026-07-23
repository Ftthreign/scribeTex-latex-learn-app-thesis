<script setup lang="ts">
import AuthLayout from "~/components/auth/AuthLayout.vue";
import RegisterForm from "~/components/auth/RegisterForm.vue";

definePageMeta({
  layout: false,
});

useHead({
  title: "Daftar Akun ScribeTex | Mulai Belajar LaTeX",
});
</script>

<template>
  <AuthLayout
    title="Mulai Perjalanan Anda"
    subtitle="Buat akun gratis dan kuasai penulisan ilmiah standar dunia."
  >
    <RegisterForm />
  </AuthLayout>
</template>
