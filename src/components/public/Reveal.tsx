import { cn } from "@/lib/utils";

/**
 * Entrance animation that is SSR-safe: the content is part of the server HTML
 * and animates in with a pure CSS keyframe (no JS required), so it is never
 * blank before hydration and remains visible if JS is disabled.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const Component = Tag as React.ElementType;
  return (
    <Component
      className={cn("motion-safe:animate-fade-up", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Component>
  );
}
