<script setup lang="ts">
definePageMeta({
  layout: "default",
});
useHead({
  title: "Edit Profil | ScribeTex",
});
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-8 pb-12">
    <ProfileHeader />

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div class="lg:col-span-8">
        <ProfileForm />
      </div>

      <div class="lg:col-span-4">
        <ProfileAccountCard />
      </div>
    </div>
  </div>
</template>
