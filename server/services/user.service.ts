import { prisma } from "../utils/prisma";

export class UserService {
  static async getAllUsers() {
    const users = await prisma.user.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
    return users;
  }

  static async updateUserProfile(userId: string, data: { name: string }) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
      },
    });
    return updatedUser;
  }
}
