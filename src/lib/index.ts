export function parseQR(id: string) {
  const parts = (id || '').split(':');
  return { action: parts[0] || '', dni: parts[1] || '', key: parts.slice(2).join(':'), fullQR: id };
}

