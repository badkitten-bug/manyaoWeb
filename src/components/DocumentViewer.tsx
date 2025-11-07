"use client";
import { ExternalLink, FileText } from "lucide-react";

interface DocumentViewerProps {
  documentUrl: string;
}

export default function DocumentViewer({ documentUrl }: DocumentViewerProps) {
  const handleOpenInNewTab = () => {
    window.open(documentUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full backdrop-blur-xl border rounded-3xl p-6 mb-6 shadow-xl" style={{backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)'}}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-red-500/10 rounded-2xl">
            <FileText className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold" style={{color: 'var(--text-primary)'}}>Documento</h3>
            <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Vista previa</p>
          </div>
        </div>
        
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleOpenInNewTab();
          }}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-semibold ml-4"
          style={{
            backgroundColor: 'transparent',
            borderColor: '#00c896',
            border: '2px solid',
            color: '#00c896'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 200, 150, 0.1)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title="Abrir documento en nueva pestaña"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Ver</span>
        </button>
      </div>

      {/* Vista previa del PDF profesional */}
      <button
        type="button"
        className="relative border rounded-2xl overflow-hidden group cursor-pointer w-full text-left p-0"
        style={{
          borderColor: 'var(--card-border)', 
          backgroundColor: 'white'
        }}
        onClick={handleOpenInNewTab}
        aria-label="Ver documento PDF completo"
      >
        {/* Preview real del PDF */}
        <iframe
          src={`${documentUrl}#toolbar=0&navpanes=0&scrollbar=1&zoom=30&view=FitH`}
          className="w-full h-[400px] sm:h-[500px]"
          title="Documento PDF"
          style={{ 
            border: 'none',
            width: '100%',
            height: '400px'
          }}
          allow="fullscreen"
          scrolling="yes"
          loading="lazy"
        />
      </button>
    </div>
  );
}
