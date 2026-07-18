import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import type { Block, BlockType } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Reorder, AnimatePresence, motion } from "framer-motion";
import {
  Type, Image as ImageIcon, MousePointerClick, LayoutGrid, Star, MessageSquareQuote,
  Mail, Minus, Sparkles, GripVertical, Trash2, Save, Monitor, Tablet, Smartphone, ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/projects/$id/builder")({
  component: BuilderPage,
});

const COMPONENTS: { type: BlockType; label: string; icon: any; defaults: Record<string, any> }[] = [
  { type: "hero", label: "Hero", icon: Sparkles, defaults: { title: "عنوان جذاب", subtitle: "وصف مختصر يوضح القيمة", cta: "ابدأ الآن" } },
  { type: "text", label: "نص", icon: Type, defaults: { content: "اكتب نصاً هنا..." } },
  { type: "image", label: "صورة", icon: ImageIcon, defaults: { url: "", alt: "صورة" } },
  { type: "button", label: "زر", icon: MousePointerClick, defaults: { label: "اضغط هنا", href: "#" } },
  { type: "gallery", label: "معرض", icon: LayoutGrid, defaults: { items: [] } },
  { type: "features", label: "مميزات", icon: Star, defaults: { title: "مميزاتنا", items: [{ title: "ميزة 1", desc: "وصف" }, { title: "ميزة 2", desc: "وصف" }, { title: "ميزة 3", desc: "وصف" }] } },
  { type: "testimonials", label: "شهادات", icon: MessageSquareQuote, defaults: { items: [{ name: "عميل", text: "تجربة رائعة" }] } },
  { type: "contact", label: "تواصل", icon: Mail, defaults: { title: "تواصل معنا" } },
  { type: "footer", label: "تذييل", icon: Minus, defaults: { text: "© 2026 اسم الموقع" } },
];

const uid = () => Math.random().toString(36).slice(2, 10);

