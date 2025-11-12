'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  onCapture?: (dataUrl: string) => void;
  autoCaptureEnabled?: boolean; // por defecto true (selfie)
  overlay?: 'circle' | 'none';  // por defecto 'circle'; 'none' para ocultar
  facingMode?: 'user' | 'environment'; // cámara frontal o trasera
  mirror?: boolean; // invertir horizontalmente (selfie)
  showCaptureButton?: boolean; // 👈 nuevo: mostrar/ocultar botón manual
};

export default function WebCamera({
  onCapture,
  autoCaptureEnabled = true,
  overlay = 'circle',
  facingMode = 'user',
  mirror,
  showCaptureButton = true, // 👈 por defecto se muestra
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isGreen, setIsGreen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shouldMirror = mirror ?? (facingMode === 'user');

  /** Captura la imagen actual del video */
  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const w = videoRef.current.videoWidth;
    const h = videoRef.current.videoHeight;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    canvasRef.current.width = w;
    canvasRef.current.height = h;

    // Aplicar espejo si es necesario
    if (shouldMirror) {
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, -w, 0, w, h);
    } else {
      ctx.drawImage(videoRef.current, 0, 0, w, h);
    }

    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.9);
    if (onCapture) requestAnimationFrame(() => onCapture(dataUrl));
  }, [onCapture, shouldMirror]);

  /** Inicia un conteo regresivo antes de tomar la foto automáticamente */
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

  /** Toma la foto inmediatamente */
  const takePhotoNow = useCallback(() => {
    setCountdown(null);
    capture();
  }, [capture]);

  /** Inicializa la cámara */
  useEffect(() => {
    let timerA: number | undefined;
    let timerB: number | undefined;
    let stream: MediaStream | null = null;
    const videoEl = videoRef.current;

    (async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('getUserMedia no está disponible. Usa HTTPS y un navegador compatible.');
        }

        const constraints: MediaStreamConstraints = {
          video: { facingMode: { ideal: facingMode } },
          audio: false,
        };

        console.log('🎥 Solicitando cámara con constraints:', constraints);
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        const vLocal = videoRef.current;
        if (!vLocal) return;

        vLocal.srcObject = stream;
        await new Promise<void>((resolve) => {
          const handler = () => {
            vLocal.removeEventListener('loadedmetadata', handler);
            resolve();
          };
          vLocal.addEventListener('loadedmetadata', handler);
        });

        await vLocal.play();
        setReady(true);

        // Autocaptura (solo si está activada)
        if (autoCaptureEnabled) {
          timerA = window.setTimeout(() => setIsGreen(true), 5000);
          timerB = window.setTimeout(() => startCountdown(), 5000);
        }
      } catch (e) {
        console.error('❌ Error de cámara', e);
        setError(e instanceof Error ? e.message : 'No se pudo iniciar la cámara');
        setReady(false);
      }
    })();

    return () => {
      if (timerA) window.clearTimeout(timerA);
      if (timerB) window.clearTimeout(timerB);
      if (stream) stream.getTracks().forEach(t => t.stop());
      if (videoEl) videoEl.srcObject = null;
    };
  }, [facingMode, autoCaptureEnabled, startCountdown]);

  /** Escucha evento manual de captura desde CameraScreen */
  useEffect(() => {
    const handleManualCapture = () => {
      console.log("📸 Captura manual recibida desde CameraScreen");
      capture();
    };
    window.addEventListener("manualCapture", handleManualCapture);
    return () => window.removeEventListener("manualCapture", handleManualCapture);
  }, [capture]);

  return (
    <div className='w-full max-w-sm'>
      <div className='relative aspect-square rounded-xl overflow-hidden bg-black'>
        <video
          ref={videoRef}
          playsInline
          muted
          className={`h-full w-full object-cover ${shouldMirror ? 'transform -scale-x-100' : ''}`}
        />

        {/* Overlay */}
        <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
          {overlay === 'circle' && (
            <div className={`w-3/4 h-3/4 rounded-full border-4 ${isGreen ? 'border-green-500' : 'border-white/60'}`} />
          )}
        </div>

        {/* Cuenta regresiva */}
        {autoCaptureEnabled && countdown !== null && (
          <div className='absolute inset-0 flex items-center justify-center text-white text-6xl font-bold'>
            {countdown}
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className='hidden' />

      {/* Errores */}
      {error && (
        <div className='mt-4 p-3 rounded bg-red-900/70 text-white text-sm'>
          <p className='font-semibold'>⚠️ Error de cámara</p>
          <p className='mt-1'>{error}</p>
          <div className='mt-2 text-xs text-gray-300'>
            <p className='font-semibold text-yellow-300'>Para Chrome Android:</p>
            <p>1. Toca el ícono 🔒 junto a la URL</p>
            <p>2. Ve a "Configuración del sitio"</p>
            <p>3. Permisos → Cámara → Permitir</p>
            <p className='mt-2 font-semibold text-yellow-300'>Alternativas:</p>
            <p>• Usa Brave o Firefox</p>
            <p>• Ve a chrome://settings/content/camera</p>
          </div>
        </div>
      )}
    </div>
  );
}
