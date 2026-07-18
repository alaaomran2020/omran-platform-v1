import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/products")({ component: ProductsPage });

function ProductsPage() {
  const products = useStore((s) => s.products);
  const remove = useStore((s) => s.removeProduct);

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">المنتجات</h2>
          <p className="text-sm text-muted-foreground">أدر مخزونك وأسعارك.</p>
        </div>
        <AddProductDialog />
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          <Package className="mx-auto mb-3 h-8 w-8 opacity-40" />
          لا توجد منتجات بعد.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Card key={p.id} className="shadow-card">
              <div className="h-32 bg-gradient-warm rounded-t-xl border-b" />
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="mt-1 text-sm text-primary font-bold">{p.price.toLocaleString("ar")} ر.س</div>
                  </div>
                  <Badge variant={p.stock > 0 ? "secondary" : "destructive"}>
                    {p.stock > 0 ? `${p.stock} متوفر` : "نفد"}
                  </Badge>
                </div>
                <Button size="sm" variant="ghost" className="mt-3 text-destructive" onClick={() => remove(p.id)}>
                  <Trash2 className="h-4 w-4" /> حذف
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function AddProductDialog() {
  const add = useStore((s) => s.addProduct);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const submit = () => {
    if (!name || !price) return toast.error("املأ الحقول");
    add({ name, price: Number(price), stock: Number(stock) || 0 });
    toast.success("تم إضافة المنتج");
    setOpen(false); setName(""); setPrice(""); setStock("");
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="bg-gradient-primary">+ منتج جديد</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>منتج جديد</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-2"><Label>الاسم</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>السعر</Label><Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} /></div>
            <div className="space-y-2"><Label>المخزون</Label><Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} /></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>إلغاء</Button>
          <Button className="bg-gradient-primary" onClick={submit}>إضافة</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
