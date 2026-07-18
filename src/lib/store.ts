import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ProjectType = "website" | "store" | "landing" | "portfolio";
export type ProjectStatus = "draft" | "published" | "archived";
export type OrderStatus = "pending" | "paid" | "completed" | "cancelled";
export type Role = "owner" | "admin" | "editor" | "member";
export type Lang = "ar" | "en";
export type Theme = "light" | "dark";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // mock only
  workspaceName: string;
  isAdmin: boolean;
  createdAt: number;
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  cover?: string;
  createdAt: number;
  updatedAt: number;
  deletedAt?: number | null;
  members: { email: string; role: Role }[];
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  tags: string[];
  notes?: string;
  lastActivity: number;
  createdAt: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  createdAt: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: number;
}

export interface MediaFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: number;
}

export type BlockType =
  | "hero" | "text" | "image" | "button" | "gallery"
  | "features" | "testimonials" | "contact" | "footer";

export interface Block {
  id: string;
  type: BlockType;
  props: Record<string, any>;
}

export interface Page {
  id: string;
  projectId: string;
  name: string;
  blocks: Block[];
  updatedAt: number;
}

export interface Template {
  id: string;
  name: string;
  category: "companies" | "stores" | "personal" | "landing";
  version: string;
  author: string;
  projectType: ProjectType;
  blocks: Block[];
}

export interface Activity {
  id: string;
  kind: "project.created" | "client.added" | "order.created" | "page.updated" | "project.deleted";
  text: string;
  createdAt: number;
}

export interface Notification {
  id: string;
  title: string;
  body?: string;
  kind: "project" | "order" | "system";
  read: boolean;
  createdAt: number;
}

interface Settings {
  lang: Lang;
  theme: Theme;
}

interface State {
  currentUserId: string | null;
  users: User[];
  projects: Project[];
  clients: Client[];
  products: Product[];
  orders: Order[];
  media: MediaFile[];
  activities: Activity[];
  notifications: Notification[];
  pages: Page[];
  settings: Settings;

  // auth
  register: (input: { name: string; email: string; password: string; workspaceName: string }) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  resetPassword: (email: string) => { ok: boolean; error?: string };

  // projects
  addProject: (input: { name: string; type: ProjectType; blocks?: Block[] }) => Project;
  updateProject: (id: string, patch: Partial<Project>) => void;
  softDeleteProject: (id: string) => void;
  restoreProject: (id: string) => void;
  duplicateProject: (id: string) => void;

  // clients
  addClient: (input: Omit<Client, "id" | "createdAt" | "lastActivity">) => void;
  removeClient: (id: string) => void;

  // products
  addProduct: (input: Omit<Product, "id" | "createdAt">) => void;
  removeProduct: (id: string) => void;

  // orders
  addOrder: (input: Omit<Order, "id" | "number" | "createdAt">) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;

  // media
  addMedia: (input: Omit<MediaFile, "id" | "createdAt">) => void;
  removeMedia: (id: string) => void;

  // pages / builder
  getOrCreatePage: (projectId: string) => Page;
  savePage: (pageId: string, blocks: Block[]) => void;

  // notifications
  markAllRead: () => void;

  // settings
  setLang: (lang: Lang) => void;
  setTheme: (theme: Theme) => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => Date.now();

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      currentUserId: null,
      users: [],
      projects: [],
      clients: [],
      products: [],
      orders: [],
      media: [],
      activities: [],
      notifications: [],
      pages: [],
      settings: { lang: "ar", theme: "light" },

      register: ({ name, email, password, workspaceName }) => {
        if (get().users.find((u) => u.email === email)) return { ok: false, error: "البريد مسجّل مسبقاً" };
        const isFirst = get().users.length === 0;
        const user: User = { id: uid(), name, email, password, workspaceName, isAdmin: isFirst, createdAt: now() };
        set((s) => ({ users: [...s.users, user], currentUserId: user.id }));
        return { ok: true };
      },
      login: (email, password) => {
        const u = get().users.find((x) => x.email === email && x.password === password);
        if (!u) return { ok: false, error: "بيانات الدخول غير صحيحة" };
        set({ currentUserId: u.id });
        return { ok: true };
      },
      logout: () => set({ currentUserId: null }),
      resetPassword: (email) => {
        if (!get().users.find((u) => u.email === email)) return { ok: false, error: "البريد غير موجود" };
        return { ok: true };
      },

