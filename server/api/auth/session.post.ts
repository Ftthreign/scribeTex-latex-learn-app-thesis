import { serverSupabaseUser } from '#supabase/server'
import { AuthService } from '../../services/auth.service'

export default defineEventHandler(async (event) => {
   const supabaseUser = await serverSupabaseUser(event)
   
   if (!supabaseUser) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: No active session'
    })
  }

  // Parse request body for name (optional)
  const body = await readBody(event).catch(() => ({}))
  const name = body?.name || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User'

  try {
    const dbUser = await AuthService.syncUserSession(
      supabaseUser.id,
      supabaseUser.email!,
      name
    )

    // Return complete profile to client
    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
      created_at: dbUser.created_at
    }
  } catch (error: any) {
    console.error('Error syncing session in auth service:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal menyelaraskan sesi pengguna dengan database lokal'
    })
  }
})
