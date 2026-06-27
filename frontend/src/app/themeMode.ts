export type VitaThemeMode = "light" | "dark";

const themeModeStorageKey = "vita-theme-mode";

function isThemeMode(value: string | null): value is VitaThemeMode {
  return value === "light" || value === "dark";
}

export function getStoredThemeMode(): VitaThemeMode {
  if (typeof window === "undefined") {
    return "dark";
  }

  const storedMode = window.localStorage.getItem(themeModeStorageKey);

  return isThemeMode(storedMode) ? storedMode : "dark";
}

export function applyThemeMode(mode: VitaThemeMode) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;

  root.classList.toggle("vita-theme-light", mode === "light");
  root.classList.toggle("vita-theme-dark", mode === "dark");
  root.style.colorScheme = mode;
}

export function persistThemeMode(mode: VitaThemeMode) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(themeModeStorageKey, mode);
  }

  applyThemeMode(mode);
}
