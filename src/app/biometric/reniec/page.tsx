"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from 'react';
// Simplified: use WebCamera with countdown/oval; backend hará la validación
import { useSearchParams } from 'next/navigation';
import { parseQR } from '@/lib';
import { notifyEvent05, createAddressForWeb } from '@/lib/api';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Componentes reutilizables
import IntroScreen from '@/components/IntroScreen';
import CameraScreen from '@/components/CameraScreen';
import CameraPreview from '@/components/CameraPreview';
import ValidationResultCard from '@/components/ValidationResultCard';

export default function Page() {
  return (
    <Suspense fallback={<main className='min-h-dvh flex items-center justify-center p-6'><p className='text-gray-300'>Cargando…</p></main>}>
      <ClientContent />
    </Suspense>
  );
}

function ClientContent() {
  const params = useSearchParams();
  const [address, setAddress] = useState<string>('');
  const [f1, setF1] = useState<string>('');
  const [step, setStep] = useState<'intro' | 'face' | 'face-preview' | 'result'>('intro');
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initDone, setInitDone] = useState(false);
  type Notify05Detail = { response?: { isValid?: string | boolean; names?: string; paternal_surname?: string; maternal_surname?: string; validity?: string; auth_id?: string; resp?: { result?: string }; live?: { status?: boolean }; isLive?: string | boolean } };
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    detail?: {
      names?: string;
      paternal_surname?: string;
      maternal_surname?: string;
      validity?: string;
      isLive?: string | boolean;
      isValid?: string | boolean;
      auth_id?: string;
      reniecResult?: string;
    };
  } | null>(null);

 function cleanErrorMessage(raw?: string): string {
   if (!raw) return 'Ocurrió un error en la validación.';
   let t = raw;
   // Quitar prefijos técnicos y patrones internos
   t = t.replace(/^\s*\[[^\]]*\]\s*=>\s*/g, ''); // [If_Do_4] =>
   t = t.replace(/showError\(\d+\s*,\s*/gi, ''); // showError(302,
   t = t.replace(/\)\s*params:\s*null\s*$/i, ''); // ) params: null
   t = t.replace(/params:\s*null\s*$/i, '');
   // Sanitizar encoding
   t = t.replace(/\?/g, 'ó');
   t = t.replace(/Validaci\?n/gi, 'Validación');
   t = t.replace(/identificaci\?n/gi, 'Identificación');
   t = t.replace(/verificaci\?n/gi, 'Verificación');
   return t.trim();
 }

 function generateReniecErrorMessage(resp: any): string {
   if (!resp?.response) {
     return 'Error al procesar la validación con RENIEC.';
   }

   const response = resp.response;
   const isValid = response.isValid === '1' || response.isValid === true;
   
   if (isValid) {
     return 'Validación exitosa';
   }

   // Verificar diferentes tipos de errores
   const messages: string[] = [];

   // Error de liveness
   if (response.live?.status === false || response.isLive === false) {
     messages.push('La selfie no pasó la verificación de vida (liveness)');
   }

   // Error de detección de cara
   if (response.resp?.result && typeof response.resp.result === 'string') {
     const result = response.resp.result.toLowerCase();
     if (result.includes('face') || result.includes('cara')) {
       messages.push('No se detectó una cara válida en la selfie');
     } else if (result.includes('match') || result.includes('coincide')) {
       messages.push('La selfie no coincide con los datos de RENIEC');
     } else if (result.includes('quality') || result.includes('calidad')) {
       messages.push('La calidad de la selfie no es suficiente');
     }
   }

   // Si hay un mensaje de detalle del backend, usarlo
   if (response.resp?.result && typeof response.resp.result === 'string') {
     const cleanDetail = cleanErrorMessage(response.resp.result);
     if (cleanDetail && !messages.includes(cleanDetail)) {
       messages.push(cleanDetail);
     }
   }

   // Si no hay mensajes específicos, usar un mensaje genérico
   if (messages.length === 0) {
     messages.push('La validación con RENIEC no fue exitosa');
   }

   return messages.join('. ') + '.';
 }

  useEffect(() => {
    if (initDone || (address && f1)) return;
    (async () => {
      // Generar un identificador estable: base local + DNI del link si existe
      const idParam = params.get('id') || '';
      const { dni } = parseQR(idParam);
      // Si vienen address/f1 por query, úsalos de inmediato
      const qAddress = params.get('address') || '';
      const qF1 = params.get('f1') || '';
      if (qAddress && !address) setAddress(qAddress);
      if (qF1 && !f1) setF1(qF1);

      // Recuperar address/f1 persistidos si existen
      if (typeof window !== 'undefined') {
        const storedAddr = localStorage.getItem('address') || '';
        const storedF1 = localStorage.getItem('f1') || '';
        if (!qAddress && storedAddr && !address) setAddress(storedAddr);
        if (!qF1 && storedF1 && !f1) setF1(storedF1);
      }

      const base = typeof window !== 'undefined' ? (localStorage.getItem('imei') || crypto.randomUUID()) : 'web-imei';
      // Permitir forzar IMEI por query para entornos de prueba; si no, usar patrón aceptado por backend
      const forcedImei = params.get('imei') || '';
      const suggested = dni ? `test-imei-${dni}` : `test-imei-${base}`;
      const imei = forcedImei || suggested;
      if (typeof window !== 'undefined') localStorage.setItem('imei', imei);
      try {
        let resp = await createAddressForWeb(imei);
        const a = resp?.address || resp?.response?.address || '';
        const f = resp?.f1 || resp?.response?.f1 || '';
        if (a && f) {
          setAddress(a); setF1(f);
          if (typeof window !== 'undefined') {
            localStorage.setItem('address', a);
            localStorage.setItem('f1', f);
          }
        } else {
          // Retry una vez con sufijo timestamp
          const retryImei = `${imei}-${Date.now()}`;
          resp = await createAddressForWeb(retryImei);
          const a2 = resp?.address || resp?.response?.address || '';
          const f2 = resp?.f1 || resp?.response?.f1 || '';
          if (a2 && f2) {
            setAddress(a2); setF1(f2);
            if (typeof window !== 'undefined') {
              localStorage.setItem('address', a2);
              localStorage.setItem('f1', f2);
            }
          }
        }
        console.log('createAddressForWeb resp:', resp);
      } catch (e) {
        console.error('createAddressForWeb error', e);
      }
      setInitDone(true);
    })();
  }, [initDone, params, address, f1]);
  async function sendToBackend(photoData: string) {
    setLoading(true);
    const loadingToast = toast.loading('Enviando datos para validación...');
    
    try {
      const id = params.get('id') || '';
      const { dni, key } = parseQR(id);
      const finalAddress = params.get('address') || address;
      const finalF1 = params.get('f1') || f1;
      console.log('[05] parsed link', { dni, key, id });
      console.log('[05] using address/f1', { address: finalAddress?.slice(0,8), f1: !!finalF1 });
      const email = 'web@correogenerado.com';
      const resp: Notify05Detail = await notifyEvent05({ photo: photoData, email, dni, f1: finalF1 || 'f1', address: finalAddress || 'addr', key });
      console.log('[05] notifyEvent05 response', resp);
      const r = resp?.response || {};
      const ok = r?.isValid === '1' || r?.isValid === true;
      
      toast.dismiss(loadingToast);
      
      const detailedMessage = generateReniecErrorMessage(resp);
      
      if (ok) {
        toast.success('¡Validación exitosa!');
      } else {
        toast.error(detailedMessage);
      }
      
      setResult({
        success: !!ok,
        message: detailedMessage,
        detail: {
          names: r.names,
          paternal_surname: r.paternal_surname,
          maternal_surname: r.maternal_surname,
          validity: r.validity,
          isLive: r.isLive ?? r.live?.status,
          isValid: r.isValid,
          auth_id: r.auth_id,
          reniecResult: r.resp?.result,
        },
      });
    } catch (e: any) {
      console.error('[05] notifyEvent05 error', e);
      toast.dismiss(loadingToast);
      toast.error(cleanErrorMessage(e?.message) || 'Error de red o servidor');
      setResult({ success: false, message: cleanErrorMessage(e?.message) || 'Error de red o servidor' });
    } finally {
      setLoading(false);
      setStep('result');
    }
  }

  if (step === 'intro') {
    return (
      <IntroScreen
        title="Validación Biométrica RENIEC"
        subtitle="Se requiere una selfie para validar tu identidad con RENIEC. Al continuar, activaremos tu cámara."
        onStart={() => setStep('face')}
        startButtonText="Iniciar verificación"
      />
    );
  }

  if (step === 'face') {
    return (
      <CameraScreen
        title="Validación Biométrica RENIEC"
        subtitle="Paso 1 de 1: Toma una selfie clara"
        description="Se requiere una selfie para validar tu identidad con RENIEC"
        onCapture={(data) => { setPhoto(data); setStep('face-preview'); }}
        facingMode="user"
        mirror={true}
        currentStep={1}
        totalSteps={1}
      />
    );
  }

  if (step === 'face-preview' && photo) {
    return (
      <CameraPreview
        title="Validación Biométrica RENIEC"
        subtitle="Paso 1 de 1: Revisa tu selfie"
        imageSrc={photo}
        imageAlt="preview"
        onRetake={() => { setPhoto(null); setStep('face'); }}
        onContinue={() => sendToBackend(photo)}
        continueDisabled={loading || !address || !f1}
        loading={loading}
        showAddressWarning={!address || !f1}
        imageType="selfie"
        currentStep={1}
        totalSteps={1}
      />
    );
  }

  if (step === 'result') {
    const { dni } = parseQR(params.get('id') || '');
    
    return (
      <ValidationResultCard
        success={result?.success || false}
        message={result?.message || 'No se pudo validar tu identidad.'}
        details={{
          ...result?.detail,
          dni
        }}
        onRetry={() => { setStep('face'); setResult(null); setPhoto(null); }}
        showRetry={!result?.success}
      />
    );
  }

  return null;
}
