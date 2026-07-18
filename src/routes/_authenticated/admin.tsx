import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, useCurrentUser } from "@/lib/store";
import { TEMPLATES } from "@/lib/templates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ShieldCheck, Users as UsersIcon, Boxes, LayoutTemplate, ScrollText, AlertTriangle, Activity as ActivityIcon, HardDrive } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: () => {
    const state = useStore.getState();
    const user = state.users.find((u) => u.id === state.currentUserId);
    if (!user?.isAdmin) throw redirect({ to: "/dashboard" });
  },
  component: AdminPanel,
});

function AdminPanel() {
  const user = useCurrentUser();
  const users = useStore((s) => s.users);
  const projects = useStore((s) => s.projects);
  const activities = useStore((s) => s.activities);
  const orders = useStore((s) => s.orders);
  const clients = useStore((s) => s.clients);
  const media = useStore((s) => s.media);

  const totalMedia = media.reduce((a, m) => a + m.size, 0);
  const [errors] = useState<{ id: string; message: string; when: number }[]>([]);

  const stats = [
    { label: "المستخدمون", value: users.length, icon: UsersIcon },
    { label: "المشاريع", value: projects.length, icon: Boxes },
    { label: "الطلبات", value: orders.length, icon: ActivityIcon },
    { label: "استخدام التخزين", value: `${(totalMedia / 1024 / 1024).toFixed(1)} MB`, icon: HardDrive },
  ];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-gradient-primary text-primary-foreground shadow-elegant">
        <CardContent className="p-6 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/20 backdrop-blur"><ShieldCheck className="h-5 w-5" /></div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold">لوحة الإدارة</h1>
              <p className="text-sm text-primary-foreground/85">إدارة النظام كاملاً — {user?.name}</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-primary-foreground border-0">صلاحية Owner</Badge>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><s.icon className="h-5 w-5" /></div>
              <div>
                <div className="text-xl font-bold leading-none">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users" dir="rtl">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="users"><UsersIcon className="h-3.5 w-3.5 ms-1" /> المستخدمون</TabsTrigger>
          <TabsTrigger value="projects"><Boxes className="h-3.5 w-3.5 ms-1" /> المشاريع</TabsTrigger>
          <TabsTrigger value="templates"><LayoutTemplate className="h-3.5 w-3.5 ms-1" /> القوالب</TabsTrigger>
          <TabsTrigger value="logs"><ScrollText className="h-3.5 w-3.5 ms-1" /> السجلات</TabsTrigger>
          <TabsTrigger value="errors"><AlertTriangle className="h-3.5 w-3.5 ms-1" /> الأخطاء</TabsTrigger>
          <TabsTrigger value="usage"><HardDrive className="h-3.5 w-3.5 ms-1" /> الاستخدام</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-base">جميع المستخدمين ({users.length})</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>البريد</TableHead>
                    <TableHead>مساحة العمل</TableHead>
                    <TableHead>الدور</TableHead>
                    <TableHead>الانضمام</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell className="text-muted-foreground">{u.email}</TableCell>
                      <TableCell>{u.workspaceName}</TableCell>
                      <TableCell>
                        {u.isAdmin
                          ? <Badge className="bg-primary">Owner</Badge>
                          : <Badge variant="secondary">Member</Badge>}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDistanceToNow(u.createdAt, { addSuffix: true, locale: ar })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="mt-4">
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-base">جميع المشاريع ({projects.length})</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الأعضاء</TableHead>
                    <TableHead>آخر تحديث</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>{p.type}</TableCell>
                      <TableCell>
                        {p.deletedAt ? <Badge variant="destructive">محذوف</Badge> : <Badge>{p.status}</Badge>}
                      </TableCell>
                      <TableCell>{p.members.length}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDistanceToNow(p.updatedAt, { addSuffix: true, locale: ar })}
                      </TableCell>
                      <TableCell>
                        <Button asChild size="sm" variant="ghost">
                          <Link to="/projects/$id" params={{ id: p.id }}>فتح</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-base">القوالب المتاحة ({TEMPLATES.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {TEMPLATES.map((t) => (
                  <div key={t.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.author} · v{t.version} · {t.blocks.length} مكوّن</div>
                    </div>
                    <Badge variant="secondary">{t.category}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-base">سجل النشاطات ({activities.length})</CardTitle></CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">لا توجد سجلات بعد</p>
              ) : (
                <ul className="space-y-2">
                  {activities.map((a) => (
                    <li key={a.id} className="flex items-start justify-between rounded-lg border p-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                        <div>
                          <div>{a.text}</div>
                          <div className="text-xs text-muted-foreground">{a.kind}</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(a.createdAt, { addSuffix: true, locale: ar })}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="mt-4">
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-base">سجل الأخطاء</CardTitle></CardHeader>
            <CardContent>
              {errors.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-success/10 text-success">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">لا توجد أخطاء مسجّلة — النظام يعمل بشكل سليم.</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {errors.map((e) => (
                    <li key={e.id} className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
                      <div className="font-medium text-destructive">{e.message}</div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            <UsageCard title="التخزين" value={`${(totalMedia / 1024 / 1024).toFixed(2)} MB`} sub={`${media.length} ملف`} percent={Math.min(100, (totalMedia / (100 * 1024 * 1024)) * 100)} />
            <UsageCard title="المشاريع" value={String(projects.length)} sub="من غير محدود" percent={Math.min(100, projects.length * 5)} />
            <UsageCard title="العملاء" value={String(clients.length)} sub={`${orders.length} طلب`} percent={Math.min(100, clients.length * 2)} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function UsageCard({ title, value, sub, percent }: { title: string; value: string; sub: string; percent: number }) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-5">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="mt-1 text-2xl font-bold">{value}</div>
        <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-gradient-primary transition-all" style={{ width: `${percent}%` }} />
        </div>
      </CardContent>
    </Card>
  );
}
