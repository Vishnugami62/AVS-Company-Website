import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireStaff, initials } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const staff = await requireStaff();
  const waiting = await prisma.deliveryRequest.count({ where: { status: "WAITING" } });

  return (
    <div className="min-h-screen bg-cream lg:grid lg:grid-cols-[264px_1fr]">
      <aside className="flex flex-col bg-navy-gradient p-5 lg:min-h-screen">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy font-head text-sm font-bold text-gold-light">
            AVS
          </span>
          <span>
            <span className="block font-head text-base font-bold text-white">AVS Admin</span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-gold-light">
              Staff only
            </span>
          </span>
        </Link>

        <div className="mt-6 flex-1">
          <AdminNav waiting={waiting} />
        </div>

        <div className="mt-6 border-t border-white/10 pt-4">
          <div className="mb-3 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-gradient text-sm font-bold text-navy-deep">
              {initials(staff.name)}
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold text-white">{staff.name}</span>
              <span className="block text-xs capitalize text-white/50">{staff.role.toLowerCase()}</span>
            </span>
          </div>
          <LogoutButton />
        </div>
      </aside>

      <div className="min-w-0">
        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
