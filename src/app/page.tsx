'use client';
import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Home() {
  return (
    <Suspense fallback={<main className="min-h-dvh flex items-center justify-center p-6"><p className="text-gray-300">Cargando…</p></main>}>
      <ClientHome />
    </Suspense>
  );
}

function ClientHome() {
  const params = useSearchParams();

  useEffect(() => {
    const idParam = params.get('id') || params.get('qrData') || '';
    if (!idParam.includes(':')) return;
    const action = idParam.split(':')[0];
    const query = new URLSearchParams({ id: idParam }).toString();
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    let base = '';
    if (pathname.startsWith('/app')) base = '/app';
    else base = '/app'; // prefijo por defecto cuando acceden a raíz
    if (action === '05') window.location.replace(`${base}/biometric/reniec?${query}`);
    else if (action === '04') window.location.replace(`${base}/biometric/dni?${query}`);
    else if (action === '03') window.location.replace(`${base}/biometric/signature?${query}`);
  }, [params]);

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center gap-6 p-6 bg-[#f5f5f5]">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold text-[#187773] mb-4">Manyao Web</h1>
        <p className="text-base text-[#666] mb-6">
          Sistema de validación biométrica
        </p>
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
          <p className="text-sm text-[#888] mb-4">
            Para acceder al sistema de validación, añade los parámetros QR al URL:
          </p>
          <div className="text-left bg-gray-50 p-3 rounded border text-xs font-mono text-[#333]">
            <p className="mb-2">• Validación RENIEC: <code>?id=05:dni:clave</code></p>
            <p className="mb-2">• Validación DNI: <code>?id=04:dni:clave</code></p>
            <p>• Firma Digital: <code>?id=03:dni:clave</code></p>
          </div>
        </div>
        <a 
          href="https://manyao.pe/" 
          className="inline-block px-6 py-3 bg-[#187773] hover:bg-[#165956] text-white font-bold rounded-lg transition-colors"
        >
          Ir a Manyao
        </a>
      </div>
    </main>
  );
}
