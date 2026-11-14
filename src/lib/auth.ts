import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./store";
import {
  getLockRemainingMinutes,
  normalizeEmail,
  registerFailedAttempt,
  resetAttempts,
} from "./security";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Ingresa tu email y contraseña.");
        }
        const email = normalizeEmail(credentials.email);

        // 1. ¿La cuenta está bloqueada por demasiados intentos?
        const lockedMinutes = await getLockRemainingMinutes(email);
        if (lockedMinutes) {
          throw new Error(
            `Cuenta bloqueada por demasiados intentos fallidos. Intenta de nuevo en ${lockedMinutes} minuto(s).`
          );
        }

        // 2. Verificar usuario y contraseña cifrada con bcrypt
        const user = await getUserByEmail(email);
        const valid = user
          ? await bcrypt.compare(credentials.password, user.passwordHash)
          : false;

        if (!user || !valid) {
          const remaining = await registerFailedAttempt(email);
          if (remaining === 0) {
            throw new Error(
              "Has superado el número de intentos. Tu cuenta quedó bloqueada temporalmente."
            );
          }
          throw new Error(`Credenciales incorrectas. Te quedan ${remaining} intento(s).`);
        }

        // 3. Login correcto: se reinicia el contador de intentos
        await resetAttempts(email);
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signIn",
  },
};
