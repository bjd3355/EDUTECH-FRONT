"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cn } from "@/lib/utils"; // Assurez-vous que cette fonction existe dans votre projet

// Types pour les props du Toast
export interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
}

// Limites et délais
const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 1000;

// Type interne avec ID
type ToastWithId = ToastProps & { id: string };

// Styles des variantes
const toastVariants = {
  default: "border bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
  destructive: "border-red-500 bg-red-500 text-white",
  success: "border-green-500 bg-green-500 text-white",
};

// Contexte pour gérer les toasts
const ToastContext = React.createContext<{
  toasts: ToastWithId[];
  addToast: (toast: ToastProps) => void;
  removeToast: (id: string) => void;
}>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

// Composant Toaster
export function Toaster() {
  const [toasts, setToasts] = React.useState<ToastWithId[]>([]);

  const addToast = (toast: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev.slice(-TOAST_LIMIT + 1), { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, duration: 0 } : t)));
  };

  return (
    <ToastPrimitives.Provider>
      <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
        <ToastPrimitives.Viewport
          className="fixed top-0 right-0 z-[100] flex flex-col gap-2 p-4 w-[390px] max-w-[100vw]"
        >
          {toasts.map(({ id, title, description, variant = "default", duration = 5000 }) => (
            <ToastPrimitives.Root
              key={id}
              className={cn(
                "p-4 rounded-md shadow-md flex items-start gap-3",
                toastVariants[variant],
                "animate-in slide-in-from-right duration-300",
                "animate-out slide-out-to-right duration-300"
              )}
              duration={duration}
              onOpenChange={(open) =>
                !open && setTimeout(() => removeToast(id), TOAST_REMOVE_DELAY)
              }
            >
              {title && (
                <ToastPrimitives.Title className="font-semibold">{title}</ToastPrimitives.Title>
              )}
              {description && (
                <ToastPrimitives.Description className="mt-1 text-sm">
                  {description}
                </ToastPrimitives.Description>
              )}
              <ToastPrimitives.Close className="absolute top-2 right-2 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </ToastPrimitives.Close>
            </ToastPrimitives.Root>
          ))}
        </ToastPrimitives.Viewport>
      </ToastContext.Provider>
    </ToastPrimitives.Provider>
  );
}

// Hook useToast corrigé
export function useToast() {
  const { addToast } = React.useContext(ToastContext);

  const toast = (props: ToastProps) => {
    addToast(props);
  };

  return { toast }; // Retourne un objet avec la fonction toast
}

// Exports supplémentaires pour compatibilité
export const ToastProvider = ToastPrimitives.Provider;
export const ToastViewport = ToastPrimitives.Viewport;
export const Toast = ToastPrimitives.Root;
export const ToastTitle = ToastPrimitives.Title;
export const ToastDescription = ToastPrimitives.Description;
export const ToastClose = ToastPrimitives.Close;