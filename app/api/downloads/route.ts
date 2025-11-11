import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const data = await prisma.contentItem.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      type: true,
      carClass: true,
      image: true,
      logo: true,
      url: true,
      released: true,
      releaseDate: true,
      specs: true,
      features: true,
      screenshots: true,
      metadata: true,
    }
  });

  return NextResponse.json(data);
}