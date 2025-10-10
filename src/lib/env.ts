// Cliente - valores por defecto para desarrollo
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://manyao.pe/app/api';
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'demo-key';
export const SCOPE = process.env.NEXT_PUBLIC_SCOPE || 'demo-scope';
export const PROC_VALIDATE_FACE = process.env.NEXT_PUBLIC_VALIDATE_FACE_PROCESS_ID || 'demo-validate-face';
export const PROC_VALIDATE_DNI_WITH_PHOTO = process.env.NEXT_PUBLIC_VALIDATE_DNI_WITH_PHOTO_PROCESS_ID || 'demo-validate-dni';
export const PROC_NOTIFY_EVENT = process.env.NEXT_PUBLIC_NOTIFY_EVENT_PROCESS_ID || 'demo-notify-event';
export const PROC_CREATE_ADDRESS = process.env.NEXT_PUBLIC_CREATE_ADDRESS_PROCESS_ID || 'b2f017e3-869e-49fe-b209-847b12eba499';

// Servidor (Route Handlers): usar variables sin prefijo si existen
export const SERVER_API_BASE = process.env.STAMPING_API_BASE_URL || API_BASE;
export const SERVER_API_KEY = process.env.STAMPING_API_KEY || API_KEY;
export const SERVER_SCOPE = process.env.STAMPING_SCOPE || SCOPE;


