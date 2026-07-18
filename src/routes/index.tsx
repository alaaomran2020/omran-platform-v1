import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sparkles, LayoutDashboard, Users, ShoppingBag, Boxes, ShieldCheck,
  ArrowLeft, Wand2, LayoutTemplate, Image as ImageIcon, CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "منصة عمران — نظام تشغيل الأعمال الرقمي" },
      { name: "description", content: "منصة عربية متكاملة لبناء وإدارة المشاريع الرقمية: مواقع، متاجر، عملاء، طلبات وفرق — بدون خبرة تقنية." },
      { property: "og:title", content: "منصة عمران — نظام تشغيل الأعمال الرقمي" },
      { property: "og:description", content: "أنشئ وأدر مشاريعك الرقمية من مكان واحد." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, ease: "easeOut" } }),
};

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Ambient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] overflow-hidden">
        <div className="absolute right-1/4 top-[-120px] h-[400px] w-[400px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute left-1/4 top-[-80px] h-[320px] w-[320px] rounded-full bg-accent/25 blur-3xl" />
      </div>

      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-extrabold">منصة عمران</span>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost"><Link to="/auth">تسجيل الدخول</Link></Button>
          <Button asChild className="bg-gradient-primary shadow-elegant">
            <Link to="/auth" search={{ tab: "register" }}>ابدأ مجاناً</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pt-10 pb-24">
        {/* HERO */}
        <section className="text-center">
          <motion.div
            variants={fadeUp} initial="hidden" animate="show"
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground shadow-card"
          >
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            الإصدار 1.0 — نظام تشغيل أعمال رقمي عربي
          </motion.div>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl"
          >
            نظام واحد
            <br />
            لكل <span className="bg-gradient-primary bg-clip-text text-transparent">أعمالك الرقمية</span>
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            أنشئ مواقع ومتاجر، أدِر عملاءك وطلباتك، وابنِ صفحاتك بصرياً —
            كل ذلك من لوحة تحكم أنيقة مصمّمة للسوق العربي.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Button asChild size="lg" className="bg-gradient-primary shadow-elegant gap-2">
              <Link to="/auth" search={{ tab: "register" }}>
                ابدأ مشروعك مجاناً <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/auth">لدي حساب</Link>
            </Button>
          </motion.div>

          <motion.ul
            variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
          >
            {["بدون بطاقة ائتمان", "دعم RTL كامل", "وضع داكن", "قوالب جاهزة"].map((t) => (
              <li key={t} className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" /> {t}
              </li>
            ))}
          </motion.ul>
        </section>

        {/* MOCK DASHBOARD */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
          className="relative mx-auto mt-16 max-w-5xl"
        >
          <div className="rounded-2xl border border-border bg-card p-2 shadow-elegant">
            <div className="rounded-xl bg-gradient-warm p-6 md:p-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">لوحة التحكم</div>
                  <div className="text-lg font-bold">مرحباً، أحمد 👋</div>
                </div>
                <div className="rounded-lg bg-gradient-primary px-3 py-1.5 text-xs text-primary-foreground shadow-elegant">
                  + مشروع جديد
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  { l: "المشاريع", v: 12, c: "text-primary" },
                  { l: "العملاء", v: 47, c: "text-accent" },
                  { l: "الطلبات", v: 83, c: "text-success" },
                  { l: "الملفات", v: 128, c: "text-warning" },
                ].map((s) => (
                  <div key={s.l} className="rounded-xl bg-card p-4 shadow-card">
                    <div className={`text-2xl font-bold ${s.c}`}>{s.v}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* FEATURES */}
        <section className="mt-24">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">المميزات</div>
            <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">كل ما تحتاجه لتشغيل عملك</h2>
            <p className="mt-3 text-muted-foreground">أدوات احترافية بواجهة عربية بسيطة، تعمل معاً بسلاسة.</p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-right">
            {[
              { icon: LayoutDashboard, title: "لوحة تحكم موحدة", desc: "إحصائيات فورية للمشاريع، العملاء، الطلبات والملفات." },
              { icon: Wand2, title: "بنّاء صفحات بصري", desc: "اسحب المكونات وعدّل الخصائص — بدون كتابة كود." },
              { icon: LayoutTemplate, title: "قوالب جاهزة", desc: "شركات، متاجر، صفحات هبوط وأعمال شخصية." },
              { icon: Boxes, title: "إدارة مشاريع مرنة", desc: "أنشئ، انسخ، أرشف، واسترجع بسهولة." },
              { icon: Users, title: "CRM للعملاء", desc: "جهات اتصال، وسوم، ملاحظات ونشاطات مرتبطة." },
              { icon: ShoppingBag, title: "متجر وطلبات", desc: "منتجات، مخزون، وحالات طلب واضحة." },
              { icon: ImageIcon, title: "مكتبة ملفات", desc: "ارفع صورك ومستنداتك واستخدمها في البنّاء." },
              { icon: ShieldCheck, title: "صلاحيات وفرق", desc: "أدوار Owner / Admin / Editor / Member." },
              { icon: Sparkles, title: "عربي أولاً", desc: "RTL، خطوط عربية أنيقة، ووضع داكن." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} custom={i % 3}
                className="group rounded-2xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant"
              >
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <motion.section
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}
          className="relative mt-24 overflow-hidden rounded-3xl bg-gradient-primary p-10 text-center text-primary-foreground shadow-elegant md:p-16"
        >
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)]" />
          <div className="relative">
            <h2 className="text-3xl font-extrabold md:text-4xl">جاهز لتشغيل مشروعك؟</h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">
              انضم لأصحاب الأعمال الذين يديرون كل شيء من مكان واحد — بدون تعقيد.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-6 bg-white text-primary hover:bg-white/90">
              <Link to="/auth" search={{ tab: "register" }}>أنشئ حسابك المجاني</Link>
            </Button>
          </div>
        </motion.section>

        <footer className="mt-16 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © 2026 منصة عمران — كل الحقوق محفوظة.
        </footer>
      </main>
    </div>
  );
}
