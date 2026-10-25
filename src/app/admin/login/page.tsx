import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Staff Sign In", robots: { index: false } };

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-navy-gradient p-5">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-navy font-head text-lg font-bold text-gold-light">
            AVS
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">AVS Admin</h1>
          <p className="mt-1 text-sm text-white/60">Staff sign in</p>
        </div>
        <div className="card p-7">
          <LoginForm />
        </div>
        <p className="mt-5 text-center text-xs text-white/50">
          <Link href="/" className="hover:text-white">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
