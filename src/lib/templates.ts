import type { Template, Block } from "./store";

const uid = () => Math.random().toString(36).slice(2, 10);
const b = (type: Block["type"], props: Record<string, any> = {}): Block => ({ id: uid(), type, props });

export const TEMPLATES: Template[] = [
  {
    id: "tpl-corp-1",
    name: "شركة احترافية",
    category: "companies",
    version: "1.0.0",
    author: "فريق عمران",
    projectType: "website",
    blocks: [
      b("hero", { title: "نبني حلولاً رقمية تصنع الفرق", subtitle: "شركة رائدة في تقديم خدمات التحول الرقمي للأعمال", cta: "ابدأ الآن" }),
      b("features", { title: "خدماتنا", items: [{ title: "تصميم", desc: "واجهات عصرية" }, { title: "تطوير", desc: "منتجات قابلة للتوسع" }, { title: "دعم", desc: "متابعة مستمرة" }] }),
      b("testimonials", { items: [{ name: "أحمد", text: "خدمة ممتازة" }, { name: "سارة", text: "تجربة رائعة" }] }),
      b("contact", { title: "تواصل معنا" }),
      b("footer", { text: "© 2026 شركتك" }),
    ],
  },
  {
    id: "tpl-store-1",
    name: "متجر إلكتروني",
    category: "stores",
    version: "1.0.0",
    author: "فريق عمران",
    projectType: "store",
    blocks: [
      b("hero", { title: "منتجات فاخرة بأسعار مميزة", subtitle: "تسوق أحدث المجموعات مع شحن سريع", cta: "تسوق الآن" }),
      b("gallery", { items: [] }),
      b("features", { title: "لماذا نحن؟", items: [{ title: "شحن سريع", desc: "خلال 48 ساعة" }, { title: "دفع آمن", desc: "بوابات موثوقة" }, { title: "استرجاع", desc: "خلال 14 يوم" }] }),
      b("footer", { text: "© 2026 متجرك" }),
    ],
  },
  {
    id: "tpl-personal-1",
    name: "بورتفوليو شخصي",
    category: "personal",
    version: "1.0.0",
    author: "فريق عمران",
    projectType: "portfolio",
    blocks: [
      b("hero", { title: "مرحباً، أنا مصمم", subtitle: "أصمم تجارب رقمية جميلة وعملية", cta: "شاهد أعمالي" }),
      b("text", { content: "نبذة عني: خبرة 5 سنوات في تصميم واجهات المستخدم." }),
      b("gallery", { items: [] }),
      b("contact", { title: "لنعمل معاً" }),
      b("footer", { text: "© 2026" }),
    ],
  },
  {
    id: "tpl-landing-1",
    name: "صفحة هبوط",
    category: "landing",
    version: "1.0.0",
    author: "فريق عمران",
    projectType: "landing",
    blocks: [
      b("hero", { title: "أطلق منتجك بأسلوب", subtitle: "احصل على وصول مبكر مجاناً", cta: "سجّل الآن" }),
      b("features", { title: "المميزات", items: [{ title: "سهل", desc: "بدون خبرة" }, { title: "سريع", desc: "دقائق فقط" }, { title: "قوي", desc: "أدوات احترافية" }] }),
      b("testimonials", { items: [{ name: "محمد", text: "غيّر طريقة عملي" }] }),
      b("contact", { title: "انضم لقائمة الانتظار" }),
      b("footer", { text: "© 2026" }),
    ],
  },
];

export const CATEGORY_LABELS: Record<Template["category"], string> = {
  companies: "الشركات",
  stores: "المتاجر",
  personal: "الأعمال الشخصية",
  landing: "صفحات الهبوط",
};
