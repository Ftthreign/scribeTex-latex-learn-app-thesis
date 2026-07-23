export const API_ENDPOINTS = {
  auth: {
    register: "/api/auth/register",
    session: "/api/auth/session",
  },
  user: {
    profile: "/api/user/profile",
  },
  admin: {
    users: "/api/admin/users",
  },
} as const;
