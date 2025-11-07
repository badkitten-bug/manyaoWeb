"use client";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const steps = Array.from({ length: totalSteps }, (_, index) => index);
  
  return (
    <div className="flex justify-center gap-3 mb-8">
      {steps.map((stepIndex) => (
        <div
          key={`progress-step-${stepIndex}`}
          className={`h-1.5 rounded-full transition-all duration-400 ease-out ${
            stepIndex < currentStep
              ? 'shadow-lg'
              : ''
          }`}
          style={{
            width: stepIndex < currentStep ? '60px' : '40px',
            background: stepIndex < currentStep 
              ? 'linear-gradient(90deg, #00c896 0%, #00b4d8 100%)' 
              : 'var(--card-border)',
            boxShadow: stepIndex < currentStep ? '0 0 20px rgba(0, 200, 150, 0.5)' : 'none'
          }}
        />
      ))}
    </div>
  );
}
