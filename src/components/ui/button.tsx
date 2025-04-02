// src/components/ui/button.tsx
import React from "react";
import { cn } from "@/lib/utils"; // Assurez-vous que cette utilité existe

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode; // Rendu optionnel avec "?"
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "md", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium",
          {
            "bg-[#2CB3C2] text-white hover:bg-[#2CB3C2]/90": variant === "default",
            "border border-gray-300 bg-transparent hover:bg-gray-100": variant === "outline",
            "bg-red-600 text-white hover:bg-red-700": variant === "destructive",
            "text-sm h-8 px-2": size === "sm",
            "text-base h-10 px-4": size === "md",
            "text-lg h-12 px-6": size === "lg",
          },
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };