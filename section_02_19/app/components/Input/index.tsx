// src/components/Input/index.tsx

import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export default function Input({
  className,
  type = "text",
  ...props
}: React.ComponentProps<"input">) {
  const inputClasses = twMerge(
    clsx(
      "w-full rounded-md border border-gray-300 px-3 py-1 shadow-xs",
      className,
    ),
  );

  return <input type={type} className={inputClasses} {...props} />;
}
