import { createFileRoute, Link, lazyRouteComponent } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Copy, Trash2, RotateCcw, Boxes } from "lucide-react";
import { NewProjectDialog, typeLabel } from "./dashboard-content";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

export const Route = createFileRoute("/_authenticated/projects")({
  component: lazyRouteComponent(() => import('./projects').then((m) => ({ default: m.default })), 'default'),
});

export default function ProjectsPage() {
  const all = useStore((s) => s.projects);
  const [q, setQ] = useState("");
  const active = all.filter((p) => !p.deletedAt && p.name.includes(q));
  const trashed = all.filter((p) => p.deletedAt && p.name.includes(q));

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
        <div>
          <h2 className="text-xl font-bold">المشاريع</h2>
          <p className="text-sm text-muted-foreground">أنشئ، أدر، ونظّم مشاريعك الرقمية.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="بحث..." value={q} onChange={(e) => setQ(e.target.value)} className="w-full md:w-64" />
          <NewProjectDialog><Button className="bg-gradient-primary shrink-0">+ مشروع جديد</Button></NewProjectDialog>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">النشطة ({active.length})</TabsTrigger>
          <TabsTrigger value="trash">المحذوفة ({trashed.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          <ProjectGrid items={active} />
        </TabsContent>
        <TabsContent value="trash" className="mt-4">
          <ProjectGrid items={trashed} trash />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProjectGrid({ items, trash }: { items: ReturnType<typeof useStore.getState>["projects"]; trash?: boolean }) {
  const dup = useStore((s) => s.duplicateProject);
  const del = useStore((s) => s.softDeleteProject);
  const restore = useStore((s) => s.restoreProject);

  if (items.length === 0)
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        <Boxes className="mx-auto mb-3 h-8 w-8 opacity-40" />
        {trash ? "لا توجد مشاريع محذوفة" : "لا توجد مشاريع بعد — ابدأ بإنشاء واحد."}
      </div>
    );

  return (
    <LayoutGroup>
      <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {items.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 320, damping: 28, delay: i * 0.04 }}
              whileHover={{ y: -4 }}
            >
              <Card className="shadow-card overflow-hidden transition hover:shadow-elegant">
                <div className="h-24 bg-gradient-warm border-b" />
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate font-semibold">{p.name}</div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary">{typeLabel(p.type)}</Badge>
                        <span>·</span>
                        <span>{formatDistanceToNow(p.updatedAt, { addSuffix: true, locale: ar })}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {trash ? (
                          <DropdownMenuItem onClick={() => restore(p.id)}><RotateCcw className="me-2 h-4 w-4" /> استرجاع</DropdownMenuItem>
                        ) : (
                          <>
                            <DropdownMenuItem onClick={() => dup(p.id)}><Copy className="me-2 h-4 w-4" /> نسخ</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => del(p.id)} className="text-destructive"><Trash2 className="me-2 h-4 w-4" /> حذف</DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {!trash && (
                    <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                      <Link to="/projects/$id" params={{ id: p.id }}>فتح المشروع</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
