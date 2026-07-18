import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useStore, type Role } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Trash2, Copy, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { typeLabel } from "./dashboard";

export const Route = createFileRoute("/_authenticated/projects/$id")({
  component: ProjectDetail,
});

function ProjectDetail() {
  const { id } = Route.useParams();
  const project = useStore((s) => s.projects.find((p) => p.id === id));
  const update = useStore((s) => s.updateProject);
  const del = useStore((s) => s.softDeleteProject);
  const dup = useStore((s) => s.duplicateProject);
  const navigate = useNavigate();

  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState<Role>("member");

  if (!project) return <div className="text-center text-muted-foreground py-16">المشروع غير موجود</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Button asChild variant="ghost" size="sm"><Link to="/projects"><ArrowRight className="h-4 w-4 rotate-180 ms-1" /> رجوع</Link></Button>

      <Card className="shadow-card">
        <div className="h-28 bg-gradient-primary rounded-t-xl" />
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-wrap items-start gap-3 justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{project.name}</h2>
                <Badge variant="secondary">{typeLabel(project.type)}</Badge>
                <Badge>{project.status === "draft" ? "مسودة" : project.status === "published" ? "منشور" : "مؤرشف"}</Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-1">أُنشئ في {new Date(project.createdAt).toLocaleDateString("ar")}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" className="gap-1"><Link to="/projects/$id/builder" params={{ id: project.id }}><Wand2 className="h-4 w-4" /> فتح بنّاء الصفحة</Link></Button>
              <Button variant="outline" size="sm" onClick={() => { dup(project.id); toast.success("تم النسخ"); }}><Copy className="h-4 w-4" /> نسخ</Button>
              <Button variant="outline" size="sm" className="text-destructive" onClick={() => { del(project.id); toast.success("تم النقل للمحذوفات"); navigate({ to: "/projects" }); }}>
                <Trash2 className="h-4 w-4" /> حذف
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>الاسم</Label>
              <Input defaultValue={project.name} onBlur={(e) => update(project.id, { name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>الحالة</Label>
              <Select value={project.status} onValueChange={(v) => update(project.id, { status: v as never })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">مسودة</SelectItem>
                  <SelectItem value="published">منشور</SelectItem>
                  <SelectItem value="archived">مؤرشف</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">أعضاء الفريق</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex-1 min-w-[200px] space-y-2">
              <Label>البريد الإلكتروني</Label>
              <Input type="email" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} placeholder="member@example.com" />
            </div>
            <div className="space-y-2">
              <Label>الدور</Label>
              <Select value={memberRole} onValueChange={(v) => setMemberRole(v as Role)}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => {
                if (!memberEmail) return;
                update(project.id, { members: [...project.members, { email: memberEmail, role: memberRole }] });
                setMemberEmail("");
                toast.success("تم إضافة العضو");
              }}
            >إضافة</Button>
          </div>

          {project.members.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-6">لا أعضاء بعد.</div>
          ) : (
            <ul className="divide-y divide-border">
              {project.members.map((m, i) => (
                <li key={i} className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm font-medium">{m.email}</div>
                    <div className="text-xs text-muted-foreground">{m.role}</div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-destructive"
                    onClick={() => update(project.id, { members: project.members.filter((_, idx) => idx !== i) })}>
                    إزالة
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
