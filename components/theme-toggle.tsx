"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";

type ThemeToggleLabels = {
  label: string;
  light: string;
  dark: string;
  switchToLight: string;
  switchToDark: string;
};

const fallbackLabels: ThemeToggleLabels = {
  label: "Theme",
  light: "Light",
  dark: "Dark",
  switchToLight: "Switch to light theme",
  switchToDark: "Switch to dark theme",
};

export function ThemeToggle({
  labels,
}: Readonly<{ labels?: ThemeToggleLabels }>) {
  const copy = labels ?? fallbackLabels;
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted && resolvedTheme === "light" ? "light" : "dark";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  const Icon = currentTheme === "dark" ? Moon : Sun;
  const visibleLabel = mounted
    ? currentTheme === "dark"
      ? copy.dark
      : copy.light
    : copy.label;
  const ariaLabel = mounted
    ? nextTheme === "light"
      ? copy.switchToLight
      : copy.switchToDark
    : copy.label;

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      title={ariaLabel}
      disabled={!mounted}
      onClick={() => setTheme(nextTheme)}
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "gap-2 rounded-full border border-border bg-surface-strong px-3 text-foreground hover:bg-surface hover:text-foreground disabled:cursor-default disabled:opacity-70",
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      <span>{visibleLabel}</span>
    </button>
  );
}
