"use client";

import type { ReactNode } from "react";
import { Icon } from "@/components/atoms";

export interface WorkspaceTemplateProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
  drawer?: ReactNode;
  mobileNavOpen: boolean;
  onToggleMobileNav: () => void;
  onCloseMobileNav: () => void;
  projectTitle: string;
}

export function WorkspaceTemplate({
  sidebar,
  header,
  children,
  drawer,
  mobileNavOpen,
  onToggleMobileNav,
  onCloseMobileNav,
  projectTitle,
}: WorkspaceTemplateProps) {
  return (
    <div className="min-h-screen flex bg-surface-canvas text-text-primary">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-[var(--layout-sidebar-width)] lg:shrink-0 bg-surface-sidebar border-r border-border-subtle sticky top-0 h-screen">
        {sidebar}
      </aside>

      {/* Mobile Sidebar Drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-surface-overlay backdrop-blur-[2px]"
            onClick={onCloseMobileNav}
            aria-hidden="true"
          />
          <aside className="relative z-10 w-[var(--layout-sidebar-width)] max-w-[85vw] h-full bg-surface-sidebar border-r border-border-default flex flex-col">
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile Top Bar */}
        <div className="lg:hidden flex items-center justify-between gap-space-md px-space-lg h-13 bg-surface-sidebar border-b border-border-subtle sticky top-0 z-20">
          <button
            type="button"
            onClick={onToggleMobileNav}
            aria-label="Abrir navegação"
            className="p-1.5 -ml-1.5 rounded-token-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover cursor-pointer"
          >
            <Icon name="menu" size="md" />
          </button>
          <span className="text-sm font-semibold text-text-primary truncate">
            {projectTitle}
          </span>
          <div className="w-7" aria-hidden="true" />
        </div>

        {/* Project Header */}
        <header className="border-b border-border-subtle bg-surface-canvas">
          <div className="max-w-[var(--layout-max-content)] mx-auto px-space-lg sm:px-space-xl py-space-xl">
            {header}
          </div>
        </header>

        {/* Active View Content */}
        <main className="flex-1 max-w-[var(--layout-max-content)] w-full mx-auto px-space-lg sm:px-space-xl py-space-xl">
          {children}
        </main>
      </div>

      {/* Contextual Slide-over Drawer */}
      {drawer}
    </div>
  );
}
