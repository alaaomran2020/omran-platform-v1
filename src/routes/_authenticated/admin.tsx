import { createFileRoute } from "@tanstack/react-router";
import { useStore, useCurrentUser } from "../../lib/store";
import { TEMPLATES } from "../../lib/templates";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

function AdminPage() {
  const products = useStore((s) => s.products);
  const orders = useStore((s) => s.orders);
  const user = useCurrentUser();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">لوحة تحكم الإدارة</h1>
        <p className="text-muted-foreground mt-1">
          إدارة المنتجات، الطلبات، والتحكم الشامل في إعدادات المنصة.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>إجمالي المنتجات</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{products?.length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الطلبات النشطة</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{orders?.length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>قوالب النظام</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{Object.keys(TEMPLATES).length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>نظرة عامة على المستخدم الحالي</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>الاسم:</strong> {user?.name || "مسؤول النظام"}</p>
          <p><strong>البريد الإلكتروني:</strong> {user?.email || "admin@omran.com"}</p>
        </CardContent>
      </Card>
    </div>
  );
}