      addProject: ({ name, type, blocks }) => {
        const p: Project = {
          id: uid(),
          name,
          type,
          status: "draft",
          createdAt: now(),
          updatedAt: now(),
          deletedAt: null,
          members: [],
        };
        const page: Page = { id: uid(), projectId: p.id, name: "الصفحة الرئيسية", blocks: blocks ?? [], updatedAt: now() };
        set((s) => ({
          projects: [p, ...s.projects],
          pages: [page, ...s.pages],
          activities: [{ id: uid(), kind: "project.created" as const, text: `تم إنشاء مشروع "${name}"`, createdAt: now() }, ...s.activities].slice(0, 50),
          notifications: [{ id: uid(), title: "مشروع جديد", body: name, kind: "project" as const, read: false, createdAt: now() }, ...s.notifications],
        }));
        return p;
      },
      updateProject: (id, patch) =>
        set((s) => ({
          projects: s.projects.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: now() } : p)),
          activities: [{ id: uid(), kind: "page.updated" as const, text: `تم تحديث المشروع`, createdAt: now() }, ...s.activities].slice(0, 50),
        })),
      softDeleteProject: (id) =>
        set((s) => ({
          projects: s.projects.map((p) => (p.id === id ? { ...p, deletedAt: now() } : p)),
          activities: [{ id: uid(), kind: "project.deleted" as const, text: `تم نقل مشروع للمحذوفات`, createdAt: now() }, ...s.activities].slice(0, 50),
        })),
      restoreProject: (id) =>
        set((s) => ({ projects: s.projects.map((p) => (p.id === id ? { ...p, deletedAt: null } : p)) })),
      duplicateProject: (id) => {
        const p = get().projects.find((x) => x.id === id);
        if (!p) return;
        const copy: Project = { ...p, id: uid(), name: p.name + " (نسخة)", createdAt: now(), updatedAt: now(), deletedAt: null };
        set((s) => ({ projects: [copy, ...s.projects] }));
      },

      addClient: (input) => {
        const c: Client = { ...input, id: uid(), createdAt: now(), lastActivity: now() };
        set((s) => ({
          clients: [c, ...s.clients],
          activities: [{ id: uid(), kind: "client.added" as const, text: `تم إضافة عميل "${c.name}"`, createdAt: now() }, ...s.activities].slice(0, 50),
        }));
      },
      removeClient: (id) => set((s) => ({ clients: s.clients.filter((c) => c.id !== id) })),

      addProduct: (input) => set((s) => ({ products: [{ ...input, id: uid(), createdAt: now() }, ...s.products] })),
      removeProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),

      addOrder: (input) => {
        const number = "#" + Math.floor(1000 + Math.random() * 9000);
        const o: Order = { ...input, id: uid(), number, createdAt: now() };
        set((s) => ({
          orders: [o, ...s.orders],
          activities: [{ id: uid(), kind: "order.created" as const, text: `طلب جديد ${number} من ${o.clientName}`, createdAt: now() }, ...s.activities].slice(0, 50),
          notifications: [{ id: uid(), title: "طلب جديد", body: `${number} — ${o.clientName}`, kind: "order" as const, read: false, createdAt: now() }, ...s.notifications],
        }));
      },
      updateOrderStatus: (id, status) =>
        set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)) })),

      markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),

      addMedia: (input) => set((s) => ({ media: [{ ...input, id: uid(), createdAt: now() }, ...s.media] })),
      removeMedia: (id) => set((s) => ({ media: s.media.filter((m) => m.id !== id) })),

      getOrCreatePage: (projectId) => {
        const existing = get().pages.find((p) => p.projectId === projectId);
        if (existing) return existing;
        const page: Page = { id: uid(), projectId, name: "الصفحة الرئيسية", blocks: [], updatedAt: now() };
        set((s) => ({ pages: [page, ...s.pages] }));
        return page;
      },
      savePage: (pageId, blocks) =>
        set((s) => ({
          pages: s.pages.map((p) => (p.id === pageId ? { ...p, blocks, updatedAt: now() } : p)),
          activities: [{ id: uid(), kind: "page.updated" as const, text: `تم حفظ الصفحة`, createdAt: now() }, ...s.activities].slice(0, 50),
        })),


      setLang: (lang) => set((s) => ({ settings: { ...s.settings, lang } })),
      setTheme: (theme) => set((s) => ({ settings: { ...s.settings, theme } })),
    }),
    { name: "omran-store" },
  ),
);

export const useCurrentUser = () => {
  const uid = useStore((s) => s.currentUserId);
  const users = useStore((s) => s.users);
  return uid ? users.find((u) => u.id === uid) ?? null : null;
};
