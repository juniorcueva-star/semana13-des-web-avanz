import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";
import Provider from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next Auth App - Junior Cueva",
  description: "Laboratorio Semana 13: Autenticación y Seguridad con NextAuth.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <nav className="w-full bg-black text-white shadow-sm">
          <div className="mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold">
              MyAuthApp
            </Link>
            <ul className="flex items-center justify-center gap-6 text-sm">
              <li>
                <Link href="/dashboard" className="hover:text-gray-400">
                  Dashboard
                </Link>
              </li>
              {session?.user && (
                <li>
                  <Link href="/profile" className="hover:text-gray-400">
                    Profile
                  </Link>
                </li>
              )}
              {!session?.user && (
                <li>
                  <Link href="/register" className="hover:text-gray-400">
                    Registro
                  </Link>
                </li>
              )}
              {session?.user && (
                <li>
                  <LogoutButton />
                </li>
              )}
              {session?.user?.image && (
                <li>
                  <Image
                    height={100}
                    width={100}
                    src={session.user.image}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                </li>
              )}
            </ul>
          </div>
        </nav>
        <Provider>
          <main className="flex-1">{children}</main>
        </Provider>
        <footer className="w-full bg-black text-gray-300 text-center text-xs py-3">
          Desarrollado por <span className="font-semibold">Junior Cueva</span> ·
          Desarrollo de Aplicaciones Web Avanzado · Semana 13
        </footer>
      </body>
    </html>
  );
}