function BuilderPage() {
  const { id } = Route.useParams();
  const project = useStore((s) => s.projects.find((p) => p.id === id));
  const getOrCreatePage = useStore((s) => s.getOrCreatePage);
  const savePage = useStore((s) => s.savePage);
  const media = useStore((s) => s.media);

  const page = useMemo(() => getOrCreatePage(id), [id, getOrCreatePage]);
  const [blocks, setBlocks] = useState<Block[]>(page.blocks);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => { setBlocks(page.blocks); }, [page.id]); // eslint-disable-line

  const selected = blocks.find((b) => b.id === selectedId) ?? null;

  const add = (type: BlockType) => {
    const def = COMPONENTS.find((c) => c.type === type)!;
    const nb: Block = { id: uid(), type, props: JSON.parse(JSON.stringify(def.defaults)) };
    setBlocks((prev) => [...prev, nb]);
    setSelectedId(nb.id);
  };
  const remove = (bid: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== bid));
    if (selectedId === bid) setSelectedId(null);
  };
  const updateProp = (bid: string, key: string, value: any) => {
    setBlocks((prev) => prev.map((b) => (b.id === bid ? { ...b, props: { ...b.props, [key]: value } } : b)));
  };
  const handleSave = () => { savePage(page.id, blocks); toast.success("تم حفظ الصفحة"); };

  if (!project) {
    return <div className="p-6"><Card className="p-8 text-center">المشروع غير موجود</Card></div>;
  }

  const width = device === "mobile" ? "max-w-sm" : device === "tablet" ? "max-w-2xl" : "max-w-full";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to="/projects/$id" params={{ id }}>
            <Button variant="ghost" size="sm" className="gap-1"><ArrowRight className="h-4 w-4" /> رجوع</Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">بنّاء الصفحة — {project.name}</h1>
            <p className="text-xs text-muted-foreground">اسحب المكونات، عدّل الخصائص، واحفظ.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border p-1">
            <Button variant={device === "mobile" ? "secondary" : "ghost"} size="sm" onClick={() => setDevice("mobile")}><Smartphone className="h-4 w-4" /></Button>
            <Button variant={device === "tablet" ? "secondary" : "ghost"} size="sm" onClick={() => setDevice("tablet")}><Tablet className="h-4 w-4" /></Button>
            <Button variant={device === "desktop" ? "secondary" : "ghost"} size="sm" onClick={() => setDevice("desktop")}><Monitor className="h-4 w-4" /></Button>
          </div>
          <Button onClick={handleSave} className="gap-1"><Save className="h-4 w-4" /> حفظ</Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_1fr_280px]">
        {/* Components palette */}
        <Card className="p-3">
          <div className="mb-2 text-sm font-semibold">المكونات</div>
          <div className="grid grid-cols-2 gap-2">
            {COMPONENTS.map((c, i) => (
              <motion.button
                key={c.type}
                onClick={() => add(c.type)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="flex flex-col items-center gap-1 rounded-lg border bg-background p-2 text-xs transition hover:border-primary hover:bg-primary/5 hover:shadow-sm"
              >
                <c.icon className="h-4 w-4 text-primary" />
                {c.label}
              </motion.button>
            ))}
          </div>
        </Card>

        {/* Canvas */}
        <Card className="min-h-[60vh] overflow-auto bg-muted/30 p-4">
          <div className={`mx-auto ${width}`}>
            {blocks.length === 0 ? (
              <div className="grid place-items-center rounded-xl border-2 border-dashed p-16 text-center text-sm text-muted-foreground">
                ابدأ بإضافة مكوّن من الشريط الأيمن
              </div>
            ) : (
              <Reorder.Group axis="y" values={blocks} onReorder={setBlocks} className="space-y-3">
                <AnimatePresence initial={false}>
                  {blocks.map((b) => (
                    <Reorder.Item
                      key={b.id}
                      value={b}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      whileDrag={{ scale: 1.02, boxShadow: "0 12px 28px -8px rgba(0,0,0,0.18)" }}
                      onClick={() => setSelectedId(b.id)}
                      className={`group relative cursor-grab overflow-hidden rounded-lg border-2 bg-background transition active:cursor-grabbing ${selectedId === b.id ? "border-primary" : "border-transparent hover:border-border"}`}
                    >
                      <BlockPreview block={b} />
                      <div className="pointer-events-none absolute left-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
                        <div className="pointer-events-auto grid h-7 w-7 place-items-center rounded-md bg-secondary text-secondary-foreground">
                          <GripVertical className="h-3.5 w-3.5" />
                        </div>
                        <Button size="icon" variant="destructive" className="pointer-events-auto h-7 w-7" onClick={(e) => { e.stopPropagation(); remove(b.id); }}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </Reorder.Item>
                  ))}
                </AnimatePresence>
              </Reorder.Group>
            )}
          </div>
        </Card>

        {/* Properties panel */}
        <Card className="p-3">
          <div className="mb-2 text-sm font-semibold">الخصائص</div>
          {!selected ? (
            <p className="text-xs text-muted-foreground">اختر مكوّناً لتعديل خصائصه.</p>
          ) : (
            <PropsEditor block={selected} onChange={(k, v) => updateProp(selected.id, k, v)} media={media} />
          )}
        </Card>
      </div>
    </div>
  );
}

function BlockPreview({ block }: { block: Block }) {
  const p = block.props;
  switch (block.type) {
    case "hero":
      return (
        <div className="rounded-lg bg-gradient-primary/10 p-8 text-center">
          <h2 className="text-2xl font-bold">{p.title}</h2>
          <p className="mt-2 text-muted-foreground">{p.subtitle}</p>
          {p.cta && <Button className="mt-4">{p.cta}</Button>}
        </div>
      );
    case "text":
      return <div className="p-4 text-sm leading-relaxed">{p.content}</div>;
    case "image":
      return p.url ? <img src={p.url} alt={p.alt} className="w-full rounded-lg" /> : <div className="grid h-40 place-items-center bg-muted text-xs text-muted-foreground">لا توجد صورة</div>;
    case "button":
      return <div className="p-4"><Button>{p.label}</Button></div>;
    case "gallery":
      return (
        <div className="grid grid-cols-3 gap-2 p-3">
          {(p.items ?? []).length === 0
            ? <div className="col-span-3 grid h-24 place-items-center bg-muted text-xs text-muted-foreground">معرض فارغ</div>
            : (p.items as any[]).map((it, i) => <img key={i} src={it.url} alt="" className="aspect-square w-full rounded object-cover" />)}
        </div>
      );
    case "features":
      return (
        <div className="p-4">
          {p.title && <h3 className="mb-3 text-center text-lg font-bold">{p.title}</h3>}
          <div className="grid gap-3 sm:grid-cols-3">
            {(p.items ?? []).map((it: any, i: number) => (
              <div key={i} className="rounded-lg border p-3 text-center text-sm">
                <div className="font-semibold">{it.title}</div>
                <div className="text-xs text-muted-foreground">{it.desc}</div>
              </div>
            ))}
          </div>
        </div>
      );
    case "testimonials":
      return (
        <div className="grid gap-2 p-4 sm:grid-cols-2">
          {(p.items ?? []).map((it: any, i: number) => (
            <div key={i} className="rounded-lg bg-muted p-3 text-sm">
              <p>"{it.text}"</p>
              <div className="mt-1 text-xs font-semibold">— {it.name}</div>
            </div>
          ))}
        </div>
      );
    case "contact":
      return (
        <div className="space-y-2 p-4">
          {p.title && <h3 className="text-lg font-bold">{p.title}</h3>}
          <Input placeholder="الاسم" disabled />
          <Input placeholder="البريد" disabled />
          <Textarea placeholder="رسالتك" disabled />
          <Button disabled>إرسال</Button>
        </div>
      );
    case "footer":
      return <div className="border-t p-4 text-center text-xs text-muted-foreground">{p.text}</div>;
  }
}

