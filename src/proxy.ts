// En Next.js 16 el archivo `middleware.ts` fue renombrado a `proxy.ts`.
// Usamos withAuth de NextAuth para proteger las rutas privadas.
import { withAuth } from "next-auth/middleware";

export const proxy = withAuth({
  pages: { signIn: "/signIn" },
});

export const config = { matcher: ["/dashboard", "/profile"] };
