import { cn } from "@/lib/cn";
import { forwardRef, type InputHTMLAttributes } from "react";
import { CheckIcon } from "lucide-react";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        data-slot="checkbox"
        className={cn(
          "relative inline-flex size-4 shrink-0 items-center justify-center",
          className,
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            "peer absolute inset-0 m-0 size-full cursor-pointer appearance-none rounded-sm border border-neutral-300 bg-white outline-none transition-colors",
            "checked:border-neutral-900 checked:bg-neutral-900",
            "focus-visible:ring-2 focus-visible:ring-neutral-200",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "aria-invalid:border-rose-500 aria-invalid:ring-2 aria-invalid:ring-rose-100",
          )}
          {...props}
        />
        <CheckIcon
          aria-hidden="true"
          className="pointer-events-none size-3 text-white opacity-0 transition-opacity peer-checked:opacity-100 z-10"
        />
      </span>
    );
  },
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
