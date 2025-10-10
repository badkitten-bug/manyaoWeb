"use client";
import React from "react";
import Link from "next/link";
import WebCamera from "./WebCamera";

interface CameraScreenProps {
  title: string;
  subtitle: string;
  description?: string;
  onCapture: (data: string) => void;
  facingMode?: 'user' | 'environment';
  autoCaptureEnabled?: boolean;
  overlay?: 'circle' | 'none';
  mirror?: boolean;
  cancelHref?: string;
}

export default function CameraScreen({
  title,
  subtitle,
  description,
  onCapture,
  facingMode = 'user',
  autoCaptureEnabled = true,
  overlay = 'circle',
  mirror,
  cancelHref = "https://manyao.pe/"
}: CameraScreenProps) {
  return (
    <main className='min-h-dvh flex flex-col items-center justify-center p-5 bg-[#f5f5f5]'>
      <div className='w-full max-w-md'>
        <div className='mb-5 text-center'>
          <h1 className='text-2xl font-bold text-[#333] mb-2'>{title}</h1>
          <p className='text-base text-[#666] mb-2'>{subtitle}</p>
          {description && (
            <p className='text-sm text-[#888] italic'>{description}</p>
          )}
        </div>
        <WebCamera 
          onCapture={onCapture}
          facingMode={facingMode}
          autoCaptureEnabled={autoCaptureEnabled}
          overlay={overlay}
          mirror={mirror}
        />
        <div className='mt-4 flex justify-center'>
          <Link 
            className='px-6 py-3.5 rounded-[8px] border border-gray-300 text-[#333] font-bold text-base transition-colors hover:bg-gray-50' 
            href={cancelHref}
          >
            Cancelar
          </Link>
        </div>
      </div>
    </main>
  );
}
