"use client";
import Link from "next/link";
import WebCamera from "./WebCamera";
import Logo from "./Logo";
import ProgressIndicator from "./ProgressIndicator";
import ThemeToggle from "./ThemeToggle";
import { Camera } from "lucide-react";
import { SITE_URL } from "@/lib/env";

interface CameraScreenProps {
  onCapture: (data: string) => void;
  onBack?: () => void;
  facingMode?: "user" | "environment";
  autoCaptureEnabled?: boolean;
  overlay?: "circle" | "square" | "none";
  mirror?: boolean;
  cancelHref?: string;
  title?: string;
  subtitle?: string;
}

export default function CameraScreen({
  onCapture,
  onBack,
  facingMode = "environment", // 👈 por defecto cámara trasera
  autoCaptureEnabled = false, // 👈 desactivamos autocaptura
  overlay = "square", // 👈 overlay cuadrado
  mirror = false,
  cancelHref = SITE_URL,
  title,
  subtitle,
}: CameraScreenProps) {
  return (
    <main className="min-h-dvh flex flex-col">
      <ThemeToggle />

      <div className="flex-1 flex flex-col items-center pt-0 pb-4 px-4 overflow-y-auto">
        {/* Contenedor principal */}
        <div
          className="w-full max-w-lg backdrop-blur-xl border rounded-3xl px-6 py-3 shadow-xl"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          <Logo />

          <ProgressIndicator currentStep={3} totalSteps={4} />

          {/* Títulos dinámicos */}
          <div className="mb-8 text-center">
            <h1
              className="text-2xl md:text-3xl font-bold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {title || "Captura una foto de tu DNI"}
            </h1>
            <p
              className="text-base md:text-lg leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {subtitle ||
                "Alinea tu DNI dentro del recuadro y presiona “Tomar foto”."}
            </p>
          </div>

          {/* Cámara */}
          <div className="mb-6 relative">
            <WebCamera
              onCapture={onCapture}
              facingMode={facingMode}
              autoCaptureEnabled={autoCaptureEnabled}
              overlay={overlay}
              mirror={mirror}
            />
          </div>

          {/* Botón Tomar Foto */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => {
                const event = new CustomEvent("manualCapture");
                window.dispatchEvent(event);
              }}
              className="w-full py-4 rounded-2xl font-bold text-lg text-white transition-all duration-300 flex items-center justify-center gap-2"
              style={{
                backgroundColor: "#00c896",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#00e0a8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#00c896";
              }}
            >
              <Camera size={22} /> Tomar foto
            </button>
          </div>

          {/* Botón Retroceder */}
          <div className="mb-6">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="w-full py-4 rounded-2xl border-2 font-bold text-lg transition-all duration-300"
                style={{
                  borderColor: "#00c896",
                  color: "#00c896",
                  backgroundColor: "var(--card-bg)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f0fdfa";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--card-bg)";
                }}
              >
                Retroceder
              </button>
            ) : (
              <Link
                className="w-full py-4 rounded-2xl border-2 font-bold text-lg transition-all duration-300 text-center block"
                style={{
                  borderColor: "#00c896",
                  color: "#00c896",
                  backgroundColor: "var(--card-bg)",
                }}
                href={cancelHref}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f0fdfa";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--card-bg)";
                }}
              >
                Retroceder
              </Link>
            )}
          </div>

          {/* Footer */}
          <footer className="mt-8 text-center">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              © 2025 <span style={{ color: "var(--text-primary)" }}>Manyao</span>
              . Todos los derechos reservados.
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
//commit