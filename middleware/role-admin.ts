import { ROUTES } from "~/constants/route";
import { UserRole } from "~/constants/role";

export default defineNuxtRouteMiddleware((to) => {
  const { role } = useAuth()

  // Guard: If role is not ADMIN, redirect to student dashboard
  if (role.value !== UserRole.ADMIN) {
    return navigateTo(ROUTES.student.dashboard)
  }
})