function PropsEditor({ block, onChange, media }: { block: Block; onChange: (k: string, v: any) => void; media: any[] }) {
  const p = block.props;
  const F = ({ label, children }: any) => (
    <div className="space-y-1">
      <label className="text-xs font-medium">{label}</label>
      {children}
    </div>
  );
  switch (block.type) {
    case "hero":
      return (
        <div className="space-y-3">
          <F label="العنوان"><Input value={p.title ?? ""} onChange={(e) => onChange("title", e.target.value)} /></F>
          <F label="العنوان الفرعي"><Textarea value={p.subtitle ?? ""} onChange={(e) => onChange("subtitle", e.target.value)} /></F>
          <F label="نص الزر"><Input value={p.cta ?? ""} onChange={(e) => onChange("cta", e.target.value)} /></F>
        </div>
      );
    case "text":
      return <F label="المحتوى"><Textarea rows={6} value={p.content ?? ""} onChange={(e) => onChange("content", e.target.value)} /></F>;
    case "image":
      return (
        <div className="space-y-3">
          <F label="رابط الصورة"><Input value={p.url ?? ""} onChange={(e) => onChange("url", e.target.value)} /></F>
          <F label="النص البديل"><Input value={p.alt ?? ""} onChange={(e) => onChange("alt", e.target.value)} /></F>
          {media.length > 0 && (
            <div>
              <div className="mb-1 text-xs font-medium">من المكتبة</div>
              <div className="grid grid-cols-3 gap-1">
                {media.filter((m) => m.type?.startsWith("image/")).slice(0, 9).map((m) => (
                  <button key={m.id} onClick={() => onChange("url", m.url)} className="overflow-hidden rounded border hover:border-primary">
                    <img src={m.url} alt="" className="aspect-square w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    case "button":
      return (
        <div className="space-y-3">
          <F label="النص"><Input value={p.label ?? ""} onChange={(e) => onChange("label", e.target.value)} /></F>
          <F label="الرابط"><Input value={p.href ?? ""} onChange={(e) => onChange("href", e.target.value)} /></F>
        </div>
      );
    case "features":
      return (
        <div className="space-y-3">
          <F label="عنوان القسم"><Input value={p.title ?? ""} onChange={(e) => onChange("title", e.target.value)} /></F>
          <F label="JSON للعناصر">
            <Textarea rows={6} value={JSON.stringify(p.items ?? [], null, 2)} onChange={(e) => { try { onChange("items", JSON.parse(e.target.value)); } catch {} }} />
          </F>
        </div>
      );
    case "testimonials":
      return (
        <F label="JSON للشهادات">
          <Textarea rows={6} value={JSON.stringify(p.items ?? [], null, 2)} onChange={(e) => { try { onChange("items", JSON.parse(e.target.value)); } catch {} }} />
        </F>
      );
    case "gallery":
      return (
        <F label="JSON للصور [{url}]">
          <Textarea rows={6} value={JSON.stringify(p.items ?? [], null, 2)} onChange={(e) => { try { onChange("items", JSON.parse(e.target.value)); } catch {} }} />
        </F>
      );
    case "contact":
      return <F label="العنوان"><Input value={p.title ?? ""} onChange={(e) => onChange("title", e.target.value)} /></F>;
    case "footer":
      return <F label="النص"><Input value={p.text ?? ""} onChange={(e) => onChange("text", e.target.value)} /></F>;
  }
}
