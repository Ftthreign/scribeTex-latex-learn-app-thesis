import { nextTick } from "vue";
import gsap from "gsap";

export const useStudentAnimations = () => {
  const isClient = typeof window !== "undefined";

  const animateDashboardEntrance = () => {
    if (!isClient) return;
    nextTick(() => {
      if (!document.querySelector(".gsap-header")) return;
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(
        ".gsap-header",
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.5 },
      );

      tl.fromTo(
        ".gsap-stat-card",
        { opacity: 0, y: 20, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08 },
        "-=0.3",
      );

      tl.fromTo(
        ".gsap-learning-card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.55 },
        "-=0.25",
      );

      tl.fromTo(
        ".gsap-assignment-section",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.25",
      );

      tl.fromTo(
        ".gsap-analytics-section",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.25",
      );

      tl.fromTo(
        ".gsap-article-section",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.25",
      );
    });
  };

  const animateModulesIndexEntrance = () => {
    if (!isClient) return;
    nextTick(() => {
      if (!document.querySelector(".gsap-modules-header")) return;
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(
        ".gsap-modules-header",
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.5 },
      );

      tl.fromTo(
        ".gsap-module-card",
        { opacity: 0, y: 20, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08 },
        "-=0.3",
      );
    });
  };

  const animateModuleDetailEntrance = () => {
    if (!isClient) return;
    nextTick(() => {
      if (!document.querySelector(".gsap-module-detail-header")) return;
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(
        ".gsap-module-detail-header",
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.5 },
      );

      tl.fromTo(
        ".gsap-lesson-item",
        { opacity: 0, x: -15 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.07 },
        "-=0.25",
      );
    });
  };

  const animateExercisesIndexEntrance = () => {
    if (!isClient) return;
    nextTick(() => {
      if (!document.querySelector(".gsap-exercises-header")) return;
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(
        ".gsap-exercises-header",
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.5 },
      );

      tl.fromTo(
        ".gsap-exercise-card",
        { opacity: 0, y: 20, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08 },
        "-=0.3",
      );
    });
  };

  const animateExerciseDetailEntrance = () => {
    if (!isClient) return;
    nextTick(() => {
      if (!document.querySelector(".gsap-exercise-header")) return;
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(
        ".gsap-exercise-header",
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.5 },
      );

      tl.fromTo(
        ".gsap-exercise-workspace",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.25",
      );
    });
  };

  return {
    animateDashboardEntrance,
    animateModulesIndexEntrance,
    animateModuleDetailEntrance,
    animateExercisesIndexEntrance,
    animateExerciseDetailEntrance,
  };
};
