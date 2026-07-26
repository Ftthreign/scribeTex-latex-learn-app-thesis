import { ROUTES, PUBLIC_ROUTES } from "~/constants/route";
import { UserRole } from "~/constants/role";

export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser();
  const { role, syncSession } = useAuth();

  const isPublicPath = PUBLIC_ROUTES.includes(to.path) || to.meta.auth === false;

  if (user.value && !role.value) {
    try {
      await syncSession();
    } catch (err) {
      console.error("Session sync failed on navigation:", err);
      const supabase = useSupabaseClient();
      await supabase.auth.signOut();
      return navigateTo(ROUTES.login);
    }
  }

  if (!user.value && !isPublicPath) {
    return navigateTo(ROUTES.login);
  }

  if (user.value && (to.path === ROUTES.login || to.path === ROUTES.register)) {
    if (role.value === UserRole.ADMIN) {
      return navigateTo(ROUTES.admin.dashboard);
    }
    return navigateTo(ROUTES.student.dashboard);
  }

  // Extra guard: If user tries to access /admin routes but is not ADMIN
  if (to.path.startsWith("/admin") && role.value !== UserRole.ADMIN) {
    return navigateTo(ROUTES.student.dashboard);
  }
});
