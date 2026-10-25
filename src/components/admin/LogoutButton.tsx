"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth-actions";

export function LogoutButton() {
  const router = useRouter();
  async function doLogout() {
    await logout();
    router.replace("/admin/login");
    router.refresh();
  }
  return (
    <button
      onClick={doLogout}
      className="flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white"
    >
      <LogOut className="h-4 w-4" /> Sign out
    </button>
  );
}
