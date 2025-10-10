"use client";
import React from "react";
import Link from "next/link";
import { Fingerprint, CreditCard } from "lucide-react";

interface ChoiceScreenProps {
  title: string;
  subtitle: string;
  description?: string;
  dni: string;
  onChoiceSelected: (choice: 'biometric' | 'cedula') => void;
  cancelHref?: string;
}

export default function ChoiceScreen({
  title,
  subtitle,
  description,
  dni,
  onChoiceSelected,
  cancelHref = "https://manyao.pe/"
}: ChoiceScreenProps) {
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
              <strong>DNI:</strong> {dni}
            </p>
          </div>
        </div>

        <div className='space-y-4 mb-6'>
          <button
            type='button'
            onClick={() => onChoiceSelected('biometric')}
            className='w-full p-4 border-2 border-[#187773] rounded-lg hover:bg-[#187773] hover:text-white transition-colors group'
          >
            <div className='flex items-center space-x-4'>
              <div className='p-3 bg-[#187773] rounded-full group-hover:bg-white transition-colors'>
                <Fingerprint size={24} className='text-white group-hover:text-[#187773]' />
              </div>
              <div className='text-left'>
                <h3 className='font-bold text-lg'>Biometría</h3>
                <p className='text-sm text-gray-600 group-hover:text-white'>
                  Validación por huella dactilar
                </p>
              </div>
            </div>
          </button>

          <button
            type='button'
            onClick={() => onChoiceSelected('cedula')}
            className='w-full p-4 border-2 border-[#187773] rounded-lg hover:bg-[#187773] hover:text-white transition-colors group'
          >
            <div className='flex items-center space-x-4'>
              <div className='p-3 bg-[#187773] rounded-full group-hover:bg-white transition-colors'>
                <CreditCard size={24} className='text-white group-hover:text-[#187773]' />
              </div>
              <div className='text-left'>
                <h3 className='font-bold text-lg'>Cédula de Identidad</h3>
                <p className='text-sm text-gray-600 group-hover:text-white'>
                  Validación por documento físico
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className='text-center'>
          <Link 
            className='px-6 py-3.5 rounded-[8px] border border-gray-300 text-[#333] font-bold text-base transition-colors hover:bg-gray-50' 
            href={cancelHref}
          >
            Cancelar
          </Link>
        </div>

        <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
          <p className='text-sm text-blue-800 text-center'>
            <strong>Demo:</strong> Selecciona cualquier opción para continuar con el proceso de firma
          </p>
        </div>
      </div>
    </main>
  );
}
