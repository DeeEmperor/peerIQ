// Copied from shadcn-ui template
// https://ui.shadcn.com/docs/components/toast

import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";
import {
  useToast as useToastOriginal,
} from "@/components/ui/use-toast";

type ToastOptions = Omit<
  ToastProps,
  "id" | "className" | "title" | "description" | "action"
> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

export const useToast = () => {
  const { toast, dismiss, toasts } = useToastOriginal();

  return {
    toast: (options: ToastOptions) => {
      toast({
        title: options.title,
        description: options.description,
        action: options.action,
        variant: options.variant,
        duration: options.duration ?? 5000,
      });
    },
    dismiss,
    toasts,
  };
};