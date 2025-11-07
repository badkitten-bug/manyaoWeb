"use client";
import { ShieldCheck } from "lucide-react";
import Logo from "./Logo";
import ProgressIndicator from "./ProgressIndicator";
import ThemeToggle from "./ThemeToggle";
import { SITE_URL } from "@/lib/env";

interface ValidationResultCardProps {
  success: boolean;
  message: string;
  details?: {
    names?: string; // Nombre completo
    paternal_surname?: string; // Apellido paterno
    maternal_surname?: string; // Apellido materno
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
    // Para flujo 03 (firma)
    choice?: string;
    signatureSent?: boolean;
    key?: string; // QR key para mostrar ID del documento
    file?: string; // URL del PDF generado
    // Nuevos campos para información más rica
    validationMessage?: string; // Mensaje específico de validación
    documentId?: string; // ID del documento
    customValidationMessage?: string; // Mensaje personalizado de validación
    customDocumentId?: string; // ID personalizado del documento
  };
  onRetry?: () => void;
  showRetry?: boolean;
  isLowQualityPhoto?: boolean; // Para detectar si es error de calidad de foto
}

export default function ValidationResultCard({
  success,
  details,
  onRetry,
  showRetry = true,
  isLowQualityPhoto = false,
}: ValidationResultCardProps) {
  const fullName =
    details?.names && details?.paternal_surname && details?.maternal_surname
      ? [details.names, details.paternal_surname, details.maternal_surname]
        .join(" ")
    : null;

  // Función para formatear el ID del documento (6 primeros + 6 últimos dígitos)
  const formatDocumentId = (key: string): string => {
    if (!key || key.length < 12) return key;
    const first6 = key.substring(0, 6);
    const last6 = key.substring(key.length - 6);
    return `${first6}...${last6}`;
  };

  // Determinar si es el flujo de firma (03)
  const isSignatureFlow = details?.signatureSent === true;

  // Función para construir el nombre completo para el flujo de firma
  const getFullNameForSignature = (): string => {
    if (!details?.names) return "";

    const parts = [details.names];
    if (details.paternal_surname) parts.push(details.paternal_surname);
    if (details.maternal_surname) parts.push(details.maternal_surname);

    return parts.join(" ");
  };

  // Función para generar mensajes de error específicos
  const getSpecificErrorMessage = (): string => {
    if (!details) return "No se pudo procesar la solicitud.";

    // Verificar si es un error de liveness (foto tapada o no válida)
    if (details.liveness?.status === false || details.isLive === false) {
      return "No se pudo validar la identidad de la foto enviada. Asegúrate de que tu rostro esté completamente visible y bien iluminado.";
    }

    // Verificar si es un error de validación de DNI
    if (details.isValid === false || details.validity === "false") {
      return "El DNI proporcionado no pudo ser validado. Verifica que el número sea correcto e inténtalo de nuevo.";
    }

    // Verificar si es un error de RENIEC
    if (details.reniecResult?.toLowerCase().includes("error")) {
      return "Error en la consulta con RENIEC. El servicio puede estar temporalmente no disponible.";
    }

    // Verificar si hay detalles específicos del error
    if (details.detail) {
      const detail = String(details.detail).replace(/\?/g, "ó");
      if (detail.toLowerCase().includes("liveness")) {
        return "No se pudo verificar que la foto sea de una persona real. Intenta tomando la foto nuevamente.";
      }
      if (detail.toLowerCase().includes("face")) {
        return "No se pudo detectar claramente tu rostro en la foto. Asegúrate de mirar directamente a la cámara.";
      }
      if (detail.toLowerCase().includes("quality")) {
        return "La calidad de la foto no es suficiente para la verificación. Intenta con mejor iluminación.";
      }
      return detail;
    }

    // Verificar validaciones específicas
    if (details.validations?.some((v) => !v.status)) {
      const failedValidations = details.validations.filter((v) => !v.status);
      if (
        failedValidations.some((v) => v.test.toLowerCase().includes("liveness"))
      ) {
        return "No se pudo verificar que la foto sea de una persona real. Intenta tomando la foto nuevamente.";
      }
      if (
        failedValidations.some((v) => v.test.toLowerCase().includes("face"))
      ) {
        return "No se pudo detectar claramente tu rostro en la foto. Asegúrate de mirar directamente a la cámara.";
      }
    }

    // Mensaje genérico como fallback
    return "No se pudo completar la verificación. Intenta nuevamente.";
  };

  return (
    <main className="min-h-dvh flex flex-col">
      <ThemeToggle />

        <div className="flex-1 flex flex-col items-center pt-0 pb-4 px-4 overflow-y-auto">
        {/* Contenedor principal para TODO el contenido */}
        <div
          className="w-full max-w-lg backdrop-blur-xl border rounded-3xl px-2 py-3 shadow-xl"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          <div className="px-4">
            <Logo />
          </div>

          <div className="px-4">
            <ProgressIndicator currentStep={4} totalSteps={4} />
          </div>

          {/* Icono central */}
          <div className="mb-6 flex justify-center">
            {success
              ? (
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, #00c896 0%, #00a67d 100%)",
                  }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-500 opacity-80"></div>
                  <svg 
                    className="w-8 h-8 text-white relative z-10" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={3} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>
              )
              : (
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl bg-red-500">
                  <span className="text-4xl text-white">❌</span>
            </div>
          )}
          </div>

          <div className="mb-10 text-center px-4">
            <h1
              className="text-2xl md:text-3xl font-bold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {success
                ? (isSignatureFlow ? "¡Proceso terminado!" : "Validación Exitosa")
                : "Verificación no completada"}
          </h1>
            <p
              className="text-base md:text-lg leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
            {success 
                ? (isSignatureFlow
                  ? "Su firma electrónica ha sido procesada exitosamente."
                  : "¡Validación biométrica exitosa! Tu identidad ha sido verificada.")
                : getSpecificErrorMessage()}
          </p>
        </div>

          {/* Datos de la persona y certificado - solo para flujo de firma exitoso */}
          {success && isSignatureFlow && details?.file && (
            <div
              className="mb-6 mt-2 px-1.5 py-4 border-l-0 border-r-0 border-t border-b rounded-none"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {/* Sección de información del documento - CENTRADA */}
                  <div className="mb-4 text-center">
                    <h3 className="text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                      Información del documento firmado
                    </h3>
                    
                    {/* Badge del ID del documento (no clickeable) */}
                    <div className="mb-2">
                      <div
                        className="inline-flex items-center px-8 py-2 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: "rgba(0, 200, 150, 0.15)",
                          borderColor: "rgba(0, 200, 150, 0.4)",
                          border: "2px solid",
                          color: "#00c896"
                        }}
                      >
                        <span className="font-semibold">ID:</span>
                        <span className="ml-2 font-mono text-xs">
                          {details?.documentId || details?.customDocumentId ? formatDocumentId(details.documentId || details.customDocumentId || '') : details?.key ? formatDocumentId(details.key) : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sección de datos del usuario - CENTRADA */}
                  <div className="mb-4 text-center">
                    <h3 className="text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                      Datos de la persona que firmó
                    </h3>
                    
                    <div 
                      className="block rounded-xl p-4 w-full relative"
                      style={{
                        backgroundColor: "var(--card-bg)"
                      }}
                    >
                      <div className="space-y-3">
                        <div className="text-center">
                          <span className="text-xs font-medium block mb-1" style={{ color: "var(--text-secondary)" }}>
                            Nombre completo
                          </span>
                          <span className="text-base font-semibold block" style={{ color: "var(--text-primary)" }}>
                            {getFullNameForSignature() || "Nombre no disponible"}
                          </span>
                        </div>
                        <div className="text-center relative">
                          <span className="text-xs font-medium block mb-1" style={{ color: "var(--text-secondary)" }}>
                            DNI
                          </span>
                          <span className="text-lg font-bold" style={{ color: "#00c896" }}>
                            {details?.dni || "N/A"}
                          </span>
                          
                          {/* Escudo clickeable para certificado */}
                          <button
                            onClick={() => window.open(details.file, "_blank")}
                            className="absolute -bottom-1 -right-1 p-2 rounded-full transition-all duration-300 hover:scale-110"
                            style={{
                              backgroundColor: "rgba(0, 200, 150, 0.15)",
                              borderColor: "rgba(0, 200, 150, 0.3)",
                              border: "2px solid"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "rgba(0, 200, 150, 0.25)";
                              e.currentTarget.style.transform = "scale(1.1)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "rgba(0, 200, 150, 0.15)";
                              e.currentTarget.style.transform = "scale(1)";
                            }}
                            title="Ver certificado de firma electrónica"
                          >
                            <ShieldCheck className="w-4 h-4" style={{ color: "#00c896" }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tarjeta de datos del usuario - solo si es exitoso y NO es flujo de firma */}
          {success && details && !isSignatureFlow && (
            <div
              className="mb-6 p-4 rounded-2xl border"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
                borderLeft: "4px solid #34C759",
              }}
            >
              {fullName
                ? (
                  <>
                    <p
                      className="text-lg font-semibold mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                  {fullName}
                </p>
                    <p
                      className="text-base"
                      style={{ color: "var(--text-secondary)" }}
                    >
                  Vence: {details.validity} - DNI: {details.dni}
                </p>
              </>
                )
                : details.dni
                ? (
              <>
                    <p
                      className="text-lg font-semibold mb-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                  DNI: {details.dni}
                </p>
                {/* Para flujo 04 - mostrar validaciones */}
                {details.validations && (
                      <div className="flex flex-wrap gap-2 justify-center mt-2">
                        {details.validations.map((validation) => (
                      <span 
                            key={validation.test}
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs text-white ${
                              validation.status
                                ? "bg-[#34C759]"
                                : "bg-[#f44336]"
                            }`}
                          >
                            {validation.test}:{" "}
                            {validation.status ? "OK" : "Falla"}
                      </span>
                    ))}
                    {details.liveness?.status !== undefined && (
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs text-white ${
                              details.liveness.status
                                ? "bg-[#34C759]"
                                : "bg-[#f44336]"
                            }`}
                          >
                            Liveness: {details.liveness.status ? "OK" : "Falla"}
                      </span>
                    )}
                  </div>
                )}
                {details.detail && (
                      <p
                        className="text-sm mt-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {String(details.detail).replace(/\?/g, "ó")}
                  </p>
                )}
              </>
                )
                : null}
          </div>
        )}
        
        {/* Referencia */}
        {details?.auth_id && (
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            Referencia: {details.auth_id}
          </p>
        )}
        
        {/* Botones */}
          <div className="space-y-4 mb-6 px-4">
            <a
              className="w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] text-center block"
              style={{
                background: "linear-gradient(135deg, #00c896 0%, #00b4d8 100%)",
                color: "white",
              }}
              href={SITE_URL}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #00b4d8 0%, #0096c7 100%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #00c896 0%, #00b4d8 100%)";
              }}
            >
              Finalizar
            </a>

          {!success && showRetry && onRetry && (
            <button 
                type="button"
                className="w-full py-4 rounded-2xl border-2 font-bold text-lg transition-all duration-300"
                style={{
                  borderColor: "#f44336",
                  color: "#f44336",
                  backgroundColor: "var(--card-bg)",
                }}
              onClick={onRetry}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(244, 67, 54, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--card-bg)";
                }}
              >
                {isLowQualityPhoto ? "Tomar otra foto" : "Intentar de nuevo"}
            </button>
          )}
        </div>

          {/* Footer */}
          <footer className="mt-8 text-center">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              © 2025{" "}
              <span style={{ color: "var(--text-primary)" }}>Manyao</span>.
              Todos los derechos reservados.
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
