'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const inputClass =
  'w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? 'No se pudo registrar.');
      setLoading(false);
      return;
    }

    // Registro correcto: iniciar sesión automáticamente
    const result = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (result?.ok && !result.error) {
      router.push('/dashboard');
      router.refresh();
    } else {
      router.push('/signIn');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl text-gray-800 font-bold mb-6 text-center">Crear cuenta</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className={inputClass}
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            placeholder="Contraseña (mín. 8, letras y números)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <input
            className={inputClass}
            type="password"
            placeholder="Confirmar contraseña"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-700 transition disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-4">
          ¿Ya tienes cuenta?{' '}
          <Link href="/signIn" className="font-semibold text-gray-900 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
