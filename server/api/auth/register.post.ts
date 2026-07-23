import { AuthService } from '../../services/auth.service'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, name } = body

  if (!email || !password || !name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Semua field (nama, email, password) wajib diisi'
    })
  }

  if (password.length < 8) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Kata sandi minimal harus 8 karakter'
    })
  }

  try {
    const dbUser = await AuthService.registerUser(email, password, name)

    return {
      success: true,
      message: 'Registrasi berhasil',
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role
      }
    }
  } catch (error: any) {
    console.error('Error during direct registration bypass:', error)
    throw createError({
      statusCode: 400,
      statusMessage: error.message || 'Terjadi kesalahan sistem saat memproses registrasi'
    })
  }
})
