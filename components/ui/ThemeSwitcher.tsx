"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

type ThemePreference = "system" | "light" | "dark";

const options = [
  { value: "system" as const, label: "System", icon: Monitor },
  { value: "light" as const, label: "Light", icon: Sun },
  { value: "dark" as const, label: "Dark", icon: Moon },
];

function applyTheme(preference: ThemePreference) {
  if (preference === "system") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.dataset.theme = preference;
  }
}

function getThemePreference(): ThemePreference {
  const saved = window.localStorage.getItem("portfolio-theme");
  return saved === "light" || saved === "dark" ? saved : "system";
}

function subscribeToTheme(callback: () => void) {
  const sync = () => {
    applyTheme(getThemePreference());
    callback();
  };
  window.addEventListener("storage", sync);
  window.addEventListener("portfolio-theme-change", sync);
  return () => {
    window.removeEventListener("storage", sync);
    window.removeEventListener("portfolio-theme-change", sync);
  };
}

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const preference = useSyncExternalStore(subscribeToTheme, getThemePreference, () => "system");

  const selectTheme = (next: ThemePreference) => {
    applyTheme(next);
    if (next === "system") {
      window.localStorage.removeItem("portfolio-theme");
    } else {
      window.localStorage.setItem("portfolio-theme", next);
    }
    window.dispatchEvent(new Event("portfolio-theme-change"));
  };

  return (
    <div className={`theme-switcher ${compact ? "theme-switcher-compact" : ""}`} role="group" aria-label="Color theme">
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          aria-label={`Use ${label.toLowerCase()} theme`}
          aria-pressed={preference === value}
          title={`${label} theme`}
          onClick={() => selectTheme(value)}
        >
          <Icon size={compact ? 15 : 16} aria-hidden="true" />
          {!compact && <span>{label}</span>}
        </button>
      ))}
    </div>
  );
}
