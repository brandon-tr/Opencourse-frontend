import * as React from "react";

import { cn } from "@/utils/utils";
import { useFormField } from "@/components/ui/form";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}
const FormInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const { error } = useFormField();
    return (
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          type={type}
          className={cn(
            ((className = error
              ? "text-red-300 ring-1 ring-inset ring-red-300 " +
                "placeholder:text-red-300" +
                "focus:ring-red-500"
              : ""),
            "block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 " +
              "ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 " +
              "sm:text-sm sm:leading-6 px-3 py-2"),
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
    );
  },
);
FormInput.displayName = "FormInput";

export { FormInput };
