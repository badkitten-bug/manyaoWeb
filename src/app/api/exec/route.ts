import { NextRequest, NextResponse } from 'next/server';
import { SERVER_API_BASE, SERVER_API_KEY, SERVER_SCOPE } from '@/lib/env';

export async function POST(req: NextRequest) {
  const incoming = await req.json();
  const body = { ...incoming, token: SERVER_API_KEY, scope: SERVER_SCOPE };
  const url = `${SERVER_API_BASE.replace(/\/$/, '')}/exec/`;
  // Debug básico (sin exponer token):
  console.log('[API PROXY] url', url);
  console.log('[API PROXY] hasKey?', !!SERVER_API_KEY, 'keyLen', SERVER_API_KEY ? SERVER_API_KEY.length : 0, 'scope', SERVER_SCOPE);
  console.log('[API PROXY] process', body?.process, 'paramsCount', Array.isArray(body?.params) ? body.params.length : 0);
  const upstream = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    // En Next 15, route handlers corren server-side, sin CORS desde el cliente
  });
  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: { 'Content-Type': upstream.headers.get('Content-Type') || 'application/json' },
  });
}


