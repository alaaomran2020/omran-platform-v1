import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

type Search = { tab?: "login" | "register" | "reset" };

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    tab: s.tab === "register" || s.tab === "reset" ? s.tab : "login",
  }),
  component: AuthPage,
});

function AuthPage() {
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  return (
    <div className="grid min-h-screen bg-gradient-warm md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-primary text-primary-foreground">
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold">منصة عمران</span>
        </div>
        <div>
          <h2 className="text-4xl font-extrabold leading-tight">ابنِ. أدِر. انطلق.</h2>
          <p className="mt-4 max-w-md text-primary-foreground/85">
            نظام تشغيل واحد لكل ما يخص أعمالك الرقمية — بلغتك، وبتصميم يليق بها.
          </p>
        </div>
        <p className="text-xs text-primary-foreground/70">© {new Date().getFullYear()} OMRAN Platform</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-between">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← الرئيسية</Link>
            <div className="md:hidden flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-bold">عمران</span>
            </div>
          </div>

          <Tabs value={tab} onValueChange={(v) => navigate({ to: "/auth", search: { tab: v as Search["tab"] } })} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">دخول</TabsTrigger>
              <TabsTrigger value="register">تسجيل</TabsTrigger>
              <TabsTrigger value="reset">استعادة</TabsTrigger>
            </TabsList>
            <TabsContent value="login"><LoginForm /></TabsContent>
            <TabsContent value="register"><RegisterForm /></TabsContent>
            <TabsContent value="reset"><ResetForm /></TabsContent>
          </Tabs>

          <Button variant="outline" className="mt-4 w-full" disabled>
            <span className="opacity-70">متابعة بحساب Google (قريباً)</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const login = useStore((s) => s.login);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = login(email, password);
    if (!r.ok) return toast.error(r.error);
    toast.success("مرحباً بعودتك");
    navigate({ to: "/dashboard" });
  };
  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="space-y-2">
        <Label htmlFor="e">البريد الإلكتروني</Label>
        <Input id="e" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="p">كلمة المرور</Label>
        <Input id="p" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button type="submit" className="w-full bg-gradient-primary">تسجيل الدخول</Button>
    </form>
  );
}

function RegisterForm() {
  const register = useStore((s) => s.register);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [workspaceName, setWs] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = z.object({
      name: z.string().min(2, "الاسم قصير"),
      workspaceName: z.string().min(2, "اسم مساحة العمل قصير"),
      email: z.string().email("بريد غير صالح"),
      password: z.string().min(6, "كلمة المرور 6 أحرف على الأقل"),
    }).safeParse({ name, workspaceName, email, password });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    const r = register({ name, workspaceName, email, password });
    if (!r.ok) return toast.error(r.error);
    toast.success("تم إنشاء الحساب ومساحة العمل");
    navigate({ to: "/dashboard" });
  };
  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="space-y-2"><Label>الاسم</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
      <div className="space-y-2"><Label>اسم مساحة العمل</Label><Input value={workspaceName} onChange={(e) => setWs(e.target.value)} required placeholder="مثال: وكالتي" /></div>
      <div className="space-y-2"><Label>البريد الإلكتروني</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
      <div className="space-y-2"><Label>كلمة المرور</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
      <Button type="submit" className="w-full bg-gradient-primary">إنشاء حساب</Button>
    </form>
  );
}

function ResetForm() {
  const reset = useStore((s) => s.resetPassword);
  const [email, setEmail] = useState("");
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = reset(email);
    if (!r.ok) return toast.error(r.error);
    toast.success("تم إرسال رابط الاستعادة (تجريبي)");
  };
  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card">
      <p className="text-sm text-muted-foreground">أدخل بريدك وسنرسل تعليمات إعادة تعيين كلمة المرور.</p>
      <div className="space-y-2"><Label>البريد الإلكتروني</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
      <Button type="submit" className="w-full">إرسال</Button>
    </form>
  );
}
