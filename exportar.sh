#!/bin/bash

# Nombre del archivo de salida.
ARCHIVO_SALIDA="codigo_del_proyecto_nextjs.txt"

# Limpia el archivo de salida si ya existe.
> "$ARCHIVO_SALIDA"

echo "--- INICIO DEL CÓDIGO DEL PROYECTO (Next.js) ---" > "$ARCHIVO_SALIDA"
echo -e "Este archivo fue generado automáticamente para revisión de código.\n\n" >> "$ARCHIVO_SALIDA"

# Lista de carpetas a incluir.
CARPETAS=(
  "public"
  "src"
)

# Lista de archivos en la raíz a incluir.
ARCHIVOS_RAIZ=(
  ".env"
  ".gitignore"
  "eslint.config.mjs"
  "next-env.d.ts"
  "next.config.ts"
  "package-lock.json"
  "package.json"
  "postcss.config.mjs"
  "README.md"
  "tsconfig.json"
)

# Extensiones de archivo que consideraremos como código/texto.
EXTENSIONES_TEXTO_REGEX='\.(tsx|ts|js|jsx|json|md|sh|html|css|mjs)$'

# Extensiones de archivo que sabemos que son binarias y deben ser omitidas.
EXTENSIONES_BINARIAS_REGEX='\.(png|jpg|jpeg|gif|bmp|ttf|otf|woff|woff2|ico|mp3|mp4|mov|zip|exe|pdf|excalidraw)$'


# Función para añadir el contenido de un archivo al archivo de salida.
agregar_contenido() {
  local archivo_path="$1"
  echo "--- RUTA DEL ARCHIVO: $archivo_path ---" >> "$ARCHIVO_SALIDA"
  # Usamos 'tr' para asegurarnos de que no haya caracteres nulos que puedan detener 'cat'.
  tr -d '\0' < "$archivo_path" >> "$ARCHIVO_SALIDA"
  echo -e "\n--- FIN DEL ARCHIVO: $archivo_path ---\n\n" >> "$ARCHIVO_SALIDA"
}

# 1. Agrega los archivos de la raíz del proyecto.
for archivo in "${ARCHIVOS_RAIZ[@]}"; do
  if [ -f "$archivo" ]; then
    agregar_contenido "$archivo"
  fi
done

# 2. Agrega los archivos de las carpetas.
for carpeta in "${CARPETAS[@]}"; do
  if [ -d "$carpeta" ]; then
    find "$carpeta" -type f | while read -r archivo; do
      if [[ "$archivo" =~ $EXTENSIONES_BINARIAS_REGEX ]]; then
        echo "--- ARCHIVO OMITIDO (BINARIO): $archivo ---\n" >> "$ARCHIVO_SALIDA"
      elif [[ "$archivo" =~ $EXTENSIONES_TEXTO_REGEX ]]; then
        agregar_contenido "$archivo"
      else
        echo "--- INTENTANDO AÑADIR (extensión desconocida): $archivo ---" >> "$ARCHIVO_SALIDA"
        agregar_contenido "$archivo"
      fi
    done
  fi
done

echo "¡Proceso completado!"
echo "Tu código ha sido exportado al archivo: $ARCHIVO_SALIDA"
echo "🚨 IMPORTANTE: Revisa el contenido de '$ARCHIVO_SALIDA' antes de compartirlo. He incluido el archivo '.env', que puede contener claves secretas. ¡Asegúrate de eliminar esa sección del archivo de texto si es necesario!"