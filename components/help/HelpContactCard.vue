<script setup lang="ts">
import { IconMail } from "@tabler/icons-vue";
</script>

<template>
  <div
    class="max-w-3xl mx-auto mt-12 p-6 bg-linear-to-br from-surface to-surface-alt border border-border rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6"
  >
    <div class="space-y-1.5 text-center sm:text-left">
      <h3 class="text-[15px] font-bold text-text-primary font-display">
        Masih Butuh Bantuan Lain?
      </h3>
      <p class="text-xs sm:text-sm text-text-secondary font-sans leading-relaxed max-w-lg">
        Jika Anda mengalami kegagalan sistem, kendala akun, atau menemukan bug pada editor LaTeX, hubungi tim administrasi kami melalui email.
      </p>
    </div>

    <a
      href="mailto:admin@scribetex.ac.id?subject=Kendala%20Sistem%20ScribeTex"
      class="btn-primary btn-md gap-2 shrink-0 font-sans shadow-sm"
    >
      <IconMail class="size-4 shrink-0" />
      Hubungi Admin
    </a>
  </div>
</template>
