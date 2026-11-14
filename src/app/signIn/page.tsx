'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaGoogle } from 'react-icons/fa';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl text-gray-800 font-bold mb-6 text-center">Sign In</h1>

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
            className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-black transition flex items-center justify-center gap-2"
          >
            <FaGoogle />
            Continue with Google
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
