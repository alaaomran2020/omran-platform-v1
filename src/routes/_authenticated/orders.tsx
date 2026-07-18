import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, type OrderStatus } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

const STATUS_LABEL: Record<OrderStatus, string> = { pending: "قيد الانتظار", paid: "مدفوع", completed: "مكتمل", cancelled: "ملغى" };
const STATUS_VARIANT: Record<OrderStatus, "secondary" | "default" | "destructive"> = { pending: "secondary", paid: "default", completed: "default", cancelled: "destructive" };

export const Route = createFileRoute("/_authenticated/orders")({ component: OrdersPage });

function OrdersPage() {
  const orders = useStore((s) => s.orders);
  const update = useStore((s) => s.updateOrderStatus);
  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">الطلبات</h2>
          <p className="text-sm text-muted-foreground">تابع حالة كل طلب.</p>
        </div>
        <NewOrderDialog />
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              <ShoppingBag className="mx-auto mb-3 h-8 w-8 opacity-40" />
              لا توجد طلبات بعد.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الطلب</TableHead>
                  <TableHead>العميل</TableHead>
                  <TableHead>المنتجات</TableHead>
                  <TableHead>الإجمالي</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono">{o.number}</TableCell>
                    <TableCell>{o.clientName}</TableCell>
                    <TableCell className="text-muted-foreground">{o.items.reduce((a, b) => a + b.qty, 0)} عنصر</TableCell>
                    <TableCell>{o.total.toLocaleString("ar")} ر.س</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString("ar")}</TableCell>
                    <TableCell>
                      <Select value={o.status} onValueChange={(v) => update(o.id, v as OrderStatus)}>
                        <SelectTrigger className="w-36 h-8">
                          <Badge variant={STATUS_VARIANT[o.status]}>{STATUS_LABEL[o.status]}</Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(STATUS_LABEL) as OrderStatus[]).map((s) => (
                            <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function NewOrderDialog() {
  const addOrder = useStore((s) => s.addOrder);
  const clients = useStore((s) => s.clients);
  const products = useStore((s) => s.products);
  const [open, setOpen] = useState(false);
  const [clientId, setClientId] = useState("");
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState("1");

  const submit = () => {
    const c = clients.find((x) => x.id === clientId);
    const p = products.find((x) => x.id === productId);
    if (!c || !p) return toast.error("اختر العميل والمنتج");
    const q = Number(qty) || 1;
    addOrder({
      clientId: c.id,
      clientName: c.name,
      items: [{ productId: p.id, name: p.name, qty: q, price: p.price }],
      total: p.price * q,
      status: "pending",
    });
    toast.success("تم إنشاء الطلب");
    setOpen(false); setClientId(""); setProductId(""); setQty("1");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="bg-gradient-primary">+ طلب جديد</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>طلب جديد</DialogTitle></DialogHeader>
        {clients.length === 0 || products.length === 0 ? (
          <p className="text-sm text-muted-foreground">أضف عميلاً ومنتجاً أولاً.</p>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>العميل</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger><SelectValue placeholder="اختر عميل" /></SelectTrigger>
                <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>المنتج</Label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger><SelectValue placeholder="اختر منتج" /></SelectTrigger>
                <SelectContent>{products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name} — {p.price} ر.س</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>الكمية</Label><Input type="number" value={qty} onChange={(e) => setQty(e.target.value)} /></div>
          </div>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>إلغاء</Button>
          <Button className="bg-gradient-primary" onClick={submit} disabled={clients.length === 0 || products.length === 0}>إنشاء</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
