"use client";
import type React from "react";

interface ButtonConfig {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'success' | 'outline-red' | 'secondary';
  icon?: React.ReactNode;
}

interface ActionButtonsProps {
  leftButton: ButtonConfig;
  rightButton: ButtonConfig;
  className?: string;
}

export default function ActionButtons({ 
  leftButton, 
  rightButton, 
  className = "" 
}: ActionButtonsProps) {
  const getButtonStyles = (variant: string, disabled: boolean) => {
    const baseStyles = "px-6 py-3.5 rounded-[8px] font-bold text-sm transition-colors min-w-[140px] flex items-center justify-center gap-2";
    
    if (disabled) {
      return `${baseStyles} opacity-50 cursor-not-allowed bg-gray-300 text-gray-500`;
    }

    switch (variant) {
      case 'primary':
        return `${baseStyles} bg-[#187773] hover:bg-[#165956] text-white`;
      case 'success':
        return `${baseStyles} bg-[#4CAF50] hover:bg-[#45a049] text-white`;
      case 'outline-red':
        return `${baseStyles} border-2 border-[#f44336] text-[#f44336] hover:bg-[#f44336] hover:text-white`;
      case 'secondary':
        return `${baseStyles} bg-[#666] hover:bg-[#555] text-white`;
      default:
        return `${baseStyles} bg-[#187773] hover:bg-[#165956] text-white`;
    }
  };

  return (
    <div className={`flex gap-4 ${className}`}>
      <button
        type="button"
        className={getButtonStyles(leftButton.variant || 'outline-red', leftButton.disabled || false)}
        onClick={leftButton.onClick}
        disabled={leftButton.disabled}
      >
        {leftButton.icon}
        {leftButton.text}
      </button>
      <button
        type="button"
        className={getButtonStyles(rightButton.variant || 'success', rightButton.disabled || false)}
        onClick={rightButton.onClick}
        disabled={rightButton.disabled}
      >
        {rightButton.icon}
        {rightButton.text}
      </button>
    </div>
  );
}
