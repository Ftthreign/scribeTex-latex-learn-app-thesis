import { storeToRefs } from "pinia";
import { useAuthStore } from "~/stores/auth";

export const useAuth = () => {
  const authStore = useAuthStore();
  const { user, role, userProfile, isLoading, isAuthenticated, isAdmin } =
    storeToRefs(authStore);

  return {
    user,
    role,
    userProfile,
    isLoading,
    isAuthenticated,
    isAdmin,
    login: authStore.login,
    register: authStore.register,
    logout: authStore.logout,
    syncSession: authStore.syncSession,
    updateProfile: authStore.updateProfile,
  };
};

