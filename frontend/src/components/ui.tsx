import { Link as RouterLink } from "react-router-dom";
import type { ComponentPropsWithoutRef, ElementType } from "react";

type ButtonProps = {
  as?: ElementType;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  children: React.ReactNode;
} & Record<string, unknown>;

export function Button({
  as: Component = "button",
  className = "",
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";
  const styles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-500",
    secondary:
      "bg-white text-slate-900 border border-slate-200 hover:bg-slate-100",
    ghost: "bg-transparent text-slate-200 hover:text-white",
  };

  return (
    <Component className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </Component>
  );
}

export function Card({
  className = "",
  noPadding = false,
  ...props
}: ComponentPropsWithoutRef<"div"> & {
  noPadding?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border border-slate-200/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl ${
        noPadding ? "p-0" : "p-6"
      } ${className}`}
      {...props}
    />
  );
}

export function Input({
  className = "",
  ...props
}: ComponentPropsWithoutRef<"input">) {
  return (
    <input
      className={`w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${className}`}
      {...props}
    />
  );
}

export function TextArea({
  className = "",
  ...props
}: ComponentPropsWithoutRef<"textarea">) {
  return (
    <textarea
      className={`w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${className}`}
      {...props}
    />
  );
}

export function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 ${className}`}
    >
      {children}
    </span>
  );
}

export function PageHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-500">
        Vita wellness
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-300 sm:text-4xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function SectionCard({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-3 text-slate-900">
        <div className="grid h-12 w-12 place-items-center rounded-3xl bg-indigo-500/10 text-indigo-600">
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <div>{children}</div>
    </Card>
  );
}

export function NavLink({
  to,
  children,
  className = "",
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <RouterLink
      to={to}
      className={`text-sm font-medium text-slate-600 hover:text-slate-900 ${className}`}
    >
      {children}
    </RouterLink>
  );
}
