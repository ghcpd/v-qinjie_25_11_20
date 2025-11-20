'use server';

import { cookies } from 'next/headers';

const ALLOWED_ROLES = ['guest', 'analyst'];

export async function setUserRole(role) {
  if (!ALLOWED_ROLES.includes(role)) {
    throw new Error('Unsupported role');
  }

  const jar = cookies();
  jar.set('ui-role', role, {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    path: '/',
    maxAge: 60 * 60
  });
}
