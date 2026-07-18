import { createFileRoute, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useStore } from "@/lib/store";
import { Bell } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const uid = useStore.getState().currentUserId;
    if (!uid) throw redirect({ to: "/auth" });
  },
  component: AuthedLayout,
});

const titles: Record<string, string> = {
  "/dashboard": "لوحة التحكم",
  "/projects": "المشاريع",
  "/clients": "العملاء",
  "/products": "المنتجات",
  "/orders": "الطلبات",
  "/notifications": "الإشعارات",
  "/settings": "الإعدادات",
};

function AuthedLayout() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const unread = useStore((s) => s.notifications.filter((n) => !n.read).length);
  const title =
    Object.entries(titles).find(([k]) => pathname === k || pathname.startsWith(k + "/"))?.[1] ??
    "منصة عمران";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-20 h-14 flex items-center gap-3 border-b bg-card/80 backdrop-blur px-4">
            <SidebarTrigger />
            <h1 className="text-sm font-semibold">{title}</h1>
            <div className="ms-auto flex items-center gap-2">
              <Link to="/notifications" className="relative rounded-md p-2 hover:bg-accent">
                <Bell className="h-4 w-4" />
                {unread > 0 && (
                  <span className="absolute -top-0.5 -end-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">
                    {unread}
                  </span>
                )}
              </Link>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
