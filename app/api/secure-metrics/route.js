import { NextResponse } from 'next/server';

const SECRET_SCOPE = process.env.SECURE_METRIC_KEY || 'demo-scope-key';

export async function GET(request) {
  const tenant = request.headers.get('x-client-tenant');
  if (!tenant) {
    return NextResponse.json({ error: 'Tenant header missing' }, { status: 400 });
  }

  const metrics = [
    { key: 'threats', name: 'Threat Insights', scope: tenant, maskedToken: SECRET_SCOPE },
    { key: 'keys', name: 'Key Disclosure', scope: tenant, maskedToken: SECRET_SCOPE },
    { key: 'dash', name: 'Dashboard Sessions', scope: tenant, maskedToken: SECRET_SCOPE }
  ];

  return NextResponse.json({ metrics, generatedAt: new Date().toISOString() }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
}
