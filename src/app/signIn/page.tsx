'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

const inputClass =
  'w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    const result = await signIn('google', {
      callbackUrl: '/dashboard',
      redirect: false,
    });

    if (result?.ok) {
      router.push('/dashboard');
    }
  };

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    setLoading(false);

    if (result?.ok && !result.error) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setError(result?.error ?? 'No se pudo iniciar sesión.');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12">
      {/* ===== Lado Google (claro) ===== */}
      <div className="absolute inset-0 bg-white">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#4285F4] opacity-30 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 h-56 w-56 rounded-full bg-[#EA4335] opacity-25 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#FBBC05] opacity-30 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-[#34A853] opacity-25 blur-3xl" />
        <FcGoogle className="absolute left-[6%] top-1/2 -translate-y-1/2 text-[18rem] opacity-15 -rotate-12 hidden md:block" />
        <span className="absolute left-8 bottom-8 text-sm font-semibold tracking-widest text-gray-400 uppercase hidden md:block">
          Google
        </span>
      </div>

      {/* ===== Lado GitHub (oscuro, cortado en diagonal) ===== */}
      <div
        className="absolute inset-0 bg-[#0d1117] [clip-path:polygon(62%_0,100%_0,100%_100%,38%_100%)]"
      >
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(#8b949e_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="absolute top-1/4 right-[8%] h-80 w-80 rounded-full bg-[#8957e5] opacity-30 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-[#2ea043] opacity-25 blur-3xl" />
        <FaGithub className="absolute right-[6%] top-1/2 -translate-y-1/2 text-[18rem] text-white opacity-10 rotate-12 hidden md:block" />
        <span className="absolute right-8 top-8 text-sm font-semibold tracking-widest text-gray-500 uppercase hidden md:block">
          GitHub
        </span>
      </div>

      {/* ===== Tarjeta ===== */}
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-white/40 bg-white/80 p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 flex h-1.5">
          <span className="flex-1 bg-[#4285F4]" />
          <span className="flex-1 bg-[#EA4335]" />
          <span className="flex-1 bg-[#FBBC05]" />
          <span className="flex-1 bg-[#34A853]" />
          <span className="flex-[2] bg-[#0d1117]" />
        </div>

        <h1 className="text-2xl text-gray-800 font-bold mb-1 text-center">Sign In</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Accede con tu cuenta o con un proveedor</p>

        <form onSubmit={handleCredentialsSignIn} className="flex flex-col gap-3">
          <input
            className={inputClass}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className={inputClass}
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-700 transition disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="flex items-center gap-2 my-4 text-gray-400 text-sm">
          <hr className="flex-1" /> o <hr className="flex-1" />
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition flex items-center justify-center gap-2 font-medium"
          >
            <FcGoogle className="text-lg" />
            Continue with Google
          </button>
          <button
            onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
            className="w-full bg-[#0d1117] text-white py-2 px-4 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-[#161b22] transition flex items-center justify-center gap-2 font-medium"
          >
            <FaGithub className="text-lg" />
            Continue with GitHub
          </button>
        </div>

        <p className="text-sm text-gray-600 text-center mt-4">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="font-semibold text-gray-900 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
