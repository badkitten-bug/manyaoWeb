# Manyao Web - Validación Biométrica y Firma Electrónica

Aplicación web Next.js para validación biométrica de DNI y firma electrónica, con integración a la API de Stamping.io.

## 📋 Descripción

Manyao Web es una aplicación web que permite:
- **Validación biométrica de DNI** con foto y verificación facial
- **Firma electrónica** con validación RENIEC (Premium) o simple (Free)
- **Captura de fotos** para verificación de identidad
- **Integración con API de Stamping.io** para procesamiento de documentos

## 🚀 Requisitos Previos

- Node.js 18+ o Bun
- npm, yarn, pnpm o bun
- Cuenta con acceso a la API de Stamping.io

## 📦 Instalación

1. **Clonar el repositorio:**
```bash
git clone <repository-url>
cd manyaoweb
```

2. **Instalar dependencias:**
```bash
npm install
# o
bun install
```

3. **Configurar variables de entorno:**
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Endpoints y autenticación
NEXT_PUBLIC_API_BASE_URL=https://api.stamping.io
NEXT_PUBLIC_API_KEY=tu-api-key-aqui
NEXT_PUBLIC_SCOPE=dev

# IDs de procesos backend
NEXT_PUBLIC_VALIDATE_DNI_WITH_PHOTO_PROCESS_ID=tu-process-id
NEXT_PUBLIC_VALIDATE_FACE_PROCESS_ID=tu-process-id
NEXT_PUBLIC_NOTIFY_EVENT_PROCESS_ID=tu-process-id
NEXT_PUBLIC_NOTIFY_SIGNATURE_PROCESS_ID=tu-process-id
NEXT_PUBLIC_NOTIFY_SIGNATURE_FREE_PROCESS_ID=tu-process-id
NEXT_PUBLIC_CREATE_ADDRESS_PROCESS_ID=tu-process-id

# URLs del sitio y proxy
NEXT_PUBLIC_SITE_URL=https://manyao.pe
NEXT_PUBLIC_PROXY_PHP_URL=https://manyao.pe/app/api/exec.php

# Variables del servidor (opcionales, usan las de NEXT_PUBLIC_ si no se definen)
STAMPING_API_BASE_URL=https://api.stamping.io
STAMPING_API_KEY=tu-api-key-aqui
STAMPING_SCOPE=dev

# Metadatos opcionales
NEXT_PUBLIC_APP_NAME=manyao
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 🛠️ Comandos Disponibles

