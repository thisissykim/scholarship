"use client";

import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...inputs: any[]) => twMerge(clsx(inputs));

export function PillButton(props: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean; tone?: "default" | "brand" }) {
  const { className, active, tone = "default", ...rest } = props;
  return <button className={cn("rounded-pill px-4 py-2 text-xs font-bold uppercase tracking-[1.6px] transition", tone === "brand" || active ? "bg-brand text-black" : "bg-surface-alt text-secondary border border-border", className)} {...rest} />;
}

export function StatusBadge({ status }: { status: "ELIGIBLE" | "CONDITIONAL" | "INELIGIBLE" }) {
  const map = { ELIGIBLE: "bg-brand text-black", CONDITIONAL: "bg-warning text-black", INELIGIBLE: "bg-negative text-white" };
  const label = { ELIGIBLE: "지원가능", CONDITIONAL: "조건부", INELIGIBLE: "지원불가" };
  return <span className={cn("inline-flex items-center rounded-badge px-2 py-1 text-[10.5px] font-semibold capitalize", map[status])}>{label[status]}</span>;
}
