import { cn } from "@/lib/cn";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, success, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "h-9 w-full min-w-0 rounded-lg border bg-white px-3 text-sm text-neutral-900 outline-none transition-colors",
          "placeholder:text-neutral-400",
          "disabled:cursor-not-allowed disabled:opacity-50",
          !error &&
            "border-neutral-300 hover:border-neutral-400 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200",
          error &&
            "border-rose-500  bg-rose-50 focus:border-rose-500 focus:ring-2 focus:ring-rose-100",
          success &&
            "border-green-500 bg-green-50 focus:border-green-500 focus:ring-2 focus:ring-green-100",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
