# Semana 13 – Autenticación y Seguridad con NextAuth.js

**Autor:** Junior Cueva
**Curso:** Desarrollo de Aplicaciones Web Avanzado – 5C24

Aplicación Next.js 16 (App Router, TypeScript, Tailwind) con autenticación mediante NextAuth.js v4.

## Funcionalidades

| Requerimiento | Implementación |
| --- | --- |
| Login con Google (laboratorio) | `GoogleProvider` en `src/lib/auth.ts` |
| Protección de rutas | `src/proxy.ts` (en Next 16 `middleware.ts` se llama `proxy.ts`) protege `/dashboard` y `/profile` |
| Login con credenciales | `CredentialsProvider` en `src/lib/auth.ts` |
| Formulario de registro | `src/app/register/page.tsx` + API `src/app/api/register/route.ts` |
| Bloqueo tras varios intentos | 3 intentos fallidos ⇒ cuenta bloqueada 5 minutos (`src/lib/security.ts`) |
| Cifrado con bcrypt | `bcryptjs` (`hash` al registrar, `compare` al iniciar sesión) |
| Login con GitHub | `GitHubProvider` en `src/lib/auth.ts` |

Los usuarios y los intentos fallidos se guardan en **Upstash Redis** cuando existen las variables
`KV_REST_API_URL` / `KV_REST_API_TOKEN` (Vercel). En local, sin esas variables, se guardan en memoria.

## Ejecutar en local

```bash
npm install
cp .env.example .env.local   # completar los valores
npm run dev
```

Abrir http://localhost:3000

## Variables de entorno

Ver `.env.example`. **Nunca** subir `.env.local` al repositorio.
