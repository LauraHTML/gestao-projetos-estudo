import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Clock,
  Code2,
  Database,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  FolderGit2,
  GitBranch,
  Layers,
  Link2,
  Lock,
  Menu,
  Milestone,
  Network,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
  Unlock,
  X,
  type LucideIcon,
} from "lucide-react";

/**
 * Icon Design Tokens
 * Centralizes every icon glyph, size, and stroke weight used in the system.
 */
export const iconRegistry = {
  // Navigation & structure
  roadmap: GitBranch,
  milestone: Milestone,
  concepts: BookOpen,
  blockers: Network,
  project: FolderGit2,
  layers: Layers,
  menu: Menu,

  // Task & concept states
  done: CheckCircle2,
  check: Check,
  inProgress: Clock,
  idle: Circle,
  locked: Lock,
  unlocked: Unlock,
  warning: AlertTriangle,

  // Actions & editing
  add: Plus,
  edit: Edit3,
  preview: Eye,
  delete: Trash2,
  search: Search,
  close: X,
  link: Link2,
  external: ExternalLink,
  arrowRight: ArrowRight,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  reset: RotateCcw,

  // Study domains & notes
  note: FileText,
  code: Code2,
  database: Database,
  highlight: Sparkles,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconRegistry;

export const iconSizes = {
  xs: 13,
  sm: 15,
  md: 17,
  lg: 20,
  xl: 24,
} as const;

export type IconSize = keyof typeof iconSizes;

export const iconStrokeWidth = {
  thin: 1.5,
  default: 1.75,
  bold: 2.1,
} as const;

export type IconStroke = keyof typeof iconStrokeWidth;
