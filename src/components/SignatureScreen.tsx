"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";

interface SignatureScreenProps {
  title: string;
  subtitle: string;
  description?: string;
  onSignatureCaptured: (signature: string) => void;
  onContinue: () => void;
  continueDisabled?: boolean;
  loading?: boolean;
  method: string;
  cancelHref?: string;
}

export default function SignatureScreen({
  title,
  subtitle,
  description,
  onSignatureCaptured,
  onContinue,
  continueDisabled = false,
  loading = false,
  method,
  cancelHref = "https://manyao.pe/"
}: SignatureScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar el canvas
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#187773';

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.type.includes('touch') 
      ? (e as React.TouchEvent).touches[0].clientX - rect.left
      : (e as React.MouseEvent).clientX - rect.left;
    const y = e.type.includes('touch')
      ? (e as React.TouchEvent).touches[0].clientY - rect.top
      : (e as React.MouseEvent).clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.type.includes('touch')
      ? (e as React.TouchEvent).touches[0].clientX - rect.left
      : (e as React.MouseEvent).clientX - rect.left;
    const y = e.type.includes('touch')
      ? (e as React.TouchEvent).touches[0].clientY - rect.top
      : (e as React.MouseEvent).clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();

    // Marcar que hay firma
    if (!hasSignature) {
      setHasSignature(true);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    
    // Capturar la firma como imagen
    const canvas = canvasRef.current;
    if (canvas && hasSignature) {
      const signatureImage = canvas.toDataURL('image/png');
      setSignatureData(signatureImage);
      onSignatureCaptured(signatureImage);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setSignatureData(null);
    onSignatureCaptured('');
  };

  const handleContinue = () => {
    if (hasSignature && signatureData) {
      onContinue();
    }
  };

  return (
    <main className='min-h-dvh flex flex-col items-center justify-center p-5 bg-[#f5f5f5]'>
      <div className='w-full max-w-md'>
        <div className='mb-6 text-center'>
          <h1 className='text-2xl font-bold text-[#333] mb-2'>{title}</h1>
          <p className='text-base text-[#666] mb-2'>{subtitle}</p>
          {description && (
            <p className='text-sm text-[#888] italic mb-4'>{description}</p>
          )}
          <div className='bg-gray-50 p-3 rounded-lg border'>
            <p className='text-sm text-gray-700'>
              <strong>Método:</strong> {method === 'biometric' ? 'Biometría' : 'Cédula de Identidad'}
            </p>
          </div>
        </div>

        {/* Panel de firma */}
        <div className='mb-6'>
          <div className='bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4'>
            <canvas
              ref={canvasRef}
              className='w-full h-48 border border-gray-200 rounded cursor-crosshair touch-none'
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={(e) => {
                e.preventDefault();
                startDrawing(e);
              }}
              onTouchMove={(e) => {
                e.preventDefault();
                draw(e);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                stopDrawing();
              }}
            />
          </div>
          
          <div className='flex justify-between items-center'>
            <p className='text-sm text-gray-600'>
              {hasSignature ? '✓ Firma capturada' : 'Dibuja tu firma arriba'}
            </p>
            <button
              type='button'
              onClick={clearSignature}
              className='px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50 transition-colors'
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Botones */}
        <div className='flex gap-4 mb-6'>
          <button
            type='button'
            onClick={handleContinue}
            disabled={continueDisabled || !hasSignature}
            className='flex-1 px-6 py-3.5 rounded-[8px] bg-[#187773] hover:bg-[#165956] text-white font-bold text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Enviando...' : 'Enviar Firma'}
          </button>
          <Link 
            className='flex-1 px-6 py-3.5 rounded-[8px] border border-gray-300 text-[#333] font-bold text-base text-center transition-colors hover:bg-gray-50' 
            href={cancelHref}
          >
            Cancelar
          </Link>
        </div>

        {/* Instrucciones */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <h4 className='font-semibold text-blue-800 mb-2'>Instrucciones:</h4>
          <ul className='text-sm text-blue-700 space-y-1'>
            <li>• Dibuja tu firma en el panel blanco</li>
            <li>• Usa el dedo o el mouse</li>
            <li>• Puedes limpiar y volver a dibujar</li>
            <li>• La firma se enviará al sistema</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
