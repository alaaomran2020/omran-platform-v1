import { z } from "zod";

// Auth Validation
export const loginSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("بريد إلكتروني غير صحيح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير")
    .regex(/[0-9]/, "يجب أن تحتوي على رقم")
    .regex(/[^A-Za-z0-9]/, "يجب أن تحتوي على رمز خاص"),
  workspaceName: z.string().min(2, "اسم مساحة العمل قصير جداً"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

export const resetPasswordSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صحيح"),
});

// Project Validation
export const createProjectSchema = z.object({
  name: z.string().min(2, "اسم المشروع قصير جداً").max(100, "اسم المشروع طويل جداً"),
  type: z.enum(["website", "store", "landing", "portfolio"]),
  description: z.string().max(500, "الوصف طويل جداً").optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

// Client Validation
export const createClientSchema = z.object({
  name: z.string().min(2, "اسم العميل قصير جداً"),
  email: z.string().email("بريد إلكتروني غير صحيح"),
  phone: z.string().regex(/^[0-9\-+\s()]+$/, "رقم هاتف غير صحيح").optional().or(z.literal("")),
  company: z.string().max(100, "اسم الشركة طويل جداً").optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().max(1000, "الملاحظات طويلة جداً").optional(),
  address: z.string().max(200, "العنوان طويل جداً").optional(),
  city: z.string().max(100, "المدينة طويلة جداً").optional(),
  country: z.string().max(100, "الدولة طويلة جداً").optional(),
});

export const updateClientSchema = createClientSchema.partial();

// Product Validation
export const createProductSchema = z.object({
  name: z.string().min(2, "اسم المنتج قصير جداً").max(100, "اسم المنتج طويل جداً"),
  description: z.string().max(1000, "الوصف طويل جداً").optional(),
  price: z.number().min(0, "السعر لا يمكن أن يكون سالباً"),
  costPrice: z.number().min(0, "سعر التكلفة لا يمكن أن يكون سالباً").optional(),
  stock: z.number().int().min(0, "المخزون لا يمكن أن يكون سالباً"),
  sku: z.string().max(50, "كود المنتج طويل جداً").optional(),
  category: z.string().max(100, "فئة المنتج طويلة جداً").optional(),
});

export const updateProductSchema = createProductSchema.partial();

// Order Validation
export const createOrderSchema = z.object({
  clientId: z.string().min(1, "اختر عميلاً"),
  items: z.array(z.object({
    productId: z.string().min(1, "معرف المنتج مطلوب"),
    qty: z.number().int().min(1, "الكمية يجب أن تكون على الأقل 1"),
    price: z.number().min(0, "السعر لا يمكن أن يكون سالباً"),
  })).min(1, "يجب أن يكون هناك عنصر واحد على الأقل"),
  notes: z.string().max(500, "الملاحظات طويلة جداً").optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "paid", "processing", "completed", "cancelled", "shipped"]),
});

// Page Builder Validation
export const createPageSchema = z.object({
  name: z.string().min(2, "اسم الصفحة قصير جداً"),
  slug: z.string().regex(/^[a-z0-9-]*$/, "يجب استخدام أحرف صغيرة وأرقام وشرطات فقط"),
});

export const updatePageSchema = createPageSchema.partial();

export const blockPropsSchema = z.record(z.unknown());

export const createBlockSchema = z.object({
  type: z.enum([
    "hero", "text", "image", "button", "gallery", "features",
    "testimonials", "contact", "footer", "cta", "divider", "team", "faq", "pricing"
  ]),
  props: blockPropsSchema,
});

// Settings Validation
export const updateSettingsSchema = z.object({
  lang: z.enum(["ar", "en"]).optional(),
  theme: z.enum(["light", "dark"]).optional(),
  notifications: z.object({
    email: z.boolean().optional(),
    orders: z.boolean().optional(),
    members: z.boolean().optional(),
  }).optional(),
});

// Type Exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type CreatePageInput = z.infer<typeof createPageSchema>;
export type UpdatePageInput = z.infer<typeof updatePageSchema>;
export type CreateBlockInput = z.infer<typeof createBlockSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;

// Validation Helpers
export function validate<T>(schema: z.ZodSchema, data: unknown): { ok: true; data: T } | { ok: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { ok: true, data: validated as T };
  } catch (err) {
    if (err instanceof z.ZodError) {
      const firstError = err.errors[0];
      return { ok: false, error: firstError.message };
    }
    return { ok: false, error: "فشل التحقق من البيانات" };
  }
}

export function validateAsync<T>(schema: z.ZodSchema, data: unknown): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  return schema.parseAsync(data)
    .then((validated) => ({ ok: true, data: validated as T }))
    .catch((err) => {
      if (err instanceof z.ZodError) {
        const firstError = err.errors[0];
        return { ok: false, error: firstError.message };
      }
      return { ok: false, error: "فشل التحقق من البيانات" };
    });
}
