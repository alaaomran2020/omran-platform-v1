import { defineConfig } from "@vitejs/vite-tanstack-config";

export default defineConfig({
  // هنا نمرر إعدادات Vite الإضافية لتحديد مسار GitHub Pages
  vite: {
    base: '/omran-platform-v1/',
  },
  tanstackStart: {
    // إعداد السيرفر الأصلي للمشروع
    server: { entry: "server" },
  },
});
