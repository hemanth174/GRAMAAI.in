import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const ToggleGroupContext = React.createContext({
  size: "default",
  variant: "default",
})

const toggleGroupVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const ToggleGroup = React.forwardRef(
  ({ className, variant, size, children, ...props }, ref) => (
    <ToggleGroupContext.Provider value={{ variant, size }}>
      <ToggleGroupPrimitive.Root
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-1 rounded-lg bg-muted p-1 text-muted-foreground",
          className
        )}
        {...props}
      >
        {children}
      </ToggleGroupPrimitive.Root>
    </ToggleGroupContext.Provider>
  )
);

ToggleGroup.displayName = "ToggleGroup"

const ToggleGroupItem = React.forwardRef(
  ({ className, children, variant, size, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext);

    return (
      <ToggleGroupPrimitive.Item
        ref={ref}
        className={cn(
          toggleGroupVariants({
            variant: context.variant || variant,
            size: context.size || size,
          }),
          "data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm",
          className
        )}
        {...props}
      >
        {children}
      </ToggleGroupPrimitive.Item>
    );
  }
);

ToggleGroupItem.displayName = "ToggleGroupItem"

export { ToggleGroup, ToggleGroupItem }