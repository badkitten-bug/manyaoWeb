import { API_KEY, SCOPE, PROC_NOTIFY_EVENT, PROC_VALIDATE_DNI_WITH_PHOTO, PROC_CREATE_ADDRESS } from './env';

type Param = { name: string; value: string };

async function postExec(processId: string, params: Param[]) {
  // Proxy dinámico: dev usa /app (con CORS); prod usa PHP local
  const isBrowser = typeof window !== 'undefined';
  const isDev = isBrowser && (location.hostname === 'localhost' || location.hostname === '127.0.0.1');
  const basePrefix = isBrowser
    ? (location.pathname.startsWith('/app')
        ? '/app'
        : '')
    : '';
  
  // En desarrollo, usar /app que tiene CORS configurado
  const proxyUrl = isDev ? 'https://manyao.pe/app/api/exec.php' : `${basePrefix}/api/exec.php`;
  const payload = isDev
    ? { process: processId, token: API_KEY, scope: SCOPE, params }
    : { process: processId, params };

  console.log('postExec:', { isDev, proxyUrl, hasToken: !!API_KEY, hasScope: !!SCOPE });

  const res = await fetch(proxyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export async function notifyEvent05({ photo, email, dni, f1, address, key }: { photo: string; email: string; dni: string; f1: string; address: string; key: string; }) {
  const params: Param[] = [
    { name: 'photo', value: photo },
    { name: 'email', value: email },
    { name: 'dni', value: dni },
    { name: 'f1', value: f1 },
    { name: 'address', value: address },
    { name: 'key', value: key },
  ];
  return postExec(PROC_NOTIFY_EVENT, params);
}

export async function validateDNIWithPhoto04({ photoFace, photoDNI, email, f1, address }: { photoFace: string; photoDNI: string; email: string; f1: string; address: string; }) {
  const params: Param[] = [
    { name: 'photoFace', value: photoFace },
    { name: 'photoDNI', value: photoDNI },
    { name: 'email', value: email },
    { name: 'f1', value: f1 },
    { name: 'address', value: address },
  ];
  console.log('[04] validateDNIWithPhoto → params', { hasFace: !!photoFace, hasDNI: !!photoDNI, email, f1: !!f1, address: address?.slice(0, 8) });
  const resp = await postExec(PROC_VALIDATE_DNI_WITH_PHOTO, params);
  console.log('[04] validateDNIWithPhoto ← response', resp);
  return resp;
}

export async function createAddressForWeb(imei: string) {
  const params: Param[] = [ { name: 'imei', value: imei } ];
  return postExec(PROC_CREATE_ADDRESS, params);
}


