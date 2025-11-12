# Manyao - Sistema de Validación Biométrica


## 📋 Descripción

**Manyao** es una plataforma web avanzada de validación biométrica diseñada para el mercado peruano. Permite la verificación de identidad mediante reconocimiento facial, validación contra RENIEC (Registro Nacional de Identificación y Estado Civil), captura de documentos DNI y firma electrónica.

La aplicación está construida con Next.js 14+ y TypeScript, ofreciendo una experiencia de usuario fluida y segura para procesos de KYC (Know Your Customer) y validación de identidad.

---

## 🎯 Características Principales

### 1. **Validación Biométrica Múltiple**
- ✅ **Validación Simple (FREE)**: Captura básica sin verificación de identidad
- ✅ **Validación con RENIEC (PRO)**: Verificación oficial contra registro nacional
- 🔜 **Validación con DNI (PRO)**: Comparación facial con foto del DNI físico
- 🔜 **Validación con eDNI (PREMIUM)**: Validación con DNI electrónico tipo 2/3
- 🔜 **Validación con NFC (PREMIUM)**: Verificación mediante CryptoCard con NFC

### 2. **Detección Facial Avanzada**
- Reconocimiento facial en tiempo real usando `@vladmandic/face-api`
- Detección de expresiones faciales
- Identificación de puntos de referencia facial (68 landmarks)
- Verificación de "liveness" (persona viva vs foto/video)

### 3. **Captura de Documentos**
- Captura de DNI con overlay guía
- Modo espejo para selfies
- Soporte para cámara frontal y trasera
- Preview antes de confirmación

### 4. **Firma Electrónica**
- Canvas interactivo para firma digital
- Captura vectorial de la firma
- Reproducción de firma para verificación
- Generación de certificados PDF

### 5. **Sistema de Temas**
- Modo oscuro/claro con toggle animado
- Persistencia de preferencias en localStorage
- Transiciones suaves entre temas

---

## 🏗️ Arquitectura del Proyecto

```
manyao/
├── app/
│   ├── layout.tsx              # Layout principal con fuente Space Mono
│   ├── page.tsx                # Página de inicio con routing dinámico
│   ├── globals.css             # Estilos globales y variables CSS
│   └── biometric/              # Módulo de validación biométrica
│       ├── reniec/             # Flujo de validación RENIEC
│       ├── dni/                # Flujo de validación DNI
│       └── signature/          # Flujo de firma electrónica
│
├── components/
│   ├── ActionButtons.tsx       # Botones de acción reutilizables
│   ├── AppIcon.tsx            # Sistema de iconos (Lucide)
│   ├── CameraPreview.tsx      # Preview de imagen capturada
│   ├── CameraScreen.tsx       # Pantalla de captura de cámara
│   ├── ChoiceScreen.tsx       # Selección de método de validación
│   ├── DNIInputScreen.tsx     # Ingreso manual de DNI
│   ├── DocumentViewer.tsx     # Visualizador de PDFs
│   ├── IntroScreen.tsx        # Pantalla de introducción
│   ├── Logo.tsx               # Logo de la aplicación
│   ├── ProgressIndicator.tsx  # Indicador de progreso (4 pasos)
│   ├── SignatureScreen.tsx    # Canvas de firma digital
│   ├── ThemeToggle.tsx        # Toggle de tema oscuro/claro
│   ├── ToastProvider.tsx      # Sistema de notificaciones
│   ├── ValidationResultCard.tsx # Resultado de validación
│   ├── WebCamera.tsx          # Componente de cámara web
│   └── WebFaceDetector.tsx    # Detector facial en tiempo real
│
├── lib/
│   └── env.ts                 # Variables de entorno
│
└── public/
    └── models/                # Modelos de face-api.js
```

---

## 🔄 Flujos de Validación

### **Flujo 03: Firma Electrónica**
```
1. ChoiceScreen (Selección de método)
   ↓
2. DNIInputScreen (Ingreso de DNI)
   ↓
3. CameraScreen (Captura de selfie)
   ↓
4. SignatureScreen (Firma digital)
   ↓
5. ValidationResultCard (Certificado PDF)
```

### **Flujo 04: Validación con DNI**
```
1. ChoiceScreen
   ↓
2. DNIInputScreen
   ↓
3. CameraScreen (Selfie)
   ↓
4. CameraScreen (DNI físico)
   ↓
5. ValidationResultCard (Comparación facial)
```

### **Flujo 05: Validación con RENIEC**
```
1. ChoiceScreen
   ↓
2. DNIInputScreen
   ↓
3. CameraScreen (Selfie con liveness)
   ↓
4. ValidationResultCard (Validación oficial)
```

---

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- **Next.js 14+**: Framework React con App Router
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos utility-first
- **Lucide React**: Iconos modernos
- **React Hot Toast**: Sistema de notificaciones

### **Validación Biométrica**
- **@vladmandic/face-api**: Reconocimiento facial
- **TensorFlow.js**: Modelos de ML en el navegador
- Modelos incluidos:
  - `tinyFaceDetector`: Detección rápida de rostros
  - `faceLandmark68Net`: 68 puntos de referencia
  - `faceRecognitionNet`: Vectores de reconocimiento
  - `faceExpressionNet`: Detección de expresiones

