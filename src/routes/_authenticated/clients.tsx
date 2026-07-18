import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

export const Route = createFileRoute("/_authenticated/clients")({
  component: ClientsPage,
});

function ClientsPage() {
  const clients = useStore((s) => s.clients);
  const remove = useStore((s) => s.removeClient);
  const [q, setQ] = useState("");
  const filtered = clients.filter((c) => (c.name + c.email).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
        <div>
          <h2 className="text-xl font-bold">العملاء</h2>
          <p className="text-sm text-muted-foreground">إدارة قاعدة عملائك بوسوم وملاحظات.</p>
        </div>
        <div className="flex gap-2">
          <Input placeholder="بحث..." value={q} onChange={(e) => setQ(e.target.value)} className="w-full md:w-64" />
          <AddClientDialog />
        </div>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              <Users className="mx-auto mb-3 h-8 w-8 opacity-40" />
              لا يوجد عملاء بعد.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>البريد</TableHead>
                  <TableHead>الهاتف</TableHead>
                  <TableHead>الوسوم</TableHead>
                  <TableHead>آخر نشاط</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-muted-foreground">{c.email}</TableCell>
                    <TableCell className="text-muted-foreground">{c.phone || "—"}</TableCell>
                    <TableCell><div className="flex flex-wrap gap-1">{c.tags.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}</div></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDistanceToNow(c.lastActivity, { addSuffix: true, locale: ar })}</TableCell>
                    <TableCell><Button size="icon" variant="ghost" onClick={() => remove(c.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button></TableCell>
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

function AddClientDialog() {
  const add = useStore((s) => s.addClient);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");

  const submit = () => {
    if (!name || !email) return toast.error("الاسم والبريد مطلوبان");
    add({ name, email, phone, tags: tags.split(",").map((t) => t.trim()).filter(Boolean), notes });
    toast.success("تم إضافة العميل");
    setOpen(false); setName(""); setEmail(""); setPhone(""); setTags(""); setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="bg-gradient-primary">+ عميل جديد</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>إضافة عميل</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-2"><Label>الاسم</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="space-y-2"><Label>البريد</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="space-y-2"><Label>الهاتف</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          <div className="space-y-2"><Label>الوسوم (مفصولة بفاصلة)</Label><Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="VIP, دائم" /></div>
          <div className="space-y-2"><Label>ملاحظات</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} /></div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>إلغاء</Button>
          <Button className="bg-gradient-primary" onClick={submit}>إضافة</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
