import * as React from "react";

import { cn } from "@/utils/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 " +
            "ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 " +
            "sm:text-sm sm:leading-6 px-3 py-2",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
