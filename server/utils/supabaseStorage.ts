import type { SupabaseClient } from "@supabase/supabase-js";

export async function uploadExercisePdfToSupabase(
  supabase: SupabaseClient,
  userId: string,
  exerciseId: number,
  pdfBase64: string,
): Promise<string | null> {
  if (!pdfBase64 || typeof pdfBase64 !== "string") {
    console.warn("[SupabaseStorage] pdfBase64 kosong atau tidak valid.");
    return null;
  }

  try {
    const cleanBase64 = pdfBase64
      .replace(/^data:application\/pdf;base64,/, "")
      .trim();
    const buffer = Buffer.from(cleanBase64, "base64");

    const bucketName = "file_submission_siswa";
    const fileName = `user_${userId}/exercise_${exerciseId}_${Date.now()}.pdf`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (error) {
      console.error(
        "[SupabaseStorage] Gagal mengunggah berkas PDF:",
        error.message,
      );
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    const publicUrl = publicUrlData?.publicUrl || null;
    console.log("[SupabaseStorage] Berkas PDF berhasil diunggah:", publicUrl);
    return publicUrl;
  } catch (err: any) {
    console.error(
      "[SupabaseStorage] Error saat memproses unggahan PDF ke Supabase Storage:",
      err,
    );
    return null;
  }
}