### **APIs**
- **MediaDevices API**: Acceso a cámara
- **Canvas API**: Captura y procesamiento de imágenes
- **LocalStorage**: Persistencia de preferencias

---

## 📦 Instalación

### **Requisitos Previos**
- Node.js 18+
- npm, yarn o pnpm

### **Pasos de Instalación**

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/manyao.git
cd manyao

# Instalar dependencias
npm install
# o
yarn install
# o
pnpm install

# Descargar modelos de face-api
# Copiar los modelos a public/models/
# Modelos necesarios:
# - tiny_face_detector_model-weights_manifest.json
# - face_landmark_68_model-weights_manifest.json
# - face_recognition_model-weights_manifest.json
# - face_expression_model-weights_manifest.json

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus configuraciones

# Ejecutar en desarrollo
npm run dev
# o
yarn dev
# o
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

---

## 🔐 Configuración de Seguridad

### **Permisos de Cámara**
La aplicación requiere permisos de cámara. Para Chrome en Android:

1. Tocar el icono 🔒 junto a la URL
2. Ir a "Configuración del sitio"
3. Permisos → Cámara → Permitir

### **HTTPS Requerido**
- La API `getUserMedia` solo funciona en:
  - `localhost` (desarrollo)
  - Dominios con HTTPS (producción)

### **Variables de Entorno**

```env
# URL del sitio
NEXT_PUBLIC_SITE_URL=https://manyao.com

# API de validación
NEXT_PUBLIC_API_URL=https://api.manyao.com

# Claves de API (backend)
API_KEY_RENIEC=tu_clave_reniec
API_KEY_VALIDATION=tu_clave_validacion
```

---

## 🎨 Sistema de Temas

### **Modo Oscuro (Por Defecto)**
```css
:root.dark-mode {
  --bg-gradient: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  --card-bg: rgba(30, 41, 59, 0.85);
  --card-border: rgba(148, 163, 184, 0.2);
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;
  --brand-500: #00c896;
  --brand-400: #00e0a8;
  --brand-600: #00b088;
}
```

### **Modo Claro**
```css
:root.light-mode {
  --bg-gradient: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  --card-bg: rgba(255, 255, 255, 0.95);
  --card-border: rgba(203, 213, 225, 0.4);
  --text-primary: #1e293b;
  --text-secondary: #475569;
  --text-muted: #64748b;
  /* ... */
}
```

---

## 📱 Componentes Principales

### **WebCamera**
Componente de captura de cámara con opciones avanzadas.

```tsx
<WebCamera
  onCapture={(dataUrl) => console.log(dataUrl)}
  autoCaptureEnabled={false}
  overlay="square"
  facingMode="environment"
  mirror={false}
  showCaptureButton={true}
/>
```

**Props:**
- `onCapture`: Callback con imagen en base64
- `autoCaptureEnabled`: Activar captura automática (default: true)
- `overlay`: Tipo de guía visual ('circle' | 'none')
- `facingMode`: Cámara a usar ('user' | 'environment')
- `mirror`: Invertir horizontalmente (default: true para selfies)
- `showCaptureButton`: Mostrar botón manual

### **WebFaceDetector**
Detector facial en tiempo real con expresiones.

```tsx
<WebFaceDetector />
```

**Características:**
- Detección de múltiples rostros
- 68 puntos de referencia
- Expresiones faciales (feliz, triste, enojado, etc.)
- Actualización cada 150ms

### **SignatureScreen**
Canvas interactivo para firma digital.

```tsx
<SignatureScreen
  title="Dibuja tu firma"
  subtitle="Usa tu dedo o mouse"
  onSignatureCaptured={(image, vector) => {...}}
  onContinue={() => {...}}
  onBack={() => {...}}
  loading={false}
  method="digital"
/>
```

**Funcionalidades:**
- Captura vectorial de trazos
- Reproducción de firma
- Limpieza de canvas
- Exportación a PNG + JSON

### **ValidationResultCard**
Tarjeta de resultado con información detallada.

```tsx
<ValidationResultCard
  success={true}
  message="Validación exitosa"
  details={{
    names: "Juan",
    paternal_surname: "Pérez",
    maternal_surname: "García",
    dni: "12345678",
    validity: "2030-12-31",
    isLive: true,
    isValid: true
  }}
  onRetry={() => {...}}
  showRetry={false}
/>
```

---

## 🔌 Integración con APIs

### **Endpoint de Validación RENIEC**
```typescript
const response = await fetch('/api/validate/reniec', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    dni: '12345678',
    selfie: 'data:image/jpeg;base64,...',
    qrKey: '05:12345678:clave123'
  })
});

const result = await response.json();
// {
//   success: true,
//   data: {
//     names: "JUAN",
//     paternal_surname: "PEREZ",
//     maternal_surname: "GARCIA",
//     validity: "2030-12-31",
//     isLive: true,
//     isValid: true,
//     auth_id: "abc123"
//   }
// }
```

