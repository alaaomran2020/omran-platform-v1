import React from "react";
import { AlertCircle, Plus, Heart, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * مكون حالة فارغة محسّنة
 */
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "info" | "warning" | "error" | "success";
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = "info",
}: EmptyStateProps) {
  const variantColors = {
    info: "bg-blue-50/50 text-blue-600",
    warning: "bg-yellow-50/50 text-yellow-600",
    error: "bg-red-50/50 text-red-600",
    success: "bg-green-50/50 text-green-600",
  };

  const defaultIcons = {
    info: <AlertCircle className="h-12 w-12 opacity-40" />,
    warning: <AlertCircle className="h-12 w-12 opacity-40" />,
    error: <AlertCircle className="h-12 w-12 opacity-40" />,
    success: <Heart className="h-12 w-12 opacity-40" />,
  };

  return (
    <div className={`rounded-2xl border border-dashed p-12 text-center ${variantColors[variant]}`}>
      <div className="mx-auto mb-4 flex justify-center">
        {icon || defaultIcons[variant]}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="mt-2 text-sm opacity-75">{description}</p>}
      {action && (
        <Button
          onClick={action.onClick}
          className="mt-4 gap-2"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          {action.label}
        </Button>
      )}
    </div>
  );
}

/**
 * مكون حالة تحميل
 */
export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted ${className}`}
    />
  );
}

/**
 * مكون قائمة الهياكل العظمية
 */
export function SkeletonTable() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-12 flex-1 rounded-lg" />
          <Skeleton className="h-12 w-24 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

/**
 * مكون كشف كلمة المرور
 */
export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export function PasswordInput(props: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={showPassword ? "text" : "password"}
        className={`w-full rounded-md border border-input bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
          props.className || ""
        }`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

/**
 * مكون شريط التقدم
 */
export interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: "default" | "success" | "warning" | "error";
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  variant = "default",
  showLabel = true,
}: ProgressBarProps) {
  const percentage = (value / max) * 100;

  const variantColors = {
    default: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  };

  return (
    <div className="space-y-2">
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full transition-all ${variantColors[variant]}`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-right text-xs text-muted-foreground">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}

/**
 * مكون البطاقة المحملة
 */
export function LoadingCard() {
  return (
    <div className="space-y-4 rounded-lg border p-6">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

/**
 * مكون شارة الحالة
 */
export interface StatusBadgeProps {
  status: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
}

export function StatusBadge({ status, variant = "default" }: StatusBadgeProps) {
  const variantStyles = {
    default: "bg-slate-100 text-slate-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variantStyles[variant]}`}>
      {status}
    </span>
  );
}

/**
 * مكون نموذج بسيط محسّن
 */
export interface SimpleFormProps {
  title: string;
  fields: {
    name: string;
    label: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
  }[];
  onSubmit: () => void;
  submitLabel?: string;
  loading?: boolean;
}

export function SimpleForm({
  title,
  fields,
  onSubmit,
  submitLabel = "حفظ",
  loading = false,
}: SimpleFormProps) {
  const [values, setValues] = React.useState<Record<string, string>>({});

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <label className="text-sm font-medium">{field.label}</label>
          <input
            type={field.type || "text"}
            placeholder={field.placeholder}
            required={field.required}
            value={values[field.name] ?? field.value ?? ""}
            onChange={(e) => {
              setValues({ ...values, [field.name]: e.target.value });
              field.onChange?.(e.target.value);
            }}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading}
          />
        </div>
      ))}
      <Button
        onClick={onSubmit}
        disabled={loading}
        className="w-full bg-gradient-primary"
      >
        {loading ? "جاري..." : submitLabel}
      </Button>
    </div>
  );
}
