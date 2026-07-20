/**
 * محسّنات ومساعدات عملية
 */

import { formatDistanceToNow, format } from "date-fns";
import { ar } from "date-fns/locale";

// تنسيق التواريخ
export function formatDate(date: number | Date, style: "short" | "long" = "short"): string {
  const d = typeof date === "number" ? new Date(date) : date;
  if (style === "short") {
    return format(d, "dd/MM/yyyy", { locale: ar });
  }
  return format(d, "EEEE, dd MMMM yyyy", { locale: ar });
}

export function formatTimeAgo(date: number | Date): string {
  return formatDistanceToNow(date, { addSuffix: true, locale: ar });
}

// تنسيق الأرقام والعملات
export function formatCurrency(amount: number, currency: "SAR" | "USD" = "SAR"): string {
  const formatted = amount.toLocaleString("ar", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  });
  return formatted;
}

export function formatNumber(num: number): string {
  return num.toLocaleString("ar");
}

// التحقق من الصحة
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return /^[0-9\-+\s()]{7,}$/.test(phone);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// معالجة النصوص
export function truncate(text: string, length: number = 50): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/--+/g, "-");
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// معالجة الأخطاء
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "حدث خطأ غير متوقع";
}

// معالجة البيانات
export function groupBy<T, K extends string | number>(
  items: T[],
  key: (item: T) => K,
): Record<K, T[]> {
  return items.reduce(
    (groups, item) => {
      const k = key(item);
      if (!groups[k]) {
        groups[k] = [];
      }
      groups[k].push(item);
      return groups;
    },
    {} as Record<K, T[]>,
  );
}

export function unique<T>(items: T[], by?: (item: T) => string | number): T[] {
  if (!by) {
    return [...new Set(items)];
  }
  const seen = new Set<string | number>();
  return items.filter((item) => {
    const key = by(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function sortBy<T>(items: T[], by: (item: T) => string | number, order: "asc" | "desc" = "asc"): T[] {
  const sorted = [...items].sort((a, b) => {
    const aVal = by(a);
    const bVal = by(b);
    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
  return sorted;
}

// معالجة الملفات
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
}

export function isImageFile(filename: string): boolean {
  const ext = getFileExtension(filename).toLowerCase();
  return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext);
}

// معالجة الكائنات
export function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const output: Record<string, unknown> = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      const sourceValue = source[key as keyof T];
      const targetValue = target[key as keyof T];

      if (isObject(sourceValue)) {
        if (!(key in target)) {
          output[key] = sourceValue;
        } else {
          output[key] = deepMerge(
            (targetValue as Record<string, unknown>) ?? {},
            (sourceValue as Record<string, unknown>) ?? {},
          );
        }
      } else {
        output[key] = sourceValue;
      }
    });
  }
  return output as T;
}

function isObject(item: unknown): item is Record<string, unknown> {
  return typeof item === "object" && item !== null && !Array.isArray(item);
}

export function removeUndefined<T extends Record<string, any>>(obj: T): T {
  const result = { ...obj };
  Object.keys(result).forEach((key) => {
    if (result[key] === undefined) {
      delete result[key];
    }
  });
  return result;
}

// معالجة المؤقتات
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  interval: number = 300,
): (...args: Parameters<T>) => void {
  let lastTime = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastTime >= interval) {
      fn(...args);
      lastTime = now;
    }
  };
}

// حفظ واسترجاع البيانات
export const storage = {
  get<T>(key: string, defaultValue?: T): T | undefined {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
    }
  },
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Failed to clear storage:", error);
    }
  },
};