### **Endpoint de Firma Electrónica**
```typescript
const response = await fetch('/api/sign/document', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    dni: '12345678',
    selfie: 'data:image/jpeg;base64,...',
    signature: 'data:image/png;base64,...',
    signatureVector: 'base64_encoded_json',
    qrKey: '03:12345678:clave123'
  })
});

const result = await response.json();
// {
//   success: true,
//   data: {
//     file: "https://cdn.manyao.com/signed/doc123.pdf",
//     key: "03:12345678:doc123",
//     signatureSent: true
//   }
// }
```

---

## 🧪 Testing

### **Ejecutar Tests**
```bash
npm run test
# o
yarn test
```

### **Tests de Componentes**
```bash
npm run test:components
```

### **Tests E2E**
```bash
npm run test:e2e
```

---

## 🚀 Deployment

### **Build de Producción**
```bash
npm run build
npm start
```

### **Deploy en Vercel**
```bash
vercel --prod
```

### **Variables de Entorno en Producción**
Configurar en el panel de Vercel:
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_API_URL`
- `API_KEY_RENIEC`
- `API_KEY_VALIDATION`

---

## 📊 Estructura de Datos

### **QR Code Format**
```
Formato: ACCION:DNI:CLAVE

Ejemplos:
- 03:12345678:secretkey123  (Firma electrónica)
- 04:12345678:secretkey456  (Validación DNI)
- 05:87654321:secretkey789  (Validación RENIEC)
```

### **Resultado de Validación**
```typescript
interface ValidationResult {
  success: boolean;
  message: string;
  details?: {
    names?: string;
    paternal_surname?: string;
    maternal_surname?: string;
    dni?: string;
    validity?: string;
    isLive?: boolean;
    isValid?: boolean;
    auth_id?: string;
    reniecResult?: string;
    validations?: Array<{
      test: string;
      status: boolean;
      result: string;
    }>;
    liveness?: { status?: boolean };
    detail?: string;
    // Para firma electrónica
    choice?: string;
    signatureSent?: boolean;
    key?: string;
    file?: string;
  };
}
```

---

## 🐛 Troubleshooting

### **Error: "getUserMedia no está disponible"**
**Causa**: Navegador no soporta API o sitio no está en HTTPS.
**Solución**: 
- Verificar que estés en `localhost` o dominio HTTPS
- Usar navegadores modernos (Chrome 53+, Firefox 36+, Safari 11+)

### **Error: "No se pudo cargar los modelos de face-api"**
**Causa**: Modelos no están en `/public/models/`.
**Solución**: 
```bash
# Descargar modelos desde:
# https://github.com/vladmandic/face-api/tree/master/model
cd public
mkdir models
cd models
# Copiar los 4 modelos necesarios
```

### **Error: "La cámara no se activa en móvil"**
**Causa**: Permisos denegados.
**Solución**: 
- Chrome Android: Configuración del sitio → Permisos → Cámara → Permitir
- iOS Safari: Ajustes → Safari → Cámara → Permitir

### **Tema no persiste al recargar**
**Causa**: LocalStorage no funciona o está bloqueado.
**Solución**: 
- Verificar que el navegador permita localStorage
- Comprobar modo incógnito (puede bloquear localStorage)

---

## 🤝 Contribución

### **Cómo Contribuir**
1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

### **Guías de Estilo**
- **TypeScript**: Usar tipos explícitos
- **Componentes**: Preferir functional components con hooks
- **CSS**: Usar Tailwind utilities primero, CSS custom como fallback
- **Commits**: Formato convencional (feat:, fix:, docs:, etc.)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 👥 Equipo

**Manyao Development Team**
- 🌐 Web: [manyao.com](https://manyao.com)
- 📧 Email: contact@manyao.com
- 🐦 Twitter: [@manyao_dev](https://twitter.com/manyao_dev)

---

## 🙏 Agradecimientos

- **face-api.js** por Vlado Mandic - Reconocimiento facial
- **Next.js Team** - Framework increíble
- **Vercel** - Hosting y deployment
- **RENIEC** - API de validación oficial

---

## 📈 Roadmap

### **Q1 2025**
- [x] Validación simple (FREE)
- [x] Validación con RENIEC (PRO)
- [x] Firma electrónica
- [ ] Validación con DNI físico

### **Q2 2025**
- [ ] Validación con eDNI
- [ ] Validación con NFC
- [ ] Dashboard de administración
- [ ] API REST pública

### **Q3 2025**
- [ ] App móvil nativa (iOS/Android)
- [ ] Integración con blockchain
- [ ] Soporte para más países

---

## 📞 Soporte

¿Necesitas ayuda? Contáctanos:

- 📧 **Email**: support@manyao.com
- 💬 **Discord**: [discord.gg/manyao](https://discord.gg/manyao)
- 📚 **Docs**: [docs.manyao.com](https://docs.manyao.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/tu-usuario/manyao/issues)

---

**© 2025 Manyao. Todos los derechos reservados.**

