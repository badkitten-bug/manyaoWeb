"use client";
import React from "react";
import { SurfieGreen } from '@/constants/colors';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'dark' | 'light';
};

export default function Card({ className = "", variant = 'default', ...props }: CardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'dark':
        return `bg-[${SurfieGreen[950]}] border-[${SurfieGreen[900]}] text-[#ECEDEE]`;
      case 'light':
        return `bg-[${SurfieGreen[50]}] border-[${SurfieGreen[200]}] text-[#333]`;
      default:
        return 'bg-white border-gray-200 text-[#333]';
    }
  };

  return (
    <div
      className={`rounded-xl border p-6 shadow-sm ${getVariantStyles()} ${className}`}
      {...props}
    />
  );
}


