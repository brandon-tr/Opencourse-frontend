import * as React from "react";

import { cn } from "@/utils/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          type={type}
          className={cn(
            "block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 " +
              "ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 " +
              "sm:text-sm sm:leading-6 px-3 py-2",
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
