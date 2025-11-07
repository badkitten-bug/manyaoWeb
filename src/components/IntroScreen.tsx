"use client";
import React from "react";

interface IntroScreenProps {
  title: string;
  subtitle: string;
  description?: string;
  onStart: () => void;
  startButtonText?: string;
  cancelHref?: string;
}

export default function IntroScreen({
  title,
  subtitle,
  description,
  onStart,
  startButtonText = "Iniciar verificación",
}: IntroScreenProps) {
  return (
    <main className='min-h-dvh flex flex-col items-center justify-center p-5 bg-[#f5f5f5]'>
      <div className='w-full max-w-md'>
        <div className='mb-5 text-center'>
          <h1 className='text-2xl font-bold text-[#333] mb-2'>{title}</h1>
          <p className='text-base text-[#666] mb-8'>{subtitle}</p>
          {description && (
            <p className='text-sm text-[#888] italic mb-8'>{description}</p>
          )}
        </div>
        <div className='flex justify-center'>
          <button 
            type='button' 
            className='px-8 py-3.5 rounded-[8px] bg-[#187773] hover:bg-[#165956] text-white font-bold text-base transition-colors' 
            onClick={onStart}
          >
            {startButtonText}
          </button>
        </div>
      </div>
    </main>
  );
}
