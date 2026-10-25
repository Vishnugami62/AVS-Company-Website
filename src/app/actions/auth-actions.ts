"use server";

import { prisma } from "@/lib/db";
import { loginSchema, firstError } from "@/lib/validation";
import { verifyPassword, createSession, destroySession } from "@/lib/auth";
import { rateLimit, getClientIp, assertSameOrigin } from "@/lib/security";

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function login(input: unknown): Promise<LoginResult> {
  try {
    await assertSameOrigin();
    const ip = await getClientIp();
    if (!rateLimit(`login:${ip}`, 8, 10 * 60 * 1000).ok) {
      return { ok: false, error: "Too many attempts. Please wait a few minutes and try again." };
    }

    const parsed = loginSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
    const { email, password } = parsed.data;

    const staff = await prisma.staff.findUnique({ where: { email: email.toLowerCase() } });
    // Constant-ish response time and identical message whether or not the email
    // exists, to avoid revealing which emails are registered.
    const genericError = "Email or password is incorrect.";
    if (!staff || !staff.active) {
      await verifyPassword(password, "$2a$12$abcdefghijklmnopqrstuv0123456789012345678901234567890");
      return { ok: false, error: genericError };
    }

    const valid = await verifyPassword(password, staff.passwordHash);
    if (!valid) return { ok: false, error: genericError };

    await createSession(staff.id);
    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export async function logout(): Promise<void> {
  await destroySession();
}
