"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-right"
      richColors
      style={
        {
          "--normal-bg": "var(--background)",
          "--normal-text": "var(--text)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--primary)",
          "--success-border": "var(--primary)",
          "--success-text": "var(--primary-foreground)",
          "--error-bg": "var(--destructive)",
          "--error-border": "var(--destructive)",
          "--error-text": "var(--primary-foreground)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}
