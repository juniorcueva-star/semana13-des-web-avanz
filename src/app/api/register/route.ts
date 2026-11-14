import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createUser } from "@/lib/store";
import { normalizeEmail } from "@/lib/security";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { name?: string; email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = normalizeEmail(body.email ?? "");
  const password = body.password ?? "";

  if (name.length < 2 || name.length > 50) {
    return NextResponse.json(
      { error: "El nombre debe tener entre 2 y 50 caracteres." },
      { status: 400 }
    );
  }
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Email inválido." }, { status: 400 });
  }
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return NextResponse.json(
      { error: "La contraseña debe tener al menos 8 caracteres, con letras y números." },
      { status: 400 }
    );
  }

  // Cifrado de la contraseña con bcrypt (10 rondas de salt)
  const passwordHash = await bcrypt.hash(password, 10);

  const created = await createUser({
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  });

  if (!created) {
    return NextResponse.json({ error: "Ese email ya está registrado." }, { status: 409 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
