import { UserService } from '../../services/user.service'

export default defineEventHandler(async (event) => {
  try {
    const users = await UserService.getAllUsers()
    
    return users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      created_at: user.created_at
    }))
  } catch (error: any) {
    console.error('Error fetching users in user service:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal mengambil data daftar pengguna'
    })
  }
})
