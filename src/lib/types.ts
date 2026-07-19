// Core Auth & User Types
export type Role = "owner" | "admin" | "editor" | "member";
export type Lang = "ar" | "en";
export type Theme = "light" | "dark";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // TODO: hash this with proper bcrypt
  workspaceName: string;
  role: Role;
  avatar?: string;
  createdAt: number;
  updatedAt: number;
}

// Project Types
export type ProjectType = "website" | "store" | "landing" | "portfolio";
export type ProjectStatus = "draft" | "published" | "archived";

export interface ProjectMember {
  id: string;
  email: string;
  role: Role;
  joinedAt: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  type: ProjectType;
  status: ProjectStatus;
  cover?: string;
  ownerId: string;
  members: ProjectMember[];
  createdAt: number;
  updatedAt: number;
  deletedAt?: number | null;
  publishedUrl?: string;
}

// Client/Customer Types
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  tags: string[];
  notes?: string;
  address?: string;
  city?: string;
  country?: string;
  lastActivity: number;
  createdAt: number;
  updatedAt: number;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  costPrice?: number;
  stock: number;
  sku?: string;
  category?: string;
  image?: string;
  images?: string[];
  createdAt: number;
  updatedAt: number;
}

// Order Types
export type OrderStatus = "pending" | "paid" | "processing" | "completed" | "cancelled" | "shipped";

export interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  items: OrderItem[];
  subtotal: number;
  tax?: number;
  shipping?: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

// Media & File Types
export interface MediaFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  projectId?: string;
  uploadedBy: string;
  createdAt: number;
}

// Page Builder Types
export type BlockType =
  | "hero"
  | "text"
  | "image"
  | "button"
  | "gallery"
  | "features"
  | "testimonials"
  | "contact"
  | "footer"
  | "cta"
  | "divider"
  | "team"
  | "faq"
  | "pricing";

export interface BlockProps {
  [key: string]: unknown;
}

export interface Block {
  id: string;
  type: BlockType;
  props: BlockProps;
  order: number;
}

export interface Page {
  id: string;
  projectId: string;
  name: string;
  slug: string;
  blocks: Block[];
  isPublished: boolean;
  createdAt: number;
  updatedAt: number;
}

// Template Types
export type TemplateCategory = "companies" | "stores" | "personal" | "landing";

export interface Template {
  id: string;
  name: string;
  description?: string;
  category: TemplateCategory;
  version: string;
  author: string;
  projectType: ProjectType;
  preview?: string;
  blocks: Block[];
  createdAt: number;
}

// Activity & Notification Types
export type ActivityKind =
  | "project.created"
  | "project.updated"
  | "project.published"
  | "project.deleted"
  | "client.added"
  | "client.updated"
  | "order.created"
  | "order.updated"
  | "product.added"
  | "page.updated"
  | "member.added"
  | "member.removed";

export interface Activity {
  id: string;
  kind: ActivityKind;
  text: string;
  icon?: string;
  relatedId?: string;
  createdAt: number;
}

export type NotificationKind = "project" | "order" | "client" | "system" | "team";

export interface Notification {
  id: string;
  title: string;
  body?: string;
  kind: NotificationKind;
  read: boolean;
  relatedId?: string;
  createdAt: number;
}

// Settings
export interface Settings {
  lang: Lang;
  theme: Theme;
  notifications: {
    email: boolean;
    orders: boolean;
    members: boolean;
  };
}

// Form Validation Result
export interface ValidationResult<T> {
  ok: boolean;
  error?: string;
  data?: T;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
