"use client";
import { useRef, useEffect, useState } from "react";
import Logo from "./Logo";
import ProgressIndicator from "./ProgressIndicator";
import ThemeToggle from "./ThemeToggle";

interface SignatureScreenProps {
  title: string;
  subtitle: string;
  description?: string;
  onSignatureCaptured: (signature: string, signatureVector: string) => void;
  onContinue: () => void;
  onBack: () => void;
  continueDisabled?: boolean;
  loading?: boolean;
  method: string;
}

interface Point {
  x: number;
  y: number;
  move?: boolean;
}

type DrawingPoint = Point | null;


export default function SignatureScreen({
  title,
  subtitle,
  description,
  onSignatureCaptured,
  onContinue,
  onBack,
  continueDisabled = false,
  loading = false,
  method
}: SignatureScreenProps) {
  // Usar method para evitar warning
  console.log('[DEBUG] SignatureScreen method:', method);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [points, setPoints] = useState<DrawingPoint[]>([]);
  const [isReplaying, setIsReplaying] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [signatureReady, setSignatureReady] = useState(false);

  // Resetear isProcessing cuando termine el loading del API
  useEffect(() => {
    if (!loading && isProcessing) {
      console.log('[DEBUG] Reseteando isProcessing porque loading terminó');
      setIsProcessing(false);
    }
  }, [loading, isProcessing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar el canvas con dimensiones fijas para mejor precisión
    canvas.width = 400;
    canvas.height = 200;
    
    // Configurar el estilo CSS para que se vea bien
    canvas.style.width = '100%';
    canvas.style.height = '12rem'; // h-48 en Tailwind
    
    // Configurar el contexto para mejor renderizado
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3; // Línea más gruesa para mejor visibilidad
    ctx.strokeStyle = '#000000';
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Establecer fondo blanco sólido
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Configurar para mejor rendimiento de lectura
    canvas.setAttribute('willReadFrequently', 'true');
    
    // Configurar eventos táctiles para evitar scroll y zoom durante el dibujo
    const handleTouchStartNative = (e: TouchEvent) => {
      e.preventDefault();
    };
    
    const handleTouchMoveNative = (e: TouchEvent) => {
      e.preventDefault();
    };
    
    const handleTouchEndNative = (e: TouchEvent) => {
      e.preventDefault();
    };
    
    // Agregar eventos nativos con passive: false para control total
    canvas.addEventListener('touchstart', handleTouchStartNative, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMoveNative, { passive: false });
    canvas.addEventListener('touchend', handleTouchEndNative, { passive: false });
    
    // También prevenir el comportamiento por defecto en el contenedor
    const container = canvas.parentElement;
    if (container) {
      container.addEventListener('touchstart', handleTouchStartNative, { passive: false });
      container.addEventListener('touchmove', handleTouchMoveNative, { passive: false });
      container.addEventListener('touchend', handleTouchEndNative, { passive: false });
    }
    
    // Cleanup
    return () => {
      canvas.removeEventListener('touchstart', handleTouchStartNative);
      canvas.removeEventListener('touchmove', handleTouchMoveNative);
      canvas.removeEventListener('touchend', handleTouchEndNative);
      
      if (container) {
        container.removeEventListener('touchstart', handleTouchStartNative);
        container.removeEventListener('touchmove', handleTouchMoveNative);
        container.removeEventListener('touchend', handleTouchEndNative);
      }
      
    };
  }, []);

  const getMousePos = (e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Convertir coordenadas del CSS a coordenadas del canvas
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getMousePos(e, canvas);
    
    // Configurar estilo para el nuevo trazo
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Capturar punto inicial
    const point: Point = { x: pos.x, y: pos.y, move: true };
    setPoints(prev => [...prev, point]);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    // Agregar null para indicar el final de un trazo
    setPoints(prev => {
      const newPoints = [...prev, null];
      
      console.log('[DEBUG] stopDrawing: Marcando hasSignature como true');
      setHasSignature(true);
      
      // Capturar automáticamente la firma cuando termine de dibujar
      setTimeout(() => {
        captureSignature(newPoints);
        setSignatureReady(true);
      }, 100); // Pequeño delay para asegurar que el estado se actualice
      
      return newPoints;
    });
  };

  const draw = (e: MouseEvent | TouchEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getMousePos(e, canvas);
    
    // Dibujar línea suave
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    
    // Capturar punto con timestamp para mejor reproducción
    const point: Point = { x: pos.x, y: pos.y, move: false };
    setPoints(prev => [...prev, point]);

    // Marcar que hay firma
    if (!hasSignature) {
      console.log('[DEBUG] Marcando hasSignature como true');
      setHasSignature(true);
    }
    
    // Limpiar error si existe
    if (showError) {
      setShowError(false);
    }
  };

  const captureSignature = (points: DrawingPoint[]): Promise<void> => {
    return new Promise((resolve) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      resolve();
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve();
      return;
    }

    // Asegurar que el fondo esté blanco antes de capturar
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Solo redibujar la firma si hay puntos
    if (points.length > 0) {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      let currentStroke: Point[] = [];
      for (const point of points) {
        if (point === null) {
          // Final de trazo - dibujar el trazo completo
          if (currentStroke.length > 0) {
            ctx.beginPath();
            ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
            for (let i = 1; i < currentStroke.length; i++) {
              ctx.lineTo(currentStroke[i].x, currentStroke[i].y);
            }
            ctx.stroke();
            currentStroke = [];
          }
        } else {
          currentStroke.push(point);
        }
      }
      
      // Procesar último trazo si existe
      if (currentStroke.length > 0) {
        ctx.beginPath();
        ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
        for (let i = 1; i < currentStroke.length; i++) {
          ctx.lineTo(currentStroke[i].x, currentStroke[i].y);
        }
        ctx.stroke();
      }
    }
    
    // Capturar como imagen de alta calidad
    const imageData = canvas.toDataURL('image/png', 1.0);
    
    // Generar vector de firma (siempre, aunque esté vacío)
    const vectorData = JSON.stringify(points);
    const vectorBase64 = btoa(vectorData);
    
    // Notificar al componente padre (siempre, aunque esté vacío)
    onSignatureCaptured(imageData, vectorBase64);
    
    console.log('[DEBUG] Firma capturada:', {
      hasCanvas: !!canvas,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      signatureLength: imageData.length,
      isDataURL: imageData.startsWith('data:image/'),
      vectorLength: vectorBase64.length,
      hasPoints: points.length > 0
    });
    
    // NO llamar a onContinue aquí - se hará cuando el usuario haga click en el botón
    console.log('[DEBUG] Firma capturada y lista para envío');
    
    // Resolver la promesa
    resolve();
    });
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;


    // Limpiar canvas completamente
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Establecer fondo blanco sólido
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Restaurar configuración de dibujo
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Resetear estados
    setHasSignature(false);
    setPoints([]);
    setIsDrawing(false);
    setShowError(false);
    setSignatureReady(false); // Resetear el estado de firma lista
  };

  const replaySignature = () => {
    if (points.length === 0 || isReplaying) return;
    setIsReplaying(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpiar el canvas antes de reproducir
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Establecer fondo blanco
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Configurar el contexto igual que al dibujar
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#000000';
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    let i = 0;
    let currentPath = false;
    
    const replay = async () => {
      if (i >= points.length) {
        setIsReplaying(false);
        
        
        return;
      }

      const point = points[i];
      if (point) {
        if (point.move) {
          // Nuevo trazo - empezar path limpio
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          currentPath = true;
        } else {
          // Continuar trazo
          if (!currentPath) {
            // Si no hay path activo, empezar uno
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            currentPath = true;
          }
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
        }
      } else {
        // null indica fin de trazo
        currentPath = false;
      }

      i++;
      setTimeout(replay, 20); // Velocidad más natural
    };

    replay();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startDrawing(e.nativeEvent);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // SOLUCIÓN: Solo dibujar si estamos activamente dibujando
    if (isDrawing) {
      draw(e.nativeEvent);
    }
  };

  const handleMouseUp = () => {
    stopDrawing();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startDrawing(e.nativeEvent);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // SOLUCIÓN: Solo dibujar si estamos activamente dibujando
    if (isDrawing) {
      draw(e.nativeEvent);
    }
  };

  const handleTouchEnd = () => {
    stopDrawing();
  };

  const handleContinue = async () => {
    // Prevenir doble click
    if (isProcessing) {
      console.log('[DEBUG] Ya se está procesando, ignorando click');
      return;
    }
    
    // Validar si hay firma antes de continuar
    if (points.length === 0) {
      setShowError(true);
      // Ocultar el error después de 3 segundos
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    
    // Validar si la firma ya está lista
    if (!signatureReady) {
      console.log('[DEBUG] Firma no está lista aún, esperando...');
      return;
    }
    
    // Marcar como procesando
    setIsProcessing(true);
    
    try {
      // La firma ya está capturada, solo enviar al API
      console.log('[DEBUG] Enviando firma ya preparada al API');
      onContinue();
    } catch (error) {
      console.error('[DEBUG] Error en handleContinue:', error);
      setIsProcessing(false);
    }
  };

  return (
    <main className='min-h-dvh flex flex-col'>
      <ThemeToggle />
      
      <div className='flex-1 flex flex-col items-center pt-0 pb-4 px-4 overflow-y-auto'>
        {/* Contenedor principal para TODO el contenido */}
        <div className='w-full max-w-lg backdrop-blur-xl border rounded-3xl px-6 py-3 shadow-xl' style={{backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)'}}>
          <Logo />
          
          <ProgressIndicator currentStep={4} totalSteps={4} />
          

          <div className='mb-8 text-center'>
            <h1 className='text-2xl md:text-3xl font-bold mb-3' style={{color: 'var(--text-primary)'}}>{title || 'Dibuja tu firma'}</h1>
            <p className='text-base md:text-lg leading-relaxed' style={{color: 'var(--text-secondary)'}}>{subtitle || 'Usa tu dedo o mouse para firmar en el recuadro blanco'}</p>
            {description && <p className='text-sm mt-2' style={{color: 'var(--text-muted)'}}>{description}</p>}
          </div>

        {/* Panel de firma */}
        <div className='mb-6'>
          {/* Botones de control de firma - MOVIDOS ARRIBA */}
          <div className='flex justify-between items-center mb-4'>
            <div className='flex gap-2'>
              <button
                type='button'
                onClick={clearSignature}
                className='px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 border-2'
                style={{
                  backgroundColor: 'transparent',
                  borderColor: '#00c896',
                  color: '#00c896'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 200, 150, 0.1)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                title='Limpiar firma'
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <title>Limpiar</title>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                </svg>
                Limpiar
              </button>
              
              <button
                type='button'
                onClick={replaySignature}
                disabled={!hasSignature || isReplaying}
                className='px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 border-2 disabled:opacity-50 disabled:cursor-not-allowed'
                style={{
                  backgroundColor: (!hasSignature || isReplaying) ? 'rgba(156, 163, 175, 0.3)' : 'transparent',
                  borderColor: (!hasSignature || isReplaying) ? 'rgba(156, 163, 175, 0.5)' : '#00c896',
                  color: (!hasSignature || isReplaying) ? 'rgba(156, 163, 175, 0.8)' : '#00c896'
                }}
                onMouseEnter={(e) => {
                  if (!(!hasSignature || isReplaying)) {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 200, 150, 0.1)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!(!hasSignature || isReplaying)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
                title='Reproducir firma'
              >
                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                  <title>Reproducir</title>
                  <path d='M8 5v14l11-7z' />
                </svg>
                {isReplaying ? 'Reproduciendo...' : 'Reproducir'}
              </button>
            </div>
            
          </div>

          {/* Campo de firma */}
          <div className='bg-white rounded-2xl p-4 mb-6 shadow-lg'>
            <canvas
              ref={canvasRef}
              className='w-full h-48 rounded-lg cursor-crosshair touch-none'
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          </div>

          {/* Mensaje de error */}
          {showError && (
            <div className='mb-6 p-4 rounded-2xl border' style={{
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              borderColor: 'rgba(244, 67, 54, 0.3)'
            }}>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <title>Error</title>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <p className="text-sm font-medium" style={{color: '#f44336'}}>
                  Por favor dibuja tu firma antes de continuar
                </p>
              </div>
            </div>
          )}

        </div>

          {/* Botones verticales */}
          <div className="space-y-4 mb-6">
            <button
              type='button'
              onClick={() => {
                console.log('[DEBUG] Botón clickeado - hasSignature:', hasSignature, 'continueDisabled:', continueDisabled);
                handleContinue();
              }}
              disabled={continueDisabled || isProcessing || !signatureReady}
              className='w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
              style={{
                background: 'linear-gradient(135deg, #00c896 0%, #00b4d8 100%)',
                color: 'white'
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #00b4d8 0%, #0096c7 100%)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #00c896 0%, #00b4d8 100%)';
                }
              }}
            >
              {loading ? 'Enviando...' : isProcessing ? 'Procesando...' : signatureReady ? 'Confirmar y Firmar' : 'Preparando firma...'}
            </button>
            
            <button
              type='button'
              onClick={onBack}
              className='w-full py-4 rounded-2xl border-2 font-bold text-lg transition-all duration-300'
              style={{
                borderColor: '#00c896',
                color: '#00c896',
                backgroundColor: 'var(--card-bg)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0fdfa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--card-bg)';
              }}
            >
              Volver atrás
            </button>
          </div>

          {/* Footer */}
          <footer className='mt-8 text-center'>
            <p className='text-xs' style={{color: 'var(--text-muted)'}}>
              © 2025 <span style={{color: 'var(--text-primary)'}}>Manyao</span>. Todos los derechos reservados.
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}