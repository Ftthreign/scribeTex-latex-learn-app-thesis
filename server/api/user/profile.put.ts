import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
import { UserService } from "../../services/user.service";

export default defineEventHandler(async (event) => {
  const supabaseUser = await serverSupabaseUser(event);

  if (!supabaseUser) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized: Sesi tidak ditemukan",
    });
  }

  const body = await readBody(event);
  const { name, password } = body || {};

  if (!name || typeof name !== "string" || !name.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: "Nama lengkap wajib diisi",
    });
  }

  try {
    const supabase = await serverSupabaseClient(event);

    const updateAttributes: any = {
      data: { full_name: name.trim() },
    };

    if (password && typeof password === "string" && password.length >= 6) {
      updateAttributes.password = password;
    }

    const { error: supabaseError } =
      await supabase.auth.updateUser(updateAttributes);

    if (supabaseError) {
      throw createError({
        statusCode: 400,
        statusMessage:
          supabaseError.message || "Gagal memperbarui data autentikasi",
      });
    }

    // Update local database record via Prisma
    const updatedUser = await UserService.updateUserProfile(supabaseUser.id, {
      name: name.trim(),
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      updated_at: updatedUser.updated_at,
    };
  } catch (err: any) {
    console.error("Profile update error:", err);
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || "Gagal memperbarui profil pengguna",
    });
  }
});
