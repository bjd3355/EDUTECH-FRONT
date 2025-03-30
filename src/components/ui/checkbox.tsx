"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils"; // Assurez-vous que cette fonction existe dans votre projet

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, id, checked, onCheckedChange, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    id={id}
    checked={checked}
    onCheckedChange={onCheckedChange}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#2CB3C2] data-[state=checked]:border-[#2CB3C2]",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
      <Check className="h-4 w-4 text-white" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = "Checkbox";

export { Checkbox };