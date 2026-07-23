import { serverSupabaseUser } from "#supabase/server";
import { prisma } from "../utils/prisma";
import { UserRole } from "../../constants/role";

export default defineEventHandler(async (event) => {
  const path = event.node.req.url || "";

  if (path.startsWith("/api/admin/")) {
    const supabaseUser = await serverSupabaseUser(event);

    if (!supabaseUser) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized: Session required",
      });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: supabaseUser.id },
    });

    if (!dbUser || dbUser.role !== UserRole.ADMIN) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden: Admin privilege required",
      });
    }
  }

  if (path.startsWith("/api/student/")) {
    const supabaseUser = await serverSupabaseUser(event);

    if (!supabaseUser) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized: Session required",
      });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: supabaseUser.id },
    });

    if (!dbUser || dbUser.role !== UserRole.STUDENT) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden: Student privilege required",
      });
    }
  }
});
