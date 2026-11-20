/**
 * Spacing, Radius & Layout Design Tokens
 * Mirrors src/styles/tokens/spacing.css for consistent spacing across Atomic components.
 */
export const spacingTokens = {
  "2xs": "var(--space-2xs)",
  xs: "var(--space-xs)",
  sm: "var(--space-sm)",
  md: "var(--space-md)",
  lg: "var(--space-lg)",
  xl: "var(--space-xl)",
  "2xl": "var(--space-2xl)",
  "3xl": "var(--space-3xl)",
} as const;

export const radiusTokens = {
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  full: "var(--radius-full)",
} as const;

export const layoutTokens = {
  sidebarWidth: "var(--layout-sidebar-width)",
  conceptListWidth: "var(--layout-concept-list-width)",
  drawerWidth: "var(--layout-drawer-width)",
  maxContent: "var(--layout-max-content)",
} as const;

export type SpacingToken = keyof typeof spacingTokens;
export type RadiusToken = keyof typeof radiusTokens;
