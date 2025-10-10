"use client";
import React, { useState, useId } from "react";
import Link from "next/link";

interface DNIInputScreenProps {
  title: string;
  subtitle: string;
  description?: string;
  onDNIEntered: (dni: string) => void;
  initialDNI?: string;
  cancelHref?: string;
}

export default function DNIInputScreen({
  title,
  subtitle,
  description,
  onDNIEntered,
  initialDNI = "",
  cancelHref = "https://manyao.pe/"
}: DNIInputScreenProps) {
  const [dni, setDni] = useState(initialDNI);
  const [error, setError] = useState("");
  const inputId = useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar DNI peruano (8 dígitos)
    const dniRegex = /^\d{8}$/;
    if (!dniRegex.test(dni)) {
      setError("El DNI debe tener 8 dígitos");
      return;
    }
    
    setError("");
    onDNIEntered(dni);
  };

  const handleDNIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Solo números
    if (value.length <= 8) {
      setDni(value);
      if (error) setError("");
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
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
              Número de DNI
            </label>
            <input
              type="text"
              id={inputId}
              value={dni}
              onChange={handleDNIChange}
              placeholder="12345678"
              className={`w-full px-4 py-3 border rounded-lg text-lg text-center font-mono ${
                error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#187773]'
              } focus:outline-none focus:ring-2 focus:ring-[#187773]/20 transition-colors`}
              maxLength={8}
              autoComplete="off"
              required
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className='flex gap-4'>
            <button 
              type='submit' 
              className='flex-1 px-6 py-3.5 rounded-[8px] bg-[#187773] hover:bg-[#165956] text-white font-bold text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={dni.length !== 8}
            >
              Continuar
            </button>
            <Link 
              className='flex-1 px-6 py-3.5 rounded-[8px] border border-gray-300 text-[#333] font-bold text-base text-center transition-colors hover:bg-gray-50' 
              href={cancelHref}
            >
              Cancelar
            </Link>
          </div>
        </form>

        <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
          <p className='text-sm text-blue-800 text-center'>
            <strong>Demo:</strong> Puedes usar cualquier DNI de 8 dígitos para probar el sistema
          </p>
        </div>
      </div>
    </main>
  );
}
