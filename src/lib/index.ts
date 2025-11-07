export function parseQR(id: string) {
  // Decodificar URL para manejar %3A -> :
  const decodedId = decodeURIComponent(id || '');
  const parts = decodedId.split(':');
  
  // Estructura: 03:DNI:KEY
  // Pero según el jefe, para el flujo 03: 03:KEY:OTRO_VALOR
  // Entonces el segundo valor es el key que necesitamos
  return { 
    action: parts[0] || '', 
    dni: parts[1] || '', // En flujo 03, el segundo valor se usa como key
    key: parts[1] || '', // El key es el segundo valor (17b...)
    thirdValue: parts[2] || '', // El tercer valor (0xd7...)
    fullQR: id 
  };
}

