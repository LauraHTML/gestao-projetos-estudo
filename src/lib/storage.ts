import type { StudyProject } from "@/types/study";

const STORAGE_KEY = "nexo.study.projects.v1";

export function loadProjectsFromStorage(): StudyProject[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed as StudyProject[];
  } catch {
    return null;
  }
}

export function saveProjectsToStorage(projects: StudyProject[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch {
    // Silently ignore storage quota errors in private browsing
  }
}

export function clearProjectsStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}
