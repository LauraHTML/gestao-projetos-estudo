import {
  colorToneTextClass,
  iconRegistry,
  iconSizes,
  iconStrokeWidth,
  type ColorTone,
  type IconName,
  type IconSize,
  type IconStroke,
} from "@/tokens";

export interface IconProps {
  name: IconName;
  size?: IconSize;
  stroke?: IconStroke;
  tone?: ColorTone;
  className?: string;
  "aria-hidden"?: boolean;
}

export function Icon({
  name,
  size = "sm",
  stroke = "default",
  tone,
  className = "",
  "aria-hidden": ariaHidden = true,
}: IconProps) {
  const Component = iconRegistry[name];
  const toneClass = tone ? colorToneTextClass[tone] : "";

  return (
    <Component
      size={iconSizes[size]}
      strokeWidth={iconStrokeWidth[stroke]}
      aria-hidden={ariaHidden}
      className={`shrink-0 ${toneClass} ${className}`.trim()}
    />
  );
}
