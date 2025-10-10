"use client";
import React from "react";
import { ButtonColors } from '@/constants/colors';

type LoadingButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  variant?: 'primary' | 'success' | 'error' | 'secondary';
};

export default function LoadingButton({
  isLoading,
  className = "",
  children,
  disabled,
  variant = 'primary',
  ...props
}: LoadingButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-[#4CAF50] hover:bg-[#45a049]';
      case 'error':
        return 'bg-[#f44336] hover:bg-[#da190b]';
      case 'secondary':
        return 'bg-[#666] hover:bg-[#555]';
      default:
        return `bg-[${ButtonColors.primary}] hover:bg-[${ButtonColors.primaryHover}]`;
    }
  };

  const base = `inline-flex items-center justify-center rounded-lg px-6 py-3 text-white font-semibold min-w-[120px] transition-colors ${getVariantStyles()} disabled:opacity-60 disabled:cursor-not-allowed`;
  
  return (
    <button
      className={`${base} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          <span>Cargando…</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}


