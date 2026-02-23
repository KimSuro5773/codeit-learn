import { cva } from "class-variance-authority";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "secondary" | "destructive" | "outline";
  className?: string;
};

const badgeVariants = cva(
  "rounded-full bg-black px-2 py-1 text-xs font-medium text-white",
  {
    variants: {
      variant: {
        secondary: "bg-gray-200 text-black",
        destructive: "bg-red-500 text-white",
        outline: "bg-transparent text-black border border-gray-200",
      },

      defaultVariants: {
        variant: "secondary",
      },
    },
  },
);

export default function Badge({ variant, className, children }: BadgeProps) {
  return (
    <span className={twMerge(clsx(badgeVariants({ variant, className })))}>
      {children}
    </span>
  );
}
