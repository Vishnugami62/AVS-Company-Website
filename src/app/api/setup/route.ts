import { NextResponse } from "next/server";
import { seedIfEmpty } from "@/lib/setup-seed";

export const dynamic = "force-dynamic";

/**
 * One-time production setup endpoint. Visit once after the first deploy:
 *   /api/setup?key=YOUR_SETUP_KEY
 * It is guarded by the SETUP_KEY env var and only seeds an empty database.
 */
export async function GET(req: Request) {
  const expected = process.env.SETUP_KEY;
  const key = new URL(req.url).searchParams.get("key");

  if (!expected || !key || key !== expected) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  try {
    const result = await seedIfEmpty();
    if (!result.seeded && result.reason === "missing_admin_env") {
      return NextResponse.json(
        { ok: false, error: "Set ADMIN_EMAIL and ADMIN_PASSWORD environment variables, then try again." },
        { status: 400 },
      );
    }
    if (!result.seeded) {
      return NextResponse.json({ ok: true, message: "Already set up. Nothing to do." });
    }
    return NextResponse.json({
      ok: true,
      message: "Setup complete. You can now sign in at /admin.",
      adminEmail: result.adminEmail,
      categories: result.categories,
      products: result.products,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "Setup failed.", detail: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
