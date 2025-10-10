"use client";
import React from "react";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Camera, 
  User, 
  CreditCard,
  ArrowLeft,
  ArrowRight,
  Loader2
} from "lucide-react";

interface AppIconProps {
  name: 'check' | 'error' | 'warning' | 'camera' | 'user' | 'card' | 'arrow-left' | 'arrow-right' | 'loading';
  size?: number;
  color?: string;
  className?: string;
}

export default function AppIcon({ 
  name, 
  size = 24, 
  color = "currentColor", 
  className = "" 
}: AppIconProps) {
  const iconProps = {
    size,
    color,
    className: `inline-block ${className}`
  };

  switch (name) {
    case 'check':
      return <CheckCircle {...iconProps} />;
    case 'error':
      return <XCircle {...iconProps} />;
    case 'warning':
      return <AlertCircle {...iconProps} />;
    case 'camera':
      return <Camera {...iconProps} />;
    case 'user':
      return <User {...iconProps} />;
    case 'card':
      return <CreditCard {...iconProps} />;
    case 'arrow-left':
      return <ArrowLeft {...iconProps} />;
    case 'arrow-right':
      return <ArrowRight {...iconProps} />;
    case 'loading':
      return <Loader2 {...iconProps} className={`${iconProps.className} animate-spin`} />;
    default:
      return <CheckCircle {...iconProps} />;
  }
}
