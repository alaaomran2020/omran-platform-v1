import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Boxes, Users, ShoppingBag, Package, Bell, Settings as SettingsIcon,
  LogOut, Sparkles, LayoutTemplate, Image as ImageIcon, ShieldCheck,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { useStore, useCurrentUser } from "@/lib/store";

const items = [
  { title: "لوحة التحكم", url: "/dashboard", icon: LayoutDashboard },
  { title: "المشاريع", url: "/projects", icon: Boxes },
  { title: "القوالب", url: "/templates", icon: LayoutTemplate },
  { title: "مكتبة الملفات", url: "/media", icon: ImageIcon },
  { title: "العملاء", url: "/clients", icon: Users },
  { title: "المنتجات", url: "/products", icon: Package },
  { title: "الطلبات", url: "/orders", icon: ShoppingBag },
  { title: "الإشعارات", url: "/notifications", icon: Bell },
  { title: "الإعدادات", url: "/settings", icon: SettingsIcon },
];
const adminItem = { title: "لوحة الإدارة", url: "/admin", icon: ShieldCheck };

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const logout = useStore((s) => s.logout);
  const user = useCurrentUser();
  const notifCount = useStore((s) => s.notifications.filter((n) => !n.read).length);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate({ to: "/auth" }); };

  return (
    <Sidebar collapsible="icon" side="right">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant">
            <Sparkles className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-sm font-bold">منصة عمران</div>
              <div className="truncate text-xs text-muted-foreground">{user?.workspaceName ?? "مساحة العمل"}</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>القائمة</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url || pathname.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span className="flex-1">{item.title}</span>}
                        {!collapsed && item.url === "/notifications" && notifCount > 0 && (
                          <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground">{notifCount}</span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              {user?.isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === adminItem.url}>
                    <Link to={adminItem.url} className="flex items-center gap-2">
                      <adminItem.icon className="h-4 w-4 text-primary" />
                      {!collapsed && <span className="flex-1 font-semibold">{adminItem.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2">
          {!collapsed && user && (
            <div className="mb-2 rounded-lg bg-sidebar-accent p-2 text-xs">
              <div className="font-medium">{user.name}</div>
              <div className="truncate text-muted-foreground">{user.email}</div>
            </div>
          )}
          <SidebarMenuButton onClick={handleLogout} className="text-destructive">
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>تسجيل الخروج</span>}
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
