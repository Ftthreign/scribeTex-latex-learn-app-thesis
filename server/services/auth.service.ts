import { prisma } from "../utils/prisma";

export class AuthService {
  static async registerUser(email: string, password: string, name: string) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error(
        "Email sudah terdaftar. Silakan masuk menggunakan akun tersebut.",
      );
    }

    const uuidRes = await prisma.$queryRawUnsafe<{ uuid: string }[]>(
      "SELECT gen_random_uuid() as uuid",
    );
    const userId = uuidRes[0].uuid;

    const hashRes = await prisma.$queryRawUnsafe<{ hash: string }[]>(
      "SELECT crypt($1, gen_salt('bf', 8)) as hash",
      password,
    );
    const hashedPassword = hashRes[0].hash;

    await prisma.$executeRawUnsafe(
      `
      INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, 
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
        created_at, updated_at, phone, phone_confirmed_at, confirmation_token, recovery_token, email_change_token_new, email_change
      ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        $1::uuid,
        'authenticated',
        'authenticated',
        $2,
        $3,
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        json_build_object('full_name', $4::text)::jsonb,
        now(),
        now(),
        NULL,
        NULL,
        '',
        '',
        '',
        ''
      )
    `,
      userId,
      email,
      hashedPassword,
      name,
    );

    const dbUser = await prisma.user.create({
      data: {
        id: userId,
        email,
        name,
        role: "STUDENT",
      },
    });

    return dbUser;
  }

  static async syncUserSession(
    supabaseId: string,
    email: string,
    name: string,
  ) {
    let dbUser = await prisma.user.findUnique({
      where: { id: supabaseId },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: supabaseId,
          email,
          name,
          role: "STUDENT", // Default role
        },
      });
    }

    return dbUser;
  }
}
