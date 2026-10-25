import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "gold" | "navy" | "outline" | "ghost" | "whatsapp";

const VARIANT_CLASS: Record<Variant, string> = {
  gold: "btn-gold",
  navy: "btn-navy",
  outline: "btn-outline",
  ghost: "btn-ghost",
  whatsapp: "btn-whatsapp",
};

type CommonProps = {
  variant?: Variant;
  size?: "md" | "sm";
  className?: string;
  children: React.ReactNode;
};

type AsLink = CommonProps & {
  href: string;
  external?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;

type AsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

export function Button(props: AsLink | AsButton) {
  const { variant = "gold", size = "md", className, children } = props;
  const classes = cn("btn", VARIANT_CLASS[variant], size === "sm" && "btn-sm", className);

  if ("href" in props && props.href !== undefined) {
    const { href, external, variant: _v, size: _s, className: _c, children: _ch, ...rest } =
      props;
    if (external) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, href: _h, ...rest } =
    props as AsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
