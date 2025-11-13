import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: number } }) {
  const { id } = params;

  const item = await prisma.modItems.findUnique({
    where: { id },
    include: {
      authors: {
        include: {
          author: true, // pulls the actual Author row for each join row
        },
      },
      authorTeams: {
        include: { team: true }, // keep any other relations you need
      },
    },
  });

  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(item);
}
