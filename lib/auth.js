import { cookies } from 'next/headers';

const DEFAULT_ROLE = 'guest';

export async function getUserRole() {
  const jar = cookies();
  return jar.get('ui-role')?.value ?? DEFAULT_ROLE;
}

export function isAnalyst(role) {
  return role === 'analyst';
}
