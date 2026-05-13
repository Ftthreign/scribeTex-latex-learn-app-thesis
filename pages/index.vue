<template>
  <main
    ref="mainRef"
    class="relative bg-background text-text-primary overflow-x-hidden font-sans"
  >
    <UiScrollProgress />
    <LandingNavbar />
    <LandingHero />
    <LandingFeatures />
    <LandingComparison />
    <LandingHowItWorks />
    <LandingFAQ />
    <LandingCTA />
    <LandingFooter />
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const mainRef = ref<HTMLElement | null>(null);

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);

  const ctx = gsap.context(() => {
    // Reveal Features
    gsap.fromTo(
      ".feature-card",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: "#features",
          start: "top 80%",
        },
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
      },
    );

    // Reveal How It Works Steps
    gsap.fromTo(
      ".step-item",
      { x: -30, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: "#how-it-works",
          start: "top 75%",
        },
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
      },
    );

    // Reveal Mockup in How It Works
    gsap.fromTo(
      ".how-it-works-mockup",
      { scale: 0.9, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        scrollTrigger: {
          trigger: "#how-it-works",
          start: "top 70%",
        },
        duration: 1.2,
        ease: "power3.out",
      },
    );

    // Reveal CTA Section
    gsap.fromTo(
      ".cta-card",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: ".cta-card",
          start: "top 85%",
        },
        duration: 1,
        ease: "power3.out",
      },
    );
  }, mainRef.value!);

  return () => ctx.revert();
});
</script>
