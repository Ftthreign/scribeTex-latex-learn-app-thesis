import { nextTick } from "vue";
import gsap from "gsap";

export const useAdminAnimations = () => {
  const isClient = typeof window !== "undefined";

  const animateAdminDashboardEntrance = () => {
    if (!isClient) return;
    nextTick(() => {
      if (!document.querySelector(".gsap-admin-header")) return;
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(
        ".gsap-admin-header",
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.5 },
      );

      tl.fromTo(
        ".gsap-admin-metric",
        { opacity: 0, y: 20, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08 },
        "-=0.3",
      );

      tl.fromTo(
        ".gsap-admin-chart",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.25",
      );

      tl.fromTo(
        ".gsap-admin-overview",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.25",
      );
    });
  };

  const animateAdminUsersEntrance = () => {
    if (!isClient) return;
    nextTick(() => {
      if (!document.querySelector(".gsap-admin-users-header")) return;
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(
        ".gsap-admin-users-header",
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.5 },
      );

      tl.fromTo(
        ".gsap-admin-users-stat",
        { opacity: 0, y: 20, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08 },
        "-=0.3",
      );

      tl.fromTo(
        ".gsap-admin-users-filter",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45 },
        "-=0.25",
      );

      tl.fromTo(
        ".gsap-admin-users-table",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.25",
      );
    });
  };

  const animateAdminContentEntrance = () => {
    if (!isClient) return;
    nextTick(() => {
      if (!document.querySelector(".gsap-admin-content-header")) return;
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(
        ".gsap-admin-content-header",
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.5 },
      );

      tl.fromTo(
        ".gsap-admin-content-tabs",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45 },
        "-=0.25",
      );

      tl.fromTo(
        ".gsap-admin-content-body",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.25",
      );
    });
  };

  return {
    animateAdminDashboardEntrance,
    animateAdminUsersEntrance,
    animateAdminContentEntrance,
  };
};