### Desarrollo
```bash
npm run dev
# o
bun dev
```
Inicia el servidor de desarrollo en [http://localhost:3000](http://localhost:3000)

### Build
```bash
npm run build
# o
bun run build
```
Crea una build de producción optimizada

### Build de Producción
```bash
npm run build:prod
# o
bun run build:prod
```
Crea una build de producción con actualización de versión

### Iniciar Producción
```bash
npm start
# o
bun start
```
Inicia el servidor de producción (requiere build previo)

### Linting
```bash
npm run lint
# o
bun run lint
```
Ejecuta el linter para verificar el código

## 📁 Estructura del Proyecto

```
manyaoweb/
├── src/
│   ├── app/                    # Rutas de Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   └── exec/          # Proxy para ejecución de procesos
│   │   ├── biometric/         # Páginas de validación biométrica
│   │   │   ├── dni/           # Validación de DNI
│   │   │   ├── reniec/        # Validación RENIEC
│   │   │   └── signature/     # Firma electrónica
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Página de inicio
│   │   └── globals.css        # Estilos globales
│   ├── components/            # Componentes React
│   │   ├── ui/                # Componentes UI reutilizables
│   │   ├── CameraScreen.tsx   # Pantalla de cámara
│   │   ├── ValidationResultCard.tsx  # Tarjeta de resultados
│   │   └── ...
│   ├── lib/                   # Utilidades y configuración
│   │   ├── api.ts             # Funciones de API
│   │   ├── env.ts             # Variables de entorno
│   │   └── index.ts           # Exports principales
│   └── constants/             # Constantes
│       └── colors.ts           # Colores del tema
├── public/                     # Archivos estáticos
├── scripts/                     # Scripts de utilidad
│   └── update-version.js      # Actualizador de versión
├── .env                        # Variables de entorno (no commitear)
├── next.config.ts              # Configuración de Next.js
├── tailwind.config.ts          # Configuración de Tailwind CSS
├── tsconfig.json               # Configuración de TypeScript
└── package.json                # Dependencias y scripts
```

## 🔧 Configuración

### Variables de Entorno

#### Variables Cliente (NEXT_PUBLIC_*)
Estas variables son accesibles desde el navegador:

- `NEXT_PUBLIC_API_BASE_URL`: URL base de la API de Stamping.io
- `NEXT_PUBLIC_API_KEY`: Clave de API para autenticación
- `NEXT_PUBLIC_SCOPE`: Scope del entorno (dev, prod, etc.)
- `NEXT_PUBLIC_SITE_URL`: URL base del sitio web
- `NEXT_PUBLIC_PROXY_PHP_URL`: URL del proxy PHP para producción
- `NEXT_PUBLIC_*_PROCESS_ID`: IDs de los procesos backend

#### Variables Servidor (STAMPING_*)
Estas variables solo están disponibles en el servidor:

- `STAMPING_API_BASE_URL`: URL base de la API (fallback a NEXT_PUBLIC_)
- `STAMPING_API_KEY`: Clave de API del servidor (fallback a NEXT_PUBLIC_)
- `STAMPING_SCOPE`: Scope del servidor (fallback a NEXT_PUBLIC_)

### Configuración de Next.js

El proyecto está configurado para:
- Exportación estática (`output: 'export'`)
- Optimización de imágenes
- Soporte para TypeScript
- Tailwind CSS v4

## 🎯 Uso

### Validación de DNI
Accede a `/biometric/dni?id=04:dni:clave` para validar un DNI con foto.

### Firma Electrónica
Accede a `/biometric/signature?id=03:dni:clave` para firmar un documento.

### Validación RENIEC
Accede a `/biometric/reniec` para validación con RENIEC.

## 🔐 Seguridad

- **No commitees el archivo `.env`** - Está en `.gitignore`
- Las variables `NEXT_PUBLIC_*` son visibles en el cliente
- Usa variables `STAMPING_*` para información sensible del servidor
- Valida todas las entradas del usuario antes de enviarlas a la API

## 🧪 Desarrollo

### Agregar Nuevas Funciones de API

1. Agrega el ID del proceso en `.env`:
```env
NEXT_PUBLIC_NEW_PROCESS_ID=tu-process-id
```

2. Exporta la constante en `src/lib/env.ts`:
```typescript
export const PROC_NEW_PROCESS = process.env.NEXT_PUBLIC_NEW_PROCESS_ID || 'demo-new-process';
```

3. Crea la función en `src/lib/api.ts`:
```typescript
export async function newProcess({ param1, param2 }: { param1: string; param2: string }) {
  const params: Param[] = [
    { name: 'param1', value: param1 },
    { name: 'param2', value: param2 },
  ];
  return postExec(PROC_NEW_PROCESS, params);
}
```

## 📝 Notas

- El proyecto usa **Next.js 15** con App Router
- **React 19** para la UI
- **Tailwind CSS v4** para estilos
- **TypeScript** para type safety
- **TensorFlow.js** y **Face-API** para detección facial

## 🚢 Deploy

### Build de Producción
```bash
npm run build:prod
```

Esto generará una carpeta `out/` con los archivos estáticos listos para deploy.

### Deploy en cPanel
1. Sube la carpeta `out/` al servidor
2. Configura las variables de entorno en el servidor
3. Asegúrate de que el proxy PHP esté configurado correctamente

## 📄 Licencia

[Especificar licencia]

## 👥 Contribuidores

[Especificar contribuidores]

## 📞 Soporte

Para problemas o preguntas, abre un issue en el repositorio.
