"use client";
import React from "react";
import { CheckCircle } from "lucide-react";

interface ValidationResultCardProps {
  success: boolean;
  message: string;
  details?: {
    names?: string;
    paternal_surname?: string;
    maternal_surname?: string;
    validity?: string;
    isLive?: string | boolean;
    isValid?: string | boolean;
    auth_id?: string;
    reniecResult?: string;
    // Para flujo 04
    dni?: string;
    validations?: Array<{ test: string; status: boolean; result: string }>;
    liveness?: { status?: boolean };
    detail?: string;
  };
  onRetry?: () => void;
  showRetry?: boolean;
}

export default function ValidationResultCard({
  success,
  message,
  details,
  onRetry,
  showRetry = true
}: ValidationResultCardProps) {
  const fullName = details?.names && details?.paternal_surname && details?.maternal_surname
    ? [details.names, details.paternal_surname, details.maternal_surname].join(' ')
    : null;

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center p-5 bg-white">
      <div className="w-full max-w-md flex flex-col items-center">
        
        {/* Contenedor del ícono y texto principal */}
        <div className="flex flex-col items-center text-center px-4">
          {success ? (
            <CheckCircle size={80} color="#34C759" className="mb-5" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-5">
              <span className="text-4xl text-red-500">❌</span>
            </div>
          )}
          <h1 className="text-2xl font-bold text-[#187773] mb-3">
            {success ? 'Validación Exitosa' : 'No se validó'}
          </h1>
          <p className="text-base text-gray-600 leading-relaxed mb-6">
            {success 
              ? '¡Validación biométrica exitosa! Tu identidad ha sido verificada. Ya puedes cerrar esta ventana o continuar para conocer más sobre Manyao.'
              : message || 'No se pudo validar tu identidad.'
            }
          </p>
        </div>

        {/* Tarjeta de datos del usuario - solo si es exitoso */}
        {success && details && (
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500 w-full mb-4 text-center">
            {fullName ? (
              <>
                <p className="text-lg font-semibold text-gray-800">
                  {fullName}
                </p>
                <p className="text-base text-gray-700 mt-1">
                  Vence: {details.validity} - DNI: {details.dni}
                </p>
              </>
            ) : details.dni ? (
              <>
                <p className="text-lg font-semibold text-gray-800">
                  DNI: {details.dni}
                </p>
                {/* Para flujo 04 - mostrar validaciones */}
                {details.validations && (
                  <div className='flex flex-wrap gap-2 justify-center mt-2'>
                    {details.validations.map((validation, index) => (
                      <span 
                        key={index}
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                          validation.status ? 'bg-[#4CAF50]' : 'bg-[#f44336]'
                        } text-white`}
                      >
                        {validation.test}: {validation.status ? 'OK' : 'Falla'}
                      </span>
                    ))}
                    {details.liveness?.status !== undefined && (
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                        details.liveness.status ? 'bg-[#4CAF50]' : 'bg-[#f44336]'
                      } text-white`}>
                        Liveness: {details.liveness.status ? 'OK' : 'Falla'}
                      </span>
                    )}
                  </div>
                )}
                {details.detail && (
                  <p className="text-sm text-gray-600 mt-2">
                    {String(details.detail).replace(/\?/g,'ó')}
                  </p>
                )}
              </>
            ) : null}
          </div>
        )}
        
        {/* Referencia */}
        {details?.auth_id && (
          <p className="text-sm text-gray-500 mb-6">
            Referencia: {details.auth_id}
          </p>
        )}
        
        {/* Botones */}
        <div className='w-full flex gap-4'>
          {!success && showRetry && onRetry && (
            <button 
              type='button' 
              className='flex-1 text-center px-6 py-4 rounded-full border-2 border-[#f44336] text-[#f44336] hover:bg-[#f44336] hover:text-white font-bold text-base transition-colors shadow-lg' 
              onClick={onRetry}
            >
              Intentar de nuevo
            </button>
          )}
          <a 
            className={`${(!success && showRetry && onRetry) ? 'flex-1' : 'w-full'} text-center px-6 py-4 rounded-full bg-[#187773] hover:bg-[#165956] text-white font-bold text-base transition-colors shadow-lg`} 
            href='https://manyao.pe/'
          >
            Finalizar
          </a>
        </div>

      </div>
    </main>
  );
}
