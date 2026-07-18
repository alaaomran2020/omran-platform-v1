import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { TEMPLATES, CATEGORY_LABELS } from "@/lib/templates";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LayoutTemplate, Eye, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Template } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/templates")({
  component: TemplatesPage,
});

const cats = ["all", "companies", "stores", "personal", "landing"] as const;
const catLabel = (c: string) => (c === "all" ? "الكل" : CATEGORY_LABELS[c as keyof typeof CATEGORY_LABELS]);

function TemplatesPage() {
  const [cat, setCat] = useState<string>("all");
  const [preview, setPreview] = useState<Template | null>(null);
  const [useDialog, setUseDialog] = useState<Template | null>(null);
  const [name, setName] = useState("");
  const addProject = useStore((s) => s.addProject);
  const navigate = useNavigate();

  const list = TEMPLATES.filter((t) => cat === "all" || t.category === cat);

  const handleUse = () => {
    if (!useDialog || !name.trim()) return;
    const p = addProject({ name: name.trim(), type: useDialog.projectType, blocks: useDialog.blocks });
    toast.success("تم إنشاء المشروع من القالب");
    setUseDialog(null);
    setName("");
    navigate({ to: "/projects/$id/builder", params: { id: p.id } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">القوالب الجاهزة</h1>
        <p className="text-sm text-muted-foreground">ابدأ مشروعك بسرعة من قالب احترافي</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {cats.map((c) => (
          <Button key={c} variant={cat === c ? "default" : "outline"} size="sm" onClick={() => setCat(c)}>
            {catLabel(c)}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t) => (
          <Card key={t.id} className="group overflow-hidden">
            <div className="grid aspect-video place-items-center bg-gradient-primary/10">
              <LayoutTemplate className="h-14 w-14 text-primary/50" />
            </div>
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">بواسطة {t.author} — v{t.version}</div>
                </div>
                <Badge variant="secondary">{CATEGORY_LABELS[t.category]}</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => setPreview(t)}>
                  <Eye className="h-3.5 w-3.5" /> معاينة
                </Button>
                <Button size="sm" className="flex-1 gap-1" onClick={() => { setUseDialog(t); setName(t.name); }}>
                  <Plus className="h-3.5 w-3.5" /> استخدام
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{preview?.name}</DialogTitle></DialogHeader>
          <div className="max-h-[60vh] space-y-2 overflow-auto rounded-lg border bg-muted/30 p-3">
            {preview?.blocks.map((b) => (
              <div key={b.id} className="rounded border bg-background p-3 text-sm">
                <span className="font-semibold text-primary">{b.type}</span>
                {b.props.title && <span className="text-muted-foreground"> — {b.props.title}</span>}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!useDialog} onOpenChange={(o) => !o && setUseDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>إنشاء مشروع من القالب</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium">اسم المشروع</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: موقع شركتي" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUseDialog(null)}>إلغاء</Button>
            <Button onClick={handleUse} disabled={!name.trim()}>إنشاء وفتح البنّاء</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
