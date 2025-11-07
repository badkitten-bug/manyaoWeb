"use client";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true); // Por defecto dark mode

        useEffect(() => {
          // Verificar tema inicial desde localStorage
          const savedTheme = localStorage.getItem('theme');
          
          console.log('[DEBUG] Inicializando tema:', { savedTheme });
          
          // Si no hay tema guardado, usar dark mode por defecto
          if (!savedTheme) {
            setIsDark(true);
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
            console.log('[DEBUG] Aplicando tema oscuro (por defecto)');
          } else {
            // Usar tema guardado
            if (savedTheme === 'dark') {
              setIsDark(true);
              document.body.classList.add('dark-mode');
              document.body.classList.remove('light-mode');
              console.log('[DEBUG] Aplicando tema oscuro (guardado)');
            } else {
              setIsDark(false);
              document.body.classList.add('light-mode');
              document.body.classList.remove('dark-mode');
              console.log('[DEBUG] Aplicando tema claro (guardado)');
            }
          }
        }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    console.log('[DEBUG] Cambiando tema de', isDark ? 'oscuro' : 'claro', 'a', newTheme ? 'oscuro' : 'claro');
    
    setIsDark(newTheme);
    
    if (newTheme) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
      console.log('[DEBUG] Aplicado tema oscuro');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
      console.log('[DEBUG] Aplicado tema claro');
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="fixed top-5 right-5 w-12 h-12 rounded-full border-none cursor-pointer flex items-center justify-center z-50 transition-all duration-300 ease-in-out shadow-lg hover:scale-110 hover:rotate-180"
      style={{
        background: isDark 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(10px)',
        border: isDark 
          ? '1px solid rgba(255, 255, 255, 0.2)' 
          : '1px solid rgba(0, 0, 0, 0.1)'
      }}
      aria-label="Cambiar tema"
    >
      {isDark ? (
        <Sun className="w-6 h-6 text-yellow-400" />
      ) : (
        <Moon className="w-6 h-6 text-slate-700" />
      )}
    </button>
  );
}
