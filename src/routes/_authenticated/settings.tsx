import { createFileRoute } from "@tanstack/react-router";
import { useStore, useCurrentUser } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sun, Moon, ShieldCheck, Monitor } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({ component: SettingsPage });

function SettingsPage() {
  const user = useCurrentUser();
  const { lang, theme } = useStore((s) => s.settings);
  const setLang = useStore((s) => s.setLang);
  const setTheme = useStore((s) => s.setTheme);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <h2 className="text-xl font-bold">الإعدادات</h2>
        <p className="text-sm text-muted-foreground">حسابك، تفضيلاتك، والأمان.</p>
      </div>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">الملف الشخصي</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2"><Label>الاسم</Label><Input defaultValue={user?.name} /></div>
          <div className="space-y-2"><Label>البريد</Label><Input defaultValue={user?.email} disabled /></div>
          <div className="space-y-2 sm:col-span-2"><Label>مساحة العمل</Label><Input defaultValue={user?.workspaceName} /></div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">التفضيلات</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>اللغة</Label>
              <p className="text-xs text-muted-foreground">العربية أو الإنجليزية.</p>
            </div>
            <Select value={lang} onValueChange={(v) => setLang(v as "ar" | "en")}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="flex items-center gap-2">
                {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                الوضع الداكن
              </Label>
              <p className="text-xs text-muted-foreground">تبديل بين الفاتح والداكن.</p>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={(c) => setTheme(c ? "dark" : "light")} />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> الأمان والجلسات</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2"><Label>كلمة مرور جديدة</Label><Input type="password" placeholder="••••••••" /></div>
          <Button variant="outline" className="w-full">تحديث كلمة المرور</Button>
          <div className="mt-4 rounded-lg border p-3 flex items-center gap-3">
            <Monitor className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <div className="text-sm font-medium">الجلسة الحالية</div>
              <div className="text-xs text-muted-foreground">هذا الجهاز — نشط الآن</div>
            </div>
            <Button size="sm" variant="ghost" disabled>حالي</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
