import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-bg-base hover:bg-primary-dark shadow-lg shadow-primary/20 hover:shadow-primary/30",
        outline:
          "border border-border text-text-100 hover:border-border-hover hover:bg-bg-elevated hover:-translate-y-px motion-reduce:hover:translate-y-0",
        ghost: "text-text-70 hover:text-text-100 hover:bg-bg-elevated",
        secondary:
          "bg-bg-elevated text-text-100 hover:bg-bg-surface border border-border hover:-translate-y-px motion-reduce:hover:translate-y-0",
        // CTA de conversión: cálido — único color de acción de la vista
        // (Von Restorff; el cyan queda para marca/informativo)
        cta: "bg-gradient-to-r from-accent-warm to-accent-warm-dark text-[#221008] font-semibold shadow-lg shadow-accent-warm/25 hover:shadow-accent-warm/40 hover:scale-[1.02]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
