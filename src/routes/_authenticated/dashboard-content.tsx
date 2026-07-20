import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useStore, useCurrentUser, type ProjectType } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Boxes, Users, ShoppingBag, Files, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { toast } from "sonner";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function DashboardPage() {
  const user = useCurrentUser();
  const projects = useStore((s) => s.projects.filter((p) => !p.deletedAt));
  const clients = useStore((s) => s.clients);
  const orders = useStore((s) => s.orders);
  const media = useStore((s) => s.media);
  const activities = useStore((s) => s.activities);

  const stats = useMemo(
    () => [
      { label: "المشاريع", value: projects.length, icon: Boxes, color: "text-primary" },
      { label: "العملاء", value: clients.length, icon: Users, color: "text-accent" },
      { label: "الطلبات", value: orders.length, icon: ShoppingBag, color: "text-success" },
      { label: "الملفات", value: media.length, icon: Files, color: "text-warning" },
    ],
    [projects, clients, orders, media],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Card className="overflow-hidden border-0 bg-gradient-primary text-primary-foreground shadow-elegant">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur">
              <Sparkles className="h-3 w-3" /> أهلاً بك في منصة عمران
            </div>
            <h2 className="mt-3 text-2xl md:text-3xl font-extrabold">
              مرحباً {user?.name} 👋
            </h2>
            <p className="mt-1 text-primary-foreground/85 text-sm md:text-base max-w-xl">
              ابدأ ببناء مشروعك الرقمي الآن — أنشئ موقعاً، متجراً، أو صفحة هبوط في دقائق.
            </p>
          </div>
          <NewProjectDialog>
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              <Plus className="h-4 w-4" /> إنشاء مشروع جديد
            </Button>
          </NewProjectDialog>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, type: "spring", stiffness: 260, damping: 24 }}
            whileHover={{ y: -3 }}
          >
            <Card className="shadow-card transition hover:shadow-elegant">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`grid h-10 w-10 place-items-center rounded-lg bg-muted ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold leading-none">
                    <AnimatedNumber value={s.value} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">المشاريع الأخيرة</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link to="/projects">عرض الكل</Link></Button>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <EmptyState text="لا توجد مشاريع بعد" />
            ) : (
              <ul className="divide-y divide-border">
                {projects.slice(0, 5).map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{typeLabel(p.type)} · {formatDistanceToNow(p.updatedAt, { addSuffix: true, locale: ar })}</div>
                    </div>
                    <Button asChild size="sm" variant="ghost"><Link to="/projects/$id" params={{ id: p.id }}>فتح</Link></Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">النشاطات الأخيرة</CardTitle></CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <EmptyState text="لا توجد نشاطات بعد" />
            ) : (
              <ul className="space-y-3">
                {activities.slice(0, 8).map((a) => (
                  <li key={a.id} className="flex items-start gap-2">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <div className="text-sm">
                      <div>{a.text}</div>
                      <div className="text-xs text-muted-foreground">{formatDistanceToNow(a.createdAt, { addSuffix: true, locale: ar })}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="py-10 text-center text-sm text-muted-foreground">{text}</div>;
}

function AnimatedNumber({ value }: { value: number }) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 90, damping: 20 });
  const rounded = useTransform(spring, (v) => Math.round(v).toString());
  const [display, setDisplay] = useState("0");
  useEffect(() => { mv.set(value); }, [value, mv]);
  useEffect(() => rounded.on("change", setDisplay), [rounded]);
  return <motion.span>{display}</motion.span>;
}

export function typeLabel(t: ProjectType) {
  return { website: "موقع إلكتروني", store: "متجر", landing: "صفحة هبوط", portfolio: "معرض أعمال" }[t];
}

export function NewProjectDialog({ children }: { children: React.ReactNode }) {
  const addProject = useStore((s) => s.addProject);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<ProjectType>("website");
  const submit = () => {
    if (name.trim().length < 2) return toast.error("اسم المشروع قصير جداً");
    addProject({ name: name.trim(), type });
    toast.success("تم إنشاء المشروع");
    setName(""); setType("website"); setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>مشروع جديد</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2"><Label>اسم المشروع</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: متجر عبير" /></div>
          <div className="space-y-2">
            <Label>نوع المشروع</Label>
            <Select value={type} onValueChange={(v) => setType(v as ProjectType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="website">موقع إلكتروني</SelectItem>
                <SelectItem value="store">متجر</SelectItem>
                <SelectItem value="landing">صفحة هبوط</SelectItem>
                <SelectItem value="portfolio">معرض أعمال</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>إلغاء</Button>
          <Button className="bg-gradient-primary" onClick={submit}>إنشاء</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
