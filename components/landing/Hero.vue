<script setup lang="ts">
import { ref, onMounted } from "vue";
import gsap from "gsap";
import HeroGrid from "./hero/HeroGrid.vue";
import HeroContent from "./hero/HeroContent.vue";
import HeroMockup from "./hero/HeroMockup.vue";

function playEntryAnimations() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReducedMotion) {
    gsap.set(".hero-el", { opacity: 1, y: 0 });
    gsap.set(".hero-mockup", { opacity: 1, scale: 1 });
    gsap.set(".floating-badge", { opacity: 1 });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.fromTo(
    ".hero-el",
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 },
  )
    .fromTo(
      ".hero-mockup",
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.6 },
      0.2,
    )
    .fromTo(
      ".floating-badge",
      { opacity: 0 },
      { opacity: 1, stagger: 0.15, duration: 0.4 },
      0.6,
    );
}

onMounted(() => {
  playEntryAnimations();
});
</script>

<template>
  <section
    ref="heroRef"
    class="hero-section relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden"
    aria-label="Hero section ScribeTex"
  >
    <HeroGrid />

    <div
      class="absolute top-0 right-0 z-0 w-2/3 h-full bg-linear-to-l from-primary/6 to-transparent blur-[140px] opacity-50 pointer-events-none"
    />
    <div
      class="absolute -top-40 -left-40 z-0 size-[400px] md:size-[600px] bg-primary/4 rounded-full blur-[120px] pointer-events-none"
    />

    <div class="container mx-auto px-6 relative z-10">
      <div class="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div class="lg:col-span-6 order-2 lg:order-1">
          <HeroContent />
        </div>
        <HeroMockup class="lg:col-span-6" />
      </div>
    </div>
  </section>
</template>
