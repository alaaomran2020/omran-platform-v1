import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Upload, Trash2, Search, FileIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/media")({
  component: MediaPage,
});

function MediaPage() {
  const media = useStore((s) => s.media);
  const addMedia = useStore((s) => s.addMedia);
  const removeMedia = useStore((s) => s.removeMedia);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = media.filter((m) => m.name.toLowerCase().includes(q.toLowerCase()));

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        addMedia({ name: file.name, size: file.size, type: file.type, url: String(reader.result) });
      };
      reader.readAsDataURL(file);
    });
    toast.success(`تم رفع ${files.length} ملف`);
  };

  const fmt = (n: number) => n < 1024 ? `${n} B` : n < 1024 * 1024 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">مكتبة الملفات</h1>
          <p className="text-sm text-muted-foreground">رفع الصور والملفات واستخدامها في مشاريعك</p>
        </div>
        <Button onClick={() => inputRef.current?.click()} className="gap-2">
          <Upload className="h-4 w-4" /> رفع ملفات
        </Button>
        <input ref={inputRef} type="file" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
      </div>

      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="بحث في الملفات..." className="pr-10" />
      </div>

      {filtered.length === 0 ? (
        <Card className="grid place-items-center gap-3 p-16 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-muted">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">لا توجد ملفات بعد. ابدأ برفع صور أو مستندات.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((m) => (
            <Card key={m.id} className="group overflow-hidden">
              <div className="relative aspect-square bg-muted">
                {m.type.startsWith("image/") ? (
                  <img src={m.url} alt={m.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center"><FileIcon className="h-10 w-10 text-muted-foreground" /></div>
                )}
                <button
                  onClick={() => removeMedia(m.id)}
                  className="absolute left-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-destructive/90 text-destructive-foreground opacity-0 transition group-hover:opacity-100"
                  aria-label="حذف"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-1 p-3">
                <div className="truncate text-sm font-medium" title={m.name}>{m.name}</div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{fmt(m.size)}</span>
                  <span>{new Date(m.createdAt).toLocaleDateString("ar")}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
