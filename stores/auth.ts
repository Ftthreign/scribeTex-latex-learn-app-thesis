import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { API_ENDPOINTS } from "~/constants/api";
import { ROUTES } from "~/constants/route";

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: string;
  created_at?: string;
  updated_at?: string;
}

export const useAuthStore = defineStore("auth", () => {
  const supabase = useSupabaseClient();
  const supabaseUser = useSupabaseUser();

  const role = ref<string | null>(null);
  const userProfile = ref<UserProfile | null>(null);
  const isLoading = ref<boolean>(false);

  const user = computed(() => supabaseUser.value);
  const isAuthenticated = computed(() => !!supabaseUser.value);
  const isAdmin = computed(() => role.value === "ADMIN");

  const syncSession = async (name?: string) => {
    if (!supabaseUser.value) {
      role.value = null;
      userProfile.value = null;
      return;
    }

    isLoading.value = true;
    try {
      const data = await $fetch<UserProfile>(API_ENDPOINTS.auth.session, {
        method: "POST",
        headers: useRequestHeaders(["cookie"]) as Record<string, string>,
        body: {
          name: name || supabaseUser.value.user_metadata?.full_name || "",
        },
      });
      if (data) {
        role.value = data.role;
        userProfile.value = data;
      }
    } catch (err) {
      console.error("Failed to sync session with PostgreSQL:", err);
      role.value = null;
      userProfile.value = null;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (email: string, password: string) => {
    isLoading.value = true;
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      await syncSession();
    } catch (err) {
      isLoading.value = false;
      throw err;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    isLoading.value = true;
    try {
      await $fetch(API_ENDPOINTS.auth.register, {
        method: "POST",
        body: {
          email,
          password,
          name,
        },
      });
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    isLoading.value = true;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      role.value = null;
      userProfile.value = null;

      navigateTo(ROUTES.login);
    } catch (err) {
      console.error("Failed to sign out:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const updateProfile = async (payload: {
    name: string;
    password?: string;
  }) => {
    isLoading.value = true;
    try {
      const data = await $fetch<UserProfile>(API_ENDPOINTS.user.profile, {
        method: "PUT",
        body: payload,
      });
      await syncSession(payload.name);
      return data;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    user,
    role,
    userProfile,
    isLoading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    syncSession,
    updateProfile,
  };
});
