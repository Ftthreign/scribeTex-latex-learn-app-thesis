<script setup lang="ts">
definePageMeta({
  middleware: [
    function () {
      return navigateTo('/student/modules')
    },
  ],
})
</script>

<template>
  <div></div>
</template>
