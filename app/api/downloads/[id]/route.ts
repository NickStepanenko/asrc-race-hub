import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const item = await prisma.contentItem.findUnique({ where: { id } });

  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(item);
}
