"use client";
import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { parseQR } from '@/lib';
import { createAddressForWeb } from '@/lib/api';
import toast from 'react-hot-toast';

// Componentes reutilizables
import IntroScreen from '@/components/IntroScreen';
import DNIInputScreen from '@/components/DNIInputScreen';
import ChoiceScreen from '@/components/ChoiceScreen';
import SignatureScreen from '@/components/SignatureScreen';
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
  const [step, setStep] = useState<'intro' | 'dni-input' | 'choice' | 'signature' | 'result'>('intro');
  const [dni, setDni] = useState<string>('');
  const [choice, setChoice] = useState<'biometric' | 'cedula' | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('');
  const [f1, setF1] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [initDone, setInitDone] = useState(false);
  
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    detail?: {
      dni?: string;
      choice?: string;
      signatureSent?: boolean;
    };
  } | null>(null);

  useEffect(() => {
    if (initDone || (address && f1)) return;
    (async () => {
      const idParam = params.get('id') || '';
      const { dni: qrDni } = parseQR(idParam);
      if (qrDni && !dni) setDni(qrDni);
      
      const qAddress = params.get('address') || '';
      const qF1 = params.get('f1') || '';
      if (qAddress && !address) setAddress(qAddress);
      if (qF1 && !f1) setF1(qF1);
      
      if (typeof window !== 'undefined') {
        const sa = localStorage.getItem('address') || '';
        const sf = localStorage.getItem('f1') || '';
        if (!qAddress && sa && !address) setAddress(sa);
        if (!qF1 && sf && !f1) setF1(sf);
      }
      
      const base = typeof window !== 'undefined' ? (localStorage.getItem('imei') || crypto.randomUUID()) : 'web-imei';
      const forcedImei = params.get('imei') || '';
      const suggested = qrDni ? `test-imei-${qrDni}` : `test-imei-${base}`;
      const imei = forcedImei || suggested;
      if (typeof window !== 'undefined') localStorage.setItem('imei', imei);
      
      try {
        let resp = await createAddressForWeb(imei);
        let a = resp?.address || resp?.response?.address || '';
        let f = resp?.f1 || resp?.response?.f1 || '';
        if (!(a && f)) {
          const retryImei = `${imei}-${Date.now()}`;
          resp = await createAddressForWeb(retryImei);
          a = resp?.address || resp?.response?.address || '';
          f = resp?.f1 || resp?.response?.f1 || '';
        }
        if (a && f) {
          setAddress(a); setF1(f);
          if (typeof window !== 'undefined') {
            localStorage.setItem('address', a);
            localStorage.setItem('f1', f);
          }
        }
      } catch (e) {
        console.log('createAddressForWeb error', e);
      }
      setInitDone(true);
    })();
  }, [initDone, params, address, f1, dni]);

  async function sendSignature() {
    if (!signature || !dni || !choice) return;
    setLoading(true);
    const loadingToast = toast.loading('Enviando firma digital...');
    
    try {
      // Simular envío de firma - aquí iría la llamada real al backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.dismiss(loadingToast);
      toast.success('¡Firma digital enviada exitosamente!');
      
      setResult({ 
        success: true, 
        message: 'Firma digital procesada correctamente. Gracias por completar el proceso.',
        detail: {
          dni,
          choice: choice === 'biometric' ? 'Biometría' : 'Cédula de Identidad',
          signatureSent: true
        }
      });
    } catch (error) {
      console.error('Error sending signature:', error);
      toast.dismiss(loadingToast);
      toast.error('Error al enviar la firma digital');
      setResult({ success: false, message: 'Error al procesar la firma digital' });
    } finally {
      setLoading(false);
      setStep('result');
    }
  }

  if (step === 'intro') {
    return (
      <IntroScreen
        title="Firma Digital Biométrica (03)"
        subtitle="Sistema de firma digital con validación biométrica o por cédula de identidad"
        description="Ingresa tu DNI, elige tu método de validación y firma digitalmente"
        onStart={() => setStep('dni-input')}
        startButtonText="Iniciar Firma Digital"
      />
    );
  }

  if (step === 'dni-input') {
    return (
      <DNIInputScreen
        title="Firma Digital Biométrica (03)"
        subtitle="Paso 1: Ingresa tu número de DNI"
        description="Necesitamos tu DNI para el proceso de validación"
        onDNIEntered={(enteredDni) => {
          setDni(enteredDni);
          setStep('choice');
        }}
        initialDNI={dni}
      />
    );
  }

  if (step === 'choice') {
    return (
      <ChoiceScreen
        title="Firma Digital Biométrica (03)"
        subtitle="Paso 2: Elige tu método de validación"
        description="Selecciona cómo deseas validar tu identidad"
        dni={dni}
        onChoiceSelected={(selectedChoice) => {
          setChoice(selectedChoice);
          setStep('signature');
        }}
      />
    );
  }

  if (step === 'signature') {
    return (
      <SignatureScreen
        title="Firma Digital Biométrica (03)"
        subtitle="Paso 3: Firma con tu dedo"
        description="Dibuja tu firma en el panel inferior"
        onSignatureCaptured={(signatureData) => {
          setSignature(signatureData);
        }}
        onContinue={sendSignature}
        continueDisabled={loading || !signature}
        loading={loading}
        method={choice || 'biometric'}
      />
    );
  }

  if (step === 'result') {
    return (
      <ValidationResultCard
        success={result?.success || false}
        message={result?.message || 'Proceso completado.'}
        details={{
          ...result?.detail,
          dni
        }}
        onRetry={() => { 
          setStep('dni-input'); 
          setResult(null); 
          setDni('');
          setChoice(null);
          setSignature(null);
        }}
        showRetry={!result?.success}
      />
    );
  }

  return null;
}
