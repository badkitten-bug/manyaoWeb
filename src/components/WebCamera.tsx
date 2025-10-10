'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  onCapture?: (dataUrl: string) => void;
  autoCaptureEnabled?: boolean; // por defecto true (selfie)
  overlay?: 'circle' | 'none';   // por defecto 'circle'; 'none' para ocultar
  facingMode?: 'user' | 'environment'; // cámara frontal o trasera
  mirror?: boolean; // invertir horizontalmente (selfie)
};

export default function WebCamera({ onCapture, autoCaptureEnabled = true, overlay = 'circle', facingMode = 'user', mirror }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isGreen, setIsGreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const shouldMirror = mirror ?? (facingMode === 'user');

  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const w = videoRef.current.videoWidth;
    const h = videoRef.current.videoHeight;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    canvasRef.current.width = w;
    canvasRef.current.height = h;
    
    // Aplicar espejo en la captura si es necesario
    if (shouldMirror) {
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, -w, 0, w, h);
    } else {
      ctx.drawImage(videoRef.current, 0, 0, w, h);
    }
    
    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.9);
    // Defer con rAF para evitar saltos de UI
    if (onCapture) {
      requestAnimationFrame(() => onCapture(dataUrl));
    }
  }, [onCapture, shouldMirror]);

  const startCountdown = useCallback(() => {
    setCountdown(3);
    const id = window.setInterval(() => {
      setCountdown(prev => {
        const next = (prev ?? 0) - 1;
        if (next <= 0) {
          window.clearInterval(id);
          capture();
          return null;
        }
        return next;
      });
    }, 1000);
  }, [capture]);

  useEffect(() => {
    let timerA: number | undefined;
    let timerB: number | undefined;
    let stream: MediaStream | null = null;
    const videoEl = videoRef.current;

    (async () => {
      try {
        // Verificar si getUserMedia está disponible
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('getUserMedia no está disponible. Usa HTTPS y un navegador compatible.');
        }

        const constraints: MediaStreamConstraints = {
          video: ({ facingMode: { ideal: facingMode } } as MediaTrackConstraints),
          audio: false,
        };
        
        console.log('Requesting camera with constraints:', constraints);
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        const vLocal = videoRef.current;
        if (!vLocal) return;

        vLocal.srcObject = stream;

        await new Promise<void>((resolve) => {
          if (!vLocal) return resolve();
          const handler = () => {
            vLocal.removeEventListener('loadedmetadata', handler);
            resolve();
          };
          vLocal.addEventListener('loadedmetadata', handler);
        });
        
        try {
          if (!vLocal) return;
          await vLocal.play();
        } catch (err: unknown) {
          const e = err as { name?: string };
          if (e?.name === 'AbortError') {
            await new Promise((r) => setTimeout(r, 100));
            try { await vLocal?.play(); } catch {}
          } else {
            throw err;
          }
        }
        
        setReady(true);
        
        // Autocaptura solo si está habilitada (selfie)
        if (autoCaptureEnabled) {
          timerA = window.setTimeout(() => setIsGreen(true), 2000);
          timerB = window.setTimeout(() => startCountdown(), 2000);
        }
      } catch (e) {
        console.error('camera error', e);
        setReady(false);
        setError(e instanceof Error ? e.message : 'No se pudo iniciar la cámara');
      }
    })();
    
    return () => {
      if (timerA) window.clearTimeout(timerA);
      if (timerB) window.clearTimeout(timerB);

      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      if (videoEl) {
        try {
          (videoEl as HTMLVideoElement).srcObject = null;
        } catch {}
      }
    };
  }, [facingMode, autoCaptureEnabled, startCountdown]);

  

  return (
    <div className='w-full max-w-sm'>
      <div className='relative aspect-square rounded-xl overflow-hidden bg-black'>
        <video ref={videoRef} playsInline muted className={`h-full w-full object-cover ${shouldMirror ? 'transform -scale-x-100' : ''}`} />
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none`}>
          {overlay === 'circle' ? (
            <div className={`w-3/4 h-3/4 rounded-full border-4 ${isGreen ? 'border-green-500' : 'border-white/60'}`} />
          ) : null}
        </div>
        {autoCaptureEnabled && countdown !== null && (
          <div className='absolute inset-0 flex items-center justify-center text-white text-6xl font-bold'>
            {countdown}
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className='hidden' />
      
      {error ? (
        <div className='mt-4 p-3 rounded bg-red-900/70 text-white text-sm'>
          <p className='font-semibold'>⚠️ Error de cámara</p>
          <p className='mt-1'>{error}</p>
          <div className='mt-2 text-xs text-gray-300'>
            <p className='font-semibold text-yellow-300'>Para Chrome Android:</p>
            <p>1. Toca el ícono 🔒 junto a la URL</p>
            <p>2. Ve a &quot;Configuración del sitio&quot;</p>
            <p>3. Permisos → Cámara → Permitir</p>
            <p className='mt-2 font-semibold text-yellow-300'>Alternativas:</p>
            <p>• Usa Brave o Firefox</p>
            <p>• Ve a chrome://settings/content/camera</p>
          </div>
        </div>
      ) : (
        <div className='mt-2 flex gap-2'>
          <button type='button' className='px-3 py-2 rounded bg-black text-white' onClick={capture}>Tomar foto</button>
          <span className='text-sm text-gray-500'>{ready ? 'Cámara lista' : 'Iniciando cámara...'}</span>
        </div>
      )}
    </div>
  );
}
