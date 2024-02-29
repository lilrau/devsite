import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';
 
export const config = { matcher: '/token' };
 
export async function middleware() {
  const token = await get('token');
  return NextResponse.json(token);
}