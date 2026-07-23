export const ROUTES = {
  landing: "/",
  login: "/login",
  register: "/register",
  student: {
    dashboard: "/student/dashboard",
    modules: "/modules",
    articles: "/articles",
    progress: "/progress",
    help: "/help",
    sandbox: "/sandbox",
    profile: "/student/profile",
  },
  admin: {
    dashboard: "/admin/dashboard",
    modules: "/admin/modules",
    articles: "/admin/articles",
    users: "/admin/users",
    help: "/help",
    profile: "/admin/profile",
  },
} as const;

export const PUBLIC_ROUTES: string[] = [
  ROUTES.landing,
  ROUTES.login,
  ROUTES.register,
];
