"use client";
import React from "react";
import ActionButtons from "./ActionButtons";

interface CameraPreviewProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  onRetake: () => void;
  onContinue: () => void;
  continueText?: string;
  continueDisabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  showAddressWarning?: boolean;
  imageType?: 'selfie' | 'document'; // Para ajustar las dimensiones según el tipo
}

export default function CameraPreview({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  onRetake,
  onContinue,
  continueText = "Continuar",
  continueDisabled = false,
  loading = false,
  loadingText = "Enviando…",
  showAddressWarning = false,
  imageType = 'selfie'
}: CameraPreviewProps) {
  return (
    <main className='min-h-dvh flex flex-col items-center justify-center p-5 bg-[#f5f5f5]'>
      <div className='w-full max-w-md'>
        <div className='mb-5 text-center'>
          <h1 className='text-2xl font-bold text-[#333] mb-2'>{title}</h1>
          <p className='text-base text-[#666]'>{subtitle}</p>
        </div>
        <div className='flex flex-col items-center'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={imageSrc} 
            alt={imageAlt} 
            className={`mb-8 rounded-[10px] border-2 border-[#ddd] ${
              imageType === 'document' 
                ? 'w-[350px] h-[250px] object-contain' // Para DNI: más ancho, menos alto, mantener proporción
                : 'w-[300px] h-[400px] object-cover'   // Para selfie: proporción vertical
            }`}
          />
          {showAddressWarning && (
            <p className='text-sm text-[#f44336] mb-4 text-center'>
              Inicializando datos (address/f1)… Si persiste, recarga o vuelve a intentar.
            </p>
          )}
          <ActionButtons
            leftButton={{
              text: "Tomar otra",
              onClick: onRetake,
              variant: "outline-red"
            }}
            rightButton={{
              text: loading ? loadingText : continueText,
              onClick: onContinue,
              disabled: continueDisabled || loading,
              variant: "success"
            }}
          />
        </div>
      </div>
    </main>
  );
}
