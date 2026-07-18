import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

export const Route = createFileRoute("/_authenticated/notifications")({ component: NotificationsPage });

const KIND_LABEL = { project: "مشروع", order: "طلب", system: "نظام" } as const;

function NotificationsPage() {
  const notifications = useStore((s) => s.notifications);
  const markAllRead = useStore((s) => s.markAllRead);
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">الإشعارات</h2>
          <p className="text-sm text-muted-foreground">تحديثات المشاريع والطلبات والنظام.</p>
        </div>
        <Button variant="outline" onClick={markAllRead}>تعليم الكل كمقروء</Button>
      </div>
      <Card className="shadow-card">
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              <Bell className="mx-auto mb-3 h-8 w-8 opacity-40" />
              لا توجد إشعارات.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {notifications.map((n) => (
                <li key={n.id} className={`p-4 flex items-start gap-3 ${!n.read ? "bg-primary/5" : ""}`}>
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-muted-foreground/30" : "bg-primary"}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs rounded-full bg-muted px-2 py-0.5">{KIND_LABEL[n.kind]}</span>
                      <span className="font-medium text-sm">{n.title}</span>
                    </div>
                    {n.body && <div className="text-sm text-muted-foreground mt-1">{n.body}</div>}
                    <div className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(n.createdAt, { addSuffix: true, locale: ar })}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
